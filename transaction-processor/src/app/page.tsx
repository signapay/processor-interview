'use client'

// TO DO
// break up components into separate files
// paginate table

import { SetStateAction, useState } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [csvData, setCsvData] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results: { data: SetStateAction<any[]>; }) => {
          setCsvData(results.data);
        },
        header: true,
      });
    }
  };

  const headers = ["Account Name", "Card Number", "Transaction Amount", "Transaction Type", "Description", "Target Card Number"];

  const tableHeaders = headers.map(header => (
    <th key={header} className="px-6 py-3" >
      {header}
    </th >
  ));

  const tableBody =
    csvData.map((row, index) => (
      <tr key={index} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
        {Object.values(row).map((value, idx) => (
          <td key={idx} className='px-6 py-4'>{String(value)}</td>
        ))}
      </tr>
    ))


  return (
    <div className='flex flex-col items-center gap-y-[16px]'>
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
      {/* breakout these into components */}
      {csvData.length > 0 && (
        <table className='min-h-[200px] max-h-[200px] overflow-hidden rounded-2xl text-left text-gray-500 text-sm w-[80%] dark:text-gray-400'>
          {/* add pagination */}
          <thead className='bg-gray-50 text-gray-700 text-xs uppercase dark:bg-gray-700 dark:text-gray-300'>
            <tr>
              {tableHeaders}
            </tr>
          </thead>
          <tbody className='px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-300 tracking-wider'>
            {tableBody}
          </tbody>
        </table>
      )
      }
    </div >
  );
}

// FIRST ITERATION BELOW. SOME USEFUL STUFF IN THERE:

// export default function Home() {
//   const headers = ["Account Name", "Card Number", "Transaction Amount", "Transaction Type", "Description", "Target Card Number"];

//   const tableHeaders = headers.map(header => (
//     <th key={header} className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//       {header}
//     </th>
//   ));

//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <h1>Upload your transaction</h1>
//       <form className="border-4 border-yellow-400">
//         <div className="border-2 border-white flex flex-col">
//           <label htmlFor="">Upload a file:</label>
//           <input type="file" id="avatar" name="avatar" accept=".csv" />
//         </div>
//         <button>Submit</button>
//       </form>
//       <table className="border-4 border-pink-300">
//         <tr>
//           {tableHeaders}
//         </tr>
//       </table>
//     </div>
//   );
// }
