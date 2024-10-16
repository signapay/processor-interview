import fs from "fs";
import csv from "csv-parser";
import { Transaction, TransactionType } from "../types/transaction";

export const readTransactionsFromCsvFile = async (filePath: string): Promise<Transaction[]> => {
  const transactions: Transaction[] = [];

  try {
    const stream = fs.createReadStream(filePath).pipe(csv());

    for await (const data of stream) {
      transactions.push({
        accountName: data.accountName,
        cardNumber: parseInt(data.cardNumber),
        transactionAmount: parseFloat(data.transactionAmount),
        transactionType: data.transactionType as TransactionType,
        description: data.description,
        targetCardNumber: data.targetCardNumber ? parseInt(data.targetCardNumber) : undefined,
      });
    }

    return transactions;
  } catch (error) {
    throw error;
  }
};

export const readTransactionsFromJsonFile = async (filePath: string): Promise<Transaction[]> => {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);
    if (!Array.isArray(jsonData)) {
      throw new Error("Invalid JSON format: Expected an array of transactions.");
    }
    return jsonData;
  } catch (error) {
    throw error;
  }
};
