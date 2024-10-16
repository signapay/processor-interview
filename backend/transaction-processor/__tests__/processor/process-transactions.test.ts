import { processTransaction, processTransactions } from "../../features/process-transactions";
import { Transaction } from "../../types/transaction";

describe("Transaction Processing", () => {
    describe("processTransaction", () => {
        it("should process a single transaction", () => {
            const transaction: Transaction = {
                accountName: "John Doe",
                cardNumber: 1234_5678_9012_3456,
                transactionAmount: 100,
                transactionType: "Credit",
                description: "Test transaction"
            };
            const result = processTransaction(transaction);
            expect(result).toEqual({
                ...transaction,
                cardNumber: 3456,
                processedAt: expect.any(String),
                status: "processed",
            });
        });
    });
    describe("processTransactions", () => {
        it("should process multiple transactions", () => {
            const transactions: Transaction[] = [
                {
                    accountName: "John Doe",
                    cardNumber: 3456,
                    transactionAmount: 100,
                    transactionType: "Credit",
                    description: "Test transaction 1"
                },
                {
                    accountName: "Jane Smith",
                    cardNumber: 9876_5432_1098_7654,
                    transactionAmount: 200,
                    transactionType: "Debit",
                    description: "Test transaction 2"
                },
            ];
            const result = processTransactions(transactions);
            expect(result).toHaveLength(2);
            result.forEach((transaction) => {
                expect(transaction).toHaveProperty("processedAt");
                expect(transaction).toHaveProperty("status", "processed");
            });
        });
    });
});
