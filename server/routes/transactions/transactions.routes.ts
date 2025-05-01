import { Hono } from "hono";

import type { Env } from "@/context";

import {
  getAllImportJobs,
  getAllRejectedTransactions,
  getImportJobStatus,
  getRejectedTransactions,
  getTransactions,
  getTransactionSummaryByCard,
  getTransactionSummaryByCardType,
  getTransactionSummaryByDay,
  getTransactionsSummary,
  importTransactions,
} from "./transactions.controller";

const transactionsRoutes = new Hono<Env>()
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
