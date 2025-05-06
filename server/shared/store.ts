import { randomUUID } from 'node:crypto';
import { validateCardNumber } from './cardValidator';
import type { CardSummary, CardTypeSummary, DailySummary, Transaction, TransactionsReport } from './entity';

class TransactionStore {
  private transactions: Transaction[] = [];

  processTransaction(transaction: Transaction): Transaction {
    const { isValid, cardType, rejectionReason } = validateCardNumber(transaction.cardNumber);
    const processedTransaction: Transaction = {
      ...transaction,
      id: randomUUID(),
      cardType: cardType ?? 'Unknown',
      isValid,
      rejectionReason,
    };
    this.transactions.push(processedTransaction);
    return processedTransaction;
  }

  processTransactions(transactions: Transaction[]): Transaction[] {
    return transactions.map((transaction) => this.processTransaction(transaction));
  }

  getTransactions(): Transaction[] {
    return this.transactions.slice();
  }

  getTransaction(id: string): Transaction {
    return this.transactions.find((t) => t.id === id) ?? null;
  }

  deleteTransaction(id: string): number {
    const originalLength = this.transactions.length;
    this.transactions = this.transactions.filter((t) => t.id !== id);
    const deletedCount = originalLength - this.transactions.length;
    return deletedCount;
  }

  getValidTransactions(): Transaction[] {
    return this.transactions.filter((transaction) => transaction.isValid);
  }

  getRejectedTransactions(): Transaction[] {
    return this.transactions.filter((transaction) => !transaction.isValid);
  }

  clearAllTransactions(): number {
    const deletedCount = this.transactions.length;
    this.transactions = [];
    return deletedCount;
  }

  getReport(): TransactionsReport {
    const validTransactions = this.getValidTransactions();
    const rejectedTransactions = this.getRejectedTransactions();

    const byCard: CardSummary = {};
    const byCardType: CardTypeSummary = {};
    const byDay: DailySummary = {};

    // Process valid transactions for summaries
    validTransactions.forEach((transaction) => {
      const { cardNumber, cardType, timestamp, amount } = transaction;
      const date = timestamp.split('T')[0]; // Extract date part from ISO timestamp

      // By Card
      if (!byCard[cardNumber]) {
        byCard[cardNumber] = { totalAmount: 0, count: 0 };
      }
      byCard[cardNumber].totalAmount += amount;
      byCard[cardNumber].count += 1;

      // By Card Type
      if (cardType && !byCardType[cardType]) {
        byCardType[cardType] = { totalAmount: 0, count: 0 };
      }
      if (cardType) {
        byCardType[cardType].totalAmount += amount;
        byCardType[cardType].count += 1;
      }

      // By Day
      if (!byDay[date]) {
        byDay[date] = { totalAmount: 0, count: 0 };
      }
      byDay[date].totalAmount += amount;
      byDay[date].count += 1;
    });

    return {
      byCard,
      byCardType,
      byDay,
      rejectedTransactions,
    };
  }
}

export const store = new TransactionStore();
