import cardValidator from "card-validator";
import { Value } from "@sinclair/typebox/value";
import { parseCsv } from "@/src/parsers/csv";
import { parseJson } from "@/src/parsers/json";
import { parseXml } from "@/src/parsers/xml";
import { TransactionType, Transaction } from "@/src/models/transaction";

abstract class TransactionsService {
  private static transactions: TransactionType[] = [];
  private static transactionsByCard: Record<string, number> = {};
  private static transactionsByCardType: Record<string, number> = {};
  private static transactionsByDay: Record<string, number> = {};
  private static rejectedTransactions: TransactionType[] = [];

  static async parseFile(file: File): Promise<TransactionType[]> {
    const buffer = await file.arrayBuffer();
    const content = Buffer.from(buffer).toString("utf8");
    const normalizedType = file.type.split(";")[0];

    switch (normalizedType) {
      case "text/csv":
        return parseCsv<TransactionType>(content, (row) => ({
          ...row,
          amount: parseFloat(row.amount),
        }));
      case "application/json":
        return parseJson<TransactionType[]>(content);
      case "application/xml": {
        const parsedXml = parseXml<{
          transactions: { transaction: TransactionType[] };
        }>(content, (data) => {
          const transactions = Array.isArray(data.transactions.transaction)
            ? data.transactions.transaction
            : [data.transactions.transaction];

          transactions.forEach((t) => {
            t.cardNumber = String(t.cardNumber);
          });

          return { transactions: { transaction: transactions } };
        });

        return parsedXml.transactions.transaction;
      }
      default:
        throw new Error("Unsupported file format");
    }
  }

  static async processFiles(files: File[]): Promise<TransactionType[]> {
    const results = await Promise.all(
      files.map((file) => this.parseFile(file)),
    );
    results.forEach((parsedData) => {
      parsedData.forEach((transaction) =>
        this.categorizeTransaction(transaction),
      );
    });
    return this.transactions;
  }

  private static categorizeTransaction(transaction: TransactionType): void {
    console.log("Categorizing transaction:", transaction);
    const cardValidation = cardValidator.number(transaction.cardNumber);

    if (!cardValidation.card?.type) {
      this.rejectedTransactions.push(transaction);
      return;
    }

    const isValid = Value.Check(Transaction, transaction);

    if (!isValid) {
      this.rejectedTransactions.push(transaction);
      return;
    }

    this.transactions.push(transaction);

    // Sum by card
    if (!this.transactionsByCard[transaction.cardNumber]) {
      this.transactionsByCard[transaction.cardNumber] = 0;
    }
    this.transactionsByCard[transaction.cardNumber] += Math.abs(
      transaction.amount,
    );

    // Sum by card type
    const cardType = this.getCardType(transaction.cardNumber);
    if (!this.transactionsByCardType[cardType]) {
      this.transactionsByCardType[cardType] = 0;
    }
    this.transactionsByCardType[cardType] += Math.abs(transaction.amount);

    // Sum by day
    const day = transaction.timestamp.split("T")[0];
    if (!this.transactionsByDay[day]) {
      this.transactionsByDay[day] = 0;
    }
    this.transactionsByDay[day] += Math.abs(transaction.amount);
  }

  private static getCardType(cardNumber: string): string {
    const firstDigit = cardNumber[0];
    switch (firstDigit) {
      case "3":
        return "Amex";
      case "4":
        return "Visa";
      case "5":
        return "MasterCard";
      case "6":
        return "Discover";
      default:
        return "Unknown";
    }
  }

  static async handleFileProcessing(files: any[]) {
    try {
      await this.processFiles(files);
    } catch (error) {
    }
  }

  static async handleTransactionDeletion() {
    this.clearTransactions();
  }

  static getTransactionsByCard(): Record<string, number> {
    return this.transactionsByCard;
  }

  static getTransactionsByCardType(): Record<string, number> {
    return this.transactionsByCardType;
  }

  static getTransactionsByDay(): Record<string, number> {
    return this.transactionsByDay;
  }

  static getRejectedTransactions(): TransactionType[] {
    return this.rejectedTransactions;
  }

  static clearTransactions(): void {
    this.transactions.length = 0;
    this.transactionsByCard = {};
    this.transactionsByCardType = {};
    this.transactionsByDay = {};
    this.rejectedTransactions = [];
  }
}

export { TransactionsService };
