import { handle } from "../../helpers/error-handler";
import { ZodError } from "zod";
import { Transaction } from "../../types/transaction";

describe("error-handler", () => {
    const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

    afterEach(() => {
        mockConsoleError.mockClear();
    });

    it("should handle ZodError", () => {
        const zodError = new ZodError([
            {
                code: "invalid_type",
                expected: "number",
                received: "string",
                path: [0, "cardNumber"],
                message: "Expected number, received string",
            },
        ]);

        const transactions: Transaction[] = [
            {
                accountName: "John Doe",
                cardNumber: 1234_5678_9012_3456,
                transactionAmount: 100,
                transactionType: "Credit",
                description: "Test transaction",
            },
        ];

        handle(zodError, transactions);

        expect(mockConsoleError).toHaveBeenCalledWith("Validation Error:");
        expect(mockConsoleError).toHaveBeenCalledWith("- Expected number, received string");
        expect(mockConsoleError).toHaveBeenCalledWith("  Invalid transaction:", expect.any(String));
    });

    it("should handle unexpected errors", () => {
        const error = new Error("Unexpected error");

        handle(error);

        expect(mockConsoleError).toHaveBeenCalledWith("Unexpected error:", "Unexpected error");
    });
});
