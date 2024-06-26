import fs from 'fs';
import { parseAndProcessCSV } from './csvUtils';
import { Transaction, BadTransaction } from './transactionUtils';


jest.mock('fs');

describe('parseAndProcessCSV', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should process a valid CSV file correctly', async () => {
    const filePath = 'valid.csv';
    const csvContent = `Alice,1234,100,Debit,Salary,
Bob,5678,50,Debit,Groceries,`;

    (fs.createReadStream as jest.Mock).mockImplementation(() => {
      const Readable = require('stream').Readable;
      const s = new Readable();
      s.push(csvContent);
      s.push(null);
      return s;
    });

    const result = await parseAndProcessCSV(filePath);

    const expectedValidTransactions: Transaction[] = [
      { accountName: 'Alice', cardNumber: 1234, transactionAmount: 100, transactionType: 'Debit', description: 'Salary', targetCardNumber: undefined },
      { accountName: 'Bob', cardNumber: 5678, transactionAmount: 50, transactionType: 'Debit', description: 'Groceries', targetCardNumber: undefined },
    ];

    expect(result.cardReports).toHaveLength(2);
    expect(result.invalidTransactions).toEqual([]);
    expect(result.transactionCount).toBe(2);
  });

  it('should handle invalid schema format', async () => {
    const filePath = 'invalid_schema.csv';
    const csvContent = `Alice,1234,abc,Credit,Salary,
Bob,5678,50,Debit,Groceries,`;

    (fs.createReadStream as jest.Mock).mockImplementation(() => {
      const Readable = require('stream').Readable;
      const s = new Readable();
      s.push(csvContent);
      s.push(null);
      return s;
    });

    const result = await parseAndProcessCSV(filePath);

    const expectedInvalidTransactions: BadTransaction[] = [
      { accountName: 'Alice', cardNumber: '1234', transactionAmount: 'abc', transactionType: 'Credit', description: 'Salary', targetCardNumber: '', error: 'Invalid schema format' },
    ];

    expect(result.cardReports).toHaveLength(1);
    expect(result.invalidTransactions).toEqual(expectedInvalidTransactions);
    expect(result.transactionCount).toBe(1);
  });

  it('should handle invalid transaction type', async () => {
    const filePath = 'invalid_type.csv';
    const csvContent = `Alice,1234,100,InvalidType,Salary,
Bob,5678,50,Debit,Groceries,`;

    (fs.createReadStream as jest.Mock).mockImplementation(() => {
      const Readable = require('stream').Readable;
      const s = new Readable();
      s.push(csvContent);
      s.push(null);
      return s;
    });

    const result = await parseAndProcessCSV(filePath);

    const expectedInvalidTransactions: BadTransaction[] = [
      { accountName: 'Alice', cardNumber: '1234', transactionAmount: '100', transactionType: 'InvalidType', description: 'Salary', targetCardNumber: '', error: 'Invalid transaction type' },
    ];

    expect(result.cardReports).toHaveLength(1);
    expect(result.invalidTransactions).toEqual(expectedInvalidTransactions);
    expect(result.transactionCount).toBe(1);
  });

  it('should handle missing target card number for transfers', async () => {
    const filePath = 'missing_target_card.csv';
    const csvContent = `Alice,1234,100,Transfer,Salary,`;

    (fs.createReadStream as jest.Mock).mockImplementation(() => {
      const Readable = require('stream').Readable;
      const s = new Readable();
      s.push(csvContent);
      s.push(null);
      return s;
    });

    const result = await parseAndProcessCSV(filePath);

    const expectedInvalidTransactions: BadTransaction[] = [
      { accountName: 'Alice', cardNumber: '1234', transactionAmount: '100', transactionType: 'Transfer', description: 'Salary', targetCardNumber: '', error: 'Missing target card number for transfer' },
    ];

    expect(result.cardReports).toHaveLength(0);
    expect(result.invalidTransactions).toEqual(expectedInvalidTransactions);
    expect(result.collections).toEqual([]);
    expect(result.transactionCount).toBe(0);
  });

  it('should correctly identify collections', async () => {
    const filePath = 'collections.csv';
    const csvContent = `Alice,1234,100,Credit,Salary,
Alice,1234,200,Debit,Rent,`;

    (fs.createReadStream as jest.Mock).mockImplementation(() => {
      const Readable = require('stream').Readable;
      const s = new Readable();
      s.push(csvContent);
      s.push(null);
      return s;
    });

    const result = await parseAndProcessCSV(filePath);

    const expectedValidTransactions: Transaction[] = [
      { accountName: 'Alice', cardNumber: 1234, transactionAmount: 100, transactionType: 'Credit', description: 'Salary', targetCardNumber: undefined },
      { accountName: 'Alice', cardNumber: 1234, transactionAmount: 200, transactionType: 'Debit', description: 'Rent', targetCardNumber: undefined },
    ];

    expect(result.cardReports).toHaveLength(1);
    expect(result.invalidTransactions).toEqual([]);
    expect(result.collections).toEqual(['1234']);
    expect(result.transactionCount).toBe(2);
  });

  it('should handle multiple errors in CSV file', async () => {
    const filePath = 'multiple_errors.csv';
    const csvContent = `Alice,1234,abc,Credit,Salary,
Bob,5678,50,InvalidType,Groceries,
Charlie,9999,100,Transfer,Gift,`;

    (fs.createReadStream as jest.Mock).mockImplementation(() => {
      const Readable = require('stream').Readable;
      const s = new Readable();
      s.push(csvContent);
      s.push(null);
      return s;
    });

    const result = await parseAndProcessCSV(filePath);

    const expectedInvalidTransactions: BadTransaction[] = [
      { accountName: 'Alice', cardNumber: '1234', transactionAmount: 'abc', transactionType: 'Credit', description: 'Salary', targetCardNumber: '', error: 'Invalid schema format' },
      { accountName: 'Bob', cardNumber: '5678', transactionAmount: '50', transactionType: 'InvalidType', description: 'Groceries', targetCardNumber: '', error: 'Invalid transaction type' },
      { accountName: 'Charlie', cardNumber: '9999', transactionAmount: '100', transactionType: 'Transfer', description: 'Gift', targetCardNumber: '', error: 'Missing target card number for transfer' },
    ];

    expect(result.cardReports).toHaveLength(0);
    expect(result.invalidTransactions).toEqual(expectedInvalidTransactions);
    expect(result.collections).toEqual([]);
    expect(result.transactionCount).toBe(0);
  });
});
