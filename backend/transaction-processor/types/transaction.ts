export type Transaction = {
  accountName: string; 
  cardNumber: number;
  transactionAmount: number;
  transactionType: TransactionType;
  description: string;
  targetCardNumber?: number;
  processedAt?: string;
  status?: string;
}

export type TransactionType = "Credit" | "Debit" | "Transfer";
