import React from "react";

export default function CollectionList({ collections }) {
  const formatBalance = (balance) => {
    return balance < 0 ? `-$${Math.abs(balance).toFixed(2)}` : `$${balance.toFixed(2)}`;
  };


  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Collections</h2>
      <div className="bg-gray-100 p-2 rounded-md">
        <div className="overflow-y-auto max-h-[400px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {collections.map(([name, balance], index) => (
                <tr key={name}>
                  <td className="px-4 py-2 border-r whitespace-nowrap text-start text-sm font-semibold text-gray-700">{name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-start text-sm font-normal text-gray-700">{formatBalance(balance.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
