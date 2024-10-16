import { z } from 'zod';

export const TransactionSchema = z.object({
  accountName: z.string(),
  cardNumber: z.number(),
  transactionAmount: z.number(),
  transactionType: z.enum(['Credit', 'Debit', 'Transfer']),
  description: z.string(),
  targetCardNumber: z.number().optional(),
  processedAt: z.string().optional(),
  status: z.string().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;