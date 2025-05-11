"use server"

import type { Transaction, TransactionReport, RejectedTransaction, ApiResponse } from "@/lib/types"
import { getCardType, getDateFromTimestamp } from "@/lib/utils"

// This is a server action that will process transaction data and return a report
export async function processTransactionFile(transactions: Transaction[]): Promise<ApiResponse> {
  try {
    // Log the data being processed (for development purposes)
    console.log("Processing transactions:", transactions.length)

    // Simulate API processing with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Process the transactions and generate a report
    const report = generateTransactionReport(transactions)

    // Return the report
    return {
      success: true,
      message: `Successfully processed ${report.totalProcessed} transactions. ${report.totalRejected} were rejected.`,
      timestamp: new Date().toISOString(),
      report,
    }
  } catch (error) {
    console.error("Error processing transactions:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to process transactions",
      timestamp: new Date().toISOString(),
    }
  }
}

// This is a server action that will receive transaction data and return a report
export async function sendTransactionsToApi(transactions: Transaction[]): Promise<ApiResponse> {
  return processTransactionFile(transactions)
}

function generateTransactionReport(transactions: Transaction[]): TransactionReport {
  // Initialize report data structures
  const byCardMap = new Map<string, { totalAmount: number; transactionCount: number }>()
  const byCardTypeMap = new Map<string, { totalAmount: number; transactionCount: number }>()
  const byDayMap = new Map<string, { totalAmount: number; transactionCount: number }>()
  const rejectedTransactions: RejectedTransaction[] = []

  let totalAmount = 0

  // Process each transaction
  transactions.forEach((transaction) => {
    // Validate transaction (simple example - in real world would be more complex)
    if (!isValidCardNumber(transaction.cardNumber)) {
      rejectedTransactions.push({
        ...transaction,
        reason: "Invalid card number",
      })
      return
    }

    if (!isValidDate(transaction.dateTime)) {
      rejectedTransactions.push({
        ...transaction,
        reason: "Invalid date format",
      })
      return
    }

    if (transaction.amount <= 0) {
      rejectedTransactions.push({
        ...transaction,
        reason: "Invalid amount",
      })
      return
    }

    // Random rejection for demonstration purposes (about 5% of transactions)
    if (Math.random() < 0.05) {
      rejectedTransactions.push({
        ...transaction,
        reason: "Transaction declined by issuer",
      })
      return
    }

    // Process valid transaction

    // Update total amount
    totalAmount += transaction.amount

    // Group by card number
    const cardKey = transaction.cardNumber
    const cardEntry = byCardMap.get(cardKey) || { totalAmount: 0, transactionCount: 0 }
    cardEntry.totalAmount += transaction.amount
    cardEntry.transactionCount += 1
    byCardMap.set(cardKey, cardEntry)

    // Group by card type
    const cardType = getCardType(transaction.cardNumber)
    const cardTypeEntry = byCardTypeMap.get(cardType) || { totalAmount: 0, transactionCount: 0 }
    cardTypeEntry.totalAmount += transaction.amount
    cardTypeEntry.transactionCount += 1
    byCardTypeMap.set(cardType, cardTypeEntry)

    // Group by day
    const day = getDateFromTimestamp(transaction.dateTime)
    const dayEntry = byDayMap.get(day) || { totalAmount: 0, transactionCount: 0 }
    dayEntry.totalAmount += transaction.amount
    dayEntry.transactionCount += 1
    byDayMap.set(day, dayEntry)
  })

  // Convert maps to arrays for the report
  const byCard = Array.from(byCardMap.entries()).map(([cardNumber, data]) => ({
    cardNumber,
    totalAmount: data.totalAmount,
    transactionCount: data.transactionCount,
  }))

  const byCardType = Array.from(byCardTypeMap.entries()).map(([cardType, data]) => ({
    cardType,
    totalAmount: data.totalAmount,
    transactionCount: data.transactionCount,
  }))

  const byDay = Array.from(byDayMap.entries()).map(([date, data]) => ({
    date,
    totalAmount: data.totalAmount,
    transactionCount: data.transactionCount,
  }))

  // Sort the arrays
  byCard.sort((a, b) => b.totalAmount - a.totalAmount)
  byCardType.sort((a, b) => b.totalAmount - a.totalAmount)
  byDay.sort((a, b) => a.date.localeCompare(b.date))

  return {
    byCard,
    byCardType,
    byDay,
    rejectedTransactions,
    totalProcessed: transactions.length - rejectedTransactions.length,
    totalRejected: rejectedTransactions.length,
    totalAmount,
  }
}

// Simple validation functions
function isValidCardNumber(cardNumber: string): boolean {
  // Basic validation - in real world would use Luhn algorithm
  return /^\d{13,19}$/.test(cardNumber.replace(/\s/g, ""))
}

function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}
