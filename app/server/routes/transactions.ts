import { PrismaClient } from "@prisma/client";
import Papa from "papaparse";
import Redis from "ioredis";
import { Transaction } from "types/types";

export async function processCSVTransactions(csvContent: string, prisma: PrismaClient, redis: Redis) {
  const transactions = Papa.parse<Transaction>(csvContent, { header: true }).data;

  for (const transaction of transactions) {
    const accountName = transaction["accountName"];
    const cardNumber = transaction["cardNumber"];
    const amount = parseFloat(transaction["amount"]);

    if (!accountName || !cardNumber || isNaN(amount)) {
      await redis.lpush("badTransactions", JSON.stringify(transaction));
      continue;
    }

    let account = await prisma.account.findUnique({ where: { name: accountName } });
    if (!account) {
      account = await prisma.account.create({ data: { name: accountName } });
    }

    let card = await prisma.card.findFirst({ where: { number: cardNumber, accountId: account.id } });
    if (!card) {
      card = await prisma.card.create({ data: { number: cardNumber, balance: 0, Account: { connect: { id: account.id } } } });
    }

    await prisma.card.update({ where: { id: card.id }, data: { balance: { increment: amount } } });
    await prisma.transaction.create({ data: { accountId: account.id, cardId: card.id, amount } });
  }
}
