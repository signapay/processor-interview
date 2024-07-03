import React, { useState } from 'react';
import { AccountDetails, Transaction } from '../interfaces';

const Reports: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [view, setView] = useState<string>('');
  const ALL_TRANSACTIONS: string = 'ALL TRANSACTIONS';
  const BAD_TRANSACTIONS: string = 'BAD TRANSACTIONS';
  const ACCOUNT_DETAILS: string = 'ACCOUNT DETAILS';
  const ACCOUNTS_FOR_COLLLECTIONS: string = 'ACCOUNTS FOR COLLECTION';

  const showAllTransactions = async () => {
    const response = await fetch('/api/transactions');
    if (response.ok) {
      const data = await response.json();
      setData(data);
      setView(ALL_TRANSACTIONS);
    } else {
      alert('Failed to fetch transactions');
    }
  };
  

  const showAccountBalance = async () => {
    const response = await fetch('/api/accountDetails');
    if (response.ok) {
      const data = await response.json();
      setData(data);
      setView(ACCOUNT_DETAILS);
    } else {
      alert('Failed to fetch account details');
    }
  };

  const showAccountsForCollections = async () => {
    const response = await fetch('/api/accountsForCollections');
    if (response.ok) {
      const data = await response.json();
      setData(data);
      setView(ACCOUNTS_FOR_COLLLECTIONS);
    } else {
      alert('Failed to fetch accounts for collection');
    }
  };

  const showBadTransactions = async () => {
    const response = await fetch('/api/badTransactions');
    if (response.ok) {
      const data = await response.json();
      setData(data);
      setView(BAD_TRANSACTIONS);
    } else {
      alert('Failed to fetch bad transactions');
    }
  };

  const getTransactionView = (data:Transaction[], showError: boolean = false) =>{
    return (
        <table>
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Card Number</th>
            <th>Transaction Amount</th>
            <th>Transaction Type</th>
            <th>Description</th>
            <th>Target Card</th>
            {showError && <th>Error</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((transaction: Transaction, index: number) => (
            <tr key={index}>
              <td>{transaction.account_name}</td>
              <td>{transaction.card_number}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.transaction_type}</td>
              <td>{transaction.description}</td>
              <td>{transaction.target_card_number}</td>
              {showError && <td>{transaction.error_msg}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  const getAccountDetailsView = (data:AccountDetails[]) =>{
    return (
        <table>
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Card Number</th>
            <th>Balance Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((details: AccountDetails, index: number) => (
            <tr key={index}>
              <td>{details.account_name}</td>
              <td>{details.card_number}</td>
              <td>{details.balance_amt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <div className='reports-container'>
        <button onClick={showAllTransactions}>Get All Transactions</button>
        <button onClick={showBadTransactions}>Get Bad Transactions</button>
        <button onClick={showAccountBalance}>Get Account Balance</button>
        <button onClick={showAccountsForCollections}>Accounts For Collection</button>
      </div>
      <h3>{view}</h3>
      {view === ALL_TRANSACTIONS && getTransactionView(data)}
      {view === BAD_TRANSACTIONS && getTransactionView(data, true)}
      {view === ACCOUNT_DETAILS && getAccountDetailsView(data)}
      {view === ACCOUNTS_FOR_COLLLECTIONS && getAccountDetailsView(data)}
    </div>
  );
};

export default Reports;
