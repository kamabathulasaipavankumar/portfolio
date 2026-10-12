import { Code2, FlaskConical, Palette, Server, Workflow, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Stagger, StaggerItem } from "../ui/motion";
import { TechLogos } from "./TechLogos";

type SkillCategory = {
  name: string;
  icon: LucideIcon;
  skills: string[];
};

const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    icon: Code2,
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript ES6+",
      "ReactJS",
      "Next.js",
      "Responsive Design",
      "Mobile-First Development",
    ],
  },
  {
    name: "UI Frameworks",
    icon: Palette,
    skills: [
      "MUI (Material-UI)",
      "Bootstrap",
      "Tailwind CSS",
      "UI/UX Principles",
      "Web Accessibility Standards",
    ],
  },
  {
    name: "Tools & DevOps",
    icon: Wrench,
    skills: [
      "Git",
      "GitHub",
      "Webpack",
      "npm",
      "yarn",
      "Browser DevTools",
      "Debugging",
      "Performance Optimization",
    ],
  },
  {
    name: "Testing & Quality",
    icon: FlaskConical,
    skills: [
      "Jest",
      "React Testing Library",
      "Cross-Browser Compatibility",
      "Code Reviews",
    ],
  },
  {
    name: "Backend & APIs",
    icon: Server,
    skills: ["RESTful APIs", "GraphQL", "Node.js", "MongoDB", "API Integration"],
  },
  {
    name: "Methodologies",
    icon: Workflow,
    skills: [
      "Agile/Scrum",
      "Technical Mentorship",
      "Project-Based Learning",
      "Curriculum Design",
    ],
  },
];

// Core stack, as named in the About section ("My expertise lies in …").
const primarySkills = new Set([
  "ReactJS",
  "Next.js",
  "JavaScript ES6+",
  "HTML5",
  "CSS3",
  "MUI (Material-UI)",
  "Bootstrap",
  "Tailwind CSS",
]);

export default function ProfessionalProfile() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative isolate py-12 sm:py-16 lg:py-20">

      <SectionHeading
        title={
          <>
            Technical <span className="text-gradient">Skills</span>
          </>
        }
        subtitle={
          <span className="block max-w-[30rem] text-base">
            A collection of technologies and tools I work with to build modern, scalable and high-performance web
            applications.
          </span>
        }
        id="skills-title"
        underline
      />

      <div className="mt-10 sm:mt-12">
        <TechLogos />
      </div>

      <Stagger
        as="ul"
        className="mt-4 grid gap-4 sm:mt-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-5"
        stagger={0.06}
      >
        {skillCategories.map(({ name, icon: Icon, skills }, i) => (
          <StaggerItem key={name} as="li">
            <article className="card card-hover group flex h-full flex-col overflow-hidden bg-surface-strong/80! p-5 backdrop-blur-xl sm:p-6">
              {/* Corner orb + dot texture */}
              <div
                aria-hidden="true"
                className={`absolute -top-10 -right-10 size-24 rounded-full bg-gradient-to-br transition-transform duration-500 group-hover:scale-110 ${
                  i % 2 === 0
                    ? "from-violet-300/60 via-fuchsia-200/30 to-indigo-200/20 dark:from-violet-500/30 dark:via-fuchsia-500/10 dark:to-indigo-500/10"
                    : "from-sky-300/60 via-indigo-200/30 to-violet-200/20 dark:from-sky-500/30 dark:via-indigo-500/10 dark:to-violet-500/10"
                }`}
              />
              <div aria-hidden="true" className="bg-dots absolute top-5 right-[4.25rem] h-11 w-12 opacity-80" />
              <div aria-hidden="true" className="edge-glow" />

              <div className="relative flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-gradient-to-br from-white to-violet-50 text-brand shadow-[0_8px_20px_-12px_rgb(79_70_229/0.5)] transition-transform duration-300 group-hover:scale-105 dark:from-violet-500/20 dark:to-indigo-500/10">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-ink">{name}</h3>
                  <span aria-hidden="true" className="bg-brand-gradient mt-1.5 block h-[3px] w-5 rounded-full" />
                </div>
              </div>

              <ul className="relative mt-5 flex flex-wrap gap-2" aria-label={`${name} skills`}>
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className={`chip px-3! py-1.5! ${primarySkills.has(skill) ? "chip-primary" : "bg-surface-strong/70!"}`}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
