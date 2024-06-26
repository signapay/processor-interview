import React, { useState } from 'react';
import FileUpload from './FileUpload';
import CardReports from './CardReports';
import Collections from './Collections';
import UploadRecords from './UploadRecords';
import InvalidTransactions from './InvalidTransactions';
import { CardReport, BadTransaction, UploadRecord } from '../../utils/transactionUtils';

const Upload: React.FC = () => {
  const [cardReports, setCardReports] = useState<CardReport[]>([]);
  const [invalidTransactions, setInvalidTransactions] = useState<BadTransaction[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [totalTransactionCount, setTotalTransactionCount] = useState<number>(0);
  const [uploadRecords, setUploadRecords] = useState<UploadRecord[]>([]);

  const handleUpload = (result: {
    cardReports: CardReport[],
    invalidTransactions: BadTransaction[],
    collections: string[],
    totalTransactionCount: number,
    files: UploadRecord[],
  }) => {
    setCardReports(prevCardReports => [...prevCardReports, ...result.cardReports]);
    setInvalidTransactions(prevInvalidTransactions => [...prevInvalidTransactions, ...result.invalidTransactions]);
    setCollections(prevCollections => [...Array.from(new Set([...prevCollections, ...result.collections]))]);
    setTotalTransactionCount(result.totalTransactionCount);
    setUploadRecords(prevUploadRecords => {
      const existingFiles = new Set(prevUploadRecords.map(record => record.filename));
      const newFiles = result.files.filter(file => !existingFiles.has(file.filename));
      return [...prevUploadRecords, ...newFiles];
    });
  };

  const handleReset = async () => {
    const response = await fetch('/api/upload', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`
      }
    });
    const result = await response.json();
    if (response.ok) {
      setCardReports([]);
      setInvalidTransactions([]);
      setCollections([]);
      setTotalTransactionCount(0);
      setUploadRecords([]);
    } else {
      alert(result.error);
    }
  };

  return (
    <div>
      <FileUpload onUpload={handleUpload} onReset={handleReset} uploadRecords={uploadRecords} />
      <div className="mt-8 text-lg text-gray-700">
        <p className="font-semibold pt-4">Cumulative</p>
        <p>Total Invalid Transactions: <span className="font-semibold">{invalidTransactions.length}</span></p>
        <p>Total Transactions Processed: <span className="font-semibold">{totalTransactionCount}</span></p>
        
        
      </div>
      <UploadRecords records={uploadRecords} />
      <div className="mt-6 min-w-full">
        <details className="border rounded-lg mb-4">
          <summary className="cursor-pointer p-4 text-lg font-semibold text-blue-600">Card Reports ({cardReports.length})</summary>
          <CardReports reports={cardReports} />
        </details>
        <details className="border rounded-lg mb-4">
          <summary className="cursor-pointer p-4 text-lg font-semibold text-blue-600">Invalid Transactions ({invalidTransactions.length})</summary>
          <InvalidTransactions transactions={invalidTransactions} />
        </details>
        <details className="border rounded-lg mb-4">
          <summary className="cursor-pointer p-4 text-lg font-semibold text-blue-600">Collections ({collections.length})</summary>
          <Collections collections={collections} cardReports={cardReports} />
        </details>
      </div>
    </div>
  );
};

export default Upload;
