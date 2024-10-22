import { Transaction } from "@/app/context/types";

export const getAccountBalance = (transactions: Transaction[], cardNumber: string): number => {
  return transactions
    .filter((row) => row.cardNumber === cardNumber)
    .reduce((acc, row) => acc + row.transactionAmount, 0);
};

export const getUniqueAccountNumbers = (transactions: Transaction[]): string[] => {
  return Array.from(new Set(transactions.map((row) => row.cardNumber)));
};

export const formatUSD = (amount: number): string => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};