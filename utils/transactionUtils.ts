  export interface Transaction {
    accountName: string;
    cardNumber: number;
    transactionAmount: number;
    transactionType: string;
    description?: string;
    targetCardNumber?: number;
  }

  export interface CardReport {
    accountNames: string[];
    cardNumber: number;
    balance: number;
    transactions: Transaction[];
  }

  export interface BadTransaction extends Omit<Transaction, 'cardNumber' | 'transactionAmount' | 'targetCardNumber'> {
    cardNumber: string;
    transactionAmount: string;
    targetCardNumber?: string;
    error: string;
  }

  export interface UploadRecord {
    filename: string;
    transactionCount: number;
  }

  interface AccountDetails {
    balance: number;
    transactions: Transaction[];
  }

  interface Accounts {
    [accountName: string]: {
      [cardNumber: number]: AccountDetails;
    };
  }

  export const processTransactions = (data: Transaction[]) => {
    const accounts: Accounts = {};
    const badTransactions: BadTransaction[] = [];
    let transactionCount = 0;

    data.forEach((transaction) => {
      transactionCount++;

      if (!transaction.accountName || !transaction.cardNumber || !transaction.transactionAmount || !transaction.transactionType) {
        badTransactions.push(createBadTransaction(transaction, 'Missing required fields'));
        return;
      }

      if (!['Credit', 'Debit', 'Transfer'].includes(transaction.transactionType)) {
        badTransactions.push(createBadTransaction(transaction, 'Invalid transaction type'));
        return;
      }

      if (!accounts[transaction.accountName]) {
        accounts[transaction.accountName] = {};
      }

      if (!accounts[transaction.accountName][transaction.cardNumber]) {
        accounts[transaction.accountName][transaction.cardNumber] = {
          balance: 0,
          transactions: [],
        };
      }

      const account = accounts[transaction.accountName][transaction.cardNumber];

      switch (transaction.transactionType) {
        case 'Credit':
          account.balance += transaction.transactionAmount;
          break;
        case 'Debit':
          account.balance -= transaction.transactionAmount;
          break;
        case 'Transfer':
          if (!transaction.targetCardNumber) {
            badTransactions.push(createBadTransaction(transaction, 'Missing target card number for transfer'));
            return;
          }
          account.balance -= transaction.transactionAmount;
          break;
      }

      account.transactions.push(transaction);
    });

    const cardReports = createCardReports(accounts);
    const collectionAccounts = findCollections(accounts);

    return { cardReports, badTransactions, collections: collectionAccounts, transactionCount };
  };

  const createBadTransaction = (transaction: Transaction, error: string): BadTransaction => ({
    ...transaction,
    cardNumber: String(transaction.cardNumber),
    transactionAmount: transaction.transactionAmount.toFixed(2),
    targetCardNumber: transaction.targetCardNumber ? String(transaction.targetCardNumber) : undefined,
    error,
  });

  const createCardReports = (accounts: Accounts): CardReport[] => {
    return Object.entries(accounts).flatMap(([accountName, cards]) =>
      Object.entries(cards).map(([cardNumber, cardDetails]) => ({
        accountNames: [accountName],
        cardNumber: Number(cardNumber),
        balance: parseFloat(cardDetails.balance.toFixed(2)),
        transactions: cardDetails.transactions.map((transaction) => ({
          ...transaction,
          transactionAmount: parseFloat(transaction.transactionAmount.toFixed(2)),
        })),
      }))
    );
  };

  const findCollections = (accounts: Accounts): string[] => {
    const collections: string[] = [];
    Object.values(accounts).forEach((cards) => {
      Object.values(cards).forEach((cardDetails) => {
        if (cardDetails.balance < 0) {
          collections.push(cardDetails.transactions[0].cardNumber.toString());
        }
      });
    });
    return collections;
  };
