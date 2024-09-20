import express from "express";
import fileUpload from "express-fileupload";
import { Transaction, Account, BadTransaction } from "../../types/types";
import cors from "cors";
import { createRequestHandler } from "@remix-run/express";
import { PrismaClient } from "@prisma/client";
import { redisClient } from "./redis/redis-client";
import { config } from "../../config/config";
import type { ServerBuild } from "@remix-run/server-runtime";
import { fileURLToPath } from "url";
import Joi from "joi";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import dotenv from "dotenv";
import * as serverBuild from "../../build/server.js";

const build = serverBuild as unknown as ServerBuild;
const headers = ["accountName", "cardNumber", "amount", "type", "description", "targetCardNumber"];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();
const app = express();

dotenv.config({
  path: config.NODE_ENV === "production" ? ".env.production" : ".env.local",
});

app.use(fileUpload());
app.use(express.json());

const transactionSchema = Joi.object({
  accountName: Joi.string().required().label("Account Name"),
  cardNumber: Joi.string().required().label("Card Number"),
  amount: Joi.string()
    .required()
    .pattern(/^-?\d+(\.\d{1,2})?$/)
    .label("Amount"),
  type: Joi.string().valid("Credit", "Debit", "Transfer").required().label("Transaction Type"),
  description: Joi.string().optional().label("Description"),
  targetCardNumber: Joi.string().optional().label("Target Card Number"),
});

app.post("/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.file as fileUpload.UploadedFile;
  const filePath = path.join(__dirname, "uploads", file.name);

  // Save the file temporarily for parsing
  await fs.promises.writeFile(filePath, file.data);

  const csvContent = await fs.promises.readFile(filePath, "utf-8");

  // Parse CSV without headers
  const parsedData = Papa.parse<string[]>(csvContent, {
    header: false,
    skipEmptyLines: true,
  }).data;

  // Fetch existing accounts and bad transactions from Redis
  const existingAccountsData = await redisClient.get("accounts");
  const existingBadTransactionsData = await redisClient.get("badTransactions");

  // Initialize or parse the existing data from Redis
  const accounts: Account[] = existingAccountsData ? JSON.parse(existingAccountsData) : [];
  const badTransactions: BadTransaction[] = existingBadTransactionsData ? JSON.parse(existingBadTransactionsData) : [];

  // Map the CSV rows to your expected structure using the predefined headers
  const mappedTransactions: Transaction[] = parsedData.map((transaction: string[]): Transaction => {
    // Map the transaction array into a Transaction object
    const [accountName, cardNumber, amount, type, description, targetCardNumber] = transaction;
    return {
      accountName,
      cardNumber,
      amount,
      type: type as "Credit" | "Debit" | "Transfer",
      description,
      targetCardNumber: targetCardNumber ? String(targetCardNumber) : undefined,
    };
  });

  // Process each mapped transaction
  mappedTransactions.forEach((transaction, index) => {
    const { error, value } = transactionSchema.validate(transaction, { abortEarly: false });

    if (error) {
      console.log(`Invalid transaction at row ${index + 1}: ${error.message}`);
      badTransactions.push({
        error: error.details.map((detail) => detail.message).join(", "),
        rawData: transaction, // Now properly structured as Transaction
        transactionAmount: transaction.amount || "0",
        cardNumber: transaction.cardNumber || "Unknown",
        accountName: transaction.accountName || "Unknown",
        description: transaction.description || "No Description",
      });
    } else {
      let account = accounts.find((acc) => acc.accountName === transaction.accountName);
      if (!account) {
        account = {
          accountName: transaction.accountName,
          cards: {},
          balance: 0,
        };
        accounts.push(account);
      }

      const numericAmount = parseFloat(transaction.amount);
      account.cards[transaction.cardNumber] = (account.cards[transaction.cardNumber] || 0) + numericAmount;
      account.balance += numericAmount;
    }
  });

  // Save updated accounts and bad transactions in Redis
  await redisClient.set("accounts", JSON.stringify(accounts));
  await redisClient.set("badTransactions", JSON.stringify(badTransactions));

  res.send({ message: "File uploaded and transactions processed.", accounts, badTransactions });
});

app.get("/report", async (req, res) => {
  try {
    // Fetch accounts and badTransactions from Redis
    const accountsData = await redisClient.get("accounts");
    const badTransactionsData = await redisClient.get("badTransactions");

    // Parse the data retrieved from Redis
    const accounts: Account[] = accountsData ? JSON.parse(accountsData) : [];
    const badTransactions: BadTransaction[] = badTransactionsData ? JSON.parse(badTransactionsData) : [];

    const collections = accounts.filter((account) => Object.values(account.cards).some((balance) => balance < 0));

    res.json({
      accounts,
      badTransactions,
      collections,
    });
  } catch (error) {
    console.error("Error fetching report data:", error);
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

app.post("/reset", async (req, res) => {
  try {
    // Clear all Redis data
    await redisClient.flushall();

    const uploadsDir = path.join(__dirname, "uploads");
    fs.readdir(uploadsDir, (err, files) => {
      if (err) console.error("Error reading uploads directory:", err);

      files.forEach((file) => {
        const filePath = path.join(uploadsDir, file);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    });

    console.log("System reset successful. All data cleared.");
    return res.status(200).send("System reset successful.");
  } catch (error) {
    console.error("Error resetting the system:", error);
    res.status(500).send("System reset failed.");
  }
});

app.all(
  "*",
  createRequestHandler({
    build: build,
    getLoadContext() {
      return { redisClient };
    },
  })
);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
