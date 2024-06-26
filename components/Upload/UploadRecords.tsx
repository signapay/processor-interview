import React from 'react';
import { UploadRecord } from '../../utils/transactionUtils';

interface UploadRecordsProps {
  records?: UploadRecord[];
}

const UploadRecords: React.FC<UploadRecordsProps> = ({ records = [] }) => (
  <div className="mt-6">
    <h2 className="text-xl font-bold text-blue-600">Upload Records ({records.length} files)</h2>
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b">Filename</th>
          <th className="px-4 py-2 border-b">Transaction Count</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record, index) => (
          <tr key={index} className="border-b">
            <td className="px-4 py-2 text-center">{record.filename}</td>
            <td className="px-4 py-2 text-center">{record.transactionCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UploadRecords;
