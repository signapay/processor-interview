import { t } from "elysia";

export const Transaction = t.Object({
  cardNumber: t.String(),
  timestamp: t.String(),
  amount: t.Number(),
});

export type TransactionType = typeof Transaction.static;
