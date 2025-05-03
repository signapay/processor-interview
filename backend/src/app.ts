import { Elysia } from "elysia";
import { logger } from "@tqman/nice-logger";
import { api } from "@/src/api";

export const app = new Elysia().use(logger()).use(api);
