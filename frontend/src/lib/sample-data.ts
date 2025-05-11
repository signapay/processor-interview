import type { Transaction } from "./types"

export function generateSampleTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = []

  const cardPrefixes = ["411", "512", "377", "601", "342"]

  const now = new Date()

  for (let i = 0; i < count; i++) {
    // Generate random card number with one of the prefixes
    const prefix = cardPrefixes[Math.floor(Math.random() * cardPrefixes.length)]
    const cardNumber = prefix + Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join("")

    // Generate random date within the last 30 days
    const date = new Date(now)
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60))

    // Generate random amount between $10 and $1000
    const amount = Math.round((10 + Math.random() * 990) * 100) / 100

    transactions.push({
      cardNumber,
      dateTime: date.toISOString(),
      amount,
    })
  }

  // Sort by date, most recent first
  return transactions.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
}
