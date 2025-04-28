import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import transactionRoutes from "./routes/transactions/transactions.routes";

const app = new Hono()
  .use("*", cors(), logger())
  .use("/*", serveStatic({ root: "./client/dist" }))
  .route("/api/transactions", transactionRoutes);

export type ApiRoutes = typeof app;
export default app;
