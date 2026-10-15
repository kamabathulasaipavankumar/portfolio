import { lazy, Suspense, useCallback, useEffect, useId, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUp,
  Briefcase,
  ChevronDown,
  FolderOpen,
  MessagesSquare,
  Minus,
  RotateCcw,
  Sparkles,
  Square,
  UserRound,
} from "lucide-react";
import { MAX_INPUT_CHARS, useChat } from "../../hooks/useChat";
import { useScrollTo } from "../../hooks/useScrollTo";
import { AVATAR_PHOTO, AvatarFallback } from "../Avatar/AvatarFallback";
import type { AvatarGesture, AvatarState } from "../Avatar/AvatarModel";
import { EASE } from "../ui/motion-config";
import { ChatMessages, LinkifiedText, TypingDots } from "./ChatMessages";
import { highlightSection, matchSection } from "./sectionLinks";
import type { SectionLink } from "./sectionLinks";

// three.js + the 11 MB model load only when the assistant is shown.
const loadAvatarStage = () => import("../Avatar/AvatarStage");
const AvatarStage = lazy(loadAvatarStage);

const STORAGE_KEY = "assistant-open";
const WIDE_QUERY = "(min-width: 1024px)";

type QuickAction = SectionLink & { chip: string; icon: LucideIcon; question: string };

// Ids are the existing section ids rendered by the portfolio sections.
const QUICK_ACTIONS: QuickAction[] = [
  { id: "skills", label: "Skills", chip: "My skills", icon: Sparkles, question: "What are Sai's core skills?" },
  { id: "projects", label: "Projects", chip: "Projects", icon: FolderOpen, question: "What projects has Sai worked on?" },
  { id: "career", label: "Experience", chip: "Experience", icon: Briefcase, question: "Tell me about Sai's work experience." },
  { id: "connect", label: "Contact", chip: "Contact me", icon: UserRound, question: "How can I contact Sai?" },
];

const STATUS_LABEL: Record<AvatarState, string> = {
  idle: "Online",
  listening: "Listening…",
  speaking: "Speaking…",
};

const GREETING = "Hi there! 👋 I'm Sai's AI assistant. How can I help you today?";

function readStoredOpen(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "1";
  } catch {
    // Storage blocked (private mode etc.) — fall through to the default.
  }
  // Avatar-first on large screens; phones start with the compact button.
  return window.matchMedia(WIDE_QUERY).matches;
}

function storeOpen(open: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
  } catch {
    // Not critical.
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(readStoredOpen);
  // Auto-opened on load: wait for an idle moment before downloading the 3D avatar.
  const [stageMounted, setStageMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [gesture, setGesture] = useState<AvatarGesture | null>(null);
  const [activity, setActivity] = useState<string | null>(null);
  const lastGestureAt = useRef(0);
  const { messages, streaming, error, send, retry, stop, reset } = useChat();
  const scrollTo = useScrollTo();
  const reduceMotion = useReducedMotion();
  const dockId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const focusInputOnOpen = useRef(false);
  const focusToggleOnClose = useRef(false);

  useEffect(() => {
    if (!open || stageMounted) return;
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setStageMounted(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setStageMounted(true), 1200);
    return () => window.clearTimeout(id);
  }, [open, stageMounted]);

  // Move focus between the input and the photo button when the visitor opens/minimizes the assistant.
  useEffect(() => {
    if (open && focusInputOnOpen.current) inputRef.current?.focus();
    if (!open && focusToggleOnClose.current) toggleRef.current?.focus();
    focusInputOnOpen.current = false;
    focusToggleOnClose.current = false;
  }, [open]);

  // Keep the newest message in view in the expanded conversation.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, error, expanded]);

  // "Showing skills" etc. fades back to the normal status after a few seconds.
  useEffect(() => {
    if (!activity) return;
    const id = window.setTimeout(() => setActivity(null), 4000);
    return () => window.clearTimeout(id);
  }, [activity]);

  const last = messages.at(-1);
  const thinking = streaming && !(last?.role === "assistant" && last.content);
  const avatarState: AvatarState = streaming && !thinking ? "speaking" : streaming || inputFocused ? "listening" : "idle";
  const status = activity ?? (thinking ? "Thinking…" : STATUS_LABEL[avatarState]);

  const playGesture = useCallback((role: AvatarGesture["role"]) => {
    lastGestureAt.current = Date.now();
    setGesture({ role, key: lastGestureAt.current });
  }, []);

  // Waves hello each time the avatar appears, and when the visitor taps it.
  const greet = useCallback(() => {
    playGesture("wave");
    setActivity("Saying hi");
  }, [playGesture]);

  // Talks with its hands when an answer starts, unless it just gestured toward a section.
  const previousState = useRef(avatarState);
  useEffect(() => {
    if (avatarState === "speaking" && previousState.current !== "speaking" && Date.now() - lastGestureAt.current > 2500) {
      playGesture("explain");
    }
    previousState.current = avatarState;
  }, [avatarState, playGesture]);

  const openDock = () => {
    focusInputOnOpen.current = true;
    setStageMounted(true);
    setOpen(true);
    storeOpen(true);
  };

  const minimize = () => {
    setOpen(false);
    setExpanded(false);
    storeOpen(false);
    focusToggleOnClose.current = true;
  };

  /** Scrolls to a section, highlights it and plays the matching gesture clip. */
  const showSection = (section: SectionLink, { focus = false } = {}) => {
    scrollTo(section.id, { focus });
    highlightSection(section.id, reduceMotion ? 0 : 600);
    playGesture(section.id === "connect" ? "wave" : "point");
    setActivity(`Showing ${section.label.toLowerCase()}`);
  };

  const ask = (text: string, section: SectionLink | null = matchSection(text)) => {
    if (!text.trim() || streaming) return;
    send(text);
    setInput("");
    if (section) showSection(section);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  const onDockKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    if (expanded) setExpanded(false);
    else minimize();
  };

  // The caption shows the latest answer (or the greeting); the full thread opens on demand.
  const caption =
    error ? null : last?.role === "assistant" ? last.content : messages.length === 0 ? GREETING : "Ask me another question.";

  return (
    <div className="pointer-events-none fixed right-3 bottom-3 z-40 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.aside
            id={dockId}
            aria-label="Sai's AI assistant"
            onKeyDown={onDockKeyDown}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="pointer-events-auto flex w-[min(24rem,calc(100vw-1.5rem))] flex-col gap-2"
          >
            {/* Speech bubble / expandable conversation */}
            <motion.div
              layout={!reduceMotion}
              transition={{ duration: 0.3, ease: EASE }}
              className="card overflow-hidden rounded-2xl! bg-surface-strong/90! backdrop-blur-xl"
            >
              {expanded ? (
                <>
                  <div className="flex items-center gap-2 border-b border-line px-3.5 py-2">
                    <p className="flex-1 text-xs font-semibold text-ink">Conversation</p>
                    {messages.length > 0 && (
                      <button
                        type="button"
                        onClick={reset}
                        className="grid size-7 place-items-center rounded-full text-muted transition-colors hover:bg-line hover:text-ink"
                        aria-label="Start a new chat"
                        title="New chat"
                      >
                        <RotateCcw size={14} aria-hidden="true" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpanded(false)}
                      className="grid size-7 place-items-center rounded-full text-muted transition-colors hover:bg-line hover:text-ink"
                      aria-label="Collapse conversation"
                    >
                      <ChevronDown size={16} aria-hidden="true" />
                    </button>
                  </div>
                  {/* data-lenis-prevent lets this area scroll under Lenis smooth scrolling */}
                  <div
                    ref={logRef}
                    data-lenis-prevent
                    role="log"
                    aria-live="polite"
                    aria-busy={streaming}
                    className="max-h-[min(22rem,38dvh)] overflow-y-auto overscroll-contain p-3.5"
                  >
                    {messages.length === 0 ? (
                      <p className="text-sm text-muted">{GREETING}</p>
                    ) : (
                      <ChatMessages messages={messages} streaming={streaming} onSection={(s) => showSection(s, { focus: true })} />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-2 px-3.5 py-3">
                  <div aria-live="polite" aria-busy={streaming} className="min-w-0 flex-1 text-sm leading-relaxed text-ink-soft">
                    {error ? (
                      <p role="alert" className="text-red-600 dark:text-red-400">
                        {error}{" "}
                        {last?.role === "user" && (
                          <button type="button" onClick={retry} className="font-semibold underline underline-offset-2">
                            Retry
                          </button>
                        )}
                      </p>
                    ) : thinking ? (
                      <TypingDots />
                    ) : (
                      <p className="line-clamp-4 whitespace-pre-wrap"><LinkifiedText text={caption ?? ""} /></p>
                    )}
                  </div>
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpanded(true)}
                      className="grid size-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-line hover:text-ink"
                      aria-label="Open full conversation"
                      title="Full conversation"
                    >
                      <MessagesSquare size={15} aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}
            </motion.div>

            {/* Avatar on a glowing platform */}
            <div className="relative h-52 sm:h-64 [@media(max-height:640px)]:h-36">
              {/* Soft halo separates the avatar from page content behind it */}
              <div
                aria-hidden="true"
                className="absolute inset-x-[12%] top-[4%] bottom-0 rounded-t-full bg-[radial-gradient(ellipse_at_50%_45%,rgb(255_255_255/0.95),rgb(237_233_254/0.85)_45%,rgb(224_231_255/0)_72%)] dark:bg-[radial-gradient(ellipse_at_50%_45%,rgb(49_46_129/0.75),rgb(30_27_75/0.55)_45%,rgb(13_17_39/0)_72%)]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-4 bottom-0 h-12 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgb(124_58_237/0.35),rgb(79_70_229/0.12)_55%,transparent_72%)]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-10 bottom-3 h-6 rounded-[100%] border border-brand-2/40 shadow-[0_0_24px_rgb(99_102_241/0.45)]"
              />
              {stageMounted ? (
                <Suspense fallback={<AvatarFallback loading />}>
                  <AvatarStage state={avatarState} gesture={gesture} onReady={greet} className="size-full" />
                </Suspense>
              ) : (
                <AvatarFallback loading />
              )}

              <button
                type="button"
                onClick={greet}
                className="absolute inset-x-[20%] inset-y-0 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-brand-2"
                aria-label="Say hi to the avatar"
                title="Say hi"
              />
              <span
                aria-hidden="true"
                className="absolute top-1 left-1 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-strong/85 px-2.5 py-1 text-[0.6875rem] font-medium text-ink-soft shadow-sm backdrop-blur"
              >
                <span
                  className={`size-1.5 rounded-full ${avatarState === "idle" && !activity ? "bg-emerald-500" : "animate-pulse bg-brand-2"}`}
                />
                {status}
              </span>
              <button
                type="button"
                onClick={minimize}
                className="absolute top-1 right-1 grid size-8 place-items-center rounded-full border border-line bg-surface-strong/85 text-muted backdrop-blur transition-colors hover:text-ink"
                aria-label="Minimize assistant"
                title="Minimize"
              >
                <Minus size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Quick actions */}
            <ul className="grid grid-cols-4 gap-1.5">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                const active = activity === `Showing ${action.label.toLowerCase()}`;
                return (
                  <li key={action.id}>
                    <button
                      type="button"
                      onClick={() => ask(action.question, action)}
                      disabled={streaming}
                      className={`chip w-full cursor-pointer justify-center gap-1 bg-surface-strong/85! px-1.5! text-[0.6875rem]! whitespace-nowrap backdrop-blur disabled:cursor-not-allowed disabled:opacity-60 ${active ? "chip-primary" : ""}`}
                    >
                      <Icon size={13} aria-hidden="true" className="hidden shrink-0 min-[400px]:block" />
                      {action.chip}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Question input */}
            <form
              onSubmit={onSubmit}
              className="glass flex items-center gap-2 rounded-full bg-surface-strong/90! py-1.5 pr-1.5 pl-4"
            >
              <Sparkles size={16} aria-hidden="true" className="shrink-0 text-brand" />
              <label htmlFor={`${dockId}-input`} className="sr-only">
                Ask about Sai
              </label>
              <input
                id={`${dockId}-input`}
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                maxLength={MAX_INPUT_CHARS}
                placeholder="Ask Sai anything…"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={stop}
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong bg-surface text-ink transition-colors hover:border-brand-2"
                  aria-label="Stop generating"
                >
                  <Square size={13} fill="currentColor" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-brand-gradient grid size-9 shrink-0 place-items-center rounded-full text-white transition-opacity disabled:opacity-40"
                  aria-label="Send question"
                >
                  <ArrowUp size={17} aria-hidden="true" />
                </button>
              )}
            </form>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Minimized: photo button. Hover/focus starts loading the 3D avatar. */}
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={toggleRef}
            type="button"
            onClick={openDock}
            onPointerEnter={() => void loadAvatarStage()}
            onFocus={() => void loadAvatarStage()}
            aria-label="Open Sai's AI assistant"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary pointer-events-auto relative size-14 rounded-full p-0 sm:size-16"
          >
            {/* The photo is a portrait; zoom in on the face for the small round button. */}
            <span className="absolute inset-[3px] overflow-hidden rounded-full bg-surface-strong">
              <img
                src={AVATAR_PHOTO}
                alt=""
                className="size-full origin-[50%_20%] scale-[1.9] object-cover object-[50%_15%]"
              />
            </span>
            <span
              aria-hidden="true"
              className="absolute right-0.5 bottom-0.5 size-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#0d1127]"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
