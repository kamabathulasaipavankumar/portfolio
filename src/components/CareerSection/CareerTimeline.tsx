import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Briefcase, Building2, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { DatePill } from "../ui/Timeline";
import { EASE } from "../ui/motion-config";

type CareerEvent = {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
};

// Chronological: first internship → current role.
const careerEvents: CareerEvent[] = [
  {
    year: "Jan 2024 – Jun 2024",
    title: "Frontend Developer Intern (Training & Development)",
    subtitle: "PODBIC, Bengaluru",
    description:
      "Completed intensive training in React, JavaScript ES6+, Next.js, GraphQL, Node.js, and MongoDB through hands-on workshops. Built real-world SPAs and component-driven applications using Webpack and npm, applying responsive design and Git version control workflows.",
    icon: GraduationCap,
  },
  {
    year: "Jul 2024 – Nov 2025",
    title: "Frontend Developer",
    subtitle: "AFORV, Bengaluru",
    description:
      "Built responsive UI components with ReactJS, Next.js, MUI, Bootstrap, and Tailwind CSS across Recruitment, Medical, Education, Hospitality, and Retail domains. Integrated RESTful APIs, implemented state management with React hooks, and built custom dashboards, forms, and data tables with cross-browser, mobile-first responsive design. Tested UI with Jest and React Testing Library.",
    icon: Building2,
  },
  {
    year: "Nov 2025 – Present",
    title: "Software Engineer",
    subtitle: "Ninestars Information Technologies Pvt. Ltd., Bengaluru",
    description:
      "Contributing to the AOTM AI automation platform, building responsive user interfaces for AI-based document processing and automation. Mentoring junior developers on coding standards and debugging techniques, and conducting code reviews to improve code quality across the team.",
    icon: Briefcase,
  },
];

const toSentences = (text: string) => text.split(/(?<=\.)\s+(?=[A-Z])/);

// Nodes sit at 0, ½ and 1 along the rail; each activates when the progress line reaches it.
const thresholds = careerEvents.map((_, i) => Math.min(0.98, Math.max(0.02, i / (careerEvents.length - 1))));

// The rail runs between the first and last column centres (equal columns, no gap).
const RAIL_INSET = 100 / (careerEvents.length * 2);

export const CareerTimeline = () => {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 85%", "end 95%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });
  const indicatorLeft = useTransform(progress, (v) => `${RAIL_INSET + v * (100 - 2 * RAIL_INSET)}%`);

  // Monotonic: once a milestone is reached it stays revealed (no replay when scrolling back).
  const [reached, setReached] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    const count = thresholds.filter((t) => v >= t).length;
    setReached((prev) => (count > prev ? count : prev));
  });
  const shown = reduceMotion ? careerEvents.length : reached;

  // Snap points swallow small arrow-key steps, so step one card per key press instead.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const el = e.currentTarget;
    if (el.scrollWidth <= el.clientWidth) return;
    e.preventDefault();
    const step = el.scrollWidth / careerEvents.length;
    el.scrollBy({ left: e.key === "ArrowRight" ? step : -step, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section id="career" aria-labelledby="career-title" className="relative isolate py-12 sm:py-16 lg:py-20">
      <SectionHeading
        title={
          <>
            Career <span className="text-gradient">Journey</span>
          </>
        }
        subtitle="An evolving path of growth, innovation, and impact"
        id="career-title"
        align="center"
        underline
      />

      {/* Below lg the journey scrolls sideways (snap per card); from lg it fits the container. */}
      <div
        role="region"
        aria-label="Career timeline"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="-mx-4 mt-10 snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 pt-2 pb-4 focus-visible:outline-offset-[-2px] sm:-mx-6 sm:mt-12 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:snap-none lg:overflow-visible lg:px-0"
      >
        <div
          ref={trackRef}
          className="relative grid w-max grid-cols-[repeat(3,min(82vw,21rem))] lg:w-full lg:grid-cols-3"
        >
          {/* Row 1: cards */}
          {careerEvents.map((event, i) => {
            const active = i < shown;
            const current = event.year.includes("Present");
            const Icon = event.icon;
            const sentences = toSentences(event.description);

            return (
              <motion.div
                key={event.year}
                className="row-start-1 snap-center px-2 pb-5 sm:px-2.5 lg:px-3"
                style={{ gridColumn: i + 1 }}
                initial={false}
                animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <article
                  aria-label={`${event.title}, ${event.subtitle}, ${event.year}`}
                  className={`card relative flex h-full flex-col bg-surface-strong/85! p-5 backdrop-blur-xl transition-[border-color,box-shadow] duration-500 sm:p-6 ${
                    current && active
                      ? "gradient-ring is-on"
                      : "hover:border-[var(--line-accent)] hover:shadow-[var(--shadow-card-hover)]"
                  }`}
                >
                  {/* Pointer down to the node */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-[7px] left-1/2 size-3.5 -translate-x-1/2 rotate-45 border-r border-b border-line bg-surface-strong"
                  />

                  <div className="flex items-start gap-3.5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-line bg-gradient-to-br from-white to-violet-50 text-brand shadow-[0_8px_20px_-12px_rgb(79_70_229/0.5)] dark:from-violet-500/20 dark:to-indigo-500/10">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`text-base leading-snug font-bold tracking-tight text-ink sm:text-[1.0625rem] ${
                          current ? "pr-16" : ""
                        }`}
                      >
                        {event.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-brand-ink">{event.subtitle}</p>
                      <div className="mt-2.5">
                        <DatePill size="sm" live={current}>
                          {event.year}
                        </DatePill>
                      </div>
                    </div>
                    {current && (
                      <span className="absolute top-5 right-5 rounded-md bg-brand-2/10 px-2 py-0.5 text-[0.6875rem] font-bold tracking-[0.1em] text-brand-ink uppercase sm:top-6 sm:right-6">
                        Current
                      </span>
                    )}
                  </div>

                  <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                    {sentences.map((sentence) => (
                      <li key={sentence} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                        <span aria-hidden="true" className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-ink-soft/60" />
                        {sentence}
                      </li>
                    ))}
                  </ul>
                </article>
              </motion.div>
            );
          })}

          {/* Row 2: rail, progress line and travelling indicator */}
          <div aria-hidden="true" className="relative row-start-2 h-16" style={{ gridColumn: "1 / -1" }}>
            <span
              className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-line-strong"
              style={{ left: `${RAIL_INSET}%`, right: `${RAIL_INSET}%` }}
            />
            <motion.span
              className="absolute top-1/2 h-[3px] origin-left -translate-y-1/2 rounded-full bg-gradient-to-r from-brand via-brand-2 to-brand-3"
              style={{ left: `${RAIL_INSET}%`, right: `${RAIL_INSET}%`, scaleX: reduceMotion ? 1 : progress }}
            />
            {!reduceMotion && shown < careerEvents.length && (
              <motion.span
                className="absolute top-1/2 z-20 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgb(99_102_241/0.7)] ring-4 ring-brand-2/30"
                style={{ left: indicatorLeft }}
              />
            )}
          </div>

          {/* Row 2 (overlaid): milestone nodes; row 3: dates */}
          {careerEvents.map((event, i) => {
            const active = i < shown;
            const current = event.year.includes("Present");
            const Icon = event.icon;
            return (
              <div key={event.year} aria-hidden="true" className="contents">
                <div className="z-10 row-start-2 flex items-center justify-center" style={{ gridColumn: i + 1 }}>
                  <motion.span
                    initial={false}
                    animate={{ scale: active ? 1 : 0.8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={`grid size-12 place-items-center rounded-full ring-[5px] ring-canvas transition-[background-color,color,box-shadow] duration-500 ${
                      active
                        ? `bg-gradient-to-br from-brand to-brand-3 text-white ${
                            current
                              ? "shadow-[0_0_0_7px_rgb(99_102_241/0.14),0_0_26px_rgb(124_58_237/0.45)]"
                              : "shadow-[0_8px_20px_-8px_rgb(79_70_229/0.6)]"
                          }`
                        : "border border-line-strong bg-surface-strong text-muted"
                    }`}
                  >
                    <Icon size={19} />
                  </motion.span>
                </div>
                <motion.div
                  className="row-start-3 px-2 pt-1 text-center"
                  style={{ gridColumn: i + 1 }}
                  initial={false}
                  animate={{ opacity: active ? 1 : 0.45 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-[0.9375rem] font-bold text-ink tabular-nums">{event.year}</p>
                  <p className="mt-0.5 text-xs text-muted">{event.subtitle.split(",")[0]}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
