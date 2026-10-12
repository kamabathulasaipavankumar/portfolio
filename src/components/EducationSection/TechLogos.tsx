import {
  siBootstrap,
  siCss,
  siGit,
  siGithub,
  siGraphql,
  siHtml5,
  siJavascript,
  siJest,
  siMongodb,
  siMui,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siReact,
  siTailwindcss,
  siTestinglibrary,
  siWebpack,
  siYarn,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import { Stagger, StaggerItem } from "../ui/motion";

type Tech = {
  /** Same wording as the skill list. */
  name: string;
  icon: SimpleIcon;
  /** Override the brand colour; "ink" follows the theme text colour (for black logos). */
  color?: string | "ink";
};

const technologies: Tech[] = [
  { name: "HTML5", icon: siHtml5 },
  { name: "CSS3", icon: siCss, color: "#1572B6" },
  { name: "JavaScript ES6+", icon: siJavascript },
  { name: "ReactJS", icon: siReact, color: "#149ECA" },
  { name: "Next.js", icon: siNextdotjs, color: "ink" },
  { name: "Tailwind CSS", icon: siTailwindcss },
  { name: "MUI (Material-UI)", icon: siMui },
  { name: "Bootstrap", icon: siBootstrap },
  { name: "Node.js", icon: siNodedotjs },
  { name: "MongoDB", icon: siMongodb },
  { name: "GraphQL", icon: siGraphql },
  { name: "Git", icon: siGit },
  { name: "GitHub", icon: siGithub, color: "ink" },
  { name: "Jest", icon: siJest },
  { name: "React Testing Library", icon: siTestinglibrary },
  { name: "Webpack", icon: siWebpack, color: "#1C78C0" },
  { name: "npm", icon: siNpm },
  { name: "yarn", icon: siYarn },
];

/** Logo grid of the technologies from the skill list. */
export function TechLogos() {
  return (
    <Stagger
      as="ul"
      className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:gap-4"
      stagger={0.03}
    >
      {technologies.map(({ name, icon, color }) => (
        <StaggerItem key={name} as="li">
          <div className="card card-hover group flex h-full flex-col items-center justify-center gap-2.5 rounded-2xl! bg-surface-strong/80! px-2 py-4 text-center backdrop-blur-xl sm:py-5">
            <svg
              role="img"
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={`size-8 transition-transform duration-300 group-hover:scale-110 sm:size-9 ${color === "ink" ? "text-ink" : ""}`}
              fill={color === "ink" ? "currentColor" : (color ?? `#${icon.hex}`)}
            >
              <path d={icon.path} />
            </svg>
            <span className="text-xs leading-tight font-semibold text-ink-soft sm:text-[0.8125rem]">{name}</span>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
