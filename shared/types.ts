import { z } from "zod";
import type { AppType } from "../server/context";

export { type AppType };

export type SuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? {} : { data: T });

export type ErrorResponse = {
  success: false;
  error: string;
  isFormError?: boolean;
};

export const orderSchema = z.enum(["asc", "desc"]);

export type Order = z.infer<typeof orderSchema>;

export const transactionSchema = z.object({
  id: z.string(),
  cardNumber: z.string(),
  cardType: z.string(),
  timestamp: z.string(),
  amount: z.number(),
  processedAt: z.string(),
  fileSource: z.string(),
});

export type Transaction = z.infer<typeof transactionSchema>;

// Transaction summary schemas
export const cardSummarySchema = z.object({
  cardLastFour: z.string(),
  cardType: z.string(),
  totalAmount: z.number(),
  transactionCount: z.number(),
});

export type CardSummary = z.infer<typeof cardSummarySchema>;

export const cardTypeSummarySchema = z.object({
  cardType: z.string(),
  totalAmount: z.number(),
  transactionCount: z.number(),
});

export type CardTypeSummary = z.infer<typeof cardTypeSummarySchema>;

export const daySummarySchema = z.object({
  date: z.string(),
  totalAmount: z.number(),
  transactionCount: z.number(),
});

export type DaySummary = z.infer<typeof daySummarySchema>;

export const rejectedTransactionSchema = z.object({
  id: z.string(),
  rejectionReason: z.string(),
  processedAt: z.string(),
});

export type RejectedTransaction = z.infer<typeof rejectedTransactionSchema>;
