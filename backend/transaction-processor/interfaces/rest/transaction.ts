import express from "express";
import multer from "multer";
import Processor from "../../features";
import { ZodError } from "zod";
import Helpers from "../../helpers";
import csv from 'csv-parser';
import { Readable } from 'stream';
import { Transaction } from "../../types/transaction";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

const handleValidationError = (error: ZodError, res: express.Response) => {
  const errorMessages = error.errors.map((err) => err.message);
  res.status(400).json({ errors: errorMessages });
};

router.get("/transactions", async (req, res) => {
  try {
    const transactions = Processor.getTransactions();
    res.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("Error fetching transactions");
  }
});

router.get("/report", async (req, res) => {
  try {
    const transactions = Processor.getTransactions();
    const report = Processor.generateReport(transactions);
    res.json({ report });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).send("Error generating report");
  }
});

router.post("/process", async (req, res) => {
  try {
    const transactions = Helpers.ValidationHelper.transactionsSchema(req.body);
    const processedTransactions = Processor.processTransactions(transactions);
    res.json({ processedTransactions });
  } catch (error) {
    if (error instanceof ZodError) {
      handleValidationError(error, res);
    } else {
      console.error("Error processing transactions:", error);
      res.status(500).send("Error processing transactions");
    }
  }
});

router.post("/process-transactions", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const { buffer } = req.file;
    
    const transactions = await new Promise<Record<string, string>[]>((resolve, reject) => {
      const results: Record<string, string>[] = [];
      Readable.from(buffer)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
    const parsedTransactions = Helpers.ValidationHelper.parseTransaction(transactions);
    const validatedTransactions = Helpers.ValidationHelper.transactionsSchema(parsedTransactions);
    const processedTransactions = Processor.processTransactions(validatedTransactions);
    res.status(200).json({ processedTransactions });
  } catch (error) {
    if (error instanceof ZodError) {
      handleValidationError(error, res);
    } else {
      console.error("Error processing transactions:", error);
      res.status(500).send("Error processing transactions");
    }
  }
});

export default router;
