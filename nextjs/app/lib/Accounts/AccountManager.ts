import { Transaction } from "@/app/lib/Transactions/Transaction";
import { Account } from "@/app/lib/Accounts/Account";

export class AccountManager {
    private accounts: Map<string, Account> = new Map();

    updateAccounts(transactions: Transaction[]): void {
        for (const transaction of transactions) {
            this.updateAccount(transaction);
        }
    }

    /**
     * Per Josh & I's discusson on Mon Oct 7, 2024 concerning duplicate Card Numbers across accounts,
     * 
     * Transfers should be made in the following way:
     * 
     * (1. Local) - If the Target Card Number already exists in the account that is performing the transfer, transfer to that Account.Card Number
     * (2. External, Alphabetically) - If not local, find the first existence of that Card Number in all Accounts *alphabetically*, transfer to that if found
     * (3. Local Fallback) - (Assumed) if we don't have an external just fall back to creating a new card in the local account.
     * 
     * This logic can be adjusted to fit priority changes.
     * 
     */
    private determineTransferAccount(fromAccount: Account, toCardNumber: number): string {

        // Check if card is already in the local account
        const cardExistsLocally = fromAccount.cards.find(c => c.cardNumber === toCardNumber);

        if (cardExistsLocally) {
            return fromAccount.name;
        }

        // If not, check if the card exists in any other account alphabetically
        const sortedAccounts = Array.from(this.accounts.values()).sort((a, b) => a.name.localeCompare(b.name));
        const externalAccountWithCard = sortedAccounts.find(a => a.cards.find(c => c.cardNumber === toCardNumber));

        if (externalAccountWithCard) {
            return externalAccountWithCard.name;
        }

        // Fallback to local account
        return fromAccount.name;

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

        // Process the transaction

        if (transaction.type === 'Transfer') {

            // This SHOULD be taken care of during parsing, but...
            if (! transaction.targetCardNumber) {
                throw new Error('Transfer transaction must specify a targetCardNumber');
            }

            // Debit the transferring account
            // TODO: Implement this in a way to roll back if the credit fails
            this.updateAccount(new Transaction({
                name: transaction.name,
                cardNumber: transaction.cardNumber,
                amount: transaction.amount,
                type: 'Debit',
                description: 'Transfer reconciliation',
            }));

            // Next, locate the target Account and Card Number

            const creditAccountName = this.determineTransferAccount(account, transaction.targetCardNumber);

            // Credit targetCardNumber
            this.updateAccount(new Transaction({
                name: creditAccountName,
                cardNumber: transaction.targetCardNumber,
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