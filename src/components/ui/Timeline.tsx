import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { EASE } from "./motion-config";
import { useMediaQuery } from "../../hooks/useMediaQuery";

type TimelineProps = {
  children: ReactNode;
  /** Dotted fade-out ends above and below the rail. */
  tails?: boolean;
};

/** Vertical timeline: left rail on mobile, centred and alternating from md up. */
export function Timeline({ children, tails = false }: TimelineProps) {
  return (
    <div className={`relative ${tails ? "py-10" : ""}`}>
      {tails && (
        <>
          <span
            aria-hidden="true"
            className="absolute top-0 left-5 h-10 w-0 -translate-x-1/2 border-l-2 border-dotted border-brand-2/40 md:left-1/2"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-5 h-10 w-0 -translate-x-1/2 border-l-2 border-dotted border-brand-2/40 md:left-1/2"
          />
        </>
      )}
      <div
        aria-hidden="true"
        className={`absolute left-5 w-px -translate-x-1/2 bg-line-strong md:left-1/2 ${tails ? "top-10 bottom-10" : "top-5 bottom-5"}`}
      />
      {/* Accent line draws once when the timeline enters the viewport */}
      <motion.div
        aria-hidden="true"
        className={`absolute left-5 origin-top -translate-x-1/2 md:left-1/2 ${
          tails
            ? "top-10 bottom-10 w-[2px] rounded-full bg-gradient-to-b from-brand via-brand-2 to-brand-3"
            : "top-5 bottom-5 w-px bg-gradient-to-b from-brand-2 via-brand-2/60 to-transparent"
        }`}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
      <ol className="relative space-y-6 sm:space-y-8 md:space-y-10">{children}</ol>
    </div>
  );
}

type TimelineItemProps = {
  index: number;
  icon: ReactNode;
  /** Shown beside the node on desktop (e.g. the date range). */
  aside: ReactNode;
  highlight?: boolean;
  /**
   * "gradient": glowing gradient disc with a dashed halo.
   * "soft": white disc with a brand icon and the same halo (for secondary entries).
   */
  node?: "default" | "gradient" | "soft";
  /** Vertically centre the node and aside against the card instead of top-aligning. */
  align?: "top" | "center";
  children: ReactNode;
};

export function TimelineItem({
  index,
  icon,
  aside,
  highlight = false,
  node = "default",
  align = "top",
  children,
}: TimelineItemProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const cardOnLeft = index % 2 === 0;
  const fromX = isDesktop ? (cardOnLeft ? -20 : 20) : 16;
  const centered = align === "center";
  const haloNode = node === "gradient" || node === "soft";

  return (
    <li
      className={`relative grid pl-12 sm:pl-14 md:grid-cols-2 md:gap-x-20 md:pl-0 lg:gap-x-24 ${
        centered ? "md:items-center" : ""
      }`}
    >
      {/* Node */}
      <motion.div
        aria-hidden="true"
        className={`absolute left-5 z-10 -translate-x-1/2 md:left-1/2 ${
          centered ? "top-1/2 -translate-y-1/2 max-md:top-8" : haloNode ? "top-6" : "top-5"
        }`}
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
      >
        {haloNode ? (
          <span className="relative grid size-10 place-items-center md:size-12 lg:size-14">
            <span className="absolute -inset-2 hidden rounded-full border border-dashed border-brand-2/35 bg-surface-strong/40 lg:block" />
            <span
              className={`relative grid size-10 place-items-center rounded-full ring-4 ring-canvas md:size-12 lg:size-14 ${
                node === "gradient"
                  ? "bg-gradient-to-br from-brand to-brand-3 text-white shadow-[0_8px_22px_-6px_rgb(79_70_229/0.7)]"
                  : "border border-line-strong bg-surface-strong text-brand shadow-[0_8px_22px_-10px_rgb(79_70_229/0.45)]"
              }`}
            >
              {icon}
            </span>
          </span>
        ) : (
          <span
            className={`relative grid size-10 place-items-center rounded-full ring-[5px] ring-canvas ${
              highlight
                ? "bg-brand-gradient text-white shadow-[0_0_0_6px_rgb(99_102_241/0.12),0_6px_18px_-6px_rgb(79_70_229/0.6)]"
                : "border border-line-strong bg-surface-strong text-brand-ink"
            }`}
          >
            {icon}
          </span>
        )}
      </motion.div>

      {/* Card */}
      <motion.div
        className={`md:row-start-1 ${cardOnLeft ? "md:col-start-1" : "md:col-start-2"}`}
        initial={{ opacity: 0, x: fromX }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {children}
      </motion.div>

      {/* Aside (desktop only) */}
      <motion.div
        className={`hidden md:row-start-1 md:flex ${centered ? "items-center" : haloNode ? "items-start pt-6 lg:pt-[1.625rem]" : "items-start pt-[1.4rem]"} ${
          cardOnLeft ? "md:col-start-2 md:justify-start" : "md:col-start-1 md:justify-end"
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
      >
        {aside}
      </motion.div>
    </li>
  );
}

export function DateBadge({ children, live = false }: { children: ReactNode; live?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tabular-nums ${
        live ? "border-brand-2/25 bg-brand-2/[0.07] text-brand-ink" : "border-line bg-surface-strong/60 text-muted"
      }`}
    >
      {live && <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgb(16_185_129/0.18)]" />}
      {children}
    </span>
  );
}

/** Desktop aside text for a date range. */
export function DateAside({ children }: { children: ReactNode }) {
  return <span className="text-[0.9375rem] font-semibold tracking-tight text-muted tabular-nums">{children}</span>;
}

/** Glass pill with a calendar icon, used for date ranges. */
export function DatePill({ children, size = "md", live = false }: { children: ReactNode; size?: "sm" | "md"; live?: boolean }) {
  return (
    <span
      className={`glass inline-flex items-center rounded-full bg-surface-strong/75! font-medium text-ink-soft tabular-nums ${
        size === "sm" ? "gap-2 px-3 py-1.5 text-xs" : "gap-2.5 px-5 py-3 text-[0.9375rem]"
      }`}
    >
      <CalendarDays size={size === "sm" ? 14 : 18} aria-hidden="true" className="text-brand" />
      {live && (
        <span aria-hidden="true" className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgb(16_185_129/0.18)]" />
      )}
      {children}
    </span>
  );
}
