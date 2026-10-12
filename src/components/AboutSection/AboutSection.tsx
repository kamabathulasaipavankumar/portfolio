import { Code2, Plane, Sparkles } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "../ui/motion";

// The About paragraph, sentence by sentence (verbatim, in order).
const lead = (
  <>
    I am a Frontend Developer with{" "}
    <span className="text-gradient font-semibold">2+ years of experience</span> building responsive,
    high-performance web applications and mentoring developers through project-based learning.
  </>
);

const highlights = [
  {
    icon: Code2,
    text: "My expertise lies in ReactJS, Next.js, JavaScript ES6+, HTML5, CSS3, and modern UI frameworks like MUI, Bootstrap, and Tailwind CSS.",
  },
  {
    icon: Sparkles,
    text: "I currently build AI-powered document automation interfaces at Ninestars, and bring hands-on experience across Agile workflows, Git, UI/UX principles, debugging, and web accessibility standards.",
  },
  {
    icon: Plane,
    text: "Outside of coding, I enjoy traveling, exploring creativity, and working on projects that challenge me to grow both personally and professionally.",
  },
];

export const AboutSection = () => {
  return (
    <section id="about" aria-labelledby="about-title" className="relative isolate py-12 sm:py-16 lg:py-20">

      {/* Heading + lead */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-center lg:gap-10">
        <div>
          <SectionHeading
            title={
              <>
                About <span className="text-gradient">Me</span>
              </>
            }
            id="about-title"
            underline
          />
        </div>

        <Reveal delay={0.1}>
          <div className="relative pl-7 sm:pl-10">
            <span aria-hidden="true" className="absolute inset-y-1 left-0 w-px bg-line-strong" />
            <span
              aria-hidden="true"
              className="absolute top-[38%] left-0 size-2.5 -translate-x-1/2 rounded-full bg-brand-2 ring-4 ring-brand-2/15"
            />
            <p className="text-[1.375rem] leading-[1.45] font-medium tracking-[-0.015em] text-ink sm:text-[1.75rem] lg:text-[1.875rem] lg:leading-[1.4]">
              {lead}
            </p>
          </div>
        </Reveal>
      </div>

      {/* Highlight cards */}
      <Stagger as="ul" className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-6" stagger={0.1} delay={0.1}>
        {highlights.map(({ icon: Icon, text }, i) => (
          <StaggerItem key={i} as="li" className={i === 2 ? "md:col-span-2 lg:col-span-1" : undefined}>
            <article className="card card-hover group h-full overflow-hidden bg-surface-strong/75! p-6 backdrop-blur-xl sm:p-7">
              {/* Corner orb + dot texture */}
              <div
                aria-hidden="true"
                className="absolute -top-12 -right-12 size-28 rounded-full bg-gradient-to-br from-violet-300/60 via-indigo-200/40 to-sky-200/30 transition-transform duration-500 group-hover:scale-110 dark:from-violet-500/30 dark:via-indigo-500/20 dark:to-sky-500/10"
              />
              <div
                aria-hidden="true"
                className="bg-dots absolute top-7 right-[4.75rem] h-[3.25rem] w-[4.25rem] opacity-90"
              />
              {/* Gradient edge wrapping the bottom-left corner */}
              <div aria-hidden="true" className="edge-glow" />

              <span className="relative grid size-12 place-items-center rounded-2xl border border-line-strong bg-surface-strong text-brand shadow-[0_8px_20px_-12px_rgb(79_70_229/0.5)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                <Icon size={21} aria-hidden="true" />
              </span>
              <p className="relative mt-6 text-[0.9375rem] leading-relaxed text-muted sm:text-base">{text}</p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
};
