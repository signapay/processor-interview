"use client"
import { useEffect, useState } from 'react';
import FileUpload from './components/FileUpload';
import AccountList from './components/AccountList';
import CollectionList from './components/CollectionList';
import BadTransactionList from './components/BadTransactionList';
import { handleFileUpload as handleFileUploadUtil } from '../utils/fileProcessor';
import { TabButton } from './components/Common';

export default function Home() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [badTransactions, setBadTransactions] = useState([]);
  const [accounts, setAccounts] = useState({});

  const handleFileUpload = async (e) => {
    await handleFileUploadUtil(e, accounts, setBadTransactions, setAccounts);
  };

  const handleReset = () => {
    setBadTransactions([]);
    setAccounts({});
  };

  const collections = Object.entries(accounts).filter(([name, account]) => account.balance < 0);
  const renderTabContent = () => {
    switch (activeTab) {
      case 'accounts':
        return <AccountList accounts={accounts} />;
      case 'collections':
        return <CollectionList collections={collections} />;
      case 'badTransactions':
        return <BadTransactionList badTransactions={badTransactions} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 text-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Transaction Processor</h1>
      <div className="mb-4 flex gap-4 justify-center">
        <TabButton
          label="Accounts"
          active={activeTab === 'accounts'}
          onClick={() => setActiveTab('accounts')}
        />
        <TabButton
          label="Collections"
          active={activeTab === 'collections'}
          onClick={() => setActiveTab('collections')}
        />
        <TabButton
          label="Bad Transactions"
          active={activeTab === 'badTransactions'}
          onClick={() => setActiveTab('badTransactions')}
        />
      </div>
      <FileUpload handleFileUpload={handleFileUpload} />
      <button onClick={handleReset} className="mb-4 p-2 bg-red-500 text-white">
        Reset
      </button>
      {renderTabContent()}
    </div>
  );
}
