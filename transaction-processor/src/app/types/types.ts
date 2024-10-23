import { Dispatch } from 'react';

export interface Transaction {
  accountName: string;
  cardNumber: string;
  transactionAmount: number;
  transactionType: string;
  description: string;
  targetCardNumber?: string;
}

export interface CardBalance {
  cardNumber: string;
  accountBalance: number;
}

export interface TransactionContextType {
  state: {
    transactions: Transaction[];
    parsedData: Transaction[];
    brokenData: string[][];
    currentPage: string;
  };
  dispatch: Dispatch<Action>;
}

export interface TransactionState {
  transactions: Transaction[];
  parsedData: Transaction[];
  brokenData: string[][];
  currentPage: string;
}

export type Action =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_PARSED_DATA'; payload: Transaction[] }
  | { type: 'SET_BROKEN_DATA'; payload: string[][] }
  | { type: 'SET_PAGE'; payload: string };