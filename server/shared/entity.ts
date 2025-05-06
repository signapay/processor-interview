export interface Transaction {
  id?: string;
  cardNumber?: string;
  timestamp?: string;
  amount?: number;
  cardType?: string;
  isValid?: boolean;
  rejectionReason?: string;
}

export interface TransactionSummary {
  totalAmount: number;
  count: number;
}

export interface CardSummary {
  [cardNumber: string]: TransactionSummary;
}

export interface CardTypeSummary {
  [cardType: string]: TransactionSummary;
}

export interface DailySummary {
  [date: string]: TransactionSummary;
}

export interface TransactionsReport {
  byCard: CardSummary;
  byCardType: CardTypeSummary;
  byDay: DailySummary;
  rejectedTransactions: Transaction[];
}

export type SupportedFileType = 'json' | 'csv' | 'xml';
