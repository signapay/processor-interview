import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { reportsRoutes, transactionsRoutes } from "./routes";

const app = new Elysia()
  .get("/health", () => "OK")
  .use(
    cors({
      origin: "http://localhost:3001",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    }),
  )
  .use(transactionsRoutes)
  .use(reportsRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export { app };
