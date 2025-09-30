import { ScrollTimeline } from "../lightswind/scroll-timeline";
import { Briefcase, Award, Users, Globe } from "lucide-react";

export const CareerTimeline = () => {
  const careerEvents = [
    {
      year: "July 2024 – Present",
      title: "Frontend Developer",
      subtitle: "AFORV Pvt Ltd, Bangalore",
      description:
        "Spearheaded development of Recruitment Management Software (RMS) with recruiter workflows, approvals, and candidate tracking. Built dashboards, data tables, approval pipelines, and real-time notifications using ReactJS & MUI. Integrated REST APIs and optimized performance with responsive layouts and client-side validations.",
      icon: <Users className="h-4 w-4 mr-2 text-primary" />,
    },

    {
      year: "Jan 2024 – Jun 2024",
      title: "Frontend Developer Intern",
      subtitle: "PODBIC, Bengaluru",
      description:
        "Contributed to Distribution Management Software (DMS) project. Built Surgery Tracking, Sales & Logistics modules with ReactJS and REST APIs. Enhanced UI with interactive elements, optimized CRUD workflows, and maintained codebase with Git + GitHub best practices.",
      icon: <Globe className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "Dec 2021 – Aug 2023",
      title: "Master of Computer Applications (MCA)",
      subtitle: "S.V.K.P & Dr. K.S. Raju Arts and Science College",
      description:
        "Graduated with 7.72 CGPA. Specialized in Computer Networks, Artificial Intelligence, and Core Java. Completed projects focusing on secure and scalable application development.",
      icon: <Award className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "Jun 2018 – Aug 2021",
      title: "Bachelor of Science (B.Sc.)",
      subtitle: "S.V.K.P & Dr. K.S. Raju Arts and Science College",
      description:
        "Graduated with 6.49 CGPA. Built strong foundation in programming, AI, and software concepts. Actively participated in technical programs and extra-curricular activities.",
      icon: <Briefcase className="h-4 w-4 mr-2 text-primary" />,
    },
  ];

  return (
    <div id="career">
      <ScrollTimeline
        events={careerEvents}
        title="Career Journey"
        subtitle="An evolving path of growth, innovation, and impact"
        animationOrder="staggered"
        cardAlignment="alternating"
        cardVariant="elevated"
        parallaxIntensity={0.15}
        revealAnimation="fade"
        progressIndicator={true}
        lineColor="bg-primary/20"
        activeColor="bg-primary"
        progressLineWidth={3}
        progressLineCap="round"
      />
    </div>
  );
};
