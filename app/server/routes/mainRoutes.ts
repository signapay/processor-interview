import { Router } from "express";
import { redisClient } from "../redis/redis-client";
import fileUpload from "express-fileupload";
import { Account, BadTransaction, Transaction } from "../../../types/types";
import { fileURLToPath } from "url";
import Joi from "joi";
import Papa from "papaparse";
import fs from "fs";
import path from "path";

const headers = ["accountName", "cardNumber", "amount", "type", "description", "targetCardNumber"];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainRouter = Router();
mainRouter.use(fileUpload());

// transaction validation schema
const transactionSchema = Joi.object({
  accountName: Joi.string().required().label("Account Name"),
  cardNumber: Joi.string().required().label("Card Number"),
  amount: Joi.string().required().label("Amount"),
  type: Joi.string().valid("Credit", "Debit", "Transfer").required().label("Transaction Type"),
  description: Joi.string().optional().label("Description"),
  targetCardNumber: Joi.string().optional().label("Target Card Number"),
  accountId: Joi.string().optional().label("Account ID"),
});

// Upload Route
mainRouter.post("/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.file as fileUpload.UploadedFile;
  const filePath = path.join(__dirname, "uploads", file.name);

  // Save the file temporarily for parsing
  await fs.promises.writeFile(filePath, file.data);

  const csvContent = await fs.promises.readFile(filePath, "utf-8");

  // Parse CSV without headers
  const parsedData = Papa.parse<string[]>(csvContent, { header: false, skipEmptyLines: true }).data;

  const existingAccountsData = await redisClient.get("accounts");
  const existingBadTransactionsData = await redisClient.get("badTransactions");

  const accounts: Account[] = existingAccountsData ? JSON.parse(existingAccountsData) : [];
  const badTransactions: BadTransaction[] = existingBadTransactionsData ? JSON.parse(existingBadTransactionsData) : [];

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

  // Process each mapped transaction
  mappedTransactions.forEach((transaction, index) => {
    const { error } = transactionSchema.validate(transaction, { abortEarly: false });

    if (error) {
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
    redisClient.rpush(`transactions:${transaction.accountId}`, JSON.stringify(transaction));
  });

  await redisClient.set("accounts", JSON.stringify(accounts));
  await redisClient.set("badTransactions", JSON.stringify(badTransactions));

  res.send({ message: "File uploaded and transactions processed.", accounts, badTransactions });
});

// Fetch Account Details
mainRouter.get("/accounts/:accountId", async (req, res) => {
  const { accountId } = req.params;
  const accountData = await redisClient.get("accounts");
  const accounts = accountData ? JSON.parse(accountData) : [];

  const account = accounts.find((acc: Account) => acc.accountId === accountId);
  if (account) {
    res.json(account);
  } else {
    res.status(404).json({ message: "Account not found" });
  }
});

// Fetch Account Transactions
mainRouter.get("/accounts/:accountId/transactions", async (req, res) => {
  const { accountId } = req.params;
  const transactions = await redisClient.lrange(`transactions:${accountId}`, 0, -1);

  if (transactions && transactions.length > 0) {
    res.json(transactions.map((tx) => JSON.parse(tx)));
  } else {
    res.status(404).json({ message: "No transactions found for this account" });
  }
});

// Fetch Report
mainRouter.get("/report", async (req, res) => {
  const accountsData = await redisClient.get("accounts");
  const badTransactionsData = await redisClient.get("badTransactions");

  const accounts: Account[] = accountsData ? JSON.parse(accountsData) : [];
  const badTransactions: BadTransaction[] = badTransactionsData ? JSON.parse(badTransactionsData) : [];

  const collections = accounts.filter((account) => Object.values(account.cards).some((balance) => balance < 0));

  res.json({ accounts, badTransactions, collections });
});

// Reset the System
mainRouter.post("/reset", async (req, res) => {
  await redisClient.flushall();

  const uploadsDir = path.join(__dirname, "uploads");
  fs.readdir(uploadsDir, (err, files) => {
    if (err) console.error("Error reading uploads directory:", err);
    files.forEach((file) => {
      fs.unlink(path.join(uploadsDir, file), (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });
  });

  res.status(200).send("System reset successful.");
});

export default mainRouter;
