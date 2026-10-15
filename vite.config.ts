import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
// Remove this if you don't need overlay
import { vitePluginErrorOverlay } from "@hiogawa/vite-plugin-error-overlay";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ApiHandler = (request: Request) => Response | Promise<Response>;

// Serves the Vercel functions in /api during `npm run dev`, so the chat works without `vercel dev`.
// Production is unaffected: Vercel deploys /api itself.
function vercelApiDev(): Plugin {
  return {
    name: "vercel-api-dev",
    apply: "serve",
    configureServer(server) {
      // Make .env / .env.local values (e.g. GROQ_API_KEY) visible to the handlers as on Vercel.
      const env = loadEnv(server.config.mode, process.cwd(), "");
      for (const [key, value] of Object.entries(env)) process.env[key] ??= value;

      server.middlewares.use("/api", async (req, res, next) => {
        const name = (req.url ?? "").split("?")[0].replace(/^\/+|\/+$/g, "");
        // Files starting with "_" are helpers, not endpoints (same rule as Vercel).
        if (!/^[a-z0-9-]+$/i.test(name)) return next();

        try {
          const mod = await server.ssrLoadModule(`/api/${name}.ts`);
          const handler = mod[req.method ?? "GET"] as ApiHandler | undefined;
          if (typeof handler !== "function") {
            res.statusCode = 405;
            return res.end();
          }

          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
          }
          const abort = new AbortController();
          res.on("close", () => !res.writableFinished && abort.abort());

          const response = await handler(
            new Request(`http://${req.headers.host}${req.originalUrl}`, {
              method: req.method,
              headers,
              body: chunks.length ? Buffer.concat(chunks) : undefined,
              signal: abort.signal,
            }),
          );

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          if (response.body) {
            for await (const chunk of response.body) res.write(chunk);
          }
          res.end();
        } catch (error) {
          if ((error as Error).message?.includes("Failed to load url")) return next();
          server.config.logger.error(`[api/${name}] ${(error as Error).stack ?? error}`);
          if (!res.headersSent) res.statusCode = 500;
          res.end();
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  assetsInclude: ["**/*.glb"],
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    tailwindcss(),
    mode === "development" ? vitePluginErrorOverlay() : null,
    vercelApiDev(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
