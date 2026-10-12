import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Reveal } from "./motion";
import { EASE } from "./motion-config";

type SectionHeadingProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  id?: string;
  /** Short gradient bar under the title that draws in on scroll. */
  underline?: boolean;
};

export function SectionHeading({ title, subtitle, align = "left", id, underline = false }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <h2
          id={id}
          className="text-[2rem] leading-[1.1] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
        >
          {title}
        </h2>
      </Reveal>
      {underline && !centered && (
        <motion.span
          aria-hidden="true"
          className="bg-brand-gradient mt-5 block h-1 w-16 origin-left rounded-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        />
      )}
      {subtitle && (
        <Reveal delay={0.12}>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>
        </Reveal>
      )}
      {underline && centered && (
        <motion.span
          aria-hidden="true"
          className="bg-brand-gradient mx-auto mt-5 block h-[3px] w-12 origin-center rounded-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
        />
      )}
    </div>
  );
}
