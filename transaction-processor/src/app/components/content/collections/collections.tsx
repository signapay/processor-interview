import { useTransactionContext } from "@/app/context/context";
import Table from "../../table/table";

export default function Collections() {
  const { state } = useTransactionContext();

  if (state.transactions.length === 0) {
    return null;
  }

  const headers = ["Account Name", "Card Number", "Transaction Amount"];

  const filterNegativeTransactions = (data: { [key: string]: string }[]) => {
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
      <h1 className="text-[40px]">Collections</h1>
      <Table headers={headers} data={filterNegativeTransactions(state.transactions)} />
    </div>
  );
}
