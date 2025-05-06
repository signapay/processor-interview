import { and, gte, lte, sql, sum } from "drizzle-orm";
import { db, transactions, rejectedTransactions } from "../db";

export async function getTransactionsByCardNumber() {
  try {
    const result = await db
      .select({
        cardNumber: transactions.cardNumber,
        totalAmount: sql<number>`sum(${transactions.amount})`,
      })
      .from(transactions)
      .groupBy(transactions.cardNumber);

    return result;
  } catch (error) {
    throw new Error(
      `Failed to fetch transactions grouped by card number: ${error}`,
    );
  }
}

export async function getTransactionsByCardType() {
  try {
    const result = await db
      .select({
        cardType: transactions.cardType,
        totalAmount: sum(transactions.amount).mapWith(Number),
      })
      .from(transactions)
      .groupBy(transactions.cardType);

    return result;
  } catch (error) {
    throw new Error(
      `Failed to fetch transactions grouped by card type: ${error}`,
    );
  }
}

export async function getTransactionsByDay(startDate: string, endDate: string) {
  try {
    if (!startDate || !endDate) {
      throw new Error(
        "startDate and endDate are required when grouping by day",
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format. Use ISO format (YYYY-MM-DD)");
    }

    start.setHours(0, 0, 0, 0);

    end.setHours(23, 59, 59, 999);

    const dateSelectionSQL = sql<string>`to_char(date_trunc('day', ${transactions.timestamp}), 'YYYY-MM-DD')`;
    const result = await db
      .select({
        date: sql<string>`to_char(date_trunc('day', ${transactions.timestamp}), 'YYYY-MM-DD')`,
        totalAmount: sql<number>`sum(${transactions.amount})`,
      })
      .from(transactions)
      .where(
        and(
          gte(transactions.timestamp, start),
          lte(transactions.timestamp, end),
        ),
      )
      .groupBy(dateSelectionSQL);

    return result;
  } catch (error) {
    throw new Error(`Failed to fetch transactions by day: ${error}`);
  }
}

export async function getAllRejectedTransactions() {
  try {
    const result = await db.select().from(rejectedTransactions);

    return result;
  } catch (error) {
    throw new Error(`Failed to fetch rejected transactions: ${error}`);
  }
}
