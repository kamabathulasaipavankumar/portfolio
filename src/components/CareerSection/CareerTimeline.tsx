import { ScrollTimeline } from "../lightswind/scroll-timeline";
import { Briefcase, Award, Users, Globe } from "lucide-react";

export const CareerTimeline = () => {
  const careerEvents = [
    {
      year: "Nov 2025 – Present",
      title: "Software Engineer",
      subtitle: "Ninestars Information Technologies Pvt. Ltd., Bengaluru",
      description:
        "Contributing to the AOTM AI automation platform, building responsive user interfaces for AI-based document processing and automation. Mentoring junior developers on coding standards and debugging techniques, and conducting code reviews to improve code quality across the team.",
      icon: <Users className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "Jul 2024 – Nov 2025",
      title: "Frontend Developer",
      subtitle: "AFORV, Bengaluru",
      description:
        "Built responsive UI components with ReactJS, Next.js, MUI, Bootstrap, and Tailwind CSS across Recruitment, Medical, Education, Hospitality, and Retail domains. Integrated RESTful APIs, implemented state management with React hooks, and built custom dashboards, forms, and data tables with cross-browser, mobile-first responsive design. Tested UI with Jest and React Testing Library.",
      icon: <Globe className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "Jan 2024 – Jun 2024",
      title: "Frontend Developer Intern (Training & Development)",
      subtitle: "PODBIC, Bengaluru",
      description:
        "Completed intensive training in React, JavaScript ES6+, Next.js, GraphQL, Node.js, and MongoDB through hands-on workshops. Built real-world SPAs and component-driven applications using Webpack and npm, applying responsive design and Git version control workflows.",
      icon: <Globe className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "Dec 2021 – Aug 2023",
      title: "Master of Computer Applications (MCA)",
      subtitle: "SVKP & Dr. K.S. Raju Arts and Science College",
      description:
        "Master's degree in Computer Applications, Computer Science.",
      icon: <Award className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "Jun 2018 – Aug 2021",
      title: "Bachelor's Degree",
      subtitle: "SVKP & Dr. K.S. Raju Arts and Science College",
      description: "Bachelor's degree in Mathematics and Computer Science.",
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
