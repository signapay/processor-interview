import { TransactionServiceImpl } from "../src/infrastructure/services/TransactionServiceImpl";

const jsonData = JSON.stringify([
  { cardNumber: "4111111111111111", timestamp: "2025-05-08T10:00:00Z", amount: 20.5 },
  { cardNumber: "5111111111111111", timestamp: "2025-05-08T12:00:00Z", amount: -5.0 }
]);

const csvData = `cardNumber,timestamp,amount
4111111111111111,2025-05-08T10:00:00Z,20.5
5111111111111111,2025-05-08T12:00:00Z,-5.0`;

const xmlData = `
<transactions>
  <transaction>
    <cardNumber>4111111111111111</cardNumber>
    <timestamp>2025-05-08T10:00:00Z</timestamp>
    <amount>20.5</amount>
  </transaction>
  <transaction>
    <cardNumber>5111111111111111</cardNumber>
    <timestamp>2025-05-08T12:00:00Z</timestamp>
    <amount>-5.0</amount>
  </transaction>
</transactions>`;

describe("TransactionServiceImpl", () => {
  const service = new TransactionServiceImpl();

  it("should parse and group JSON transactions", async () => {
    const result = await service.processTransactions(jsonData, "application/json");
    expect(result).toHaveProperty("4111111111111111");
  });

  it("should parse and group CSV transactions", async () => {
    const result = await service.processTransactions(csvData, "text/csv");
    expect(result).toHaveProperty("4111111111111111");
  });

  it("should parse and group XML transactions", async () => {
    const result = await service.processTransactions(xmlData, "application/xml");
    expect(result).toHaveProperty("4111111111111111");
  });
});