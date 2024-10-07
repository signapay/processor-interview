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
        this.accountManager.updateAccounts([transaction]);
    }

    // Add multiple transactions to the collection
    addTransactions(transactions: Transaction[]): void {
        this.transactions.push(...transactions);
        this.accountManager.updateAccounts(transactions);
    }

    getTransactions(): Transaction[] {
        return this.transactions;
    }

    getAccountSummary(): Account[] {
        return this.accountManager.getAccountSummary();
    }

    getAccountByName(name: string): Account | undefined {
        return this.accountManager.getAccountByName(name);
    }
}