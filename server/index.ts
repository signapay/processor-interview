import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";

import type { Env } from "./context";
import { onErrorMiddleware } from "./middlewares/on-error.middleware";
import { prismaMiddleware } from "./middlewares/prisma-middleware";
import authRouter from "./routes/auth/auth.routes";
import transactionsRouter from "./routes/transactions/transactions.routes";

const app = new Hono<Env>().basePath("/api/v1");

app.use(requestId());
app.use(cors());
app.use(logger());
app.use(prettyJSON());
app.use(prismaMiddleware);

export const publicRoutes = app.route("/auth", authRouter);

export const privateRoutes = app.route("/transactions", transactionsRouter);

app.onError(onErrorMiddleware);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ root: "./frontend/dist/index.html" }));

export default {
  port: process.env["PORT"] ?? 3000,
  hostname: "127.0.0.1",
  fetch: app.fetch,
};
