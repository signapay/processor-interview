import { Transaction } from '../types/transaction';
import { setCache } from '../cache';

export const processTransaction = (transaction: Transaction): Transaction => {
  const processedTransaction = {
    ...transaction,
    cardNumber: Number(transaction.cardNumber.toString().slice(-4)),
    processedAt: new Date().toISOString(),
    status: 'processed'
  };
  setCache([processedTransaction]);
  return processedTransaction;
};

export const processTransactions = (transactions: Transaction[]): Transaction[] => transactions.map(processTransaction);

