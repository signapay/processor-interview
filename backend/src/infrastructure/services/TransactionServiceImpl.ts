import { TransactionService } from "../../application/services/TransactionService";
import { Transaction } from "../../domain/entities/Transaction";

export class TransactionServiceImpl implements TransactionService {
  async getTransaction(): Promise<Transaction> {
    return new Transaction("Hello from Lambda Onion Architecture!");
  }
}