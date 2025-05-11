import { Transaction } from "../../domain/entities/Transaction";

export interface TransactionService {
  processTransactions(data: string, contentType: string): Promise<Record<string, Record<string, number[]>>>;
}