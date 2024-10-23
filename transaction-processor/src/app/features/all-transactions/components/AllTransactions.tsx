import { useTransactionContext } from "@/app/context/context";
import { allTransactionsKeyMap, headers } from "@/app/constants";
import { Table } from "@/app/components/Table";

export default function AllTransactions() {
  const { state } = useTransactionContext();

  if (state.transactions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="text-[40px]">All Transactions</h1>
      <Table headers={headers} data={state.transactions} keyMap={allTransactionsKeyMap} />
    </div>
  );
}
