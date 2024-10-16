import React, { useState, useEffect } from 'react';
import FileUpload from './components/file-upload';
import TransactionList from './components/transaction-list';
import TransactionChart from './components/transaction-chart';
import { Transaction } from './types/transaction';
import './global.css';
import './app.css';

type Filters = {
  accountName: string;
  transactionType: string;
  startDate: string;
  endDate: string;
};

const initialFilters: Filters = {
  accountName: '',
  transactionType: '',
  startDate: '',
  endDate: '',
};

const filterTransactions = (transactions: Transaction[], filters: Filters): Transaction[] => {
  return transactions.filter(t => 
    (!filters.accountName || t.accountName.toLowerCase().includes(filters.accountName.toLowerCase())) &&
    (!filters.transactionType || t.transactionType.toLowerCase() === filters.transactionType.toLowerCase()) &&
    (!filters.startDate || new Date(t.processedAt || '') >= new Date(filters.startDate)) &&
    (!filters.endDate || new Date(t.processedAt || '') <= new Date(filters.endDate))
  );
};

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleTransactionsProcessed = (processedTransactions: Transaction[]): void => {
    setTransactions(processedTransactions);
  };

  const toggleChart = (): void => {
    setShowChart(prevShowChart => !prevShowChart);
  };

  const handleRemoveCSV = (): void => {
    setTransactions([]);
    setFilteredTransactions([]);
    setFilters(initialFilters);
  };

  const handleResetFilters = (): void => {
    setFilters(initialFilters);
  };

  useEffect(() => {
    const filtered = filterTransactions(transactions, filters);
    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  return (
    <div className="App container">
      <h1>Transaction Processor</h1>
      <div className="controls-row">
        <div className="centered-controls">
          <FileUpload onTransactionsProcessed={handleTransactionsProcessed} />
          {renderChartToggle(transactions, showChart, toggleChart)}
          {transactions.length > 0 && (
            <>
              <button onClick={handleRemoveCSV} className="remove-csv-btn">
                Remove CSV
              </button>
              <button onClick={handleResetFilters} className="reset-filters-btn">
                Reset Filters
              </button>
            </>
          )}
        </div>
      </div>
      {renderTransactionData(transactions, filteredTransactions, showChart, filters, setFilters)}
    </div>
  );
};

const renderChartToggle = (
  transactions: Transaction[], 
  showChart: boolean, 
  toggleChart: () => void
): React.ReactNode => {
  if (transactions.length === 0) return null;

  return (
    <button onClick={toggleChart} className="toggle-chart-btn">
      {showChart ? 'Hide Chart' : 'Show Chart'}
    </button>
  );
};

const renderTransactionData = (
  transactions: Transaction[],
  filteredTransactions: Transaction[],
  showChart: boolean,
  filters: Filters,
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
): React.ReactNode => {
  if (transactions.length === 0) return null;

  return (
    <>
      {showChart && <TransactionChart transactions={filteredTransactions} />}
      <TransactionList 
        transactions={filteredTransactions} 
        filters={filters}
        setFilters={setFilters}
      />
    </>
  );
};

export default App;
