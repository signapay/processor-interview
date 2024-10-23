import { Transaction } from "@/app/context/types";
import { formatUSD, getAccountBalance, getUniqueAccountNumbers } from "../helpers";

const transactions: Transaction[] = [
  {
    accountName: "Alice",
    cardNumber: "1111",
    transactionAmount: 100,
    transactionType: "Credit",
    description: "Salary"
  },
  {
    accountName: "Alice",
    cardNumber: "1111",
    transactionAmount: -50,
    transactionType: "Debit",
    description: "Groceries"
  },
  {
    accountName: "Bob",
    cardNumber: "2222",
    transactionAmount: 200,
    transactionType: "Credit",
    description: "Bonus"
  },
];

describe("getAccountBalance", () => {
  it("should return the correct balance for a card", () => {
    const balance = getAccountBalance(transactions, "1111");
    expect(balance).toBe(50);
  });

  it("should return 0 if no transactions exist for the given card number", () => {
    const balance = getAccountBalance(transactions, "9999");
    expect(balance).toBe(0);
  });

  it("should return 0 if the transactions array is empty", () => {
    const balance = getAccountBalance([], "1111");
    expect(balance).toBe(0);
  });
});

describe("getUniqueAccountNumbers", () => {
  it("should return unique card numbers", () => {
    const uniqueCardNumbers = getUniqueAccountNumbers(transactions);
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
