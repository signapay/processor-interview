import { Account, Transaction } from "../../types/types";
import React from "react";

type PersonalAccountProps = {
  account: Account;
  transactions: Transaction[];
};

const PersonalAccount: React.FC<PersonalAccountProps> = React.memo(({ account, transactions }) => {
  // Group transactions by card number
  const groupedTransactions = transactions.reduce((acc: { [key: string]: Transaction[] }, txn) => {
    const normalizedCardNumber = String(txn.cardNumber).trim(); // Normalize cardNumber
    if (!acc[normalizedCardNumber]) {
      acc[normalizedCardNumber] = [];
    }
    acc[normalizedCardNumber].push(txn);
    return acc;
  }, {});

  console.log("Grouped Transactions:", groupedTransactions);

  return (
    <div>
      <h3>Account Details for {account.accountName}</h3>
      <p>Total Balance: ${parseFloat(account.balance).toFixed(2)}</p>

      {Object.entries(account.cards).map(([cardNumber, balance], cardIndex) => {
        const formattedCardNumber = String(cardNumber).trim(); // Normalize for lookup
        console.log("Formatted Card Number:", formattedCardNumber);
        console.log("Grouped Transaction Keys:", Object.keys(groupedTransactions));

        return (
          <div key={cardIndex} className="card mb-3">
            <div className="card-header">
              Card {cardIndex + 1}: **** {formattedCardNumber.slice(-4)} - Balance: ${balance.toFixed(2)}
            </div>
            <div className="card-body">
              <h5 className="card-title">Transactions for **** {formattedCardNumber.slice(-4)}</h5>

              {groupedTransactions[formattedCardNumber]?.length > 0 ? (
                groupedTransactions[formattedCardNumber].map((txn, txnIndex) => (
                  <ul key={txnIndex}>
                    <li>
                      Type: {txn.type}
                      {txn.type === "Transfer" && txn.targetCardNumber && <span> (Target Card: **** {String(txn.targetCardNumber).slice(-4)})</span>}
                    </li>
                    <li>Amount: ${txn.amount}</li>
                    <li>Descripiton: {txn.description}</li>
                  </ul>
                ))
              ) : (
                <p>No transactions for this card</p>
              )}
            </div>
          </div>
        );
      })}

      {/* Display all transactions */}
      <div className="card mt-4">
        <div className="card-header">
          <h5>All Transactions</h5>
        </div>
        <div className="card-body">
          {transactions.length > 0 ? (
            transactions.map((txn, txnIndex) => (
              <ul>
                <li>
                  Type: {txn.type}
                  {txn.type === "Transfer" && txn.targetCardNumber && <span> (Target Card: **** {String(txn.targetCardNumber).slice(-4)})</span>}
                </li>
                <li>Amount: ${txn.amount}</li>
                <li>Description: {txn.description}</li>
              </ul>
            ))
          ) : (
            <p>No transactions for this account</p>
          )}
        </div>
      </div>
    </div>
  );
});

export default PersonalAccount;
