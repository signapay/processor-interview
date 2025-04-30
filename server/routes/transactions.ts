import type { SuccessResponse, Transaction } from "@/shared/types";
import { Hono } from "hono";

const transactionsRoute = new Hono()
  .get("/", (c) => {
    const response: SuccessResponse<Transaction[]> = {
      success: true,
      message: "Transactions fetched",
      data: [] as Transaction[],
    };
    return c.json(response);
  })
  .post("/import", (c) => {
    return c.json({ success: true, message: "Import" });
  })
  .get("/summary", (c) => {
    return c.json({
      success: true,
      message: "Summary",
    });
  });

export default transactionsRoute;
