import { Elysia } from "elysia";
import { reportsRoutes, transactionsRoutes } from "./routes";

const app = new Elysia()
  .get("/health", () => "OK")
  .use(transactionsRoutes)
  .use(reportsRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export { app };
