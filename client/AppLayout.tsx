import { Modal, Skeleton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Suspense, lazy } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { ScrollRestoration } from 'react-router-dom';
import s from './AppLayout.module.css';
import { Sidebar } from './shared/component/Sidebar.js';
import type { ModalName, Transaction } from './shared/entity';
import { prependTransactionsData } from './shared/queryClient';

const TransactionsFileForm = lazy(() => import('./transactions/TransactionsFileForm.js'));

export function AppLayout() {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  const modalName = hash.slice(1) as ModalName;

  const close = (transactions?: Transaction[]) => {
    navigate(pathname + search, { replace: true });
    if (transactions) {
      notifications.show({
        message: `${transactions.length} transactions were processed`,
        title: 'Processed',
        color: 'green',
      });
      prependTransactionsData(transactions);
    }
  };

  return (
    <>
      <Sidebar />

      <main className={s.main}>
        <Outlet />
      </main>

      {modalName === 'upload-transactions' && (
        <Modal
          title="Upload Transactions"
          onClose={close}
          opened
          radius="md"
          overlayProps={{
            backgroundOpacity: 0.7,
            blur: 3,
          }}
        >
          <Suspense fallback={<Skeleton height={100} />}>
            <TransactionsFileForm onClose={close} />
          </Suspense>
        </Modal>
      )}

      <ScrollRestoration getKey={(location, matches) => location.pathname} />
    </>
  );
}
