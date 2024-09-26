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
  amount: Joi.string().required().label("Amount"),
  type: Joi.string().valid("Credit", "Debit", "Transfer").required().label("Transaction Type"),
  description: Joi.string().optional().label("Description"),
  targetCardNumber: Joi.string().optional().label("Target Card Number"),
  accountId: Joi.string().optional().label("Account ID"),
});

app.post("/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.file as fileUpload.UploadedFile;
  const filePath = path.join(__dirname, "uploads", file.name);

  // save file temporarily for parsing
  await fs.promises.writeFile(filePath, file.data);

  const csvContent = await fs.promises.readFile(filePath, "utf-8");

  // parse CSV without headers
  const parsedData = Papa.parse<string[]>(csvContent, {
    header: false,
    skipEmptyLines: true,
  }).data;

  // fetch existing accounts and bad transactions from Redis
  const existingAccountsData = await redisClient.get("accounts");
  const existingBadTransactionsData = await redisClient.get("badTransactions");

  // initialize or parse  existing data from Redis
  const accounts: Account[] = existingAccountsData ? JSON.parse(existingAccountsData) : [];
  const badTransactions: BadTransaction[] = existingBadTransactionsData ? JSON.parse(existingBadTransactionsData) : [];

  // map the CSV rows
  const mappedTransactions: Transaction[] = parsedData.map((transaction: string[]): Transaction => {
    const [accountName, cardNumber, amount, type, description, targetCardNumber] = transaction;
    const accountId = `${accountName.replace(/\s+/g, "_")}_${cardNumber.trim()}`;

    return {
      accountName,
      accountId,
      cardNumber,
      amount,
      type: type as "Credit" | "Debit" | "Transfer" | undefined,
      description,
      targetCardNumber: targetCardNumber ? String(targetCardNumber) : undefined,
    };
  });

  // process each mapped transaction
  mappedTransactions.forEach((transaction, index) => {
    const { error, value } = transactionSchema.validate(transaction, { abortEarly: false });

    if (error) {
      console.log(`Invalid transaction at row ${index + 1}: ${error.message}`);
      badTransactions.push({
        error: error.details.map((detail) => detail.message).join(", "),
        rawData: transaction,
        transactionAmount: transaction.amount || "0",
        cardNumber: transaction.cardNumber || "Unknown",
        accountName: transaction.accountName || "Unknown",
        description: transaction.description || "No Description",
        accountId: transaction.accountId || "No ID",
        type: transaction.type || "No Card Type",
      });
    } else {
      let account = accounts.find((acc) => acc.accountId === transaction.accountId);
      if (!account) {
        account = {
          accountName: transaction.accountName,
          accountId: transaction.accountId,
          cards: {},
          balance: 0,
        };
        accounts.push(account);
      }

      const numericAmount = parseFloat(transaction.amount);
      account.cards[transaction.cardNumber] = (account.cards[transaction.cardNumber] || 0) + numericAmount;
      account.balance += numericAmount;
    }
    redisClient.rpush(
      `transactions:${transaction.accountId}`,
      JSON.stringify({
        accountName: transaction.accountName,
        accountId: transaction.accountId,
        cardNumber: transaction.cardNumber,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        targetCardNumber: transaction.targetCardNumber,
      })
    );
  });

  // save updated accounts and bad transactions in Redis
  await redisClient.set("accounts", JSON.stringify(accounts));
  await redisClient.set("badTransactions", JSON.stringify(badTransactions));

  res.send({ message: "File uploaded and transactions processed.", accounts, badTransactions });
});

app.get("/accounts/:accountId", async (req, res) => {
  const { accountId } = req.params;

  // Check if the account exists in Redis
  const accountData = await redisClient.get(`accounts`);
  const accounts = accountData ? JSON.parse(accountData) : [];

  const account = accounts.find((acc: Account) => acc.accountId === accountId);

  if (account) {
    res.json(account);
  } else {
    res.status(404).json({ message: "Account not found" });
  }
});

app.get("/accounts/:accountId/transactions", async (req, res) => {
  const { accountId } = req.params;

  // Log accountId to ensure it's correct
  console.log(`Fetching transactions for account: ${accountId}`);

  // Check if Redis key for transactions exists for this accountId
  const redisKey = `transactions:${accountId}`;
  const transactions = await redisClient.lrange(redisKey, 0, -1); // Fetch all transactions

  // Log fetched transactions to verify data
  console.log("Fetched transactions:", transactions);

  if (transactions && transactions.length > 0) {
    // Parse and return transactions
    const parsedTransactions = transactions.map((tx) => JSON.parse(tx));
    res.json(parsedTransactions);
  } else {
    res.status(404).json({ message: `No transactions found for account ${accountId}` });
  }
});

app.get("/report", async (req, res) => {
  try {
    // fetch accounts and badTransactions from Redis
    const accountsData = await redisClient.get("accounts");
    const badTransactionsData = await redisClient.get("badTransactions");

    // parse the data retrieved from Redis
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
