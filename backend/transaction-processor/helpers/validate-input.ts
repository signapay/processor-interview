import { Transaction, TransactionType } from "../types/transaction";
import { z } from "zod";


export const parseTransaction = (transactions: Record<string, string>[]): Transaction[] => {
  return transactions.map((transaction) => ({
    accountName: transaction.accountName,
    cardNumber: parseInt(transaction.cardNumber),
    transactionAmount: parseFloat(transaction.transactionAmount),
    transactionType: transaction.transactionType as TransactionType,
    description: transaction.description,
    targetCardNumber: transaction.targetCardNumber ? parseInt(transaction.targetCardNumber) : undefined,
  }));
};

export const transactionsSchema = (transactions: unknown[]): Transaction[] => {
  const transactionSchema = z.object({
    accountName: z.string(),
    cardNumber: z.number().int().positive(),
    transactionAmount: z.number(),
    transactionType: z.enum(["Credit", "Debit", "Transfer"]),
    description: z.string(),
    targetCardNumber: z.number().int().positive().optional(),
  });
  return transactions.map(transaction => transactionSchema.parse(transaction));
};

export const fileUploadSchema = (file: unknown) => {
  const fileSchema = z.object({
    file: z.instanceof(Buffer),
  });
  return fileSchema.parse(file);
};
