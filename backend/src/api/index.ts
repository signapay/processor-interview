import Elysia from "elysia";
import cors from "@elysiajs/cors";
import bearer from "@elysiajs/bearer";
import { transactionsRoute } from "@/src/api/routes/transactions";

export const api = new Elysia({
  prefix: "/api",
})
  .use(
    cors({
      origin: Bun.env.CLIENT_URL,
    }),
  )
  .use(bearer())
  .onBeforeHandle(async ({ bearer }) => {
    const isAuthorized = bearer === Bun.env.API_TOKEN;
    if (!isAuthorized) {
      throw new Error("Unauthorized");
    }
  })
  .use(transactionsRoute);
