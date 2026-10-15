// POST /api/chat — streams a Groq chat completion back to the portfolio chat widget as plain text.
// The Groq API key stays on the server; the browser only ever sees the generated text.
import { SYSTEM_PROMPT } from "./_profile.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// openai/gpt-oss-20b: open-weight (Apache 2.0), listed as a production model on Groq.
const DEFAULT_MODEL = "openai/gpt-oss-20b";

const MAX_BODY_BYTES = 16_000;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 1_000;
// Answers are 1–4 sentences; a small budget also keeps each request cheap against the tokens/minute limit.
const MAX_COMPLETION_TOKENS = 350;
const UPSTREAM_TIMEOUT_MS = 30_000;
// If Groq's rate limit frees up within this many seconds, wait and retry once instead of failing.
const MAX_RETRY_WAIT_S = 6;

// Best-effort per-IP limits. Memory is per function instance, so this stops casual abuse,
// not a distributed attack — use a shared store (e.g. Upstash Redis) if you need hard limits.
const RATE_LIMITS = [
  { windowMs: 60_000, max: 8 },
  { windowMs: 60 * 60_000, max: 40 },
];
const hits = new Map<string, number[]>();

type ChatMessage = { role: "user" | "assistant"; content: string };

const json = (status: number, error: string, headers: HeadersInit = {}) =>
  Response.json({ error }, { status, headers: { "Cache-Control": "no-store", ...headers } });

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  // Same-origin requests (production, preview deployments, `vercel dev`) are always allowed.
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (originHost === host) return true;
  const extra = (process.env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean);
  return extra.includes(origin);
}

function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/** Records a hit and returns the seconds to wait if the IP is over a limit, otherwise 0. */
function rateLimit(ip: string): number {
  const now = Date.now();
  const longest = Math.max(...RATE_LIMITS.map((l) => l.windowMs));
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < longest);
  for (const { windowMs, max } of RATE_LIMITS) {
    const inWindow = recent.filter((t) => now - t < windowMs);
    if (inWindow.length >= max) {
      hits.set(ip, recent);
      return Math.ceil((inWindow[0] + windowMs - now) / 1000);
    }
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear(); // keep memory bounded on long-lived instances
  return 0;
}

function parseMessages(body: unknown): ChatMessage[] | null {
  if (typeof body !== "object" || body === null) return null;
  const { messages } = body as { messages?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const recent = messages.slice(-MAX_MESSAGES);
  const parsed: ChatMessage[] = [];
  for (const m of recent) {
    if (typeof m !== "object" || m === null) return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    // Only user/assistant turns are accepted, so clients can't inject their own system prompt.
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const text = content.trim();
    if (!text || text.length > MAX_MESSAGE_CHARS) return null;
    parsed.push({ role, content: text });
  }
  return parsed.at(-1)?.role === "user" ? parsed : null;
}

/** Turns Groq's OpenAI-style SSE stream into a stream of plain answer text. */
function toTextStream(upstream: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return upstream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.trim();
          if (!data.startsWith("data:")) continue;
          const payload = data.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const text = JSON.parse(payload)?.choices?.[0]?.delta?.content;
            if (typeof text === "string" && text) controller.enqueue(encoder.encode(text));
          } catch {
            // Ignore keep-alive or partial lines.
          }
        }
      },
    }),
  );
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is not set");
    return json(500, "The assistant is not configured yet.");
  }

  if (!isAllowedOrigin(request)) return json(403, "Forbidden.");
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json(415, "Expected a JSON body.");
  }

  const retryAfter = rateLimit(clientIp(request));
  if (retryAfter > 0) {
    return json(429, "You're sending messages too quickly. Please wait a moment.", {
      "Retry-After": String(retryAfter),
    });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, "Message is too long.");
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, "Invalid JSON.");
  }
  const messages = parseMessages(body);
  if (!messages) return json(400, `Send 1–${MAX_MESSAGES} messages of up to ${MAX_MESSAGE_CHARS} characters.`);

  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)]);
  const callGroq = () =>
    fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
        temperature: 0.4,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
        // gpt-oss is a reasoning model: keep thinking short and out of the response.
        reasoning_effort: "low",
        include_reasoning: false,
      }),
      // Stop the Groq request if the visitor closes the chat or it takes too long.
      signal,
    });

  let upstream: Response;
  try {
    upstream = await callGroq();
    const wait = Number(upstream.headers.get("retry-after"));
    if (upstream.status === 429 && wait > 0 && wait <= MAX_RETRY_WAIT_S) {
      await upstream.body?.cancel();
      await new Promise((resolve) => setTimeout(resolve, wait * 1000));
      upstream = await callGroq();
    }
  } catch (error) {
    console.error("Groq request failed", error);
    return json(502, "The assistant is unavailable right now. Please try again.");
  }

  if (!upstream.ok || !upstream.body) {
    console.error("Groq error", upstream.status, await upstream.text().catch(() => ""));
    if (upstream.status === 429) {
      return json(429, "The assistant is busy right now. Please try again in a minute.", {
        "Retry-After": upstream.headers.get("retry-after") ?? "60",
      });
    }
    return json(502, "The assistant is unavailable right now. Please try again.");
  }

  return new Response(toTextStream(upstream.body), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function GET() {
  return json(405, "Use POST.", { Allow: "POST" });
}
