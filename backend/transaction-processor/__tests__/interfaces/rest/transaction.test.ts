import request from 'supertest';
import express from 'express';
import transactionRouter from '../../../interfaces/rest/transaction';
import Processor from '../../../features';
import Helpers from '../../../helpers';

jest.mock('../../../features');
jest.mock('../../../helpers');

const app = express();
app.use(express.json());
app.use(transactionRouter);

const mockTransactions = [
  { id: '1', amount: 100, description: 'Test transaction' },
];

const mockProcessedTransactions = [
  { id: '1', amount: 100, description: 'Test transaction', processed: true },
];

const mockReport = {
  totalTransactions: 1,
  totalAmount: 100,
};

const setupMocks = () => {
  (Processor.getTransactions as jest.Mock).mockReturnValue(mockTransactions);
  (Processor.generateReport as jest.Mock).mockReturnValue(mockReport);
  (Processor.processTransactions as jest.Mock).mockReturnValue(mockProcessedTransactions);
  (Helpers.ValidationHelper.transactionsSchema as jest.Mock).mockReturnValue(mockTransactions);
};

describe('Transaction Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  const testGetTransactions = async () => {
    const response = await request(app).get('/transactions');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ transactions: mockTransactions });
  };

  const testGetReport = async () => {
    const response = await request(app).get('/report');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ report: mockReport });
  };

  const testProcessTransactions = async () => {
    const response = await request(app)
      .post('/process')
      .send(mockTransactions);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ processedTransactions: mockProcessedTransactions });
  };

  test('GET /transactions returns transactions', testGetTransactions);
  test('GET /report returns report', testGetReport);
  test('POST /process processes transactions', testProcessTransactions);
});