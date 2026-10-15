import { Component, Suspense, useCallback, useState } from "react";
import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { AvatarModel } from "./AvatarModel";
import type { AvatarGesture, AvatarState } from "./AvatarModel";
import { AvatarFallback } from "./AvatarFallback";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Catches model download/parse errors so the chat keeps working without the 3D avatar. */
class AvatarErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("3D avatar unavailable:", error);
  }
  render() {
    return this.state.failed ? <AvatarFallback /> : this.props.children;
  }
}

type AvatarStageProps = {
  state: AvatarState;
  gesture?: AvatarGesture | null;
  /** Called once the 3D model is loaded and visible. */
  onReady?: () => void;
  className?: string;
};

/** Transparent WebGL stage framing the avatar from mid-torso up (room for arm gestures). Lazy-load this module. */
export default function AvatarStage({ state, gesture, onReady: onReadyProp, className = "" }: AvatarStageProps) {
  const reduceMotion = useReducedMotion();
  const [webgl] = useState(hasWebGL);
  const [ready, setReady] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const onReady = useCallback(() => {
    setReady(true);
    onReadyProp?.();
  }, [onReadyProp]);

  return (
    <div className={`relative ${className}`}>
      {!webgl || contextLost ? (
        <AvatarFallback />
      ) : (
        <AvatarErrorBoundary>
          {!ready && <AvatarFallback loading />}
          <Canvas
            // Fade in once the model is ready so the T-pose → relaxed pose setup is never visible.
            className={`transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
            frameloop={reduceMotion ? "demand" : "always"}
            dpr={[1, 1.75]}
            gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
            camera={{ fov: 24, near: 0.1, far: 10, position: [0, 1.5, 1.95] }}
            onCreated={({ camera, gl }) => {
              camera.lookAt(0, 1.47, 0);
              gl.domElement.addEventListener("webglcontextlost", () => setContextLost(true), { once: true });
            }}
            aria-hidden="true"
          >
            <hemisphereLight args={["#eef0ff", "#2a1f5c", 1.1]} />
            <directionalLight position={[0.8, 2.2, 2.4]} intensity={3} color="#ffffff" />
            {/* Brand rim lights: violet from the left, blue from the right */}
            <directionalLight position={[-2, 2, -1.5]} intensity={2.4} color="#8b5cf6" />
            <directionalLight position={[2, 1.6, -1.5]} intensity={1.6} color="#3b82f6" />
            <Suspense fallback={null}>
              <AvatarModel state={state} gesture={gesture} still={!!reduceMotion} onReady={onReady} />
            </Suspense>
          </Canvas>
        </AvatarErrorBoundary>
      )}
    </div>
  );
}
