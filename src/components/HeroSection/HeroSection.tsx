import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { MouseEvent } from "react";
import { ArrowRight, Atom, Code2, Lightbulb, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EASE } from "../ui/motion-config";
import { SocialLinks } from "../ui/SocialLinks";
import { useScrollTo } from "../../hooks/useScrollTo";

type Stat = {
  value: string;
  label: string;
  icon: LucideIcon;
  tone: string;
  /** Placement inside the portrait box (desktop). */
  position: string;
};

const stats: Stat[] = [
  {
    value: "2+",
    label: "Years Experience",
    icon: Code2,
    tone: "from-violet-500 to-indigo-600",
    position: "left-0 top-[57%]",
  },
  {
    value: "React, Next.js",
    label: "Primary Stack",
    icon: Atom,
    tone: "from-sky-400 to-blue-600",
    position: "right-0 top-[45%]",
  },
  {
    value: "AI Automation",
    label: "Current Focus",
    icon: Lightbulb,
    tone: "from-violet-500 to-fuchsia-500",
    position: "right-0 bottom-[6%]",
  },
];

// Load sequence: backdrop → navbar → copy (staggered) → portrait → stat cards → script & scroll cue
const copy: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function StatIcon({ icon: Icon, tone, small = false }: { icon: LucideIcon; tone: string; small?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br text-white shadow-[0_8px_18px_-8px_rgb(79_70_229/0.8)] ${tone} ${
        small ? "size-9" : "size-10 xl:size-12"
      }`}
    >
      <Icon size={small ? 16 : 19} aria-hidden="true" />
    </span>
  );
}

export const HeroSection = () => {
  const scrollTo = useScrollTo();
  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo(id);
  };

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate pt-28 pb-6 sm:pt-32 sm:pb-12 lg:flex lg:min-h-[min(100dvh,56rem)] lg:items-center lg:pt-28 lg:pb-20"
    >
      <div className="grid w-full items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-x-8 md:gap-y-10 lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        {/* Copy */}
        <motion.div variants={copy} initial="hidden" animate="show" className="max-w-xl">
          <motion.p
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-500/[0.08] py-1 pr-3.5 pl-2.5 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:text-emerald-300"
          >
            <span aria-hidden="true" className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgb(16_185_129/0.18)]" />
            Available for Opportunities
          </motion.p>

          <motion.p variants={rise} className="mt-6 text-lg font-medium text-muted sm:text-xl">
            Hello, I'm
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={rise}
            className="mt-1 text-[2.75rem] leading-[1] font-bold tracking-[-0.04em] text-ink min-[400px]:text-5xl sm:text-6xl lg:text-[4.25rem] xl:text-[5rem]"
          >
            <span className="block">Sai Pavan </span>
            <span className="text-gradient block pb-1.5">Kumar . K</span>
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-5 text-[1.0625rem] leading-snug font-semibold text-ink sm:text-xl"
          >
            <span className="inline-block">Frontend Developer</span>{" "}
            <span className="mx-1 font-normal text-muted/60">|</span>{" "}
            <span className="inline-block">Software Engineer @ Ninestars</span>
          </motion.p>

          <motion.p
            variants={rise}
            className="mt-4 max-w-[33rem] text-[0.9375rem] leading-relaxed text-muted sm:text-base lg:text-[1.0625rem]"
          >
            2+ years building responsive, high-performance web apps with ReactJS, Next.js, and modern
            JavaScript. Currently crafting AI-powered automation interfaces at Ninestars, with a passion for
            mentoring and clean, accessible UI.
          </motion.p>

          <motion.div
            className="mt-8 sm:mt-9"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.65 }}
          >
            <a href="#connect" onClick={go("connect")} className="btn btn-primary min-h-14 gap-3 px-7 text-base">
              <Send size={18} aria-hidden="true" />
              Let's Connect
              <ArrowRight size={18} className="btn-icon" aria-hidden="true" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-7"
          >
            <SocialLinks className="gap-3 [&_a]:size-12 [&_a]:bg-surface-strong [&_a]:shadow-[var(--shadow-card)] [&_a]:text-ink" />
          </motion.div>
        </motion.div>

        {/* Portrait composition. Every layer is positioned inside this box (no negative offsets),
            so nothing can spill into the text column or past the page edge. */}
        <div className="relative mx-auto w-full max-w-[21rem] min-[400px]:max-w-[23rem] sm:max-w-[28rem] md:max-w-none lg:max-w-[31rem] xl:max-w-[34rem]">
          <div className="relative aspect-[10/11]">
            {/* z-0: glow */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-[4%] z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
              style={{
                background:
                  "radial-gradient(closest-side, rgb(124 58 237 / 0.2), rgb(99 102 241 / 0.08) 55%, transparent)",
              }}
            />

            {/* z-0: decorative layers */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-dots absolute top-[4%] left-[6%] h-20 w-28 opacity-70 [mask-image:radial-gradient(closest-side,#000,transparent)]" />
              <div className="bg-dots absolute top-[30%] right-0 h-24 w-24 opacity-70 [mask-image:radial-gradient(closest-side,#000,transparent)]" />
              <div className="bg-dots absolute bottom-[6%] left-[4%] h-24 w-20 opacity-70 [mask-image:radial-gradient(closest-side,#000,transparent)]" />
              <div className="absolute top-[12%] right-[4%] bottom-[12%] w-[46%] rotate-[7deg] rounded-[2.5rem] border border-white/70 bg-gradient-to-br from-white/55 to-violet-200/25 shadow-[0_30px_60px_-30px_rgb(79_70_229/0.35)] backdrop-blur-md dark:border-white/10 dark:from-white/[0.05] dark:to-violet-400/[0.05]" />
              <div className="absolute top-[46%] left-[3%] h-[24%] w-[60%] -rotate-[16deg] rounded-[50%] border-[3px] border-white/75 shadow-[0_0_18px_rgb(139_92_246/0.22)] dark:border-white/15" />
            </motion.div>

            {/* z-10: frame with the portrait. The frame (66% x 84% of a 10:11 box, about 0.714) matches the
                photo (864:1184, about 0.73), and the photo is counter-rotated and scaled just enough (110%) to fill
                the tilted frame, so the full head and upper body stay visible. */}
            <motion.div
              className="absolute top-[9%] right-[17%] bottom-[7%] left-[17%] z-10"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
            >
              <div className="animate-float size-full">
                <div className="relative size-full -rotate-[4deg] overflow-hidden rounded-[2.25rem] bg-[#26272d] shadow-[0_36px_72px_-30px_rgb(15_23_42/0.55)] ring-1 ring-white/40 dark:ring-white/15 sm:rounded-[2.75rem]">
                  <img
                    src="/images/myphoto.jpg"
                    alt="Sai Pavan Kumar"
                    width={864}
                    height={1184}
                    fetchPriority="high"
                    decoding="async"
                    className="absolute -top-[5%] -left-[5%] size-[110%] max-w-none rotate-[4deg] object-cover object-bottom"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/15 via-transparent to-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* z-20: script label */}
            <motion.div
              aria-hidden="true"
              className="absolute top-[5%] right-[6%] z-20 hidden -rotate-[12deg] text-right text-brand-ink [text-shadow:0_0_2px_#fff,0_0_12px_rgb(255_255_255/0.95)] sm:block dark:[text-shadow:0_0_14px_rgb(0_0_0/0.6)] md:scale-90 xl:scale-100"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 1.05 }}
            >
              <span className="block font-['Caveat'] text-[1.9rem] leading-[0.9] font-semibold xl:text-[2.15rem]">
                Frontend
              </span>
              <span className="mr-[-0.6rem] block font-['Caveat'] text-[1.9rem] leading-[0.95] font-semibold xl:text-[2.15rem]">
                Developer
              </span>
              <svg
                viewBox="0 0 60 60"
                className="mt-1 mr-8 ml-auto h-10 w-10 text-brand-2 drop-shadow-[0_0_6px_rgb(255_255_255/0.95)] xl:h-12 xl:w-12 dark:drop-shadow-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M40 4 C 50 22, 44 40, 18 50" />
                <path d="M26 42 L 17 50 L 28 54" />
              </svg>
            </motion.div>

            {/* z-30: stat cards (desktop only), anchored to the portrait box edges, beside the face */}
            <ul className="hidden lg:block">
              {stats.map(({ value, label, icon, tone, position }, i) => (
                <motion.li
                  key={label}
                  className={`absolute z-30 ${position}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.8 + i * 0.1 }}
                >
                  <div className="glass flex items-center gap-3 rounded-2xl bg-surface-strong/85! py-2.5 pr-4 pl-2.5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] motion-reduce:hover:translate-y-0 xl:gap-3.5 xl:py-3 xl:pr-5 xl:pl-3">
                    <StatIcon icon={icon} tone={tone} />
                    <div className="whitespace-nowrap">
                      <p className="text-base leading-tight font-bold tracking-tight text-ink xl:text-lg">{value}</p>
                      <p className="mt-0.5 text-xs text-muted">{label}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stat cards (mobile & tablet: a row under the hero) */}
        <ul className="grid grid-cols-3 gap-2 sm:gap-3 md:col-span-2 lg:hidden">
          {stats.map(({ value, label, icon, tone }, i) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.8 + i * 0.08 }}
              className="glass flex flex-col items-center rounded-2xl bg-surface-strong/85! px-2 py-3 text-center transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] motion-reduce:hover:translate-y-0 sm:flex-row sm:gap-3 sm:px-4 sm:py-3.5 sm:text-left"
            >
              <StatIcon icon={icon} tone={tone} small />
              <div className="min-w-0">
                <p className="mt-2 text-[0.8125rem] leading-tight font-bold text-ink sm:mt-0 sm:text-base">{value}</p>
                <p className="mt-0.5 text-[0.6875rem] leading-tight text-muted sm:text-xs">{label}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};
