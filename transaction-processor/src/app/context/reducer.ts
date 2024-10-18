'use client'

interface TransactionState {
  transactions: any[];  // Adjust types as needed
  parsedData: any[];
  currentPage: string;  // Add this for managing the displayed page
}

type Action =
  | { type: 'SET_TRANSACTIONS'; payload: any[] }
  | { type: 'SET_PARSED_DATA'; payload: any[] }
  | { type: 'SET_PAGE'; payload: string };

const transactionReducer = (state: TransactionState, action: Action): TransactionState => {
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
