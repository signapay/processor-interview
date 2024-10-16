import React, { useState } from 'react';
import { Transaction } from '../types/transaction';
import styles from '../styles/transaction-list.module.css';

type TransactionListProps = {
  transactions: Transaction[];
  filters: {
    accountName: string;
    transactionType: string;
    startDate: string;
    endDate: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    accountName: string;
    transactionType: string;
    startDate: string;
    endDate: string;
  }>>;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, filters, setFilters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const renderFilters = () => (
    <div className={styles.filtersContainer}>
      <h3>Filters</h3>
      <div className={styles.filters}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label htmlFor="accountName">Account Name</label>
            <input
              id="accountName"
              type="text"
              name="accountName"
              style={{ width: '90%' }}
              placeholder="Enter account name"
              value={filters.accountName}
              onChange={handleFilterChange}
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="transactionType">Transaction Type</label>
            <select
              id="transactionType"
              name="transactionType"
              style={{ width: '100%' }}
              value={filters.transactionType}
              onChange={handleFilterChange}
            >
              <option value="">All types</option>
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>
          </div>
        </div>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              style={{ width: '90%' }}
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              style={{ width: '95.5%' }}
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const pageCount = Math.ceil(transactions.length / transactionsPerPage);

  const renderTransactions = (transactions: Transaction[]) => (
    transactions.map((transaction, index) => (
      <tr key={index}>
        <td>{transaction.accountName}</td>
        <td>{transaction.cardNumber.toString().slice(-4).padStart(16, '*')}</td>
        <td className={transaction.transactionAmount < 0 ? styles.negative : styles.positive}>
          ${Math.abs(transaction.transactionAmount).toFixed(2)}
        </td>
        <td>{transaction.transactionType}</td>
        <td>{transaction.description}</td>
        <td>{transaction.processedAt ? new Date(transaction.processedAt).toLocaleString() : ''}</td>
      </tr>
    ))
  );

  const changePage = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, pageCount)));
  };

  const renderPagination = () => {
    if (pageCount <= 1) {
      return null;
    }

    return (
      <div className={styles.pagination}>
        <button onClick={() => changePage(1)} disabled={currentPage === 1}>First</button>
        <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {pageCount}</span>
        <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === pageCount}>Next</button>
        <button onClick={() => changePage(pageCount)} disabled={currentPage === pageCount}>Last</button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {renderFilters()}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Card Number</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Description</th>
              <th>Processed At</th>
            </tr>
          </thead>
          <tbody>
            {renderTransactions(currentTransactions)}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export default TransactionList;
