// Animation clips for the 3D avatar. The model file itself contains no clips. Hand-authored wave,
// point and explain clips are built in (./builtInClips.ts); files listed here replace them, e.g.
// Mixamo FBX downloads ("Without Skin") for more natural motion.
//
// To add a clip: put the file in public/avatar/animations/ and add its path below. Missing or
// unlisted roles are simply skipped. Mixamo bone names ("mixamorig:Hips") are mapped onto this rig.
//
//   idle       looping   – plays when nothing else is happening (replaces the procedural idle)
//   listening  looping   – while the visitor types or waits for an answer
//   talking    looping   – while the answer streams in
//   point      one-shot  – when a question navigates to Skills, Projects, Experience or Education
//   wave       one-shot  – greeting when the assistant opens, a tap on the avatar, and Contact
//   explain    one-shot  – hand movement when an answer starts

export type ClipRole = "idle" | "listening" | "talking" | "point" | "wave" | "explain";
export type GestureRole = Extract<ClipRole, "point" | "wave" | "explain">;

export const CLIP_FILES: Partial<Record<ClipRole, string>> = {
  // idle: "/avatar/animations/idle.fbx",
  // listening: "/avatar/animations/listening.fbx",
  // talking: "/avatar/animations/talking.fbx",
  // point: "/avatar/animations/point.fbx",
  // wave: "/avatar/animations/wave.fbx",
  // explain: "/avatar/animations/explain.fbx",
};

export const LOOPING_ROLES: ClipRole[] = ["idle", "listening", "talking"];

/** Clips embedded in the model are matched to roles by name. */
export const EMBEDDED_CLIP_NAMES: Record<ClipRole, RegExp> = {
  idle: /idle|breath/i,
  listening: /listen/i,
  talking: /talk|speak/i,
  point: /point|gesture/i,
  wave: /wave|greet/i,
  explain: /explain|gesticulat/i,
};
