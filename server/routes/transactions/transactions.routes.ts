import { Hono } from "hono";

import type { Env } from "@/context";
import { authMiddleware } from "@/kinde";

import {
  getAllImportJobs,
  getAllRejectedTransactions,
  getImportJobStatus,
  getRejectedTransactions,
  getTransactions,
  getTransactionsSummary,
  getTransactionSummaryByCard,
  getTransactionSummaryByCardType,
  getTransactionSummaryByDay,
  importTransactions,
} from "./transactions.controller";

const transactionsRoutes = new Hono<Env>()
  .use(authMiddleware)
  .get("/", getTransactions)
  .post("/import", importTransactions)
  .get("/summary", getTransactionsSummary)
  .get("/summary/by-card", getTransactionSummaryByCard)
  .get("/summary/by-card-type", getTransactionSummaryByCardType)
  .get("/summary/by-day", getTransactionSummaryByDay)
  .get("/rejected", getAllRejectedTransactions)
  .get("/import/jobs", getAllImportJobs)
  .get("/import/jobs/:jobId", getImportJobStatus)
  .get("/import/jobs/:jobId/rejected", getRejectedTransactions);

export default transactionsRoutes;
