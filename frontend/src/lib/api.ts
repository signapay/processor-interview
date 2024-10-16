import { Transaction, TransactionSchema } from '../types/transaction';
import env from '../env';

const API_BASE_URL = env.REACT_APP_API_URL;
const token = env.REACT_APP_AUTH_TOKEN;

const makeRequest = async (url: string, method: string, body?: FormData, headers?: Record<string, string>) => {
  const response = await fetch(url, {
    method,
    body,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...headers
    }
  });
  return response.json();
};

export const processTransactions = async (file: File): Promise<Transaction[]> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await makeRequest(`${API_BASE_URL}/api/process-transactions`, 'POST', formData);
    return TransactionSchema.array().parse(response.processedTransactions);
  } catch (error) {
    console.error('Error processing transactions:', error);
    throw error;
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch(`${API_BASE_URL}/transactions`);
  return TransactionSchema.array().parse(response.json());
};
