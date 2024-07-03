import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Transaction } from '../interfaces';


const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Transaction List</h2>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.account_name} - {transaction.card_number} ({transaction.transaction_type}) {transaction.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
