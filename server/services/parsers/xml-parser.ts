import { Readable } from "stream";

import * as sax from "sax";

import type { RawTransaction } from "@/shared/import-types";

import { BaseParser, type ParserOptions } from "./base-parser";

export class XmlParser extends BaseParser {
  constructor(options: ParserOptions = {}) {
    super(options);
  }

  canParse(fileType: string): boolean {
    return (
      fileType === "application/xml" ||
      fileType === "text/xml" ||
      fileType.endsWith(".xml") ||
      fileType.includes("xml")
    );
  }

  async parse(stream: Readable): Promise<RawTransaction[]> {
    return new Promise((resolve, reject) => {
      const transactions: RawTransaction[] = [];
      let currentTransaction: Partial<RawTransaction> = {};
      let currentTag = "";
      let inTransaction = false;
      let transactionCount = 0;
      let processedCount = 0;

      // Create a SAX parser
      const saxParser = sax.createStream(true, {
        trim: true,
        normalize: true,
      });

      // Handle opening tags
      saxParser.on("opentag", (node) => {
        currentTag = node.name.toLowerCase();

        // Check if we're entering a transaction element
        if (
          currentTag === "transaction" ||
          currentTag === "item" ||
          currentTag === "record"
        ) {
          inTransaction = true;
          currentTransaction = {};
          transactionCount++;
        }
      });

      // Handle text content
      saxParser.on("text", (text) => {
        if (!inTransaction || !currentTag) return;

        // Map XML fields to transaction properties
        if (
          currentTag === "cardnumber" ||
          currentTag === "card_number" ||
          currentTag === "card"
        ) {
          currentTransaction.cardNumber = text;
        } else if (
          currentTag === "timestamp" ||
          currentTag === "date" ||
          currentTag === "time"
        ) {
          currentTransaction.timestamp = text;
        } else if (
          currentTag === "amount" ||
          currentTag === "value" ||
          currentTag === "price"
        ) {
          currentTransaction.amount = parseFloat(
            text.replace(/[^0-9.-]+/g, "") ?? "0",
          );
        }
      });

      // Handle closing tags
      saxParser.on("closetag", (tagName) => {
        const tag = tagName.toLowerCase();

        // Check if we're exiting a transaction element
        if (
          (tag === "transaction" || tag === "item" || tag === "record") &&
          inTransaction
        ) {
          inTransaction = false;

          // Add the transaction if it has all required fields
          if (
            currentTransaction.cardNumber &&
            currentTransaction.timestamp &&
            currentTransaction.amount !== undefined
          ) {
            transactions.push({
              cardNumber: currentTransaction.cardNumber,
              timestamp: currentTransaction.timestamp,
              amount: currentTransaction.amount,
            });
          }

          processedCount++;
          if (transactionCount > 0) {
            this.reportProgress((processedCount / transactionCount) * 100);
          }
        }

        currentTag = "";
      });

      // Handle errors
      saxParser.on("error", (error) => {
        reject(error);
      });

      // Handle end of stream
      saxParser.on("end", () => {
        resolve(transactions);
      });

      // Pipe the input stream to the SAX parser
      stream.pipe(saxParser);
    });
  }
}
