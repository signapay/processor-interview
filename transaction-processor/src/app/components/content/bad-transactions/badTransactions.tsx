import { useTransactionContext } from "@/app/context/context";
import Table from "../../table/table";

export default function BadTransactions() {
  const { state } = useTransactionContext();

  if (state.transactions.length === 0 && state.brokenData.length === 0) {
    return <h1>Upload file to begin.</h1>;
  }

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="text-[40px]">Bad Transactions</h1>
      {state.brokenData.length > 0 ? (
        <Table data={state.brokenData} />
      ) : (
        <p className="text-yellow-500">No bad transactions found!</p>
      )}
    </div>
  );
}
