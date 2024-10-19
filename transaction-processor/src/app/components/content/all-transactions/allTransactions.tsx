
import { useTransactionContext } from "@/app/context/context";
import Table from "../../table/table";

export default function AllTransactions() {
  const { state } = useTransactionContext();

  if (state.transactions.length === 0) {
    return null;
  }

  const headers = ["Account Name", "Card Number", "Transaction Amount", "Transaction Type", "Description", "Target Card Number"];

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="text-[40px]">All Transactions</h1>
      <Table headers={headers} data={state.transactions} />
    </div>
  );
}
