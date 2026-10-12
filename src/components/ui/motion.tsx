import { motion } from "framer-motion";
import { revealVariants } from "./motion-config";
import type { RevealDirection } from "./motion-config";
import type { ReactNode } from "react";

const VIEWPORT = { once: true, amount: 0.2 } as const;

type RevealProps = {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  className?: string;
};

/** Reveals its content once, when it scrolls into view. */
export function Reveal({ children, direction = "up", delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={revealVariants(direction)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol";
};

/** Container that reveals its <StaggerItem> children one after another. */
export function Stagger({ children, className, stagger = 0.07, delay = 0, as = "div" }: StaggerProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </Component>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  as?: "div" | "li" | "article";
};

export function StaggerItem({ children, className, direction = "up", as = "div" }: StaggerItemProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component className={className} variants={revealVariants(direction)}>
      {children}
    </Component>
  );
}
