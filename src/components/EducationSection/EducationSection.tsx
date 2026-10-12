import { BookOpen, GraduationCap } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { DatePill, Timeline, TimelineItem } from "../ui/Timeline";

const education = [
  {
    degree: "Master of Computer Applications (MCA)",
    institution: "SVKP & Dr. K.S. Raju Arts and Science College",
    period: "Dec 2021 – Aug 2023",
    detail: "Major in Computer Science.",
  },
  {
    degree: "Bachelor's Degree",
    institution: "SVKP & Dr. K.S. Raju Arts and Science College",
    period: "Jun 2018 – Aug 2021",
    detail: "Major in Mathematics and Computer Science.",
  },
];

export const EducationSection = () => {
  return (
    <section id="education" aria-labelledby="education-title" className="relative isolate py-12 sm:py-16 lg:py-20">

      <SectionHeading
        title={
          <>
            Edu<span className="text-gradient">cation</span>
          </>
        }
        subtitle={
          <span className="mx-auto block max-w-[26rem]">
            My academic journey that built the foundation for my career in technology.
          </span>
        }
        id="education-title"
        align="center"
      />

      <div className="mx-auto mt-10 max-w-6xl sm:mt-12">
        <Timeline tails>
          {education.map((item, i) => {
            const cardOnLeft = i % 2 === 0;
            return (
              <TimelineItem
                key={item.degree}
                index={i}
                node="gradient"
                align="center"
                icon={<GraduationCap size={20} aria-hidden="true" />}
                aside={<DatePill>{item.period}</DatePill>}
              >
                <div className="relative">
                  {/* Notch pointing at the rail */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-8 z-10 size-3.5 rotate-45 bg-surface-strong md:top-1/2 md:-translate-y-1/2 ${
                      cardOnLeft
                        ? "-left-[7px] border-b border-l border-line md:right-[-7px] md:left-auto md:border-t md:border-r md:border-b-0 md:border-l-0"
                        : "-left-[7px] border-b border-l border-line"
                    }`}
                  />
                  <article className="card card-hover group overflow-hidden bg-surface-strong/85! p-5 backdrop-blur-xl sm:p-7">
                    <div
                      aria-hidden="true"
                      className={`absolute -top-12 -right-12 size-28 rounded-full bg-gradient-to-br transition-transform duration-500 group-hover:scale-110 ${
                        cardOnLeft
                          ? "from-violet-300/70 via-fuchsia-200/40 to-indigo-200/20 dark:from-violet-500/30 dark:via-fuchsia-500/15 dark:to-indigo-500/10"
                          : "from-sky-300/70 via-indigo-200/40 to-violet-200/20 dark:from-sky-500/30 dark:via-indigo-500/15 dark:to-violet-500/10"
                      }`}
                    />
                    <div aria-hidden="true" className="edge-glow" />

                    <span className="md:hidden">
                      <DatePill size="sm">{item.period}</DatePill>
                    </span>

                    <div className="relative mt-4 flex items-start gap-4 md:mt-0 sm:gap-5">
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-gradient-to-br from-violet-100 to-indigo-50 text-brand shadow-[0_8px_20px_-12px_rgb(79_70_229/0.5)] transition-transform duration-300 group-hover:scale-105 sm:size-14 lg:size-16 dark:from-violet-500/20 dark:to-indigo-500/10">
                        <GraduationCap size={26} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-lg leading-snug font-bold tracking-tight text-ink sm:text-xl">
                          {item.degree}
                        </h3>
                        <p className="mt-1.5 text-sm font-semibold text-brand-ink xl:text-[0.9375rem]">
                          {item.institution}
                        </p>
                      </div>
                    </div>

                    <p className="relative mt-5 flex items-center gap-3 border-t border-line pt-4 text-sm text-muted sm:text-[0.9375rem]">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-line/60 text-ink-soft">
                        <BookOpen size={17} aria-hidden="true" />
                      </span>
                      {item.detail}
                    </p>
                  </article>
                </div>
              </TimelineItem>
            );
          })}
        </Timeline>
      </div>
    </section>
  );
};
