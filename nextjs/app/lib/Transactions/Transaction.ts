export type TransactionType = 'Credit' | 'Debit' | 'Transfer';

/**
 * All transactions have the following properties
 */
export interface BaseTransactionData {
    name: string;
    cardNumber: number;
    amount: number;
    description: string;
}

/**
 * Three types of transactions, Credit, Debit...
 */
export interface CreditDebitTransactionData extends BaseTransactionData {
    type: 'Credit' | 'Debit';
}


/**
 * And Transfers which also have a target card number
 */
export interface TransferTransactionData extends BaseTransactionData {
    type: 'Transfer';
    targetCardNumber: number;
}

// Union type for all transaction types which can either be Credit/Debit or Transfer
export type TransactionData = CreditDebitTransactionData | TransferTransactionData;

export class Transaction {
    private data: TransactionData;

    constructor(data: TransactionData) {
        this.data = data;
    }

    get name(): string {
        return this.data.name;
    }

    get cardNumber(): number {
        return this.data.cardNumber;
    }

    get amount(): number {
        return this.data.amount;
    }

    get type(): TransactionType {
        return this.data.type;
    }

    get description(): string {
        return this.data.description;
    }

    get targetCardNumber(): number | undefined {
        return this.data.type === 'Transfer' ? this.data.targetCardNumber : undefined;
    }

    toJSON(): string {
        return JSON.stringify(this.data);
    }
}