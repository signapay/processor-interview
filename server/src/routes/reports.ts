import { Elysia } from "elysia";
import {
  getAllRejectedTransactions,
  getTransactionsByCardNumber,
  getTransactionsByCardType,
  getTransactionsByDay,
} from "../services/reports";

export const reportsRoutes = new Elysia()
  .get("/reports/transactions", async ({ query }) => {
    try {
      const { groupBy, startDate, endDate } = query;

      if (!groupBy || !["card", "card-type", "day"].includes(groupBy)) {
        throw new Error(
          'Invalid groupBy parameter. Use "card", "card-type", or "day"',
        );
      }

      switch (groupBy) {
        case "card":
          return await getTransactionsByCardNumber();
        case "card-type":
          return await getTransactionsByCardType();
        case "day":
          return await getTransactionsByDay(startDate, endDate);
        default:
          throw new Error("Unsupported grouping option");
      }
    } catch (error) {
      throw new Error(`Failed to fetch transaction reports: ${error}`);
    }
  })

  .get("/reports/rejected-transactions", async () => {
    try {
      return await getAllRejectedTransactions();
    } catch (error) {
      throw new Error(`Failed to fetch rejected transactions: ${error}`);
    }
  });
