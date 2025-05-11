import { TransactionService } from "../../application/services/TransactionService";
import { Transaction } from "../../domain/entities/Transaction";
import { parse } from "csv-parse/sync";
import xml2js from "xml2js";

const isValidCard = (cardNumber: string): boolean => {
  return /^[3456]/.test(cardNumber);
};

const groupByCardAndDay = (transactions: Transaction[]) => {
  const grouped: Record<string, Record<string, number[]>> = {};

  for (const tx of transactions) {
    if (!isValidCard(tx.cardNumber)) continue;

    const date = new Date(tx.timestamp).toISOString().split("T")[0];
    grouped[tx.cardNumber] = grouped[tx.cardNumber] || {};
    grouped[tx.cardNumber][date] = grouped[tx.cardNumber][date] || [];
    grouped[tx.cardNumber][date].push(tx.amount);
  }

  return grouped;
};

export class TransactionServiceImpl implements TransactionService {
  async processTransactions(data: string, contentType: string): Promise<Record<string, Record<string, number[]>>> {
    let transactions: Transaction[] = [];

    switch (contentType) {
      case "application/json":
        transactions = JSON.parse(data);
        break;
      case "text/csv":
        transactions = parse(data, {
          columns: ["cardNumber", "timestamp", "amount"],
          skip_empty_lines: true
        });
        break;
      case "application/xml":
        const parsed = await xml2js.parseStringPromise(data, { explicitArray: false });
        transactions = Array.isArray(parsed.transactions.transaction)
          ? parsed.transactions.transaction
          : [parsed.transactions.transaction];
        break;
      default:
        throw new Error("Unsupported content type");
    }

    transactions = transactions.map(t => ({
      cardNumber: t.cardNumber,
      timestamp: t.timestamp,
      amount: parseFloat(t.amount.toString())
    })).filter(t => isValidCard(t.cardNumber));

    return groupByCardAndDay(transactions);
  }
}