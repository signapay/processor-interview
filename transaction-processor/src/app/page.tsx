'use client'

import { useState } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [csvData, setCsvData] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          setCsvData(results.data); // Store parsed CSV data
        },
        header: true, // If the CSV has headers
      });
    }
  };

  return (
    <div>
      <h1>Upload CSV</h1>
      <form>
        <label htmlFor="fileInput">Data</label>
        <input
          type="file"
          id="fileInput"
          accept=".csv"
          onChange={handleFileUpload}
        />
      </form>

      {/* Display parsed CSV data in a table */}
      {csvData.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(csvData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
