import type { Env } from "@/context";
import type { SuccessResponse, Transaction } from "@/shared/types";
import type { Context } from "hono";

export const getTransactions = async (c: Context<Env>) => {
  try {
    const transactions = await c.var.prisma.transaction.findMany();

    // Map Prisma model to API response type
    const mappedTransactions = transactions.map((t) => ({
      id: t.id,
      cardNumber: t.encryptedCardNumber, // Note: This should be decrypted in a real app
      cardType: t.cardType,
      timestamp: t.timestamp.toISOString(),
      amount: t.amount,
      processedAt: t.processedAt.toISOString(),
      fileSource: t.fileSource,
    }));

    const response: SuccessResponse<Transaction[]> = {
      success: true,
      message: "Transactions fetched",
      data: mappedTransactions,
    };
    return c.json(response);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch transactions",
      },
      500,
    );
  }
};

export const importTransactions = async (c: Context<Env>) => {
  // This would handle file uploads and processing
  return c.json({ success: true, message: "Import endpoint ready" });
};

export const getTransactionsSummary = async (c: Context<Env>) => {
  try {
    const prisma = c.get("prisma");

    // Get count of transactions
    const transactionCount = await prisma.transaction.count();

    // Get count of rejected transactions
    const rejectedCount = await prisma.rejectedTransaction.count();

    // Get sum of all transaction amounts
    const amountSum = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
    });

    return c.json({
      success: true,
      message: "Summary fetched",
      data: {
        transactionCount,
        rejectedCount,
        totalAmount: amountSum._sum.amount ?? 0,
      },
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch summary",
      },
      500,
    );
  }
};
