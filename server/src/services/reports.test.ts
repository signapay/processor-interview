import {
  expect,
  spyOn,
  describe,
  beforeEach,
  afterEach,
  jest,
  it,
} from "bun:test";
import { db, rejectedTransactions, transactions } from "../db";
import {
  getAllRejectedTransactions,
  getTransactionsByCardNumber,
} from "./reports";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../db/schema";
import { sql } from "drizzle-orm";

describe("Transaction Service", () => {
  describe("getAllRejectedTransactions", () => {
    let selectSpy: ReturnType<
      typeof spyOn<NodePgDatabase<typeof schema>, "select">
    >;
    let fromSpy: ReturnType<typeof jest.fn>;

    beforeEach(() => {
      fromSpy = spyOn(
        db as unknown as { from: () => Promise<unknown[]> },
        "from",
      ).mockResolvedValue([]);
      selectSpy = spyOn(db, "select").mockReturnValue({
        from: fromSpy,
      } as never);
    });

    afterEach(() => {
      selectSpy.mockRestore();
      fromSpy.mockRestore();
    });

    it("should call db.select().from() with rejectedTransactions", async () => {
      expect(selectSpy).toHaveBeenCalledTimes(0);
      expect(fromSpy).toHaveBeenCalledTimes(0);

      await getAllRejectedTransactions();

      expect(selectSpy).toHaveBeenCalledTimes(1);
      expect(fromSpy).toHaveBeenCalledTimes(1);
      expect(fromSpy).toHaveBeenCalledWith(rejectedTransactions);
    });

    it("should throw an error if db.select().from() fails", async () => {
      const errorMessage = "Database connection error";
      fromSpy.mockRejectedValueOnce(new Error(errorMessage));

      try {
        await getAllRejectedTransactions();
        expect(true).toBe(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe(
            `Failed to fetch rejected transactions: Error: ${errorMessage}`,
          );
        } else {
          throw new Error("Expected error to be an instance of Error");
        }
      }
      expect(fromSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTransactionsByCardNumber", () => {
    let selectSpy: ReturnType<
      typeof spyOn<NodePgDatabase<typeof schema>, "select">
    >;
    let fromSpy: jest.Mock;
    let groupBySpy: jest.Mock;

    beforeEach(() => {
      groupBySpy = jest.fn().mockReturnValue({
        mockResults: true,
      });

      fromSpy = jest.fn().mockReturnValue({
        groupBy: groupBySpy,
      });

      selectSpy = spyOn(db, "select").mockReturnValue({
        from: fromSpy,
      } as never);
    });

    afterEach(() => {
      selectSpy.mockRestore();
    });

    it("should call database with the corret parameters", async () => {
      await getTransactionsByCardNumber();

      expect(selectSpy).toHaveBeenCalledWith({
        cardNumber: transactions.cardNumber,
        totalAmount: sql<number>`sum(${transactions.amount})`,
      });
      expect(fromSpy).toHaveBeenCalledWith(transactions);
      expect(groupBySpy).toHaveBeenCalledWith(transactions.cardNumber);
    });

    it("should throw an error if db.select().from() fails", async () => {
      const errorMessage = "Database connection error";
      groupBySpy.mockRejectedValueOnce(new Error(errorMessage));

      try {
        await getTransactionsByCardNumber();
        expect(true).toBe(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          expect(error).toBeInstanceOf(Error);
        } else {
          throw new Error("Expected error to be an instance of Error");
        }
      }
      expect(fromSpy).toHaveBeenCalledTimes(1);
    });
  });
});
