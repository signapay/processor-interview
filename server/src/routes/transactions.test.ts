import { describe, it, expect, spyOn, afterAll, jest } from "bun:test";
import { transactionsRoutes } from "./transactions";
import * as transactionsService from "../services/transactions";

describe("Transaction Routes", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should handle file upload", async () => {
    const processSpy = spyOn(
      transactionsService,
      "processTransactionFile",
    ).mockImplementation(async (file) => {
      console.log(`Mock called with file: ${file.name}`);
      return { message: `File ${file.name} processed with success.` };
    });

    const mockFileContent = JSON.stringify([
      {
        cardNumber: "49927398716",
        timestamp: "2025-03-01T10:00:00Z",
        amount: "200.25",
      },
    ]);

    const mockFile = new File([mockFileContent], "test-transactions.json", {
      type: "application/json",
    });

    const formData = new FormData();
    formData.append("file", mockFile);

    const request = new Request("http://localhost/upload", {
      method: "POST",
      body: formData,
    });

    const response = await transactionsRoutes.handle(request);

    expect(response.status).toEqual(200);
    expect(processSpy).toHaveBeenCalledTimes(1);
    expect(processSpy.mock.calls[0][0].name).toBe("test-transactions.json");
  });
});
