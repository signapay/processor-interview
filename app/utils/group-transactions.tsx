import { Transaction, GroupedTransactions } from "../../types/types";

// Function to group transactions by account name
export const groupByAccount = (transactions: Transaction[]): GroupedTransactions => {
  return transactions.reduce((acc: GroupedTransactions, transaction: Transaction) => {
    const { accountName } = transaction;
    if (!acc[accountName]) {
      acc[accountName] = [];
    }
    acc[accountName].push(transaction);
    return acc;
  }, {});
};
