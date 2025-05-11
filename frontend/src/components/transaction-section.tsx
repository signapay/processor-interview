"use client"

import { useState } from "react"
import { FileUpload } from "@/components/csv-upload" // This import matches your file name
import { TransactionTable } from "@/components/transaction-table"
import type { ApiResponse, TransactionData } from "@/lib/types"

export function TransactionSection() {
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDataReceived = (response: ApiResponse) => {
    if (response.success && response.data) {
      setTransactionData(response.data)
      setError(null)
    } else {
      setError(response.message || "Failed to process file")
      setTransactionData(null)
    }
  }

  return (
    <section className="w-full py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Transaction Management</h2>

        <div className="max-w-4xl mx-auto border border-gray-200 rounded bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-semibold">Recent Transactions</h3>
                <p className="text-sm text-gray-500">Upload a file to view your transactions</p>
              </div>
              <FileUpload onDataReceived={handleDataReceived} />
            </div>
          </div>

          <div className="p-4">
            {error && (
              <div className="p-3 mb-4 text-sm bg-red-50 border border-red-200 text-red-600 rounded">{error}</div>
            )}

            {transactionData ? (
              <TransactionTable data={transactionData} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Upload a transaction file to view your transaction history.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
