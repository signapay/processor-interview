import React from 'react';
import { CardReport, Transaction } from '../../utils/transactionUtils';

interface CardReportsProps {
  reports: CardReport[];
}

interface GroupedReports {
  [customerName: string]: CardReport[];
}

const CardReports: React.FC<CardReportsProps> = ({ reports }) => {
  const groupedReports: GroupedReports = reports.reduce((acc: GroupedReports, report) => {
    report.accountNames.forEach(accountName => {
      if (!acc[accountName]) {
        acc[accountName] = [];
      }
      acc[accountName].push(report);
    });
    return acc;
  }, {});

  const renderTable = (data: Transaction[], title: string) => (
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
    <div>
      {Object.keys(groupedReports).sort().map((customerName, index) => (
        <div key={index} className="border rounded-lg mt-4">
          <details className="p-4">
            <summary className="cursor-pointer text-lg font-semibold">
              Customer: {customerName}
            </summary>
            {groupedReports[customerName].map((card, idx) => (
              <div key={idx} className="ml-4 mt-2">
                <details className="p-4">
                  <summary className="cursor-pointer text-lg font-semibold">
                    Card Number: {card.cardNumber} (Balance: {Math.abs(card.balance).toFixed(2)}) - <span className="text-sm">{card.transactions.length} transactions</span>
                  </summary>
                  {renderTable(card.transactions, 'Transactions')}
                </details>
              </div>
            ))}
          </details>
        </div>
      ))}
    </div>
  );
};

export default CardReports;
