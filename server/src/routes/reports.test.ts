import { describe, expect, it, spyOn, beforeEach, afterEach } from "bun:test";
import { app } from "../index";
import * as reportsService from "../services/reports";

describe("Reports Routes", () => {
  describe("GET /reports/transactions/rejected", () => {
    let getAllRejectedTransactionsSpy: ReturnType<typeof spyOn>;

    beforeEach(() => {
      getAllRejectedTransactionsSpy = spyOn(
        reportsService,
        "getAllRejectedTransactions",
      ).mockResolvedValue([
        {
          id: 1,
          cardNumber: "1234567890123456",
          timestamp: "2023-01-01",
          amount: "100.00",
        },
      ]);
    });

    afterEach(() => {
      getAllRejectedTransactionsSpy.mockRestore();
    });

    it("should call getAllRejectedTransactions function", async () => {
      await app.handle(
        new Request("http://localhost:3000/reports/transactions/rejected"),
      );

      expect(getAllRejectedTransactionsSpy).toHaveBeenCalledTimes(1);
    });

    it("should return the result from getAllRejectedTransactions", async () => {
      const response = await app.handle(
        new Request("http://localhost:3000/reports/transactions/rejected"),
      );

      const result = await response.json();

      expect(result).toEqual([
        {
          id: 1,
          cardNumber: "1234567890123456",
          timestamp: "2023-01-01",
          amount: "100.00",
        },
      ]);
    });

    it("should handle errors when getAllRejectedTransactions fails", async () => {
      getAllRejectedTransactionsSpy.mockReset();
      getAllRejectedTransactionsSpy.mockRejectedValue(
        new Error("Database connection error"),
      );

      const response = await app.handle(
        new Request("http://localhost:3000/reports/transactions/rejected"),
      );

      expect(response.status).toBe(500);
    });
  });

  describe("GET /reports/transactions", () => {
    let getTransactionsByCardNumberSpy: ReturnType<typeof spyOn>;
    let getTransactionsByCardTypeSpy: ReturnType<typeof spyOn>;
    let getTransactionsByDaySpy: ReturnType<typeof spyOn>;

    beforeEach(() => {
      getTransactionsByCardNumberSpy = spyOn(
        reportsService,
        "getTransactionsByCardNumber",
      ).mockResolvedValue([
        { cardNumber: "4111111111111111", totalAmount: 500.25 },
        { cardNumber: "5555555555554444", totalAmount: 300.75 },
      ]);

      getTransactionsByCardTypeSpy = spyOn(
        reportsService,
        "getTransactionsByCardType",
      ).mockResolvedValue([]);

      getTransactionsByDaySpy = spyOn(
        reportsService,
        "getTransactionsByDay",
      ).mockResolvedValue([]);
    });

    afterEach(() => {
      getTransactionsByCardNumberSpy.mockRestore();
      getTransactionsByCardTypeSpy.mockRestore();
      getTransactionsByDaySpy.mockRestore();
    });

    it("should call getTransactionsByCardNumber", async () => {
      const response = await app.handle(
        new Request("http://localhost:3000/reports/transactions/by-card"),
      );

      expect(response.status).toBe(200);

      expect(getTransactionsByCardNumberSpy).toHaveBeenCalledTimes(1);
      expect(getTransactionsByCardTypeSpy).toHaveBeenCalledTimes(0);
      expect(getTransactionsByDaySpy).toHaveBeenCalledTimes(0);

      const result = await response.json();
      expect(result).toEqual([
        { cardNumber: "4111111111111111", totalAmount: 500.25 },
        { cardNumber: "5555555555554444", totalAmount: 300.75 },
      ]);
    });

    it("should call getTransactionsByCardType", async () => {
      getTransactionsByCardTypeSpy.mockResolvedValue([
        { cardType: "Visa", totalAmount: 1200.5 },
        { cardType: "Mastercard", totalAmount: 850.75 },
        { cardType: "Amex", totalAmount: 2500.0 },
      ]);

      const response = await app.handle(
        new Request("http://localhost:3000/reports/transactions/by-card-type"),
      );

      expect(response.status).toBe(200);

      expect(getTransactionsByCardNumberSpy).toHaveBeenCalledTimes(0);
      expect(getTransactionsByCardTypeSpy).toHaveBeenCalledTimes(1);
      expect(getTransactionsByDaySpy).toHaveBeenCalledTimes(0);

      const result = await response.json();
      expect(result).toEqual([
        { cardType: "Visa", totalAmount: 1200.5 },
        { cardType: "Mastercard", totalAmount: 850.75 },
        { cardType: "Amex", totalAmount: 2500.0 },
      ]);
    });

    it("should call getTransactionsByDay", async () => {
      getTransactionsByDaySpy.mockResolvedValue([
        {
          date: "2024-06-23",
          totalAmount: "676.96",
        },
        {
          date: "2024-06-24",
          totalAmount: "-805.85",
        },
      ]);

      const response = await app.handle(
        new Request(
          "http://localhost:3000/reports/transactions/by-day?startDate=2024-06-23&endDate=2024-06-24",
        ),
      );

      expect(response.status).toBe(200);

      expect(getTransactionsByCardNumberSpy).toHaveBeenCalledTimes(0);
      expect(getTransactionsByCardTypeSpy).toHaveBeenCalledTimes(0);
      expect(getTransactionsByDaySpy).toHaveBeenCalledTimes(1);

      const result = await response.json();
      expect(result).toEqual([
        {
          date: "2024-06-23",
          totalAmount: "676.96",
        },
        {
          date: "2024-06-24",
          totalAmount: "-805.85",
        },
      ]);
    });
  });
});
