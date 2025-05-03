import { describe, expect, it, spyOn } from "bun:test";
import { Elysia } from "elysia";
import { transactionsRoute } from "@/src/api/routes/transactions";
import { TransactionsService } from "@/src/services/transactions";

describe("Transactions Route", () => {
  const app = new Elysia().use(transactionsRoute);

  it("should return transactions by card", async () => {
    spyOn(TransactionsService, "getTransactionsByCard").mockReturnValueOnce({});

    const response = await app
      .handle(new Request("http://localhost/transactions/by-card"))
      .then((res) => res.json());

    expect(response).toEqual({});
  });

  it("should return transactions by card type", async () => {
    spyOn(TransactionsService, "getTransactionsByCardType").mockReturnValueOnce(
      {},
    );

    const response = await app
      .handle(new Request("http://localhost/transactions/by-card-type"))
      .then((res) => res.json());

    expect(response).toEqual({});
  });

  it("should return transactions by day", async () => {
    spyOn(TransactionsService, "getTransactionsByDay").mockReturnValueOnce({});

    const response = await app
      .handle(new Request("http://localhost/transactions/by-day"))
      .then((res) => res.json());

    expect(response).toEqual({});
  });

  it("should return rejected transactions", async () => {
    spyOn(TransactionsService, "getRejectedTransactions").mockReturnValueOnce(
      [],
    );

    const response = await app
      .handle(new Request("http://localhost/transactions/rejected"))
      .then((res) => res.json());

    expect(response).toEqual([]);
  });

  it("should process uploaded files", async () => {
    const mockFiles = new FormData();
    mockFiles.append(
      "files",
      new File(["content"], "test.csv", { type: "text/csv" }),
    );
    mockFiles.append(
      "files",
      new File(["content"], "test.json", { type: "application/json" }),
    );

    spyOn(TransactionsService, "handleFileProcessing").mockImplementationOnce(
      async () => {},
    );

    const response = await app
      .handle(
        new Request("http://localhost/transactions", {
          method: "POST",
          body: mockFiles,
        }),
      )
      .then((res) => res.json());

    expect(response).toEqual({ status: "Transactions are being processed" });
  });

  it("should delete all transactions", async () => {
    spyOn(
      TransactionsService,
      "handleTransactionDeletion",
    ).mockImplementationOnce(async () => {});

    const response = await app
      .handle(
        new Request("http://localhost/transactions", {
          method: "DELETE",
        }),
      )
      .then((res) => res.json());

    expect(response).toEqual({ message: "All transactions will be deleted" });
  });
});
