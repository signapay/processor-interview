import { Hono } from "hono";
import {
  getTransactions,
  getTransactionsSummary,
  importTransactions,
} from "./transactions.controller";
import type { Env } from "@/context";

const transactionsRoutes = new Hono<Env>()
  .get("/", getTransactions)
  .post("/import", importTransactions)
  .get("/summary", getTransactionsSummary);

export default transactionsRoutes;
