'use client'

import { Button } from "@/app/components/ui/button";
import { processTransactionsFromCSV } from '@/app/utils/csvParser';
import { useTransactionStore } from '@/app/store/transactionStore';
import { HardDrive, Trash2 } from 'lucide-react';

export default function FilePool() {
  const { fileStatuses, errors, addTransactions, addFileStatus, addErrors, resetFilePool } = useTransactionStore();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];

    if (file) {

      try {
        const csvContent = await file.text();
        const result = await processTransactionsFromCSV(csvContent);
        
        addTransactions(result.data);

        addFileStatus({
          filename: file.name,
          transactionsCount: result.data.length,
          errorsCount: result.errors.length
        });

        addErrors(file.name, result.errors.map(error => ({ ...error, row: error.lineNumber })));

      } catch (error) {
        console.error('Error processing CSV:', error);
        addFileStatus({
          filename: file.name,
          transactionsCount: 0,
          errorsCount: 1
        });
      } 
    }
  };

  const handleReset = () => {
    resetFilePool();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-4">Choose Files</h1>

      <p>Add CSV files containing transactions to this file pool for inclusion in the reports.</p>

      <h2 className="text-1xl font-bold my-4">Current Files</h2>

      {fileStatuses.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          {fileStatuses.map((status, index) => (
            <p key={index}>
              <span className="font-bold">{status.filename}</span>: 
              <span className="text-green-600"> {status.transactionsCount} transactions</span>,
              <span className="text-red-600"> {status.errorsCount} errors</span>
            </p>
          ))}
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Transaction Parsing Issues</h2>
          {errors.map((error, index) => (
            <div key={index} className="mb-2 p-2 text-sm border border-red-200 rounded">
              <p>{error.filename}:{error.row}: <strong>{error.message}</strong></p>
              <p className="text-sm text-gray-600"><pre className="bg-gray-100 p-2">{error.input}</pre></p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="csv-file-input"
        />
        <Button
          onClick={() => document.getElementById('csv-file-input')?.click()}
        >
          <HardDrive className="mr-2 h-4 w-4" />
          Add CSV Transactions File
        </Button>
        <Button onClick={handleReset} variant="outline">
          <Trash2 className="mr-2 h-4 w-4" />
          Reset File Pool
        </Button>
      </div>

    </div>
  );
}
