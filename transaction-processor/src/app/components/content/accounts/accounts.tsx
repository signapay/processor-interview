
import { useTransactionContext } from "@/app/context/context";
import Button from "../../button/button";
import { useState } from "react";
import AccountsByName from "./accountsByName";
import { formatUSD, getAccountBalance } from "@/app/utils/helpers";

export default function Accounts() {
  const [selectedAccountName, setSelectedAccountName] = useState(null);

  const { state } = useTransactionContext();

  if (state.transactions.length === 0) {
    return null;
  }

  const uniqueAccountNames = Array.from(
    new Set(state.transactions.map((row) => row["Account Name"]))
  );

  const uniqueAccountNumbersByName = (accountName: string | null) => {
    return Array.from(
      new Set(
        state.transactions
          .filter((row) => row["Account Name"] === accountName)
          .map((row) => row["Card Number"])
      )
    );
  };

  const aggregateTableData = (accountName: string) => {
    return uniqueAccountNumbersByName(accountName).map((cardNumber) => {
      return {
        "Card Number": cardNumber,
        "Account Balance": formatUSD(getAccountBalance(state.transactions, cardNumber)),
      };
    });
  };

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="mb-[24px] text-[40px]">Accounts</h1>
      <div className="flex flex-row">
        <div className="border-2 border-white basis-1/5 flex flex-col max-w-[240px] min-h-[600px] my-[56px] p-2 rounded-xl">
          <h3 className="font-semibold">Account Names:</h3>
          {uniqueAccountNames.map((name) => {
            return (
              <Button label={name} variant={"link"} onClick={() => setSelectedAccountName(name)} />
            );
          })}
        </div>
        {!selectedAccountName && <p className="mt-[52px] mx-2 text-[18px] text-yellow-500">* Select an Account Name from the list on the left to view associated accounts</p>}
        {selectedAccountName && <AccountsByName accountName={selectedAccountName} data={aggregateTableData(selectedAccountName)} />}
      </div>
    </div>
  );
}
