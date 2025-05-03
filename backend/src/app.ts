import { Elysia } from "elysia";
import { logger } from "@tqman/nice-logger";
import { api } from "@/src/api";
import { ws } from "@/src/ws";

export const app = new Elysia().use(logger()).use(api).use(ws);
