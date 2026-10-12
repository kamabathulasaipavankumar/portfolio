import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  User,
  GraduationCap,
  Layers,
  Briefcase,
  FolderKanban,
  MessageCircle,
  Send,
} from "lucide-react";
import { useScrollTo } from "../../hooks/useScrollTo";
import { EASE } from "../ui/motion-config";

const navItems = [
  { name: "Home", id: "home", icon: Home },
  { name: "About", id: "about", icon: User },
  { name: "Education", id: "education", icon: GraduationCap },
  { name: "Skills", id: "skills", icon: Layers },
  { name: "Career", id: "career", icon: Briefcase },
  { name: "Projects", id: "projects", icon: FolderKanban },
  { name: "Connect", id: "connect", icon: MessageCircle },
];

const sectionIds = navItems.map((item) => item.id);
const desktopItems = navItems.filter((item) => item.id !== "connect");

type Theme = "light" | "dark";

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function useActiveSection() {
  const [active, setActive] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // The last section may never reach the middle of the viewport.
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) setActive(sectionIds[sectionIds.length - 1]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return active;
}

export default function Header() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const active = useActiveSection();
  const scrollTo = useScrollTo();
  const reduceMotion = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);

  // Theme sync
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  // Glass state on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on Escape / outside click / resize to desktop
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMobileMenuOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setIsMobileMenuOpen(false);
    };
    const mql = window.matchMedia("(min-width: 768px)");
    const onResize = () => mql.matches && setIsMobileMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    mql.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      mql.removeEventListener("change", onResize);
    };
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.classList.toggle("dark", next === "dark");
      setTheme(next);
    };
    if (!reduceMotion && typeof document.startViewTransition === "function") {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  };

  const handleNav = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    scrollTo(id);
  };

  return (
    <motion.header
      ref={headerRef}
      className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6"
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
    >
      <div className="relative mx-auto max-w-6xl">
        <div
          className="flex h-14 items-center justify-between gap-3 rounded-full border pr-2 pl-2 transition-[background-color,border-color,box-shadow] duration-300 sm:h-16 sm:pr-2.5"
          style={{
            background: scrolled ? "var(--nav-bg-scrolled)" : "var(--nav-bg)",
            borderColor: scrolled ? "var(--line-strong)" : "var(--line)",
            boxShadow: scrolled ? "var(--shadow-card)" : "none",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
            backdropFilter: "blur(18px) saturate(160%)",
          }}
        >
          {/* Brand */}
          <a
            href="#home"
            onClick={(e) => handleNav(e, "home")}
            className="group flex shrink-0 items-center rounded-full p-1"
            aria-label="Sai Pavan Kumar . K — Home"
          >
            <span className="bg-brand-gradient grid size-10 place-items-center rounded-full text-sm font-bold tracking-tight text-white shadow-[0_4px_12px_-6px_rgb(79_70_229/0.7)] transition-transform duration-300 group-hover:scale-105 sm:size-11">
              SP
            </span>
          </a>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-0.5 lg:gap-1">
              {desktopItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id} className="relative">
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleNav(e, item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative block rounded-full px-2.5 py-2 text-[0.8125rem] font-medium transition-colors duration-300 lg:px-4 lg:text-sm ${
                        isActive ? "text-ink" : "text-muted hover:text-ink"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-full border border-line shadow-[0_2px_10px_-4px_rgb(15_23_42/0.18)]"
                          style={{ background: "var(--nav-active)" }}
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{item.name}</span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-dot"
                          className="bg-brand-gradient absolute -bottom-0.5 left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={theme === "dark"}
              onClick={toggleTheme}
              aria-label="Dark theme"
              className="relative flex h-10 items-center rounded-full border border-line bg-surface p-1 transition-colors hover:border-[var(--line-accent)]"
            >
              <motion.span
                aria-hidden="true"
                className="absolute top-1 left-1 size-8 rounded-full border border-line bg-surface-strong shadow-[0_2px_8px_-2px_rgb(15_23_42/0.2)]"
                animate={{ x: theme === "dark" ? 32 : 0 }}
                transition={{ duration: 0.25, ease: EASE }}
              />
              <span
                aria-hidden="true"
                className={`relative grid size-8 place-items-center transition-colors ${theme === "light" ? "text-ink" : "text-muted"}`}
              >
                <Sun size={16} />
              </span>
              <span
                aria-hidden="true"
                className={`relative grid size-8 place-items-center transition-colors ${theme === "dark" ? "text-ink" : "text-muted"}`}
              >
                <Moon size={16} />
              </span>
            </button>

            <a
              href="#connect"
              onClick={(e) => handleNav(e, "connect")}
              aria-current={active === "connect" ? "true" : undefined}
              className="btn btn-primary hidden min-h-10 gap-2 px-4 text-[0.8125rem] md:inline-flex lg:min-h-11 lg:px-5 lg:text-sm"
            >
              <Send size={15} className="btn-icon" aria-hidden="true" />
              Connect
            </a>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="icon-btn size-10 md:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isMobileMenuOpen ? "close" : "open"}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                  className="grid place-items-center"
                >
                  {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              className="glass absolute inset-x-0 top-full mt-2 origin-top rounded-3xl p-2 md:hidden"
              style={{ background: "color-mix(in srgb, var(--surface-strong) 95%, transparent)" }}
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <motion.ul
                className="grid gap-1 sm:grid-cols-2"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } } }}
              >
                {navItems.map(({ name, id, icon: Icon }) => {
                  const isActive = active === id;
                  return (
                    <motion.li
                      key={id}
                      variants={{ hidden: { opacity: 0, y: -6 }, show: { opacity: 1, y: 0 } }}
                    >
                      <a
                        href={`#${id}`}
                        onClick={(e) => handleNav(e, id)}
                        aria-current={isActive ? "true" : undefined}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[0.9375rem] font-medium transition-colors ${
                          isActive
                            ? "bg-brand-2/10 text-brand-ink"
                            : "text-ink-soft hover:bg-line hover:text-ink"
                        }`}
                      >
                        <span
                          className={`grid size-8 place-items-center rounded-xl ${
                            isActive ? "bg-brand-gradient text-white" : "border border-line bg-surface-strong text-muted"
                          }`}
                        >
                          <Icon size={16} aria-hidden="true" />
                        </span>
                        {name}
                      </a>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
