export interface Transaction {
  cardNumber: string
  dateTime: string
  amount: number
}

export interface TransactionData {
  [cardNumber: string]: {
    [date: string]: number[]
  }
}

export interface ApiResponse {
  success: boolean
  message?: string
  timestamp?: string
  data?: TransactionData
  report?: TransactionReport
}

export interface TransactionReport {
  byCard: { cardNumber: string; totalAmount: number; transactionCount: number }[]
  byCardType: { cardType: string; totalAmount: number; transactionCount: number }[]
  byDay: { date: string; totalAmount: number; transactionCount: number }[]
  rejectedTransactions: RejectedTransaction[]
  totalProcessed: number
  totalRejected: number
  totalAmount: number
}

export interface RejectedTransaction extends Transaction {
  reason: string
}
