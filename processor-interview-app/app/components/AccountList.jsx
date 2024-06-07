import { useEffect, useState } from 'react';
import { DropdownOpenIcon, DropdownClosedIcon } from './Common';

export default function AccountList({ accounts }) {
  const [expandedAccounts, setExpandedAccounts] = useState({});

  const toggleAccount = (name) => {
    setExpandedAccounts((prevExpandedAccounts) => ({
      ...prevExpandedAccounts,
      [name]: !prevExpandedAccounts[name],
    }));
  };
  const formatBalance = (balance) => {
    return balance < 0 ? `-$${Math.abs(balance).toFixed(2)}` : `$${balance.toFixed(2)}`;
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Accounts</h2>
      {Object.entries(accounts).map(([name, account]) => (
        <div key={name} className="border  mb-2">
          <div className="flex items-center p-4 justify-between cursor-pointer" onClick={() => toggleAccount(name)}>
            <h3 className="font-bold">{name}</h3>
            {expandedAccounts[name] ? DropdownClosedIcon : DropdownOpenIcon}
          </div>
          {expandedAccounts[name] && (
            <div className="bg-gray-100 p-2 rounded-md">
              <div className="overflow-y-auto max-h-[400px]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(account.cards).map(([card, balance]) => (
                      <tr key={card}>
                        <td className="px-4 py-2 w-1/2 whitespace-nowrap text-start border-r text-sm font-semibold text-gray-700">{card}</td>
                        <td className="px-4 py-2 w-1/2 whitespace-nowrap text-start text-sm font-normal text-gray-700">{formatBalance(balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
