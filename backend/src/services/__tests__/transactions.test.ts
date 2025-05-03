import { describe, it, expect, beforeEach, spyOn } from "bun:test";
import { TransactionsService } from "../transactions";

spyOn(TransactionsService, "applyDelay").mockImplementation(async () => {});

const mockFile = (name: string, type: string, content: string): File => {
  return new File([content], name, { type });
};

describe("TransactionsService", () => {
  beforeEach(() => {
    TransactionsService.clearTransactions();
  });

  it("should parse and categorize CSV transactions", async () => {
    const csvContent = "cardNumber,amount,timestamp\n4111111111111111,100.50,2025-05-01T10:00:00Z";
    const file = mockFile("transactions.csv", "text/csv", csvContent);

    await TransactionsService.handleFileProcessing([file]);

    const transactionsByCard = TransactionsService.getTransactionsByCard();
    expect(transactionsByCard["4111111111111111"]).toBe(100.5);
  });

  it("should parse and categorize JSON transactions", async () => {
    const jsonContent = JSON.stringify([
      {
        cardNumber: "4111111111111111",
        amount: 200.75,
        timestamp: "2025-05-02T12:00:00Z",
      },
    ]);
    const file = mockFile("transactions.json", "application/json", jsonContent);

    await TransactionsService.handleFileProcessing([file]);

    const transactionsByCard = TransactionsService.getTransactionsByCard();
    expect(transactionsByCard["4111111111111111"]).toBe(200.75);
  });

  it.only("should parse and categorize XML transactions", async () => {
    const xmlContent = `
      <transactions>
        <transaction>
          <cardNumber>4111111111111111</cardNumber>
          <amount>300.25</amount>
          <timestamp>2025-05-03T14:00:00Z</timestamp>
        </transaction>
      </transactions>
    `;
    const file = mockFile("transactions.xml", "application/xml", xmlContent);

    await TransactionsService.handleFileProcessing([file]);

    const transactionsByCard = TransactionsService.getTransactionsByCard();
    expect(transactionsByCard["4111111111111111"]).toBe(300.25);
  });

  it("should reject invalid transactions", async () => {
    const csvContent = "cardNumber,amount,timestamp\n123,invalid,2025-05-01T10:00:00Z";
    const file = mockFile("invalid.csv", "text/csv", csvContent);

    await TransactionsService.handleFileProcessing([file]);

    const rejectedTransactions = TransactionsService.getRejectedTransactions();
    expect(rejectedTransactions.length).toBe(1);
  });
});