import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { ajax } from 'client/shared/ajax';
import type { ModalName } from 'client/shared/entity';
import { clearTransactionsData } from 'client/shared/queryClient';
import { useLocation, useNavigate } from 'react-router';
import type { AppResponseError } from 'server/shared/exception';
import s from './TransactionToolbar.module.css';

export function TransactionToolbar() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const openTransactionForm = () => {
    const modalName = 'upload-transactions' satisfies ModalName;
    navigate(pathname + search + '#' + modalName, { replace: true });
  };

  const clearAllTransactionsMutation = useMutation<number, AppResponseError, void>({
    mutationFn: () => ajax('/api/transactions/all', { method: 'delete' }),
  });

  const clearAllTransactions = () =>
    clearAllTransactionsMutation.mutateAsync().then((count) => {
      clearTransactionsData();
      notifications.show({ message: `${count} transactions were removed`, title: 'Deleted', color: 'pink' });
    });

  return (
    <aside className={`${s.container} actions`}>
      <Button onClick={openTransactionForm}>Process Transactions</Button>
      <Button onClick={clearAllTransactions} variant="light">
        Clear All Transactions
      </Button>
    </aside>
  );
}
