import React, { useState } from 'react';
import { processTransactions } from '../lib/api';
import { Transaction } from '../types/transaction';

type FileUploadProps = {
  onTransactionsProcessed: (transactions: Transaction[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onTransactionsProcessed }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (file) {
      try {
        const transactions = await processTransactions(file);
        onTransactionsProcessed(transactions);
      } catch (error) {
        console.error('Error processing transactions:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="file-upload-form">
      <div className="file-input-wrapper">
        <label htmlFor="file-upload" className="file-input-label" style={{ fontWeight: 'bold', marginRight: '10px' }}>
          Choose a CSV File: 
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>
      <button type="submit" disabled={!file} className="submit-button">
        Process Transactions
      </button>
    </form>
  );
};

export default FileUpload;
