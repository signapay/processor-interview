import { processTransactions, Transaction, CardReport, BadTransaction } from './transactionUtils';

describe('processTransactions', () => {
  it('should process valid transactions correctly', () => {
    const transactions: Transaction[] = [
      { accountName: 'Alice', cardNumber: 1234, transactionAmount: 100, transactionType: 'Credit', description: 'Salary' },
      { accountName: 'Alice', cardNumber: 1234, transactionAmount: 50, transactionType: 'Debit', description: 'Groceries' },
    ];

    const { cardReports, badTransactions, collections, transactionCount } = processTransactions(transactions);

    const expectedCardReports: CardReport[] = [
      {
        accountNames: ['Alice'],
        cardNumber: 1234,
        balance: 50.00,
        transactions: [
          { accountName: 'Alice', cardNumber: 1234, transactionAmount: 100, transactionType: 'Credit', description: 'Salary' },
          { accountName: 'Alice', cardNumber: 1234, transactionAmount: 50, transactionType: 'Debit', description: 'Groceries' },
        ],
      },
    ];

    expect(cardReports).toEqual(expectedCardReports);
    expect(badTransactions).toEqual([]);
    expect(collections).toEqual([]);
    expect(transactionCount).toBe(2);
  });

  it('should handle missing required fields', () => {
    const transactions: Transaction[] = [
      { accountName: '', cardNumber: 1234, transactionAmount: 100, transactionType: 'Credit', description: 'Salary' },
    ];

    const { cardReports, badTransactions, collections, transactionCount } = processTransactions(transactions);

    const expectedBadTransactions: BadTransaction[] = [
      {
        accountName: '',
        cardNumber: '1234',
        transactionAmount: '100.00',
        transactionType: 'Credit',
        description: 'Salary',
        targetCardNumber: undefined,
        error: 'Missing required fields',
      },
    ];

    expect(cardReports).toEqual([]);
    expect(badTransactions).toEqual(expectedBadTransactions);
    expect(collections).toEqual([]);
    expect(transactionCount).toBe(1);
  });

  it('should handle invalid transaction types', () => {
    const transactions: Transaction[] = [
      { accountName: 'Alice', cardNumber: 1234, transactionAmount: 100, transactionType: 'InvalidType', description: 'Unknown' },
    ];

    const { cardReports, badTransactions, collections, transactionCount } = processTransactions(transactions);

    const expectedBadTransactions: BadTransaction[] = [
      {
        accountName: 'Alice',
        cardNumber: '1234',
        transactionAmount: '100.00',
        transactionType: 'InvalidType',
        description: 'Unknown',
        targetCardNumber: undefined,
        error: 'Invalid transaction type',
      },
    ];

    expect(cardReports).toEqual([]);
    expect(badTransactions).toEqual(expectedBadTransactions);
    expect(collections.length).toBe(0);
    expect(transactionCount).toBe(1);
  });

  it('should handle missing target card number for transfers', () => {
    const transactions: Transaction[] = [
      { accountName: 'Alice', cardNumber: 1234, transactionAmount: 100, transactionType: 'Transfer', description: 'Transfer to Bob', targetCardNumber: undefined },
    ];

    const { cardReports, badTransactions, collections, transactionCount } = processTransactions(transactions);

    const expectedBadTransactions: BadTransaction[] = [
      {
        accountName: 'Alice',
        cardNumber: '1234',
        transactionAmount: '100.00',
        transactionType: 'Transfer',
        description: 'Transfer to Bob',
        targetCardNumber: undefined,
        error: 'Missing target card number for transfer',
      },
    ];

    expect(badTransactions).toEqual(expectedBadTransactions);
    expect(collections).toEqual([]);
    expect(transactionCount).toBe(1);
  });

  it('should correctly identify collections', () => {
    const transactions: Transaction[] = [
      { accountName: 'Alice', cardNumber: 1234, transactionAmount: 100, transactionType: 'Credit', description: 'Salary' },
      { accountName: 'Alice', cardNumber: 1234, transactionAmount: 200, transactionType: 'Debit', description: 'Rent' },
    ];

    const { cardReports, badTransactions, collections, transactionCount } = processTransactions(transactions);

    const expectedCardReports: CardReport[] = [
      {
        accountNames: ['Alice'],
        cardNumber: 1234,
        balance: -100.00,
        transactions: [
          { accountName: 'Alice', cardNumber: 1234, transactionAmount: 100, transactionType: 'Credit', description: 'Salary' },
          { accountName: 'Alice', cardNumber: 1234, transactionAmount: 200, transactionType: 'Debit', description: 'Rent' },
        ],
      },
    ];

    expect(cardReports).toEqual(expectedCardReports);
    expect(badTransactions).toEqual([]);
    expect(collections).toEqual(['1234']);
    expect(transactionCount).toBe(2);
  });

  it('should handle valid transfer transactions', () => {
    const transactions: Transaction[] = [
      { accountName: 'Alice', cardNumber: 1234, transactionAmount: 100, transactionType: 'Transfer', description: 'Transfer to Bob', targetCardNumber: 5678 },
    ];

    const { cardReports, badTransactions, collections, transactionCount } = processTransactions(transactions);

    const expectedCardReports: CardReport[] = [
      {
        accountNames: ['Alice'],
        cardNumber: 1234,
        balance: -100,
        transactions: [
          { accountName: 'Alice', cardNumber: 1234, transactionAmount: 100, transactionType: 'Transfer', description: 'Transfer to Bob', targetCardNumber: 5678 },
        ],
      }
    ];


    expect(cardReports).toEqual(expectedCardReports);
    expect(badTransactions).toEqual([]);
    expect(transactionCount).toBe(1);
  });

  it('should handle invalid transaction amounts', () => {
    const transactions: Transaction[] = [
      { accountName: 'Alice', cardNumber: 1234, transactionAmount: NaN, transactionType: 'Credit', description: 'Salary' },
    ];

    const { cardReports, badTransactions, collections, transactionCount } = processTransactions(transactions);

    const expectedBadTransactions: BadTransaction[] = [
      {
        accountName: 'Alice',
        cardNumber: '1234',
        transactionAmount: 'NaN',
        transactionType: 'Credit',
        description: 'Salary',
        targetCardNumber: undefined,
        error: 'Missing required fields',
      },
    ];

    expect(cardReports).toEqual([]);
    expect(badTransactions).toEqual(expectedBadTransactions);
    expect(collections).toEqual([]);
    expect(transactionCount).toBe(1);
  });
});
