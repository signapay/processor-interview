import { useTransactionContext } from "@/app/context/context";
import Table from "../../table/table";
import { getNegativeBalanceAccounts, } from "@/app/utils/helpers";
import { collectionsKeyMap } from "@/app/constants";

export default function Collections() {
  const { state } = useTransactionContext();

  if (!state.transactions || state.transactions.length === 0) {
    return null;
  }

  const headers = ["Card Number", "Account Balance"];

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="text-[40px]">Collections</h1>
      <Table headers={headers} data={getNegativeBalanceAccounts(state.transactions)} keyMap={collectionsKeyMap} />
    </div>
  );
}
