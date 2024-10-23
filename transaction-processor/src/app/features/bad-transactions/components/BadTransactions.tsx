import { Table } from "@/app/components/Table";
import { useTransactionContext } from "@/app/context/context";

export default function BadTransactions() {
  const { state } = useTransactionContext();

  if (state.transactions.length === 0 && state.brokenData.length === 0) {
    return <h1>Upload file to begin.</h1>;
  }

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="text-[40px]">Bad Transactions</h1>
      {state.brokenData.length > 0 ? (
        <div>
          <p className="mt-[52px] mx-2 text-[18px] text-yellow-500">
            * The following line items were unable to be processed and need to be manually investigated.
          </p>
          <Table data={state.brokenData} />
        </div>
      ) : (
        <p className="text-yellow-500">No bad transactions found!</p>
      )}
    </div>
  );
}
