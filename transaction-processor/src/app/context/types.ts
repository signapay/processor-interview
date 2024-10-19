import { Dispatch } from 'react';

export interface TransactionContextType {
  state: {
    transactions: any[];
    parsedData: any[];
    currentPage: string;
  };
  dispatch: Dispatch<Action>;
}

export interface TransactionState {
  transactions: any[];
  parsedData: any[];
  currentPage: string;
}

export type Action =
  | { type: 'SET_TRANSACTIONS'; payload: any[] }
  | { type: 'SET_PARSED_DATA'; payload: any[] }
  | { type: 'SET_PAGE'; payload: string };