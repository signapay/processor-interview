import { Transaction } from '../types/transaction';

export const calculateTotalAmount = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, transaction) => sum + transaction.transactionAmount, 0);
};

export const generateReport = (transactions: Transaction[]): string => {
  const totalAmount = calculateTotalAmount(transactions);
  const transactionCount = transactions.length;

  return `
    Transaction Report
    ------------------
    Total transactions: ${transactionCount}
    Total amount: $${totalAmount.toFixed(2)}
    Processed at: ${new Date().toISOString()}

    Transaction Details:
    ${transactions.map(transaction => `
      - Account Name: ${transaction.accountName}
      - Card Number: ${transaction.cardNumber.toString().match(/.{1,4}/g)?.join('_') || transaction.cardNumber}
      - Amount: ${transaction.transactionAmount < 0 ? `-$${Math.abs(transaction.transactionAmount).toFixed(2)}` : `$${transaction.transactionAmount.toFixed(2)}`}
      - Type: ${transaction.transactionType}
      - Description: ${transaction.description}
      - Processed At: ${transaction.processedAt}
      - Status: ${transaction.status}
      ${transaction.targetCardNumber ? `- Target Card Number: ${transaction.targetCardNumber.toString().match(/.{1,4}/g)?.join('_') || transaction.targetCardNumber}` : ""}
    `).join("\n")}
  `.trim();
};
