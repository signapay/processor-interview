import { QueryClient } from '@tanstack/react-query';
import type { Transaction } from 'server/shared/entity';
import { ajax } from './ajax';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({ queryKey }) => ajax(queryKey.join('/')),
      throwOnError: (error: any) => {
        console.log('queryClient queries throwOnError', error);
        return error.response?.status >= 400;
      },
    },
    mutations: {
      throwOnError: (error: any) => {
        console.log('queryClient mutations throwOnError', error);
        return error.response?.status >= 400;
      },
    },
  },
});

export const prependTransactionsData = (data: Transaction[]) => {
  queryClient.setQueryData(['/api/transactions'], (currentData: Transaction[] = []) => [...data, currentData]);
  queryClient.invalidateQueries({ queryKey: ['/api/report'] });
};

export const clearTransactionsData = () => {
  queryClient.setQueryData(['/api/transactions'], []);
  queryClient.invalidateQueries({ queryKey: ['/api/report'] });
};
