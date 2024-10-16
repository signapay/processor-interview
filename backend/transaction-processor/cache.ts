import { Transaction } from "./types/transaction";

const cache: Transaction[] = [];

export const setCache = (transactions: Transaction[]) => {
  cache.push(...transactions);
};

export const getCache = () => {
  return cache;
};
