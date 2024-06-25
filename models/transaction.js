class Transaction {
  constructor() {
    this.transactions = [];
    this.accounts = {};
    this.badTransactions = [];
  }

  addTransaction(transaction) {
    const { "_0": accountName, "_1": cardNumber, "_2": amount, "_3": type, "_4": targetCardNumber } = transaction;

    // Validate transaction
    if (!this._isValidTransaction(transaction)) {
      this.badTransactions.push(transaction);
      return;
    }

    this.transactions.push(transaction);
    const transactionAmount = parseFloat(amount);

    switch(type.toLowerCase()) {
      case 'credit':
        this._creditAccount(accountName, transactionAmount);
        break;
      case 'debit':
        this._debitAccount(accountName, transactionAmount);
        break;
      case 'transfer':
        if (targetCardNumber) {
          this._transferAmount(accountName, targetCardNumber, transactionAmount);
        } else {
          this.badTransactions.push(transaction);
        }
        break;
      default:
        this.badTransactions.push(transaction);
    }
  }

  _isValidTransaction(transaction) {
    const { "_0": accountName, "_1": cardNumber, "_2": amount, "_3": type } = transaction;
    if (!accountName || !cardNumber || isNaN(amount) || !type) {
      return false;
    }
    return true;
  }

  _creditAccount(accountName, amount) {
    if (!this.accounts[accountName]) {
      this.accounts[accountName] = 0;
    }
    this.accounts[accountName] += amount;
  }

  _debitAccount(accountName, amount) {
    if (!this.accounts[accountName]) {
      this.accounts[accountName] = 0;
    }
    this.accounts[accountName] -= amount;
  }

  _transferAmount(fromAccount, toAccount, amount) {
    if (!this.accounts[fromAccount]) {
      this.accounts[fromAccount] = 0;
    }
    if (!this.accounts[toAccount]) {
      this.accounts[toAccount] = 0;
    }
    this.accounts[fromAccount] -= amount;
    this.accounts[toAccount] += amount;
  }

  getAccounts() {
    return Object.keys(this.accounts).map(account => ({
      name: account,
      balance: this.accounts[account]
    }));
  }

  getCollections() {
    return this.getAccounts().filter(account => account.balance < 0);
  }

  getBadTransactions() {
    return this.badTransactions;
  }

  reset() {
    this.transactions = [];
    this.accounts = {};
    this.badTransactions = [];
  }
}

module.exports = new Transaction();
