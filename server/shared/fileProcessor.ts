import fs from 'node:fs';
import csv from 'csv-parser';
import type { SupportedFileType, Transaction } from 'server/shared/entity';
import { Parser } from 'xml2js';
import { store } from '../shared/store';

export class FileProcessor {
  async processFile(filePath: string, type: SupportedFileType): Promise<Transaction[]> {
    try {
      let transactions: Transaction[] = [];
      switch (type) {
        case 'json':
          transactions = await this.processJsonFile(filePath);
          break;
        case 'csv':
          transactions = await this.processCsvFile(filePath);
          break;
        case 'xml':
          transactions = await this.processXmlFile(filePath);
          break;
        default:
          throw new TypeError(`Unsupported file format: ${type}`);
      }
      return store.processTransactions(transactions);
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
      throw error;
    }
  }

  private async processJsonFile(filePath: string): Promise<Transaction[]> {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error processing JSON file ${filePath}:`, error);
      throw error;
    }
  }

  private async processCsvFile(filePath: string): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
      const transactions: Transaction[] = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => {
          const transaction = {
            cardNumber: data.cardNumber,
            timestamp: data.timestamp,
            amount: Number.parseFloat(data.amount),
          } satisfies Transaction;
          transactions.push(transaction);
        })
        .on('end', () => {
          resolve(transactions);
        })
        .on('error', (error: Error) => {
          reject(error);
        });
    });
  }

  private async processXmlFile(filePath: string): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        const parser = new Parser({ explicitArray: false });
        parser.parseString(data, (parseErr: Error, result: any) => {
          if (parseErr) {
            reject(parseErr);
            return;
          }

          try {
            const transactions = result.transactions.transaction.map(
              (item: any) =>
                ({
                  cardNumber: item.cardNumber,
                  timestamp: item.timestamp,
                  amount: Number.parseFloat(item.amount),
                }) satisfies Transaction
            );

            resolve(transactions);
          } catch (transformErr) {
            reject(transformErr);
          }
        });
      });
    });
  }
}

export const fileProcessor = new FileProcessor();
