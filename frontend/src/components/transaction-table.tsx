import { formatCardNumber, formatCurrency, formatDate } from "@/lib/utils"
import type { TransactionData } from "@/lib/types"

interface TransactionTableProps {
  data: TransactionData
}

export function TransactionTable({ data }: TransactionTableProps) {
  // Flatten the nested structure into an array of transactions
  const transactions = Object.entries(data).flatMap(([cardNumber, dates]) =>
    Object.entries(dates).flatMap(([date, amounts]) =>
      amounts.map((amount) => ({
        cardNumber,
        date,
        amount,
      })),
    ),
  )

  // Sort by date (newest first)
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left text-xs font-medium text-gray-500 border-b">Card Number</th>
            <th className="p-2 text-left text-xs font-medium text-gray-500 border-b">Date</th>
            <th className="p-2 text-right text-xs font-medium text-gray-500 border-b">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                No transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border-b">{formatCardNumber(transaction.cardNumber)}</td>
                <td className="p-2 border-b">{formatDate(transaction.date)}</td>
                <td className={`p-2 text-right border-b ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                  {formatCurrency(transaction.amount)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
