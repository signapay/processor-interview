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
