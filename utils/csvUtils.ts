import fs from 'fs';
import { parse } from 'fast-csv';
import { Transaction, BadTransaction, processTransactions } from './transactionUtils';

export const parseAndProcessCSV = (filePath: string): Promise<{
  cardReports: any[],
  invalidTransactions: BadTransaction[],
  collections: string[],
  transactionCount: number
}> => {
  return new Promise((resolve, reject) => {
    const validTransactions: Transaction[] = [];
    const invalidTransactions: BadTransaction[] = [];

    fs.createReadStream(filePath)
      .pipe(parse({ headers: false }))
      .on('data', (row: string[]) => {
        const transaction = normalizeRow(row);
        if ((transaction as BadTransaction).error) {
          invalidTransactions.push(transaction as BadTransaction);
        } else {
          validTransactions.push(transaction as Transaction);
        }
      })
      .on('end', () => {
        const { cardReports, badTransactions, collections, transactionCount } = processTransactions(validTransactions);
        resolve({
          cardReports,
          invalidTransactions: [...invalidTransactions, ...badTransactions],
          collections,
          transactionCount
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

const normalizeRow = (row: string[]): Transaction | BadTransaction => {
  const [accountName, cardNumberStr, transactionAmountStr, transactionType, description, targetCardNumberStr] = row;
  const cardNumber = Number(cardNumberStr);
  const transactionAmount = Number(transactionAmountStr);
  const targetCardNumber = targetCardNumberStr ? Number(targetCardNumberStr) : undefined;

  if (row.length !== 6 || isNaN(cardNumber) || isNaN(transactionAmount) || (targetCardNumberStr && isNaN(Number(targetCardNumberStr)))) {
    return {
      accountName,
      cardNumber: cardNumberStr,
      transactionAmount: transactionAmountStr,
      transactionType,
      description,
      targetCardNumber: targetCardNumberStr || '',
      error: 'Invalid schema format',
    } as BadTransaction;
  } else if (!['Credit', 'Debit', 'Transfer'].includes(transactionType)) {
    return {
      accountName,
      cardNumber: cardNumberStr,
      transactionAmount: transactionAmountStr,
      transactionType,
      description,
      targetCardNumber: targetCardNumberStr || '',
      error: 'Invalid transaction type',
    } as BadTransaction;
  } else if (transactionType === 'Transfer' && !targetCardNumber) {
    return {
      accountName,
      cardNumber: cardNumberStr,
      transactionAmount: transactionAmountStr,
      transactionType,
      description,
      targetCardNumber: targetCardNumberStr || '',
      error: 'Missing target card number for transfer',
    } as BadTransaction;
  }

  return {
    accountName,
    cardNumber,
    transactionAmount,
    transactionType,
    description,
    targetCardNumber,
  } as Transaction;
};
