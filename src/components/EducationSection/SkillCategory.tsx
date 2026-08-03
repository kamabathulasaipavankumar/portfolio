import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../lightswind/card.tsx";
import { Badge } from "../lightswind/badge";
import { motion, AnimatePresence } from "framer-motion";

const skillCategories = [
  {
    name: "Frontend",
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
    skills: [
      "Jest",
      "React Testing Library",
      "Cross-Browser Compatibility",
      "Code Reviews",
    ],
  },
  {
    name: "Backend & APIs",
    skills: ["RESTful APIs", "GraphQL", "Node.js", "MongoDB", "API Integration"],
  },
  {
    name: "Methodologies",
    skills: [
      "Agile/Scrum",
      "Technical Mentorship",
      "Project-Based Learning",
      "Curriculum Design",
    ],
  },
];

export default function ProfessionalProfile() {
  return (
    <motion.section
      id="skills"
      className="space-y-12"
      initial={{ opacity: 0 }}
      whileInView={{
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.3,
        },
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl font-bold mb-6">Technical Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              viewport={{ once: true, amount: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle size="sm">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {category.skills.map((skill) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                        }}
                        viewport={{ once: true }}
                      >
                        <Badge className="bg-pink-500">{skill}</Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
