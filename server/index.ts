import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import authRouter from "./routes/auth";
import transactionsRouter from "./routes/transactions";
import { HTTPException } from "hono/http-exception";
import type { ErrorResponse } from "@/shared/types";

const app = new Hono();

app.use("*", cors(), logger());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .basePath("/api")
  .route("/auth", authRouter)
  .route("/transactions", transactionsRouter);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const errResponse =
      err.res ??
      c.json<ErrorResponse>(
        {
          success: false,
          error: err.message,
          isFormError:
            err.cause && typeof err.cause == "object" && "form" in err.cause
              ? err.cause.form === true
              : false,
        },
        err.status,
      );

    return errResponse;
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      error:
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : (err.stack ?? err.message),
    },
    500,
  );
});

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ root: "./frontend/dist/index.html" }));

export default {
  port: process.env["PORT"] ?? 3000,
  hostname: "0.0.0.0",
  fetch: app.fetch,
};

export type ApiRoutes = typeof routes;
