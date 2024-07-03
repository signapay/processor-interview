
export interface Transaction {
    account_name: string;
    card_number: number;
    amount: number;
    transaction_type: string;
    description: string;
    target_card_number: number;
    error_msg?: string
  };

  export interface AccountDetails {
    account_name: string;
    card_number: number;
    balance_amt: number;
  };