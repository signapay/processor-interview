'use client'

import { useTransactionStore } from '@/app/store/transactionStore';

export default function TransactionCount() {
  const { transactions } = useTransactionStore();

  return (
    <div className="text-sm text-gray-600 mt-2">
      {transactions.length > 0 ? (
        <span>{transactions.length} Transactions loaded</span>
      ) : (
        <span>No transactions loaded</span>
      )}
    </div>
  );
}
