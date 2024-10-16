import { transactionsSchema, fileUploadSchema } from "../../helpers/validate-input";
import { ZodError } from "zod";

describe("validate-input", () => {

    describe("transactionsSchema", () => {
        it("should validate correct transactions", () => {
            const validTransactions = [
                {
                    accountName: "John Doe",
                    cardNumber: 1234_5678_9012_3456,
                    transactionAmount: 100.50,
                    transactionType: "Credit",
                    description: "Test transaction",
                },
            ];

            expect(() => transactionsSchema(validTransactions)).not.toThrow();
        });

        it("should throw ZodError for invalid transactions", () => {
            const invalidTransactions = [
                {
                    accountName: "John Doe",
                    cardNumber: "invalid",
                    transactionAmount: "100.50",
                    transactionType: "Invalid",
                    description: 123,
                },
            ];

            expect(() => transactionsSchema(invalidTransactions)).toThrow(ZodError);
        });
    });

    describe("fileUploadSchema", () => {
        it("should validate correct file upload", () => {
            const validFileUpload = {
                file: Buffer.from("test content"),
            };

            expect(() => fileUploadSchema(validFileUpload)).not.toThrow();
        });

        it("should throw ZodError for invalid file upload", () => {
            const invalidFileUpload = {
                file: "not a buffer",
            };

            expect(() => fileUploadSchema(invalidFileUpload)).toThrow(ZodError);
        });
    });
});
