import { createContext, useState, useContext, ReactNode } from 'react';
import { TransactionContextType } from './types';

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  console.log('transactions', transactions);


  return (
    <TransactionContext.Provider value={{ transactions, setTransactions }
    }>
      {children}
    </TransactionContext.Provider>
  );
};
