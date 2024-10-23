import { Action, TransactionState } from "../types/types";

export function transactionReducer(
  state: TransactionState,
  action: Action
): TransactionState {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: [...state.transactions, ...action.payload] };
    case 'SET_PARSED_DATA':
      return { ...state, parsedData: [...state.parsedData, ...action.payload] };
    case 'SET_BROKEN_DATA':
      return { ...state, brokenData: [...state.brokenData, ...action.payload] };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
}
