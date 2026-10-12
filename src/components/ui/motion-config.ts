import type { Variants } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

export type RevealDirection = "up" | "left" | "right" | "scale" | "fade";

const hiddenState: Record<RevealDirection, Record<string, number>> = {
  up: { opacity: 0, y: 18 },
  left: { opacity: 0, x: -20 },
  right: { opacity: 0, x: 20 },
  scale: { opacity: 0, scale: 0.97 },
  fade: { opacity: 0 },
};

export const revealVariants = (direction: RevealDirection = "up"): Variants => ({
  hidden: hiddenState[direction],
  show: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE, delay },
  }),
});
