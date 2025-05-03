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
    const csvContent =
      "cardNumber,amount,timestamp\n4111111111111111,100.50,2025-05-01T10:00:00Z";
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

  it("should parse and categorize XML transactions", async () => {
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
    const csvContent =
      "cardNumber,amount,timestamp\n123,invalid,2025-05-01T10:00:00Z";
    const file = mockFile("invalid.csv", "text/csv", csvContent);

    await TransactionsService.handleFileProcessing([file]);

    const rejectedTransactions = TransactionsService.getRejectedTransactions();
    expect(rejectedTransactions.length).toBe(1);
  });

  it("should clear all transactions and broadcast success event", async () => {
    const spyBroadcast = spyOn(TransactionsService, "broadcast");

    await TransactionsService.handleTransactionDeletion();

    expect(TransactionsService.getTransactionsByCard()).toEqual({});
    expect(TransactionsService.getTransactionsByCardType()).toEqual({});
    expect(TransactionsService.getTransactionsByDay()).toEqual({});
    expect(TransactionsService.getRejectedTransactions()).toEqual([]);
    expect(spyBroadcast).toHaveBeenCalledWith("TransactionsDeleteSuccess", {
      status: "success",
    });
  });

  it("should throw an error for unsupported file format", async () => {
    const spyBroadcast = spyOn(TransactionsService, "broadcast");
    const unsupportedFile = mockFile(
      "unsupported.txt",
      "text/plain",
      "unsupported content",
    );

    await TransactionsService.handleFileProcessing([unsupportedFile]);
    expect(spyBroadcast).toHaveBeenCalledWith("TransactionsUploadFail", {
      status: "error",
    });
  });

  it("should categorize transactions by card type", async () => {
    const csvContent =
      "cardNumber,amount,timestamp\n4111111111111111,100.50,2025-05-01T10:00:00Z";
    const file = mockFile("transactions.csv", "text/csv", csvContent);

    await TransactionsService.handleFileProcessing([file]);

    const transactionsByCardType =
      TransactionsService.getTransactionsByCardType();
    expect(transactionsByCardType["Visa"]).toBe(100.5);
  });

  it("should categorize transactions by day", async () => {
    const csvContent =
      "cardNumber,amount,timestamp\n4111111111111111,100.50,2025-05-01T10:00:00Z";
    const file = mockFile("transactions.csv", "text/csv", csvContent);

    await TransactionsService.handleFileProcessing([file]);

    const transactionsByDay = TransactionsService.getTransactionsByDay();
    expect(transactionsByDay["2025-05-01"]).toBe(100.5);
  });

  it("should clear all internal data structures", () => {
    TransactionsService.clearTransactions();

    expect(TransactionsService.getTransactionsByCard()).toEqual({});
    expect(TransactionsService.getTransactionsByCardType()).toEqual({});
    expect(TransactionsService.getTransactionsByDay()).toEqual({});
    expect(TransactionsService.getRejectedTransactions()).toEqual([]);
  });
});
