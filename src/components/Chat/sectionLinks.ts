// Maps visitor questions to existing portfolio sections so the chat can navigate to them.
// Section ids are the real ids rendered by the section components (src/components/*Section*).

export type SectionLink = { id: string; label: string };

const RULES: (SectionLink & { pattern: RegExp })[] = [
  {
    id: "skills",
    label: "Skills",
    pattern: /\b(skills?|tech ?stack|stack|technolog(y|ies)|tools?|frameworks?|languages?|react|next\.?js|tailwind|typescript|javascript)\b/i,
  },
  {
    id: "projects",
    label: "Projects",
    pattern: /\b(projects?|aotm|rms|dms|recruitment management|distribution management)\b/i,
  },
  {
    id: "career",
    label: "Experience",
    pattern: /\b(experience|career|jobs?|work(s|ed|ing)?|roles?|compan(y|ies)|employ(er|ment)|ninestars|aforv|podbic|intern(ship)?)\b/i,
  },
  {
    id: "education",
    label: "Education",
    pattern: /\b(education|degree|mca|bachelor'?s?|college|universit(y|ies)|stud(y|ied)|qualifications?)\b/i,
  },
  {
    id: "connect",
    label: "Contact",
    pattern: /\b(contact|e-?mail|phone|call|reach|linkedin|github|hire|connect)\b/i,
  },
];

/** Returns the section a question is about (the earliest match in the text), if it exists on the page. */
export function matchSection(question: string): SectionLink | null {
  let best: { rule: (typeof RULES)[number]; index: number } | null = null;
  for (const rule of RULES) {
    const index = question.search(rule.pattern);
    if (index >= 0 && (!best || index < best.index)) best = { rule, index };
  }
  if (!best || !document.getElementById(best.rule.id)) return null;
  return { id: best.rule.id, label: best.rule.label };
}

const HIGHLIGHT_CLASS = "section-highlight";
const timers = new Map<string, number>();

/** Briefly outlines a section (styles in index.css; static outline under reduced motion). */
export function highlightSection(id: string, delay = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  window.clearTimeout(timers.get(id));
  el.classList.remove(HIGHLIGHT_CLASS);
  timers.set(
    id,
    window.setTimeout(() => {
      void el.offsetWidth; // restart the animation if it is already running
      el.classList.add(HIGHLIGHT_CLASS);
      timers.set(id, window.setTimeout(() => el.classList.remove(HIGHLIGHT_CLASS), 2600));
    }, delay),
  );
}
