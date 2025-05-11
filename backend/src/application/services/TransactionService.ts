import { Transaction } from "../../domain/entities/Transaction";

export interface TransactionService {
  getTransaction(): Promise<Transaction>;
}