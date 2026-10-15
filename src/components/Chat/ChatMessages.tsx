import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ChatMessage } from "../../hooks/useChat";
import { matchSection } from "./sectionLinks";
import type { SectionLink } from "./sectionLinks";

// Turns URLs and email addresses in plain-text replies into links.
const LINK_PATTERN = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

export function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(LINK_PATTERN).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part;
    return (
      <a
        key={i}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="font-medium break-all text-brand-ink underline underline-offset-2"
      >
        {part}
      </a>
    );
  });
  return <>{parts}</>;
}

export function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-muted"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

type BubbleProps = {
  message: ChatMessage;
  typing: boolean;
  section: SectionLink | null;
  onSection: (section: SectionLink) => void;
};

function Bubble({ message, typing, section, onSection }: BubbleProps) {
  const isUser = message.role === "user";
  return (
    <li className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-brand-gradient rounded-br-md text-white"
            : "rounded-bl-md border border-line bg-surface-strong text-ink-soft"
        }`}
      >
        <span className="sr-only">{isUser ? "You: " : "Assistant: "}</span>
        {typing && !message.content ? <TypingDots /> : isUser ? message.content : <LinkifiedText text={message.content} />}
      </div>
      {section && !typing && message.content && (
        <button
          type="button"
          onClick={() => onSection(section)}
          className="chip chip-primary mt-1.5 cursor-pointer gap-1.5 text-xs"
        >
          View {section.label} section
          <ArrowRight size={13} aria-hidden="true" />
        </button>
      )}
    </li>
  );
}

type ChatMessagesProps = {
  messages: ChatMessage[];
  streaming: boolean;
  onSection: (section: SectionLink) => void;
};

/** Full conversation; each reply links to the section its question was about. */
export function ChatMessages({ messages, streaming, onSection }: ChatMessagesProps) {
  const lastId = messages.at(-1)?.id;
  return (
    <ul className="flex flex-col gap-3">
      {messages.map((m, i) => {
        const question = messages[i - 1];
        const section = m.role === "assistant" && question?.role === "user" ? matchSection(question.content) : null;
        return (
          <Bubble
            key={m.id}
            message={m}
            typing={streaming && m.id === lastId}
            section={section}
            onSection={onSection}
          />
        );
      })}
    </ul>
  );
}
