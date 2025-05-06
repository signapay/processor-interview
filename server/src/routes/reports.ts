import { Elysia } from "elysia";
import {
  getAllRejectedTransactions,
  getTransactionsByCardNumber,
  getTransactionsByCardType,
  getTransactionsByDay,
} from "../services/reports";

export const reportsRoutes = new Elysia()
  .get("/reports/transactions/by-card", async () => {
    try {
      return await getTransactionsByCardNumber();
    } catch (error) {
      throw new Error(`Failed to fetch transactions reports by card: ${error}`);
    }
  })

  .get("/reports/transactions/by-card-type", async () => {
    try {
      return await getTransactionsByCardType();
    } catch (error) {
      throw new Error(`Failed to fetch transactions reports by card: ${error}`);
    }
  })

  .get("/reports/transactions/by-day", async ({ query }) => {
    try {
      const { startDate, endDate } = query;

      if (!startDate || !endDate) {
        throw new Error(
          "startDate and endDate are required when grouping by day",
        );
      }

      return await getTransactionsByDay(startDate, endDate);
    } catch (error) {
      throw new Error(`Failed to fetch transaction reports by day: ${error}`);
    }
  })

  .get("/reports/transactions/rejected", async () => {
    try {
      return await getAllRejectedTransactions();
    } catch (error) {
      throw new Error(`Failed to fetch rejected transactions: ${error}`);
    }
  });
