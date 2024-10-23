import { TransactionState, Action } from "../types/types";

export const initialState: TransactionState = {
  transactions: [],
  parsedData: [],
  brokenData: [],
  currentPage: "All Transactions",
};

export function transactionReducer(
  state: TransactionState,
  action: Action
): TransactionState {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: [...action.payload, ...state.transactions],
      };
    case "SET_PARSED_DATA":
      return { ...state, parsedData: [...action.payload, ...state.parsedData] };
    case "SET_BROKEN_DATA":
      return { ...state, brokenData: [...action.payload, ...state.brokenData] };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "RESET_APP":
      return initialState;
    default:
      return state;
  }
}
