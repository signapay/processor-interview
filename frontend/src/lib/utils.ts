export function formatCardNumber(cardNumber: string): string {
  // Show only first three digits and mask the rest
  if (!cardNumber || cardNumber.length < 4) return cardNumber

  const firstThree = cardNumber.substring(0, 3)
  const maskedPart = "•".repeat(Math.min(12, cardNumber.length - 3))

  return `${firstThree}${maskedPart}`
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  } catch (error) {
    return dateString
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    signDisplay: "auto",
  }).format(amount)
}
