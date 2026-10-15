// Hand-authored gesture clips for this rig (the FBX ships without animations).
// Each keyframe pose aims bones at directions in avatar space, solved against the relaxed rest pose:
// +X = avatar's left (screen right), +Y = up, +Z = toward the viewer. The avatar's right arm is on -X,
// which is screen left, where the portfolio content sits.
// Clip files listed in ./animations.ts replace these when present.
import { AnimationClip, Quaternion, QuaternionKeyframeTrack, Vector3 } from "three";
import type { Object3D } from "three";
import type { ClipRole } from "./animations";

type Dir = [number, number, number];
/** Aim `bone` so that `toward` (a descendant joint) lies in direction `dir` from it. */
type Aim = [bone: string, toward: string, dir: Dir];
type Pose = Aim[] | null; // null = relaxed rest pose

const rightArm = (upper: Dir, fore: Dir, hand: Dir = fore): Aim[] => [
  ["RightArm", "RightForeArm", upper],
  ["RightForeArm", "RightHand", fore],
  ["RightHand", "RightHandMiddle1", hand],
];
const leftArm = (upper: Dir, fore: Dir, hand: Dir = fore): Aim[] => [
  ["LeftArm", "LeftForeArm", upper],
  ["LeftForeArm", "LeftHand", fore],
  ["LeftHand", "LeftHandMiddle1", hand],
];

const tmpA = new Vector3();
const tmpB = new Vector3();
const tmpTarget = new Vector3();
const tmpDelta = new Quaternion();
const tmpWorld = new Quaternion();
const tmpParent = new Quaternion();

/** Applies the aims parent-first and leaves the bones posed. */
function applyPose(root: Object3D, aims: Aim[]) {
  for (const [boneName, towardName, dir] of aims) {
    const bone = root.getObjectByName(boneName);
    const toward = root.getObjectByName(towardName);
    if (!bone?.parent || !toward) continue;
    root.updateMatrixWorld(true);
    const from = toward.getWorldPosition(tmpA).sub(bone.getWorldPosition(tmpB)).normalize();
    tmpDelta.setFromUnitVectors(from, tmpTarget.set(...dir).normalize());
    bone.getWorldQuaternion(tmpWorld).premultiply(tmpDelta);
    bone.quaternion.copy(bone.parent.getWorldQuaternion(tmpParent).invert().multiply(tmpWorld));
  }
}

function buildClip(root: Object3D, name: string, keys: [time: number, pose: Pose][]): AnimationClip | null {
  const boneNames = [...new Set(keys.flatMap(([, pose]) => (pose ?? []).map(([bone]) => bone)))];
  const bones = boneNames.map((n) => root.getObjectByName(n));
  if (bones.some((b) => !b)) return null;

  const rest = bones.map((b) => b!.quaternion.clone());
  const restore = () => bones.forEach((b, i) => b!.quaternion.copy(rest[i]));
  const values = boneNames.map(() => [] as number[]);

  for (const [, pose] of keys) {
    restore();
    if (pose) applyPose(root, pose);
    bones.forEach((b, i) => values[i].push(...b!.quaternion.toArray()));
  }
  restore();
  root.updateMatrixWorld(true);

  const times = keys.map(([t]) => t);
  const tracks = boneNames.map((n, i) => new QuaternionKeyframeTrack(`${n}.quaternion`, times, values[i]));
  return new AnimationClip(name, times.at(-1), tracks);
}

// ---- Poses -------------------------------------------------------------------------------------

// Wave: elbow out just below the shoulder, hand up beside the face, swinging side to side.
const WAVE_OUT: Pose = rightArm([-0.5, -0.3, 0.4], [-0.12, 1, 0.3], [-0.15, 1, 0.35]);
const WAVE_IN: Pose = rightArm([-0.5, -0.3, 0.4], [0.3, 1, 0.3], [0.35, 1, 0.35]);

// Present: open hand extended toward screen left, where the highlighted section is.
const PRESENT: Pose = rightArm([-0.42, -0.78, 0.45], [-0.45, 0, 0.9], [-0.4, 0.15, 0.9]);
const PRESENT_HOLD: Pose = rightArm([-0.4, -0.75, 0.5], [-0.43, 0.05, 0.9], [-0.38, 0.2, 0.9]);

// Explain: both forearms forward, opening slightly as if talking with the hands.
const EXPLAIN_A: Pose = [
  ...rightArm([-0.2, -1, 0.2], [-0.15, 0.1, 1], [-0.1, 0.2, 1]),
  ...leftArm([0.2, -1, 0.2], [0.15, 0.1, 1], [0.1, 0.2, 1]),
];
const EXPLAIN_B: Pose = [
  ...rightArm([-0.22, -1, 0.2], [-0.3, 0.2, 1], [-0.25, 0.3, 1]),
  ...leftArm([0.22, -1, 0.2], [0.3, 0.2, 1], [0.25, 0.3, 1]),
];

/** Built-in clips, computed once per (cached) avatar scene from its relaxed rest pose. */
export function createBuiltInClips(root: Object3D): Partial<Record<ClipRole, AnimationClip>> {
  if (root.userData.builtInClips) return root.userData.builtInClips;
  const clips: Partial<Record<ClipRole, AnimationClip | null>> = {
    wave: buildClip(root, "builtin-wave", [
      [0, null],
      [0.45, WAVE_OUT],
      [0.75, WAVE_IN],
      [1.05, WAVE_OUT],
      [1.35, WAVE_IN],
      [1.65, WAVE_OUT],
      [2.15, null],
    ]),
    point: buildClip(root, "builtin-present", [
      [0, null],
      [0.5, PRESENT],
      [1.6, PRESENT_HOLD],
      [2.2, null],
    ]),
    explain: buildClip(root, "builtin-explain", [
      [0, null],
      [0.5, EXPLAIN_A],
      [1.0, EXPLAIN_B],
      [1.5, EXPLAIN_A],
      [2.0, EXPLAIN_B],
      [2.6, null],
    ]),
  };
  const built = Object.fromEntries(Object.entries(clips).filter(([, c]) => c)) as Partial<
    Record<ClipRole, AnimationClip>
  >;
  root.userData.builtInClips = built;
  return built;
}
