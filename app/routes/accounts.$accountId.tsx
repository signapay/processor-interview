import React from "react";
import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Account, Transaction } from "../../types/types";
import PersonalAccount from "../components/PersonalAccount";

export const loader: LoaderFunction = async ({ params }) => {
  const { accountId } = params;

  // Ensure accountId is present
  if (!accountId) {
    throw new Response("Account ID is missing", { status: 400 });
  }

  // Fetch the account data
  const accountResponse = await fetch(`http://localhost:4000/accounts/${encodeURIComponent(accountId)}`);
  if (!accountResponse.ok) {
    throw new Response("Account not found", { status: 404 });
  }
  const account = await accountResponse.json();

  // Fetch the account transactions
  const transactionsResponse = await fetch(`http://localhost:4000/accounts/${encodeURIComponent(accountId)}/transactions`);
  if (!transactionsResponse.ok) {
    throw new Response("Transactions not found", { status: 404 });
  }
  const transactions = await transactionsResponse.json();

  return json({
    account: account as Account, // Cast account to Account type
    transactions: transactions as Transaction[], // Cast transactions to Transaction[] type
  });
};

export default function AccountDetailsPage() {
  const { account, transactions } = useLoaderData<{ account: Account; transactions: Transaction[] }>();

  return <PersonalAccount account={account} transactions={transactions} />;
}
