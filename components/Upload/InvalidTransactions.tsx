import React from 'react';
import { BadTransaction } from '../../utils/transactionUtils';

interface InvalidTransactionsProps {
  transactions: BadTransaction[];
}

const InvalidTransactions: React.FC<InvalidTransactionsProps> = ({ transactions }) => {
  const renderTable = (data: BadTransaction[], title: string) => (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            {data.length > 0 && Object.keys(data[0]).map((key) => (
              <th key={key} className="px-4 py-2 border-b">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b">
              {Object.entries(row).map(([key, value], i) => (
                <td key={i} className="px-4 py-2 text-center">
                  {key === 'transactionAmount' && typeof value === 'number' ? value.toFixed(2) :
                   key === 'balance' && typeof value === 'number' ? value.toFixed(2) : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-4">
      {renderTable(transactions, 'Invalid Transactions')}
    </div>
  );
};

export default InvalidTransactions;
