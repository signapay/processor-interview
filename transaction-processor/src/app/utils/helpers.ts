export const getAccountBalance = (transactions: any, cardNumber: string): number => {
  return transactions
    .filter((row) => row["Card Number"] === cardNumber)
    .reduce((acc, row) => {
      return acc + parseFloat(row["Transaction Amount"]);
    }, 0).toFixed(2);
}

export const getNegativeAccountBalances = (transactions: any): any[] => {
  return transactions
    .filter((row) => parseFloat(row["Transaction Amount"]) < 0)
    .map((row) => {
      return {
        "Account Name": row["Account Name"],
        "Card Number": row["Card Number"],
        "Transaction Amount": row["Transaction Amount"],
      };
    });
};

export const getUniqueAccountNumbers = (transactions: any): string[] => {
  return Array.from(new Set(transactions.map((row) => row["Card Number"])));
}

export const formatUSD = (amount: number): string => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};