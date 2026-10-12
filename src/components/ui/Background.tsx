import { motion } from "framer-motion";

/** Fixed, very low-contrast ambient background: two slow glow orbs over a faded grid. */
export function Background() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_20%,transparent_70%)]" />

      <div
        className="animate-drift-a absolute -top-[25vh] -left-[15vw] size-[70vw] max-h-[900px] max-w-[900px] rounded-full"
        style={{ background: "radial-gradient(circle, var(--glow-1), transparent 62%)" }}
      />
      <div
        className="animate-drift-b absolute top-[35vh] -right-[20vw] size-[60vw] max-h-[800px] max-w-[800px] rounded-full"
        style={{ background: "radial-gradient(circle, var(--glow-2), transparent 62%)" }}
      />
    </motion.div>
  );
}
