import { headers } from "@/app/constants";
import Table from "../../table/table";
import { useTransactionContext } from "@/app/context/context";

export default function BadTransactions() {
  const { state } = useTransactionContext();

  if (state.transactions.length === 0) {
    return (
      <h1>Upload file to begin.</h1>
    )
  }

  const filterNegativeTransactions = (data: { [key: string]: string }[]) => {
    // return data
    // filter items that can't be parsed
    return data
      .filter(row => parseFloat(row["Transaction Amount"]) < 0)
      .map(row => ({
        "Account Name": row["Account Name"],
        "Card Number": row["Card Number"],
        "Transaction Amount": row["Transaction Amount"],
      }));
  };

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="text-[40px]">Bad Transactions</h1>
      <Table headers={headers} data={filterNegativeTransactions(state.transactions)} />
    </div>
  );
}

