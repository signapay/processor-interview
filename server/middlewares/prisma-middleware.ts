import type { Env } from "@/context";
import { createMiddleware } from "hono/factory";

export const prismaMiddleware = createMiddleware<Env>(async (c, next) => {
  const prisma = await import("../db");
  c.set("prisma", prisma.default);
  await next();
});
