import { createContext, useReducer, useContext, ReactNode } from "react";
import { TransactionContextType } from "../types/types";
import { transactionReducer, initialState } from "./reducer";

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactionContext must be used within a TransactionProvider");
  }
  return context;
};

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
};
