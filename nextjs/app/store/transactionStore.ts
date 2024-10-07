import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TransactionCollection } from '@/app/lib/Transactions/TransactionCollection';
import { Account } from '@/app/lib/Accounts/Account';
import { Transaction } from '@/app/lib/Transactions/Transaction';
import { ParseError } from '@/app/utils/csvParser';

interface ParseErrorWithFilename extends ParseError {
  filename: string;
}

interface FileStatus {
  filename: string;
  transactionsCount: number;
  errorsCount: number;
}

interface TransactionState {
  transactions: Transaction[]; // Transactions parsed from CSVs
  addTransactions: (newTransactions: Transaction[]) => void;

  fileStatuses: FileStatus[]; // Results of each CSV file's parsing
  addFileStatus: (status: FileStatus) => void;

  accountSummary: Account[]; // getAccountSummary() from accountManager
  updateAccountSummary: () => void;

  errors: ParseErrorWithFilename[];
  addErrors: (filename: string, newErrors: ParseError[]) => void;

  collectionsSummary: { accountName: string; cardNumber: string; balance: number }[]; // getCollectionsSummary() from accountManager

  resetFilePool: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  // Use local storage to persist the state
  persist(
    (set, get) => ({
      transactions: [],
      fileStatuses: [],
      accountSummary: [],
      collectionsSummary: [],
      addTransactions: (newTransactions) => {
        set((state) => {
          const updatedTransactions = [...state.transactions, ...newTransactions];
          const transactionCollection = new TransactionCollection();
          transactionCollection.addTransactions(updatedTransactions);
          return {
            transactions: updatedTransactions,
            accountSummary: transactionCollection.getAccountSummary(),
            collectionsSummary: transactionCollection.getCollectionsSummary(),
          };
        });
      },
      addFileStatus: (status) => set((state) => ({ fileStatuses: [...state.fileStatuses, status] })),
      updateAccountSummary: () => {
        const { transactions } = get();
        const transactionCollection = new TransactionCollection();
        transactionCollection.addTransactions(transactions);
        set({
          accountSummary: transactionCollection.getAccountSummary(),
          collectionsSummary: transactionCollection.getCollectionsSummary(),
        });
      },
      resetFilePool: () => set({
        transactions: [],
        fileStatuses: [],
        accountSummary: [],
        collectionsSummary: [],
        errors: [],
      }),
      errors: [],
      addErrors: (filename, newErrors) => set((state) => ({
        errors: [...state.errors, ...newErrors.map(error => ({ ...error, filename }))]
      })),
    }),
    {
      name: 'transaction-storage',
    }
  )
);