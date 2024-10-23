import { Transaction } from "../types/types";

export const mockTransactions: Transaction[] = [
  {
    accountName: "Alice",
    cardNumber: "1111",
    transactionAmount: -50,
    transactionType: "Debit",
    description: "Groceries"
  },
  {
    accountName: "Alice",
    cardNumber: "1111",
    transactionAmount: -100,
    transactionType: "Debit",
    description: "Restaurant"
  },
  {
    accountName: "Bob",
    cardNumber: "2222",
    transactionAmount: 200,
    transactionType: "Credit",
    description: "Bonus"
  },
];