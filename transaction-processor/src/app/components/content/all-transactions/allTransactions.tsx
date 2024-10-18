
import { useTransactionContext } from "@/app/context/context";
import { Key } from "react";

export default function AllTransactions() {
  const { state } = useTransactionContext();

  if (state.transactions.length === 0) {
    return null;
  }

  const headers = ["Account Name", "Card Number", "Transaction Amount", "Transaction Type", "Description", "Target Card Number"];

  const tableHeaders = headers.map((header) => (
    <th key={header} className="px-6 py-3">
      {header}
    </th>
  ));

  const tableBody =
    state.transactions.map((row: { [s: string]: unknown; } | ArrayLike<unknown>, index: Key | null | undefined) => (
      <tr key={index} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
        {Object.values(row).map((value, idx) => (
          <td key={idx} className='px-6 py-4'>{String(value)}</td>
        ))}
      </tr>
    ));

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="text-[40px]">All Transactions</h1>
      <div className='border-4 border-pink-300 max-h-[600px] min-h-[500px] overflow-y-auto rounded-2xl'>
        <table className='table-fixed w-full text-left text-gray-500 text-sm dark:text-gray-400'>
          <thead className='bg-gray-50 text-gray-700 text-xs uppercase dark:bg-gray-700 dark:text-gray-300'>
            <tr className="sticky top-0 bg-gray-50 dark:bg-gray-700">
              {tableHeaders}
            </tr>
          </thead>
          <tbody className='px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-medium text-gray-300 tracking-wider'>
            {tableBody}
          </tbody>
        </table>
      </div>
    </div>
  );
}
