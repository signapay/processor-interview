import { Dispatch, SetStateAction } from "react";

export interface TransactionContextType {
  transactions: any[]; // Adjust this any
  setTransactions: Dispatch<SetStateAction<any[]>>
}