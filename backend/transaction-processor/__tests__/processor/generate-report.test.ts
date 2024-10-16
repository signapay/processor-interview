import { generateReport, calculateTotalAmount } from "../../features/generate-report";
import { Transaction } from "../../types/transaction";

describe("Generating Report", () => {
    it('should calculate total amount', () => {
        const mockProcessedTransactions: Transaction[] = [
            {
                accountName: "John Doe",
                cardNumber: 1234_5678_9012_3456,
                transactionAmount: 100,
                transactionType: "Credit",
                description: "Test transaction 1",
            },
            {
                accountName: "Jane Smith",
                cardNumber: 9876_5432_1098_7654,
                transactionAmount: 200,
                transactionType: "Debit",
                description: "Test transaction 2",
            },
        ];
        const result = calculateTotalAmount(mockProcessedTransactions);
        expect(result).toBe(300);
    });

    it("should generate a report correctly", () => {
        const mockProcessedTransactions: Transaction[] = [
            {
                accountName: "John Doe",
                cardNumber: 1234_5678_9012_3456,
                transactionAmount: 100,
                transactionType: "Credit",
                description: "Test transaction 1",
            },
            {
                accountName: "Jane Smith",
                cardNumber: 9876_5432_1098_7654,
                transactionAmount: 200,
                transactionType: "Debit",
                description: "Test transaction 2",
            },
        ];
        const result = generateReport(mockProcessedTransactions);
        expect(result).toContain("Transaction Report");
        expect(result).toContain("Total transactions: 2");
        expect(result).toContain("Total amount: $300.00");
        expect(result).toContain("John Doe");
        expect(result).toContain("Jane Smith");
    });

    it("should handle empty transaction list", () => {
        const result = generateReport([]);
        expect(result).toContain("Transaction Report");
        expect(result).toContain("Total transactions: 0");
        expect(result).toContain("Total amount: $0.00");
    });
});
