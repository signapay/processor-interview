import { readTransactionsFromCsvFile } from "../../features/file-reader";
import fs from "fs";
import { Readable } from "stream";

jest.mock("fs");

describe("Reading Transactions", () => {
  it("should read transactions from a CSV file", async () => {
    const mockCsvContent = `accountName,cardNumber,transactionAmount,transactionType,description
John Doe,1234567890123456,100.50,Credit,Test transaction 1
Jane Smith,9876543210987654,200.75,Debit,Test transaction 2`;

    const mockReadStream = Readable.from(mockCsvContent);
    (fs.createReadStream as jest.Mock).mockReturnValue(mockReadStream);

    const mockParsedTransactions = [
      {
        accountName: "John Doe",
        cardNumber: 1234567890123456,
        transactionAmount: 100.50,
        transactionType: "Credit",
        description: "Test transaction 1"
      },
      {
        accountName: "Jane Smith",
        cardNumber: 9876543210987654,
        transactionAmount: 200.75,
        transactionType: "Debit",
        description: "Test transaction 2"
      }
    ];

    const result = await readTransactionsFromCsvFile("transactions/test.csv");

    expect(result).toEqual(mockParsedTransactions);
  });

  it("should throw an error if file reading fails", async () => {
    (fs.createReadStream as jest.Mock).mockImplementation(() => {
      throw new Error("File not found");
    });

    await expect(readTransactionsFromCsvFile("transactions/non-existent.csv")).rejects.toThrow(
      "File not found"
    );
  });
});
