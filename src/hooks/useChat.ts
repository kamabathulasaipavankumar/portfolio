import { useCallback, useEffect, useRef, useState } from "react";

export type ChatRole = "user" | "assistant";
export type ChatMessage = { id: number; role: ChatRole; content: string };

// Mirrors the server limits in api/chat.ts.
export const MAX_INPUT_CHARS = 1000;
const HISTORY_LIMIT = 10;

let nextId = 0;
const makeMessage = (role: ChatRole, content: string): ChatMessage => ({ id: nextId++, role, content });

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    if (data.error) return data.error;
  } catch {
    // Non-JSON error body.
  }
  return "Something went wrong. Please try again.";
}

/** Chat state plus a streaming request to /api/chat. */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(async (history: ChatMessage[]) => {
    if (abortRef.current) return;
    const controller = new AbortController();
    abortRef.current = controller;
    const reply = makeMessage("assistant", "");

    setError(null);
    setStreaming(true);
    setMessages([...history, reply]);

    const appendToReply = (text: string) =>
      setMessages((prev) => prev.map((m) => (m.id === reply.id ? { ...m, content: m.content + text } : m)));
    const dropReplyIfEmpty = () =>
      setMessages((prev) => prev.filter((m) => m.id !== reply.id || m.content.length > 0));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.slice(-HISTORY_LIMIT).map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(await readError(res));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let received = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        if (text) {
          received = true;
          appendToReply(text);
        }
      }
      if (!received) throw new Error("No response received. Please try again.");
    } catch (err) {
      dropReplyIfEmpty();
      // A user-initiated stop keeps whatever text already arrived.
      if (!controller.signal.aborted) {
        setError(err instanceof TypeError ? "Network error. Check your connection." : (err as Error).message);
      }
    } finally {
      abortRef.current = null;
      setStreaming(false);
    }
  }, []);

  const send = useCallback(
    (text: string) => {
      const content = text.trim().slice(0, MAX_INPUT_CHARS);
      if (!content || streaming) return;
      void run([...messages, makeMessage("user", content)]);
    },
    [messages, run, streaming],
  );

  /** Re-sends the conversation after a failed request. */
  const retry = useCallback(() => {
    if (!streaming && messages.at(-1)?.role === "user") void run(messages);
  }, [messages, run, streaming]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  return { messages, streaming, error, send, retry, stop, reset };
}
