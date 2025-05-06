import { describe, it, expect, mock, spyOn, beforeEach } from "bun:test";
import { processTransactionFile } from "./transactions";

import * as dbModule from "../db";
import type { NewTransaction, NewRejectedTransaction } from "../db";
import type { PgTable } from "drizzle-orm/pg-core";

const mockOnConflictDoNothing = mock(async () => {
  return;
});

const mockValues = mock(
  (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _data: NewTransaction[] | NewRejectedTransaction[],
  ): { onConflictDoNothing: typeof mockOnConflictDoNothing } => {
    return {
      onConflictDoNothing: mockOnConflictDoNothing,
    };
  },
);

const mockInsertBuilder = {
  values: mockValues,
  table: {} as PgTable,
  session: {},
  dialect: {},
  overridingSystemValue: () => mockInsertBuilder,
  select: () => mockInsertBuilder,
};

const mockInsert = spyOn(dbModule.db, "insert").mockImplementation(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_table: PgTable) => {
    return mockInsertBuilder as never;
  },
);

describe("Transaction Processing", () => {
  beforeEach(() => {
    mockInsert.mockClear();
    mockValues.mockClear();
    mockOnConflictDoNothing.mockClear();
  });

  it("should throw an error for an unsupported file type", async () => {
    const mockUnsupportedContent = "This is not a CSV content";
    const mockFile = new File([mockUnsupportedContent], "transactions.txt", {
      type: "text/plain",
    });

    expect(processTransactionFile(mockFile)).rejects.toThrowError(
      "transactions.txt: Error: File type not supported: text/plain;charset=utf-8",
    );

    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("should process a JSON file, identify valid/invalid transactions, and call db insert correctly", async () => {
    const mockJsonData = [
      {
        cardNumber: "49927398716",
        timestamp: "2025-03-01T10:00:00Z",
        amount: "200.25",
      },
      {
        cardNumber: "378282246310005",
        timestamp: "2025-03-01T10:01:00Z",
        amount: "50.50",
      },
      { cardNumber: "123", timestamp: "2025-03-01T10:02:00Z", amount: "10.00" },
      {
        cardNumber: "5412345678901234",
        timestamp: "2025-03-01T10:03:00Z",
        amount: "75.00",
      },
    ];
    const mockFileContent = JSON.stringify(mockJsonData);
    const mockFile = new File([mockFileContent], "transactions.json", {
      type: "application/json",
    });

    const result = await processTransactionFile(mockFile);

    expect(result).toEqual({
      message: "File transactions.json processed with success.",
    });

    expect(mockInsert).toHaveBeenCalledTimes(2);

    const insertCallArgs = mockInsert.mock.calls;
    const valuesCallArgs = mockValues.mock.calls;

    const validTransactionCallData = valuesCallArgs[0]?.[0] as
      | NewTransaction[]
      | undefined;
    const rejectedTransactionCallData = valuesCallArgs[1]?.[0] as
      | NewRejectedTransaction[]
      | undefined;

    expect(insertCallArgs[0]?.[0]).toBe(dbModule.transactions);
    expect(validTransactionCallData).toBeDefined();
    expect(validTransactionCallData).toHaveLength(2);
    expect(validTransactionCallData![0]).toEqual({
      cardNumber: "49927398716",
      cardType: "Visa",
      timestamp: new Date("2025-03-01T10:00:00Z"),
      amount: "200.25",
    });
    expect(validTransactionCallData![1]).toEqual({
      cardNumber: "378282246310005",
      cardType: "Amex",
      timestamp: new Date("2025-03-01T10:01:00Z"),
      amount: "50.50",
    });

    expect(insertCallArgs[1]?.[0]).toBe(dbModule.rejectedTransactions);
    expect(rejectedTransactionCallData).toBeDefined();
    expect(rejectedTransactionCallData).toHaveLength(2);
    expect(rejectedTransactionCallData).toEqual([
      {
        cardNumber: "123",
        timestamp: "2025-03-01T10:02:00Z",
        amount: "10.00",
      },
      {
        cardNumber: "5412345678901234",
        timestamp: "2025-03-01T10:03:00Z",
        amount: "75.00",
      },
    ]);

    expect(mockOnConflictDoNothing).toHaveBeenCalledTimes(2);
  });

  it("should process a CSV file, identify valid/invalid transactions, and call db insert correctly", async () => {
    const mockCsvContent = `CardNumber,Timestamp,Amount
49927398716,2025-01-01T10:00:00Z,100.50
5412345678901234,2025-01-01T10:01:00Z,75.00
378282246310005,2025-01-01T10:02:00Z,12.34
6011000000000000,2025-01-01T10:03:00Z,99.99
4111111111111111,2025-01-01T10:04:00Z,1.00
5555555555555555,2025-01-01T10:05:00Z,25.00
4000000000000008,2025-01-01T10:06:00Z,50.25
49927398717,2025-01-01T10:07:00Z,200.00
1234567890123456,2025-01-01T10:08:00Z,15.00
123,2025-01-01T10:09:00Z,5.00
`;
    const mockFile = new File([mockCsvContent], "transactions.csv", {
      type: "text/csv",
    });

    const result = await processTransactionFile(mockFile);

    expect(result).toEqual({
      message: "File transactions.csv processed with success.",
    });

    expect(mockInsert).toHaveBeenCalledTimes(2);

    const insertCallArgs = mockInsert.mock.calls;
    const valuesCallArgs = mockValues.mock.calls;

    const validTransactionCallIndex = insertCallArgs.findIndex(
      (args) => args[0] === dbModule.transactions,
    );
    expect(validTransactionCallIndex).toBeGreaterThan(-1);

    expect(valuesCallArgs.length).toBeGreaterThan(0);

    const validTransactionsData = (valuesCallArgs[0]?.[0] ||
      []) as NewTransaction[];
    expect(validTransactionsData).toHaveLength(3);

    expect(validTransactionsData[0]).toEqual({
      cardNumber: "49927398716",
      cardType: "Visa",
      timestamp: new Date("2025-01-01T10:00:00Z"),
      amount: "100.50",
    });

    expect(validTransactionsData.map((t) => t.cardType)).toEqual([
      "Visa",
      "Amex",
      "Visa",
    ]);

    const rejectedTransactionCallIndex = insertCallArgs.findIndex(
      (args) => args[0] === dbModule.rejectedTransactions,
    );
    expect(rejectedTransactionCallIndex).toBeGreaterThan(-1);

    const rejectedTransactionsData = (valuesCallArgs[1]?.[0] ||
      []) as NewRejectedTransaction[];
    expect(rejectedTransactionsData).toHaveLength(7);

    expect(rejectedTransactionsData).toEqual([
      {
        cardNumber: "5412345678901234",
        timestamp: "2025-01-01T10:01:00Z",
        amount: "75.00",
      },
      {
        cardNumber: "6011000000000000",
        timestamp: "2025-01-01T10:03:00Z",
        amount: "99.99",
      },
      {
        cardNumber: "5555555555555555",
        timestamp: "2025-01-01T10:05:00Z",
        amount: "25.00",
      },
      {
        cardNumber: "4000000000000008",
        timestamp: "2025-01-01T10:06:00Z",
        amount: "50.25",
      },
      {
        cardNumber: "49927398717",
        timestamp: "2025-01-01T10:07:00Z",
        amount: "200.00",
      },
      {
        cardNumber: "1234567890123456",
        timestamp: "2025-01-01T10:08:00Z",
        amount: "15.00",
      },
      {
        cardNumber: "123",
        timestamp: "2025-01-01T10:09:00Z",
        amount: "5.00",
      },
    ]);

    expect(mockOnConflictDoNothing).toHaveBeenCalledTimes(2);
  });

  it("should process an XML file, identify valid/invalid transactions, and call db insert correctly", async () => {
    const mockXmlContent = `
<transactions>
  <transaction>
    <cardNumber>49927398716</cardNumber>
    <timestamp>2025-04-01T10:00:00Z</timestamp>
    <amount>300.00</amount>
  </transaction>
  <transaction>
    <cardNumber>378282246310005</cardNumber>
    <timestamp>2025-04-01T10:01:00Z</timestamp>
    <amount>75.25</amount>
  </transaction>
  <transaction>
    <cardNumber>789</cardNumber>
    <timestamp>2025-04-01T10:02:00Z</timestamp>
    <amount>20.50</amount>
  </transaction>
  <transaction>
    <cardNumber>5412345678901234</cardNumber>
    <timestamp>2025-04-01T10:03:00Z</timestamp>
    <amount>90.00</amount>
  </transaction>
</transactions>
    `.trim();
    const mockFile = new File([mockXmlContent], "transactions.xml", {
      type: "application/xml",
    });

    const result = await processTransactionFile(mockFile);

    expect(result).toEqual({
      message: "File transactions.xml processed with success.",
    });

    expect(mockInsert).toHaveBeenCalledTimes(2);

    const insertCallArgs = mockInsert.mock.calls;
    const valuesCallArgs = mockValues.mock.calls;

    const validTransactionCallData = valuesCallArgs[0]?.[0] as
      | NewTransaction[]
      | undefined;
    const rejectedTransactionCallData = valuesCallArgs[1]?.[0] as
      | NewRejectedTransaction[]
      | undefined;

    expect(insertCallArgs[0]?.[0]).toBe(dbModule.transactions);
    expect(validTransactionCallData).toBeDefined();
    expect(validTransactionCallData).toHaveLength(2);
    expect(validTransactionCallData![0]).toEqual({
      cardNumber: "49927398716",
      cardType: "Visa",
      timestamp: new Date("2025-04-01T10:00:00Z"),
      amount: "300.00",
    });
    expect(validTransactionCallData![1]).toEqual({
      cardNumber: "378282246310005",
      cardType: "Amex",
      timestamp: new Date("2025-04-01T10:01:00Z"),
      amount: "75.25",
    });

    expect(insertCallArgs[1]?.[0]).toBe(dbModule.rejectedTransactions);
    expect(rejectedTransactionCallData).toBeDefined();
    expect(rejectedTransactionCallData).toHaveLength(2);
    expect(rejectedTransactionCallData).toEqual([
      {
        cardNumber: "789",
        timestamp: "2025-04-01T10:02:00Z",
        amount: "20.5",
      },
      {
        cardNumber: "5412345678901234",
        timestamp: "2025-04-01T10:03:00Z",
        amount: "90",
      },
    ]);

    expect(mockOnConflictDoNothing).toHaveBeenCalledTimes(2);
  });
});
