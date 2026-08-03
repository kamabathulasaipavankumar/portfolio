import { Separator } from "../lightswind/separator";
import { motion } from "framer-motion";

export const AboutSection = () => {
  return (
    <motion.div
      id="about"
      className="text-foreground max-w-7xl mx-auto w-full px-6 py-12 space-y-4"
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <h2 className="text-3xl font-bold">About Me</h2>
      <p className="text-muted-foreground text-sm max-w-3xl">
        I am a Frontend Developer with 2+ years of experience building responsive,
        high-performance web applications and mentoring developers through
        project-based learning. My expertise lies in ReactJS, Next.js, JavaScript
        ES6+, HTML5, CSS3, and modern UI frameworks like MUI, Bootstrap, and
        Tailwind CSS. I currently build AI-powered document automation interfaces
        at Ninestars, and bring hands-on experience across Agile workflows, Git,
        UI/UX principles, debugging, and web accessibility standards.
        Outside of coding, I enjoy traveling, exploring creativity, and working on
        projects that challenge me to grow both personally and professionally.
      </p>
      <Separator />
    </motion.div>
  );
};
