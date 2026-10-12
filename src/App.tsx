import ReactLenis from "lenis/react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import Header from "./components/Header/Header";
import { HeroSection } from "./components/HeroSection/HeroSection";
import { AboutSection } from "./components/AboutSection/AboutSection";
import { EducationSection } from "./components/EducationSection/EducationSection";
import ProfessionalProfile from "./components/EducationSection/SkillCategory";
import { CareerTimeline } from "./components/CareerSection/CareerTimeline";
import { ProjectsSection } from "./components/ProjectsSection/ProjectsSection";
import ConnectSection from "./components/ConnectSection/ConnectSection";
import { Background } from "./components/ui/Background";
import { PageBackdrop } from "./components/ui/PageBackdrop";

function App() {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.1, smoothWheel: !reduceMotion }}>
        {/* Clips full-bleed decoration horizontally without creating a scroll container */}
        <div className="relative overflow-x-clip">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-surface-strong focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-lg"
          >
            Skip to content
          </a>

          <Background />
          <PageBackdrop />
          <Header />

          <main id="main" className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <HeroSection />
            <AboutSection />
            <EducationSection />
            <ProfessionalProfile />
            <CareerTimeline />
            <ProjectsSection />
            <ConnectSection />
          </main>
        </div>
      </ReactLenis>
    </MotionConfig>
  );
}

export default App;
