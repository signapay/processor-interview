import { Readable } from "stream";

import Papa from "papaparse";

import type { RawTransaction } from "@/shared/import-types";

import { BaseParser, type ParserOptions } from "./base-parser";

export class CsvParser extends BaseParser {
  constructor(options: ParserOptions = {}) {
    super(options);
  }

  canParse(fileType: string): boolean {
    return (
      fileType === "text/csv" ||
      fileType === "application/csv" ||
      fileType === "application/vnd.ms-excel" ||
      fileType.endsWith(".csv")
    );
  }

  async parse(stream: Readable): Promise<RawTransaction[]> {
    return new Promise((resolve, reject) => {
      // Convert stream to string
      let csvData = "";
      stream.on("data", (chunk) => {
        csvData += chunk.toString();
      });

      stream.on("end", () => {
        try {
          // Parse CSV data
          const results = Papa.parse(csvData, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
          });

          if (results.errors && results.errors.length > 0) {
            reject(
              new Error(`CSV parsing error: ${results.errors[0].message}`),
            );
            return;
          }

          // Map CSV data to RawTransaction objects
          const transactions: RawTransaction[] = results.data.map(
            (row: any) => {
              // Handle different possible field names
              const cardNumber =
                row.cardNumber || row.card_number || row["card number"] || "";
              const timestamp = row.timestamp || row.date || row.time || "";
              const amount =
                typeof row.amount === "number"
                  ? row.amount
                  : parseFloat(
                      row.amount?.toString().replace(/[^0-9.-]+/g, "") || "0",
                    );

              return {
                cardNumber: cardNumber.toString(),
                timestamp: timestamp.toString(),
                amount,
              };
            },
          );

          resolve(transactions);
        } catch (error) {
          reject(error);
        }
      });

      stream.on("error", (error) => {
        reject(error);
      });
    });
  }
}
