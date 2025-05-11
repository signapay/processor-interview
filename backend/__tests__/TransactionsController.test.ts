import { TransactionController } from "../src/interfaces/controllers/TransactionController";
import { TransactionService } from "../src/application/services/TransactionService";

class MockTransactionService implements TransactionService {
  async processTransactions(data: string, contentType: string) {
    return { "4111111111111111": { "2025-05-09": [10, -5] } };
  }
}

describe("TransactionController", () => {
  it("returns grouped transactions with 200 status", async () => {
    const controller = new TransactionController(new MockTransactionService());
    const event = {
      headers: { "content-type": "application/json" },
      body: JSON.stringify([
        { cardNumber: "4111111111111111", timestamp: "2025-05-09T10:00:00Z", amount: 10 },
        { cardNumber: "4111111111111111", timestamp: "2025-05-09T11:00:00Z", amount: -5 }
      ])
    };

    const res = await controller.handleRequest(event);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toHaveProperty("4111111111111111");
  });
});