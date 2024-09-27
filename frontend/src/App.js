import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [balanceReport, setBalanceReport] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [negativeBalances, setNegativeBalances] = useState([]);  // To store negative balance cards
  const [badTransactions, setBadTransactions] = useState([]);    // To store bad transactions
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('balance');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response from server:', response.data);  // For debugging

      setBalanceReport(response.data.balanceReport || []);
      setNegativeBalances(response.data.negativeBalances || []);  // Store negative balances
      setBadTransactions(response.data.badTransactions || []);  // Store bad transactions
      setTransactions(response.data.allTransactions || []);
      setUploadedFiles(response.data.uploadedFiles || []);

      setLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:3000/reset');
      setBalanceReport([]);
      setNegativeBalances([]);  // Clear negative balances
      setBadTransactions([]);  // Clear bad transactions
      setTransactions([]);
      setUploadedFiles([]);
      setLoading(false);
    } catch (error) {
      console.error('Error resetting system:', error);
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Transaction Processor</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? 'Processing...' : 'Upload'}
      </button>
      <button onClick={handleReset} disabled={loading}>
        {loading ? 'Resetting...' : 'Reset'}
      </button>

      <nav className="nav-bar">
        <button onClick={() => setActiveTab('files')} className={activeTab === 'files' ? 'active' : ''}>Uploaded CSV Files</button>
        <button onClick={() => setActiveTab('balance')} className={activeTab === 'balance' ? 'active' : ''}>Balance Report</button>
        <button onClick={() => setActiveTab('transactions')} className={activeTab === 'transactions' ? 'active' : ''}>Transaction History</button>
        <button onClick={() => setActiveTab('negative')} className={activeTab === 'negative' ? 'active' : ''}>Negative Balance</button>
        <button onClick={() => setActiveTab('bad')} className={activeTab === 'bad' ? 'active' : ''}>Bad Transactions</button>
      </nav>

      {activeTab === 'files' && (
        <div>
          <h2>Uploaded CSV Files</h2>
          <ul>
            {Array.isArray(uploadedFiles) && uploadedFiles.length > 0 ? (
              uploadedFiles.map((fileName, index) => <li key={index}>{fileName}</li>)
            ) : (
              <p>No files uploaded yet.</p>
            )}
          </ul>
        </div>
      )}

      {activeTab === 'balance' && (
        <div>
          <h2>Balance Report (Cumulative)</h2>
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Card Number</th>
                <th>Card Balance</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(balanceReport) && balanceReport.length > 0 ? (
                balanceReport.map((customerReport, index) => (
                  Array.isArray(customerReport.cards) && customerReport.cards.length > 0 ? customerReport.cards.map((card, cardIndex) => (
                    <tr key={`${index}-${cardIndex}`}>
                      <td>{cardIndex === 0 ? customerReport.customer : ''}</td> {/* Display customer name only once */}
                      <td>{card.cardNumber}</td>
                      <td>{card.balance}</td>
                    </tr>
                  )) : (
                    <tr key={index}>
                      <td>{customerReport.customer}</td>
                      <td colSpan="2">No cards found</td>
                    </tr>
                  )
                ))
              ) : (
                <tr>
                  <td colSpan="3">No data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'negative' && (
        <div>
          <h2>Negative Balance Accounts</h2>
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Card Number</th>
                <th>Card Balance</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(negativeBalances) && negativeBalances.length > 0 ? (
                negativeBalances.map((account, index) => (
                  <tr key={index}>
                    <td>{account.customer}</td>
                    <td>{account.cardNumber}</td>
                    <td>{account.balance}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No negative balance accounts.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'bad' && (
        <div>
          <h2>Bad Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Card Number</th>
                <th>Transaction Amount</th>
                <th>Transaction Type</th>
                <th>Description</th>
                <th>Target Card Number</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(badTransactions) && badTransactions.length > 0 ? (
                badTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.accountName || 'Unknown Account Name'}</td>
                    <td>{transaction.cardNumber || 'Unknown Card Number'}</td>
                    <td>{transaction.amount || 'Invalid Amount'}</td>
                    <td>{transaction.type || 'Unknown'}</td>
                    <td>{transaction.description || 'No Description'}</td>
                    <td>{transaction.targetCardNumber || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No bad transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div>
          <h2>Transaction History</h2>
          <table>
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Card Number</th>
                <th>Transaction Amount</th>
                <th>Transaction Type</th>
                <th>Description</th>
                <th>Target Card Number</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(transactions) && transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.customer || 'Unknown Account Name'}</td>
                    <td>{transaction.cardNumber || 'Unknown Card Number'}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.type || 'Unknown'}</td>
                    <td>{transaction.description || 'No Description'}</td>
                    <td>{transaction.targetCardNumber || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No transaction history available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;


