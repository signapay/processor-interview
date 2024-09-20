export interface Transaction {
  accountName: string;
  cardNumber: string;
  amount: string;
  type?: "Credit" | "Debit" | "Transfer";
  description?: string;
  targetCardNumber?: string;
}

export type Account = {
  accountName: string;
  cards: { [cardNumber: string]: number };
  amount?: number;
  balance?: any;
};

export interface BadTransaction {
  error?: string;
  rawData?: Transaction;
  transactionAmount?: string;
  cardNumber?: string;
  accountName?: string;
  description?: string;
  amount?: number;
}

export interface ReportData {
  accounts: Account[];
  collections: Account[];
  badTransactions: BadTransaction[];
  totalPages: number;
}

export interface FileItem {
  name?: string;
  status?: "loading" | "complete" | "error";
  files?: string;
}

export type TabsProps = {
  activeTab: "accounts" | "collections" | "badTransactions";
  onTabChange: (tab: "accounts" | "collections" | "badTransactions") => void;
};

export type Tab = "accounts" | "collections" | "badTransactions";

export type GroupedTransactions = {
  [accountName: string]: Transaction[];
};
