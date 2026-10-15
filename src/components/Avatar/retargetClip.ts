import { AnimationClip } from "three";
import type { Object3D } from "three";

/**
 * Makes a clip from another file play on this rig: maps Mixamo bone names ("mixamorig:Hips") to ours,
 * keeps only rotation tracks for bones that exist (position/scale tracks carry root motion and
 * unit differences), and returns null if nothing is left.
 */
export function retargetClip(clip: AnimationClip, root: Object3D): AnimationClip | null {
  const boneNames = new Set<string>();
  root.traverse((o) => boneNames.add(o.name));

  const tracks = clip.tracks.flatMap((track) => {
    const dot = track.name.lastIndexOf(".");
    const node = track.name.slice(0, dot).replace(/^mixamorig\d*:?/, "");
    const property = track.name.slice(dot + 1);
    if (property !== "quaternion" || !boneNames.has(node)) return [];
    const copy = track.clone();
    copy.name = `${node}.${property}`;
    return [copy];
  });
  return tracks.length ? new AnimationClip(clip.name, clip.duration, tracks) : null;
}
