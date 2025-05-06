import { Elysia } from "elysia";
import { transactionsRoutes } from "./routes";

const app = new Elysia()
  .get("/health", () => "OK")
  .use(transactionsRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
