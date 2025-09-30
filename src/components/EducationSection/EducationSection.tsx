import { Card, CardHeader, CardTitle, CardContent } from "../lightswind/card";
import ProfessionalProfile from "./SkillCategory";
import { motion } from "framer-motion";

export const EducationSection = () => {
  return (
    <motion.section
      id="education"
      className="space-y-10 py-10 px-6"
      initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Education */}
      <div>
        <motion.h3
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Education
        </motion.h3>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-1 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Master of Computer Application</CardTitle>
              <p className="text-sm text-muted-foreground">
                S.V.K.P & Dr.K.S Raju arts and Science College — 2021 – 2023
              </p>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                Specialized in <strong>Computer Networks</strong>,
               <strong> Artificial Intelligence</strong>, and 
                <strong> Data Mining</strong>.
              </p>
              <ul className="list-disc list-inside space-y-1">
               <li>Completed advanced projects in AI and Data Mining</li>
                <li>Gained strong knowledge of Core Java and programming fundamentals</li>
                <li>Maintained GPA of 7.72/10.0</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>B.Sc. in Computer Science</CardTitle>
              <p className="text-sm text-muted-foreground">
                Adikavi Nannaya University — 2018 – 2021
              </p>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
            <p>
            Gained strong foundation in <strong>Java</strong>, 
            <strong> Artificial Intelligence</strong>, and 
            <strong> Office Tools & Photoshop</strong>.
            </p>
            <ul className="list-disc list-inside space-y-1">
            <li>Completed projects using Java and AI concepts</li>
            <li>Learned Adobe Photoshop and MS Office applications</li>
            <li>Maintained GPA of 6.59/10.0</li>
            </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ProfessionalProfile />
    </motion.section>
  );
};
