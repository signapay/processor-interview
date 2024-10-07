import { Transaction } from "@/app/lib/Transactions/Transaction";
import { Account } from "@/app/lib/Accounts/Account";

export class AccountManager {
    private accounts: Map<string, Account> = new Map();

    updateAccounts(transactions: Transaction[]): void {
        for (const transaction of transactions) {
            this.updateAccount(transaction);
        }
    }

    private updateAccount(transaction: Transaction): void {

        // Try to fetch an existing account from our map by name
        let account = this.accounts.get(transaction.name);

        // If we don't have an account, create one
        if (!account) { 
            account = { name: transaction.name, cards: [] };
            this.accounts.set(transaction.name, account);
        }

        // Try to find a card in this account with this card number
        let card = account.cards.find(c => c.cardNumber === transaction.cardNumber);

        // If we don't have a card, create one with a balance of 0
        if (!card) {
            card = { cardNumber: transaction.cardNumber, balance: 0 };
            account.cards.push(card);
        }

        // Process the actual transaction

        if (transaction.type === 'Transfer') {
            /**
             * Per Josh & I's discusson on Mon Oct 7, 2024 concerning duplicate Card Numbers across accounts,
             * Transfers should work in the following way:
             * 
             * - If the Target Card Number already exists in the account that is performing the transfer, transfer to that Account.Card Number
             * - If not, find the first existence of that Card Number in all Accounts *alphabetically*, transfer to that one
             * - (Assumed) if it doesn't exist, consider the operation an Invalid Transaction
             * 
             * The current code below simply silos transfers to the account they are being made from by splitting them into a Credit / Debit against the same account.
             */

            // TODO: Implement the updated Transfer logic ^^^

            // Debit cardNumber
            this.updateAccount(new Transaction({
                name: transaction.name,
                cardNumber: transaction.cardNumber,
                amount: transaction.amount,
                type: 'Debit',
                description: 'Transfer reconciliation',
            }));

            // Credit targetCardNumber
            this.updateAccount(new Transaction({
                name: transaction.name,
                cardNumber: transaction.targetCardNumber || 0, // TODO: Fix this hack
                amount: transaction.amount,
                type: 'Credit',
                description: 'Transfer reconciliation',
            }));

        } else {
            if (transaction.type === 'Credit') {

                card.balance = this.roundCurrency(card.balance + transaction.amount);

            } else if (transaction.type === 'Debit') {

                card.balance = this.roundCurrency(card.balance - transaction.amount);
            }
        }
    }

    // Round the currency to 2 decimal places and return as a number
    private roundCurrency(amount: number): number {
        return Number(amount.toFixed(2));
    }

    getAccountSummary(): Account[] {
        return Array.from(this.accounts.values());
    }

    // TODO: Possibly refactor, this was hasty
    getCollectionsSummary(): { accountName: string; cardNumber: string; balance: number }[] {
        return Array.from(this.accounts.values())
            .filter(account => account.cards.some(card => card.balance < 0))
            .flatMap(account => account.cards
                .filter(card => card.balance < 0)
                .map(card => ({
                    accountName: account.name,
                    cardNumber: card.cardNumber.toString(),
                    balance: card.balance
                }))
            );
    }

}