import { formatCardNumber, formatCurrency, formatDate } from "@/lib/utils"
import type { TransactionReport } from "@/lib/types"

interface TransactionReportProps {
  report: TransactionReport
}

export function TransactionReport({ report }: TransactionReportProps) {
  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Transaction Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Processed</p>
            <p className="text-xl font-bold">{report.totalProcessed} transactions</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-bold">{formatCurrency(report.totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rejected Transactions</p>
            <p className="text-xl font-bold">{report.totalRejected} transactions</p>
          </div>
        </div>
      </div>

      {/* By Card Type */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Volume by Card Type</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card Type
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Count
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report.byCardType.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.cardType}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-right">{item.transactionCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* By Day */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Volume by Day</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Count
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report.byDay.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatDate(item.date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-right">{item.transactionCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* By Card */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Volume by Card</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card Number
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Count
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report.byCard.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCardNumber(item.cardNumber)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-right">{item.transactionCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejected Transactions */}
      {report.rejectedTransactions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Rejected Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Card Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.rejectedTransactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatCardNumber(transaction.cardNumber)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(transaction.dateTime)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(transaction.amount)}</td>
                    <td className="px-4 py-3 text-sm text-red-600">{transaction.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
