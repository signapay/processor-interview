import { useTransactionContext } from "@/app/context/context";
import Table from "../../table/table";
import { getAccountBalance, getUniqueAccountNumbers } from "@/app/utils/helpers";
import { Transaction } from "@/app/context/types";
import { collectionsKeyMap } from "@/app/constants";

export default function Collections() {
  const { state } = useTransactionContext();

  if (!state.transactions || state.transactions.length === 0) {
    return null;
  }

  const headers = ["Card Number", "Account Balance"];

  const getNegativeBalanceAccounts = (transactions: Transaction[]) =>
    getUniqueAccountNumbers(transactions)
      .filter((cardNumber) => getAccountBalance(transactions, cardNumber) < 0)
      .map((cardNumber) => ({
        cardNumber,
        accountBalance: getAccountBalance(transactions, cardNumber),
      }));

  const negativeBalanceAccounts = getNegativeBalanceAccounts(state.transactions);

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="text-[40px]">Collections</h1>
      <Table headers={headers} data={negativeBalanceAccounts} keyMap={collectionsKeyMap} />
    </div>
  );
}
