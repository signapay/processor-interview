import React, { useState } from 'react';
import { UploadRecord } from '../../utils/transactionUtils';

interface FileUploadProps {
  onUpload: (result: {
    cardReports: any[],
    invalidTransactions: any[],
    collections: string[],
    totalTransactionCount: number,
    files: UploadRecord[]
  }) => void;
  onReset: () => void;
  uploadRecords: UploadRecord[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onReset, uploadRecords }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file.');
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true); // Set loading state to true

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`
        }
      });

      const result = await response.json();

      if (response.status === 400) {
        alert(result.error); // Show alert if file already exists
        setLoading(false);
        return;
      }
      return onUpload(result);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const handleReset = async () => {
    const response = await fetch('/api/upload', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`
      }
    });
    const result = await response.json();
    onReset();
  };

  return (
    <div className="mb-6 mx-auto">
      <input type="file" accept=".csv" onChange={handleFileChange} className="block mb-4" />
      <button 
        onClick={handleUpload} 
        disabled={!file || loading} 
        className={`px-6 py-2 w-36 text-lg font-semibold rounded-lg ${!file || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'} transition duration-300`}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 mr-3 inline-block text-white" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path fill="currentColor" d="M4 12a8 8 0 017-7.93V1.05A10 10 0 002 12h2zm2 5.3a8 8 0 007 7.93v2.02A10 10 0 014 17.3h2zm12 1.4a8 8 0 00-7-7.93v-2.02a10 10 0 018 10h-2z" />
          </svg>
        ) : 'Upload'}
      </button>
      <button 
        onClick={handleReset} 
        className={`ml-4 px-6 text-lg w-36 rounded-lg py-2 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 ${uploadRecords.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
        disabled={uploadRecords.length === 0}
      >
        Reset
      </button>
    </div>
  );
};

export default FileUpload;
