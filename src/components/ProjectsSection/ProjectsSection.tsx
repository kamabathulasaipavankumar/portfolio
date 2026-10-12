import { Building2, CalendarDays } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Stagger, StaggerItem } from "../ui/motion";
import { DatePill } from "../ui/Timeline";
import { ProjectPreview } from "./ProjectPreviews";
import type { PreviewKind } from "./ProjectPreviews";

interface Project {
  id: number;
  title: string;
  company: string;
  date: string;
  description: string;
  tech: string[];
  preview: PreviewKind;
}

const projects: Project[] = [
  {
    id: 1,
    title: "AOTM AI Automation Platform",
    company: "Ninestars",
    date: "Nov 2025 – Present",
    description:
      "Building responsive user interfaces for AI-based document processing and automation as part of the AOTM platform. Mentoring junior developers on coding standards and debugging, and conducting code reviews to raise code quality across the team.",
    tech: ["ReactJS", "Next.js", "AI Automation"],
    preview: "automation",
  },
  {
    id: 2,
    title: "Recruitment Management Software (RMS)",
    company: "AFORV",
    date: "Jul 2024 – Nov 2025",
    description:
      "Built responsive UI components for recruiter workflows across Recruitment, Medical, Education, Hospitality, and Retail domains. Integrated RESTful APIs, implemented state management with React hooks, and built custom dashboards, forms, and data tables tested with Jest and React Testing Library.",
    tech: ["React", "Next.js", "MUI", "Tailwind CSS", "REST APIs"],
    preview: "recruitment",
  },
  {
    id: 3,
    title: "Distribution Management Software (DMS)",
    company: "PODBIC",
    date: "Jan 2024 – Jun 2024",
    description:
      "Completed intensive training and built Surgery Tracking, Sales, and Logistics modules with a responsive ReactJS UI, using GraphQL and MongoDB, Webpack, and npm as part of a training and development program.",
    tech: ["ReactJS", "Next.js", "GraphQL", "MongoDB"],
    preview: "distribution",
  },
];

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const current = project.date.includes("Present");

  return (
    <article
      className={`card card-hover group grid h-full overflow-hidden bg-surface-strong/85! p-2.5 backdrop-blur-xl sm:p-3 ${
        featured ? "gradient-ring lg:grid-cols-[1.4fr_1fr] lg:items-center" : "grid-rows-[auto_1fr]"
      }`}
    >
      {featured && (
        <>
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-12 size-32 rounded-full bg-gradient-to-br from-violet-300/60 via-fuchsia-200/30 to-indigo-200/20 transition-transform duration-500 group-hover:scale-110 dark:from-violet-500/30 dark:via-fuchsia-500/10 dark:to-indigo-500/10"
          />
          <div aria-hidden="true" className="bg-dots absolute top-24 right-4 hidden h-14 w-14 opacity-80 lg:block" />
        </>
      )}
      {!featured && <div aria-hidden="true" className="edge-glow" />}

      {/* Preview */}
      <div
        className="relative aspect-[8/5] overflow-hidden rounded-2xl bg-[#0b0e2a] shadow-[0_24px_48px_-28px_rgb(15_23_42/0.6)] ring-1 ring-black/5 dark:ring-white/10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:group-hover:scale-100">
          <ProjectPreview kind={project.preview} />
        </div>
      </div>

      {/* Body */}
      <div className={`relative flex flex-col px-3 pt-5 pb-3 sm:px-4 ${featured ? "lg:px-8 lg:py-6" : ""}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
            <Building2 size={16} aria-hidden="true" className="text-brand" />
            {project.company}
          </span>
          {current ? (
            <DatePill size="sm" live>
              {project.date}
            </DatePill>
          ) : (
            <>
              <span aria-hidden="true" className="h-3.5 w-px bg-line-strong" />
              <span className="inline-flex items-center gap-1.5 text-sm text-muted tabular-nums">
                <CalendarDays size={15} aria-hidden="true" />
                {project.date}
              </span>
            </>
          )}
        </div>

        <h3
          className={`mt-3 font-bold tracking-tight text-ink ${
            featured ? "text-xl sm:text-2xl lg:mt-5 lg:text-[1.75rem] lg:leading-tight" : "text-lg leading-snug sm:text-xl"
          }`}
        >
          {project.title}
        </h3>

        <p className={`mt-3 leading-relaxed text-muted ${featured ? "text-[0.9375rem] sm:text-base" : "text-[0.9375rem]"}`}>
          {project.description}
        </p>

        <ul className="mt-auto flex flex-wrap gap-2 pt-6" aria-label="Technologies">
          {project.tech.map((tag) => (
            <li key={tag} className="chip bg-surface-strong/70! px-3! py-1.5!">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export const ProjectsSection = () => {
  const [featured, ...rest] = projects;

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative isolate py-12 sm:py-16 lg:py-20">

      <SectionHeading
        title={
          <>
            Proje<span className="text-gradient">cts</span>
          </>
        }
        id="projects-title"
      />

      <Stagger as="ul" className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:gap-6" stagger={0.1}>
        <StaggerItem as="li" className="md:col-span-2">
          <ProjectCard project={featured} featured />
        </StaggerItem>
        {rest.map((project) => (
          <StaggerItem key={project.id} as="li">
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
};
