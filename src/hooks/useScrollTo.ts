import { useCallback } from "react";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

/** Smoothly scrolls to a section by id (via Lenis when available). Pass { focus: false } to keep focus where it is. */
export function useScrollTo() {
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();

  return useCallback(
    (id: string, { focus = true }: { focus?: boolean } = {}) => {
      const el = document.getElementById(id);
      if (!el) return;

      if (lenis) {
        lenis.scrollTo(id === "home" ? 0 : el, { immediate: !!reduceMotion, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }

      if (!focus) return;
      // Move keyboard focus to the section so tabbing continues from there.
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    },
    [lenis, reduceMotion]
  );
}
