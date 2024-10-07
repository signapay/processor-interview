"use client"

import Link from 'next/link';
import DisplayCurrency from '@/app/components/DisplayCurrency';
import { useTransactionStore } from '@/app/store/transactionStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"

export default function Reports() {
  const { accountSummary, collectionsSummary, transactions } = useTransactionStore();

  if (transactions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        <p className="text-lg text-gray-600">No transactions loaded - please <Link href="/file-pool" className="text-blue-500 hover:underline">add some files</Link> to get started!</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      {accountSummary.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Account Summary</h2>
          {accountSummary.map((account, index) => (
            <div key={index} className="mb-6 p-4 rounded-lg shadow-lg">
              <h3 className="font-semibold mb-2">{account.name}</h3>
              <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Card Number</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {account.cards.map((card, cardIndex) => (
                      <TableRow key={cardIndex} className={cardIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                        <TableCell>{card.cardNumber}</TableCell>
                        <TableCell className="text-right"><DisplayCurrency amount={card.balance} decorated={true} /> </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Collections Summary</h2>
        <div className='mb-6 p-4 rounded-lg shadow-lg'>
        {collectionsSummary.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Card Number</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collectionsSummary.map((item, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <TableCell>{item.accountName}</TableCell>
                  <TableCell>{item.cardNumber}</TableCell>
                  <TableCell className="text-right"><DisplayCurrency amount={item.balance} decorated={true} /> </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-600">There are currently no accounts in collections.</p>
        )}
        </div>
      </div>
    </div>
  );
}