import { Hono } from "hono";

import type { Env } from "@/context";

import {
  getAllImportJobs,
  getImportJobStatus,
  getRejectedTransactions,
  getTransactions,
  getTransactionsSummary,
  importTransactions,
} from "./transactions.controller";

const transactionsRoutes = new Hono<Env>()
  .get("/", getTransactions)
  .post("/import", importTransactions)
  .get("/summary", getTransactionsSummary)
  .get("/import/jobs", getAllImportJobs)
  .get("/import/jobs/:jobId", getImportJobStatus)
  .get("/import/jobs/:jobId/rejected", getRejectedTransactions);

export default transactionsRoutes;
