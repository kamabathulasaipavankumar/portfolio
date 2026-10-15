import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  AnimationClip,
  AnimationMixer,
  DoubleSide,
  Euler,
  LoopOnce,
  LoopRepeat,
  MathUtils,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
} from "three";
import type { AnimationAction, Bone, Group, Material, Mesh, MeshPhongMaterial, Object3D, SkinnedMesh } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { CLIP_FILES, EMBEDDED_CLIP_NAMES, LOOPING_ROLES } from "./animations";
import { createBuiltInClips } from "./builtInClips";
import { retargetClip } from "./retargetClip";
import type { ClipRole, GestureRole } from "./animations";

export const AVATAR_URL = "/avatar/sai-avatar.fbx";

export type AvatarState = "idle" | "listening" | "speaking";
export type AvatarGesture = { role: GestureRole; key: number };

/*
 * What the FBX provides (inspected with FBXLoader):
 * - Humanoid rig (Hips → Spine → Neck → Head, arms, legs) exported in a T-pose. Units are meters, Y-up, facing +Z.
 * - ARKit blendshapes on AvatarHead / AvatarEyelashes / AvatarTeethLower (eyeBlink*, jawOpen, mouthSmile*, …).
 * - No animation clips and no viseme blendshapes.
 * Gestures are hand-authored keyframe clips (./builtInClips.ts) unless clip files in ./animations.ts
 * replace them. Idle is procedural (breathing, head drift, blinks) until an idle clip is added, and
 * speaking is a jaw movement rather than phoneme lip-sync.
 */

const ROUGHNESS: Record<string, number> = {
  AvatarLeftEyeball: 0.15,
  AvatarRightEyeball: 0.15,
  AvatarTeethLower: 0.4,
  AvatarTeethUpper: 0.4,
  haircut: 0.8,
  outfit: 0.85,
};

/** FBX exports Phong materials; standard PBR materials look far better under the stage lighting. */
function toStandardMaterial(source: Material): Material {
  const phong = source as MeshPhongMaterial;
  if (!phong.isMeshPhongMaterial) return source;
  const material = new MeshStandardMaterial({
    name: phong.name,
    color: phong.color,
    map: phong.map,
    normalMap: phong.normalMap,
    roughness: ROUGHNESS[phong.name] ?? 0.65,
    metalness: 0,
  });
  // Hair is built from alpha cards: cut out the transparent parts and render both faces.
  if (phong.name === "haircut") {
    material.alphaTest = 0.45;
    material.side = DoubleSide;
  }
  phong.dispose();
  return material;
}

/** Rotates a T-pose arm down to a relaxed pose by aiming the upper arm at a world-space direction. */
function relaxArm(root: Object3D, side: "Left" | "Right") {
  const arm = root.getObjectByName(`${side}Arm`);
  const foreArm = root.getObjectByName(`${side}ForeArm`);
  if (!arm?.parent || !foreArm) return;

  root.updateMatrixWorld(true);
  const from = foreArm.getWorldPosition(new Vector3()).sub(arm.getWorldPosition(new Vector3())).normalize();
  const outward = side === "Left" ? 1 : -1; // the avatar's left arm points along +X
  const to = new Vector3(outward * 0.2, -1, 0.06).normalize();

  const delta = new Quaternion().setFromUnitVectors(from, to);
  const armWorld = arm.getWorldQuaternion(new Quaternion());
  const parentWorldInverse = arm.parent.getWorldQuaternion(new Quaternion()).invert();
  arm.quaternion.copy(parentWorldInverse.multiply(delta.multiply(armWorld)));
}

/** One-time setup of the cached FBX scene. Safe to call again (StrictMode, remounts). */
function prepareAvatar(root: Group) {
  if (root.userData.prepared) return;
  root.userData.prepared = true;

  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(toStandardMaterial) : toStandardMaterial(mesh.material);
    // Skinned bounds don't follow bone motion; skip culling so the head never pops out.
    mesh.frustumCulled = false;
  });

  relaxArm(root, "Left");
  relaxArm(root, "Right");
  // Gesture clips are solved against this clean relaxed pose.
  createBuiltInClips(root);
}

// External clip files are loaded once per page, independent of the avatar mounting/unmounting.
let externalClips: Promise<Partial<Record<ClipRole, AnimationClip>>> | null = null;

function loadExternalClips() {
  externalClips ??= Promise.all(
    Object.entries(CLIP_FILES).map(async ([role, url]) => {
      try {
        const group = await new FBXLoader().loadAsync(url);
        return [role, group.animations[0]] as const;
      } catch (error) {
        console.warn(`Avatar clip "${role}" could not be loaded from ${url}`, error);
        return [role, undefined] as const;
      }
    }),
  ).then((entries) => Object.fromEntries(entries.filter(([, clip]) => clip)));
  return externalClips;
}

function embeddedClips(animations: AnimationClip[]) {
  const found: Partial<Record<ClipRole, AnimationClip>> = {};
  for (const [role, pattern] of Object.entries(EMBEDDED_CLIP_NAMES) as [ClipRole, RegExp][]) {
    const clip = animations.find((a) => pattern.test(a.name));
    if (clip) found[role] = clip;
  }
  return found;
}

/** Fades one action into another (from may be null). */
function fadeTo(from: AnimationAction | null, to: AnimationAction, duration: number) {
  to.enabled = true;
  to.setEffectiveTimeScale(1);
  to.setEffectiveWeight(1);
  if (to.loop === LoopOnce) to.reset();
  to.play();
  if (from && from !== to) from.crossFadeTo(to, duration, false);
}

type MorphTarget = { influences: number[]; index: number };

function findMorphs(root: Object3D, name: string): MorphTarget[] {
  const targets: MorphTarget[] = [];
  root.traverse((child) => {
    const mesh = child as SkinnedMesh;
    const index = mesh.morphTargetDictionary?.[name];
    if (index !== undefined && mesh.morphTargetInfluences) targets.push({ influences: mesh.morphTargetInfluences, index });
  });
  return targets;
}

const setMorph = (targets: MorphTarget[], value: number) => {
  for (const t of targets) t.influences[t.index] = value;
};

const tmpParent = new Quaternion();
const tmpOffset = new Quaternion();
const tmpEuler = new Euler();

/** Sets a bone to its rest pose rotated by (pitch, yaw, roll) expressed in avatar space. */
function poseBone(bone: Bone, rest: Quaternion, pitch: number, yaw: number, roll: number) {
  bone.quaternion.copy(rest);
  if (!bone.parent) return;
  bone.parent.getWorldQuaternion(tmpParent);
  tmpOffset.setFromEuler(tmpEuler.set(pitch, yaw, roll));
  // local = parent⁻¹ · offset · parent · rest  ⇒  world = offset · restWorld
  bone.quaternion.copy(tmpParent).invert().multiply(tmpOffset).multiply(tmpParent).multiply(rest);
}

type AvatarModelProps = {
  state: AvatarState;
  /** One-shot gesture; a new key replays it. Ignored when the matching clip is missing. */
  gesture?: AvatarGesture | null;
  /** Disables all motion (prefers-reduced-motion). The avatar still renders in its relaxed pose. */
  still?: boolean;
  onReady?: () => void;
};

export function AvatarModel({ state, gesture, still = false, onReady }: AvatarModelProps) {
  const scene = useLoader(FBXLoader, AVATAR_URL);
  prepareAvatar(scene);

  const rig = useMemo(() => {
    const bone = (name: string) => scene.getObjectByName(name) as Bone | undefined;
    const bones = { spine1: bone("Spine1"), spine2: bone("Spine2"), neck: bone("Neck"), head: bone("Head") };
    // The loader caches the scene across mounts, so capture the rest pose only once.
    const rest: Map<Bone, Quaternion> = (scene.userData.rest ??= new Map(
      Object.values(bones)
        .filter((b): b is Bone => !!b)
        .map((b) => [b, b.quaternion.clone()]),
    ));
    return {
      bones,
      rest,
      blink: [...findMorphs(scene, "eyeBlinkLeft"), ...findMorphs(scene, "eyeBlinkRight")],
      jaw: findMorphs(scene, "jawOpen"),
      smile: [...findMorphs(scene, "mouthSmileLeft"), ...findMorphs(scene, "mouthSmileRight")],
    };
  }, [scene]);

  // ---- Animation clips -------------------------------------------------------------------------
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const [actions, setActions] = useState<Partial<Record<ClipRole, AnimationAction>>>({});
  const baseRef = useRef<AnimationAction | null>(null);
  const gestureRef = useRef<AnimationAction | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadExternalClips().then((external) => {
      if (cancelled) return;
      const clips = { ...createBuiltInClips(scene), ...embeddedClips(scene.animations), ...external };
      const next: Partial<Record<ClipRole, AnimationAction>> = {};
      for (const [role, clip] of Object.entries(clips) as [ClipRole, AnimationClip][]) {
        const retargeted = retargetClip(clip, scene);
        if (!retargeted) {
          console.warn(`Avatar clip "${role}" has no tracks matching this rig`);
          continue;
        }
        const action = mixer.clipAction(retargeted);
        if (LOOPING_ROLES.includes(role)) action.setLoop(LoopRepeat, Infinity);
        else {
          action.setLoop(LoopOnce, 1);
          action.clampWhenFinished = true;
        }
        next[role] = action;
      }
      setActions(next);
    });
    return () => {
      cancelled = true;
      mixer.stopAllAction();
      baseRef.current = null;
      gestureRef.current = null;
    };
  }, [scene, mixer]);

  // Looping base clip follows the conversation state (falls back to idle).
  useEffect(() => {
    if (still) {
      mixer.stopAllAction();
      baseRef.current = null;
      return;
    }
    const next =
      (state === "speaking" && actions.talking) || (state === "listening" && actions.listening) || actions.idle || null;
    if (!next || next === baseRef.current) return;
    // While a gesture plays, the new base takes over when the gesture fades out.
    if (!gestureRef.current) fadeTo(baseRef.current, next, 0.4);
    baseRef.current = next;
  }, [state, actions, still, mixer]);

  // One-shot gestures fade in over the base clip (or the relaxed pose) and back out before they end.
  // With no base clip, the mixer blends toward each bone's pose from before the gesture, so the arms
  // settle back to the relaxed pose on their own.
  useEffect(() => {
    const action = gesture ? actions[gesture.role] : undefined;
    if (!action || still) return;
    const from = gestureRef.current ?? baseRef.current;
    gestureRef.current = action;
    if (from && from !== action) fadeTo(from, action, 0.3);
    else action.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.3).play();

    const timer = window.setTimeout(
      () => {
        if (baseRef.current) fadeTo(action, baseRef.current, 0.45);
        else action.fadeOut(0.45);
        gestureRef.current = null;
      },
      Math.max(0, action.getClip().duration - 0.45) * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [gesture, actions, still]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  // ---- Per-frame motion ------------------------------------------------------------------------
  // Smoothed values that ease toward per-state targets.
  const motion = useRef({ tilt: 0, nod: 0, jaw: 0, nextBlink: 2, blinkStart: -1 });

  useFrame(({ clock, pointer }, delta) => {
    const t = clock.elapsedTime;
    const m = motion.current;
    const { bones, rest } = rig;
    const ease = 1 - Math.exp(-delta * 4);

    if (still) {
      for (const [bone, q] of rest) bone.quaternion.copy(q);
      setMorph(rig.jaw, 0);
      setMorph(rig.blink, 0);
      setMorph(rig.smile, 0.15);
      return;
    }

    mixer.update(delta);
    const clipDriven = !!baseRef.current;
    const listening = state === "listening";
    const speaking = state === "speaking";

    // Procedural body motion only when no clip drives the skeleton.
    if (!clipDriven) {
      // Breathing: a slow chest rise on the upper spine.
      const breath = Math.sin(t * 1.6) * 0.5 + 0.5;
      if (bones.spine1) poseBone(bones.spine1, rest.get(bones.spine1)!, -breath * 0.012, 0, 0);
      if (bones.spine2) poseBone(bones.spine2, rest.get(bones.spine2)!, -breath * 0.025, Math.sin(t * 0.23) * 0.02, 0);

      // Head: gentle drift, a slight follow of the pointer, a tilt while listening and nods while speaking.
      m.tilt = MathUtils.lerp(m.tilt, listening ? 0.08 : 0, ease);
      m.nod = MathUtils.lerp(m.nod, speaking ? 1 : 0, ease);
      const yaw = Math.sin(t * 0.37) * 0.07 + Math.sin(t * 0.11) * 0.04 + pointer.x * 0.12;
      const pitch =
        Math.sin(t * 0.29 + 1) * 0.025 - pointer.y * 0.06 + (listening ? 0.04 : 0) + m.nod * Math.sin(t * 3.1) * 0.03;
      if (bones.neck) poseBone(bones.neck, rest.get(bones.neck)!, pitch * 0.4, yaw * 0.4, m.tilt * 0.4);
      if (bones.head) poseBone(bones.head, rest.get(bones.head)!, pitch * 0.6, yaw * 0.6, m.tilt * 0.6);
    }

    // Face: blinks every 2–6 s (clips from Mixamo carry no facial tracks).
    if (t >= m.nextBlink && m.blinkStart < 0) m.blinkStart = t;
    let blink = 0;
    if (m.blinkStart >= 0) {
      const p = (t - m.blinkStart) / 0.16;
      blink = p < 1 ? Math.sin(p * Math.PI) : 0;
      if (p >= 1) {
        m.blinkStart = -1;
        m.nextBlink = t + 2 + Math.random() * 4;
      }
    }
    setMorph(rig.blink, blink);

    // Speaking: jaw movement while the reply streams in (no visemes in this model, so not true lip-sync).
    const talk = speaking ? 0.12 + 0.22 * Math.max(0, Math.sin(t * 11) * 0.6 + Math.sin(t * 17.3) * 0.4) : 0;
    m.jaw = MathUtils.lerp(m.jaw, talk, 1 - Math.exp(-delta * 18));
    setMorph(rig.jaw, m.jaw);
    setMorph(rig.smile, listening ? 0.3 : 0.18);
  });

  return <primitive object={scene} />;
}

useLoader.preload(FBXLoader, AVATAR_URL);
