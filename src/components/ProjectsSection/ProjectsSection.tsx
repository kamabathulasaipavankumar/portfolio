import { Card, CardHeader, CardTitle, CardContent } from "../lightswind/card";
import { Badge } from "../lightswind/badge";
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

interface Project {
  id: number;
  title: string;
  company: string;
  date: string;
  description: string;
  tech: string[];
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
  },
  {
    id: 2,
    title: "Recruitment Management Software (RMS)",
    company: "AFORV",
    date: "Jul 2024 – Nov 2025",
    description:
      "Built responsive UI components for recruiter workflows across Recruitment, Medical, Education, Hospitality, and Retail domains. Integrated RESTful APIs, implemented state management with React hooks, and built custom dashboards, forms, and data tables tested with Jest and React Testing Library.",
    tech: ["React", "Next.js", "MUI", "Tailwind CSS", "REST APIs"],
  },
  {
    id: 3,
    title: "Distribution Management Software (DMS)",
    company: "PODBIC",
    date: "Jan 2024 – Jun 2024",
    description:
      "Completed intensive training and built Surgery Tracking, Sales, and Logistics modules with a responsive ReactJS UI, using GraphQL and MongoDB, Webpack, and npm as part of a training and development program.",
    tech: ["ReactJS", "Next.js", "GraphQL", "MongoDB"],
  },
];

export const ProjectsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ when: "beforeChildren", staggerChildren: 0.1 }}
    >
      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.h2
          className="text-3xl font-bold text-foreground mb-8 text-center"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card
                hoverable
                bordered
                className="h-full flex flex-col bg-background/70"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle size="sm">{project.title}</CardTitle>
                    <Badge
                      variant="secondary"
                      className="shrink-0 whitespace-nowrap"
                    >
                      <Briefcase className="h-3 w-3 mr-1" />
                      {project.company}
                    </Badge>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {project.date}
                  </span>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tag) => (
                      <Badge key={tag} className="bg-pink-500">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
