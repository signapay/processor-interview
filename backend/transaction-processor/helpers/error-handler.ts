import { ZodError } from "zod";
import { Transaction } from "../types/transaction";

export const handle = (error: unknown, transactions?: Transaction[]): void => {
  if (error instanceof ZodError) {
    console.error("Validation Error:");
    error.errors.forEach((err) => logValidation(err, transactions));
  } else {
    console.error("Unexpected error:", (error as Error).message);
  }
};

const logValidation = (err: ZodError["errors"][number], transactions?: Transaction[]): void => {
  const invalidTransactionIndex = parseInt(`${err.path[0]}`, 10);
  const invalidTransaction = transactions?.[invalidTransactionIndex];
  console.error(`- ${err.message}`);
  console.error("  Invalid transaction:", JSON.stringify(invalidTransaction, null, 2));
};
