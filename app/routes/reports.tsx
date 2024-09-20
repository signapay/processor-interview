import { useLoaderData } from "@remix-run/react";
import { BadTransaction } from "types/types";

type Account = {
  name: string;
  balance: number;
  cards: {
    number: string;
    balance: number;
  }[];
};

type LoaderData = {
  accounts: Account[];
  badTransactions: BadTransaction[];
};

export default function ReportPage() {
  const { accounts, badTransactions } = useLoaderData<LoaderData>();

  return (
    <div>
      <h2>Accounts</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account.name}>
            {account.name}: {account.balance}
            <ul>
              {account.cards.map((card) => (
                <li key={card.number}>
                  Card: {card.number}, Balance: {card.balance}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h2>Bad Transactions</h2>
      <ul>
        {badTransactions ? (
          badTransactions.map((transaction, index) => (
            <li key={index}>
              Account: {transaction.accountName}, Card: {transaction.cardNumber}, Amount: {transaction.transactionAmount}
            </li>
          ))
        ) : (
          <p>No transactions...</p>
        )}
      </ul>
    </div>
  );
}
