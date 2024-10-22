import { CardBalance, Transaction } from "./context/types";

export const headers = ["Account Name", "Card Number", "Transaction Amount", "Transaction Type", "Description", "Target Card Number"];

export const headerKeyMap: { [key: string]: keyof Transaction } = {
  'Account Name': 'accountName',
  'Card Number': 'cardNumber',
  'Transaction Amount': 'transactionAmount',
  'Transaction Type': 'transactionType',
  'Description': 'description',
  'Target Card Number': 'targetCardNumber',
};

export const allTransactionsKeyMap: Record<string, keyof Transaction> = {
  "Account Name": "accountName",
  "Card Number": "cardNumber",
  "Transaction Amount": "transactionAmount",
  "Transaction Type": "transactionType",
  "Description": "description",
  "Target Card Number": "targetCardNumber",
};


export const collectionsKeyMap: Record<string, keyof CardBalance> = {
  "Card Number": "cardNumber",
  "Account Balance": "accountBalance",
};
