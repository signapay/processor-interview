import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { reportsRoutes, transactionsRoutes } from "./routes";

const API_KEY = process.env.API_KEY;

const apiKeyAuth = (app: Elysia) =>
  app.onBeforeHandle(async ({ request, set, error }) => {
    const url = new URL(request.url);
    if (url.pathname === "/health" || request.method === "OPTIONS") {
      return;
    }

    const apiKeyHeader = request.headers.get("x-api-key");

    if (!apiKeyHeader) {
      set.status = 401; 
      return error(401, "Unauthorized: Missing x-api-key header");
    }

    if (apiKeyHeader !== API_KEY) {
      set.status = 403; 
      return error(403, "Forbidden: Invalid x-api-key");
    }
  });

const app = new Elysia()
  .get("/health", () => "OK")
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "x-api-key"],
    }),
  )
  .use(apiKeyAuth)
  .use(transactionsRoutes)
  .use(reportsRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export { app };
