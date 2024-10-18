import { Action, TransactionState } from "./types";

export const transactionReducer = (state: TransactionState, action: Action): TransactionState => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_PARSED_DATA':
      return { ...state, parsedData: action.payload };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
};
