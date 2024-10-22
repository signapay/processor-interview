// export const getAccountBalance = (transactions: Transaction[]): AccountBalance[] => {
//   const accountBalance: AccountBalance[] = [];

//   transactions.forEach((transaction) => {
//     const { cardNumber, amount } = transaction;
//     const existingAccount = accountBalance.find((account) => account.cardNumber === cardNumber);

//     if (existingAccount) {
//       existingAccount.balance += amount;
//     } else {
//       accountBalance.push({ cardNumber, balance: amount });
//     }
//   });

//   return accountBalance;
// }

export const getAccountBalance = (transactions: any, cardNumber: string): number => {
  return transactions
    .filter((row) => row["Card Number"] === cardNumber)
    .reduce((acc, row) => {
      return acc + parseFloat(row["Transaction Amount"]);
    }, 0).toFixed(2);
}

export const formatUSD = (amount: number): string => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};