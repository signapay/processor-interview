import { useTransactionContext } from "@/app/context/context";
import { getNegativeBalanceAccounts, } from "@/app/utils/helpers";
import { collectionsKeyMap } from "@/app/constants";
import { Table } from "@/app/components/Table";

export default function Collections() {
  const { state } = useTransactionContext();

  if (!state.transactions || state.transactions.length === 0) {
    return null;
  }

  const headers = ["Card Number", "Account Balance"];

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="text-[40px]">Collections</h1>
      <p className="mt-[52px] mx-2 text-[18px] text-yellow-500">
        * The following accounts have a negative balance.
      </p>
      <Table headers={headers} data={getNegativeBalanceAccounts(state.transactions)} keyMap={collectionsKeyMap} />
    </div>
  );
}
