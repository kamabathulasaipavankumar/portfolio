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
        {/* I am a seasoned Full-Stack Developer and UI/UX Designer with over 10
        years of experience delivering high-quality software solutions for
        global enterprises and startups. My career blends deep technical
        expertise with leadership skills, enabling me to design, build, and lead
        innovative digital products from concept to launch. */}
        I am a Frontend Developer and IT professional with 1+ years of experience in designing and developing responsive, interactive, and high-performance web applications. My expertise lies in HTML5, CSS3, JavaScript, React, Redux, and Git, with a strong focus on debugging, performance optimization, and building scalable UIs.
        I am passionate about problem-solving, decision-making, and delivering solutions that enhance user experience. I thrive in collaborative environments, learning new technologies, and adapting quickly to project needs. 
        Outside of coding, I enjoy traveling, exploring creativity, and working on projects that challenge me to grow both personally and professionally.

      </p>
      <Separator />
    </motion.div>
  );
};
