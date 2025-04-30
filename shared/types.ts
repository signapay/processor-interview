import { z } from "zod";

import type { ApiRoutes } from "../server/index";

export { type ApiRoutes };

export type SuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? {} : { data: T });

export type ErrorResponse = {
  success: false;
  error: string;
  isFormError?: boolean;
};

export const loginSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9]+$/),
  password: z.string().min(6).max(18),
});

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
