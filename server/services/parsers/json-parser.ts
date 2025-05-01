import { Readable } from "stream";

import { chain } from "stream-chain";
import { parser } from "stream-json";
import { streamValues } from "stream-json/streamers/StreamValues";

import type { RawTransaction } from "@/shared/import-types";

import { BaseParser, type ParserOptions } from "./base-parser";

export class JsonParser extends BaseParser {
  constructor(options: ParserOptions = {}) {
    super(options);
  }

  canParse(fileType: string): boolean {
    return (
      fileType === "application/json" ||
      fileType.endsWith(".json") ||
      fileType.includes("json")
    );
  }

  async parse(stream: Readable): Promise<RawTransaction[]> {
    return new Promise((resolve, reject) => {
      const transactions: RawTransaction[] = [];
      let totalItems = 0;
      let processedItems = 0;

      // Create a processing pipeline
      const pipeline = chain([stream, parser(), streamValues()]);

      // Process each value from the JSON stream
      pipeline.on("data", (data) => {
        try {
          const value = data.value;

          // Handle both array of transactions and single transaction object
          if (Array.isArray(value)) {
            totalItems = value.length;

            // Process each transaction in the array
            value.forEach((item) => {
              const transaction = this.mapToTransaction(item);
              if (transaction) {
                transactions.push(transaction);
              }

              processedItems++;
              this.reportProgress((processedItems / totalItems) * 100);
            });
          } else if (typeof value === "object" && value !== null) {
            // Handle single transaction object
            const transaction = this.mapToTransaction(value);
            if (transaction) {
              transactions.push(transaction);
            }

            processedItems++;
            this.reportProgress(100); // 100% for single item
          }
        } catch (error) {
          this.reportError(error as Error);
        }
      });

      pipeline.on("end", () => {
        resolve(transactions);
      });

      pipeline.on("error", (error) => {
        reject(error);
      });
    });
  }

  private mapToTransaction(data: any): RawTransaction | null {
    try {
      // Handle different possible field names
      const cardNumber =
        data.cardNumber || data.card_number || data["card number"] || "";
      const timestamp = data.timestamp || data.date || data.time || "";
      const amount =
        typeof data.amount === "number"
          ? data.amount
          : parseFloat(
              data.amount?.toString().replace(/[^0-9.-]+/g, "") || "0",
            );

      return {
        cardNumber: cardNumber.toString(),
        timestamp: timestamp.toString(),
        amount,
      };
    } catch (error) {
      this.reportError(error as Error);
      return null;
    }
  }
}
