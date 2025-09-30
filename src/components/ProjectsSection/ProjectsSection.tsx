"use client";

import { useState } from "react";
import { DragOrderList } from "../lightswind/DragOrderList";
import { motion } from "framer-motion";

export const ProjectsSection = () => {
  const [projects] = useState([
    {
      id: 1,
      title: "Recruitment Management Software (RMS)",
      subtitle:
        "Designed and implemented Recruiter Workflow Module with reusable React components and dynamic UI logic. Integrated REST APIs, built dashboards, approval pipelines, and real-time notifications. Optimized responsiveness with MUI + Tailwind CSS.",
      date: "Aug 2024 – Jun 2025",

    },
    {
      id: 2,
      title: "Distribution Management Software (DMS)",
      subtitle:
        "Developed modules for Surgery Tracking, Sales & Logistics Portal during internship. Built responsive UI with ReactJS, optimized CRUD workflows, and integrated APIs for real-time data sync. Maintained clean code with Git + GitHub.",
      date: "Jan 2024 – Jun 2024",

    },
  ]);
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
        <DragOrderList items={projects} />
      </section>
    </motion.div>
  );
};
