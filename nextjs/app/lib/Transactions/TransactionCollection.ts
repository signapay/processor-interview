import { Transaction } from '@/app/lib/Transactions/Transaction';
import { AccountManager } from '@/app/lib/Accounts/AccountManager';
import { Account } from '@/app/lib/Accounts/Account';

export class TransactionCollection {
    private transactions: Transaction[] = [];
    private accountManager: AccountManager;

    constructor() {
        this.accountManager = new AccountManager();
    }

    // Add one transaction to the collection
    addTransaction(transaction: Transaction): void {
        this.transactions.push(transaction);
        
        // TODO: Too repeaty
        this.accountManager.updateAccounts([transaction]);
    }

    // Add multiple transactions to the collection
    addTransactions(transactions: Transaction[]): void {
        this.transactions.push(...transactions);

        // TODO: Too repeaty
        this.accountManager.updateAccounts(transactions);
    }

    getTransactions(): Transaction[] {
        return this.transactions;
    }

    // TODO: Reevaluate pass-throughs to AccountManager?
    getAccountSummary(): Account[] {
        return this.accountManager.getAccountSummary();
    }

    getCollectionsSummary(): { accountName: string; cardNumber: string; balance: number }[] {
        return this.accountManager.getCollectionsSummary();
    }

}