import { Transaction } from "@/app/types/types";
import { aggregateAccountsData, formatUSD, getAccountBalance, getNegativeBalanceAccounts, getUniqueAccountNumbers, getUniqueAccountNumbersByName } from "../helpers";
import { mockTransactions } from "@/app/mocks/mock";

describe("getAccountBalance", () => {
  it("should return the correct balance for a card", () => {
    const balance = getAccountBalance(mockTransactions, "1111");
    expect(balance).toBe(-150);
  });

  it("should return 0 if no transactions exist for the given card number", () => {
    const balance = getAccountBalance(mockTransactions, "9999");
    expect(balance).toBe(0);
  });

  it("should return 0 if the transactions array is empty", () => {
    const balance = getAccountBalance([], "1111");
    expect(balance).toBe(0);
  });
});

describe("getNegativeBalanceAccounts", () => {
  it("should return accounts with negative balances", () => {
    const result = getNegativeBalanceAccounts(mockTransactions);
    expect(result).toEqual([
      { cardNumber: "1111", accountBalance: -150 },
    ]);
  });

  it("should return an empty array if no accounts have negative balances", () => {
    const positiveTransactions: Transaction[] = [
      {
        accountName: "Bob",
        cardNumber: "2222",
        transactionAmount: 200,
        transactionType: "Credit",
        description: "Bonus"
      },
    ];
    const result = getNegativeBalanceAccounts(positiveTransactions);
    expect(result).toEqual([]);
  });

  it("should return an empty array if the transactions array is empty", () => {
    const result = getNegativeBalanceAccounts([]);
    expect(result).toEqual([]);
  });

  it("should handle multiple cards, returning only those with negative balances", () => {
    const moreTransactions: Transaction[] = [
      ...mockTransactions,
      {
        accountName: "Charlie",
        cardNumber: "3333",
        transactionAmount: -300,
        transactionType: "Debit",
        description: "Loan Payment"
      },
    ];
    const result = getNegativeBalanceAccounts(moreTransactions);
    expect(result).toEqual([
      { cardNumber: "1111", accountBalance: -150 },
      { cardNumber: "3333", accountBalance: -300 },
    ]);
  });
});

describe("getUniqueAccountNumbers", () => {
  it("should return unique card numbers", () => {
    const uniqueCardNumbers = getUniqueAccountNumbers(mockTransactions);
    expect(uniqueCardNumbers).toEqual(["1111", "2222"]);
  });

  it("should return an empty array if there are no transactions", () => {
    const uniqueCardNumbers = getUniqueAccountNumbers([]);
    expect(uniqueCardNumbers).toEqual([]);
  });

  it("should return a single unique card number if all transactions share the same card number", () => {
    const sameCardTransactions: Transaction[] = [
      {
        accountName: "Charlie",
        cardNumber: "3333",
        transactionAmount: 10,
        transactionType: "Credit",
        description: "Refund"
      },
      {
        accountName: "Charlie",
        cardNumber: "3333",
        transactionAmount: 20,
        transactionType: "Credit",
        description: "Gift"
      },
    ];
    const uniqueCardNumbers = getUniqueAccountNumbers(sameCardTransactions);
    expect(uniqueCardNumbers).toEqual(["3333"]);
  });
});

describe("formatUSD", () => {
  it("should format a positive number as USD", () => {
    const formatted = formatUSD(1234.56);
    expect(formatted).toBe("$1,234.56");
  });

  it("should format a negative number as USD", () => {
    const formatted = formatUSD(-1234.56);
    expect(formatted).toBe("-$1,234.56");
  });

  it("should format 0 as USD", () => {
    const formatted = formatUSD(0);
    expect(formatted).toBe("$0.00");
  });

  it("should correctly format a large number", () => {
    const formatted = formatUSD(1000000);
    expect(formatted).toBe("$1,000,000.00");
  });
});

describe("getUniqueAccountNumbersByName", () => {
  it("should return unique card numbers for a given account name", () => {
    const result = getUniqueAccountNumbersByName(mockTransactions, "Alice");
    expect(result).toEqual(["1111"]);
  });

  it("should return an empty array if no transactions exist for the given account name", () => {
    const result = getUniqueAccountNumbersByName(mockTransactions, "Charlie");
    expect(result).toEqual([]);
  });

  it("should return an empty array if account name is null", () => {
    const result = getUniqueAccountNumbersByName(mockTransactions, null);
    expect(result).toEqual([]);
  });
});

describe("aggregateAccountsData", () => {
  it("should return aggregated table data for a given account name", () => {
    const result = aggregateAccountsData(mockTransactions, "Alice");
    expect(result).toEqual([
      {
        cardNumber: "1111",
        accountBalance: "-$150.00",
      },
    ]);
  });

  it("should return an empty array if no transactions exist for the given account name", () => {
    const result = aggregateAccountsData(mockTransactions, "Charlie");
    expect(result).toEqual([]);
  });

  it("should handle multiple cards for the same account", () => {
    const moreTransactions: Transaction[] = [
      ...mockTransactions,
      {
        accountName: "Alice",
        cardNumber: "3333",
        transactionAmount: 300,
        transactionType: "Credit",
        description: "Freelance Work",
      },
    ];
    const result = aggregateAccountsData(moreTransactions, "Alice");
    expect(result).toEqual([
      { cardNumber: "1111", accountBalance: "-$150.00" },
      { cardNumber: "3333", accountBalance: "$300.00" },
    ]);
  });
});