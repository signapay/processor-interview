import { useTransactionContext } from "@/app/context/context";
import Button from "../../button/button";
import { useState } from "react";
import AccountsByName from "./accountsByName";
import { formatUSD, getAccountBalance } from "@/app/utils/helpers";

interface AccountData {
  cardNumber: string;
  accountBalance: string;
}

export default function Accounts() {
  const [selectedAccountName, setSelectedAccountName] = useState<string | null>(null);
  const { state } = useTransactionContext();

  if (state.transactions.length === 0) {
    return null;
  }

  const uniqueAccountNames = Array.from(
    new Set(state.transactions.map((row) => row.accountName))
  );

  const uniqueAccountNumbersByName = (accountName: string | null): string[] => {
    return Array.from(
      new Set(
        state.transactions
          .filter((row) => row.accountName === accountName)
          .map((row) => row.cardNumber)
      )
    );
  };

  const aggregateTableData = (accountName: string): AccountData[] => {
    return uniqueAccountNumbersByName(accountName).map((cardNumber) => ({
      cardNumber,
      accountBalance: formatUSD(getAccountBalance(state.transactions, cardNumber)),
    }));
  };

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="mb-[24px] text-[40px]">Accounts</h1>
      <div className="flex flex-row">
        <div className="border-4 border-pink-300 basis-1/5 flex flex-col max-w-[240px] min-h-[600px] my-[56px] p-2 rounded-2xl">
          <h3 className="font-semibold">Account Names:</h3>
          {uniqueAccountNames.map((name) => (
            <Button key={name} label={name} variant="link" onClick={() => setSelectedAccountName(name)} />
          ))}
        </div>
        {!selectedAccountName && (
          <p className="mt-[52px] mx-2 text-[18px] text-yellow-500">
            * Select an Account Name from the list on the left to view associated accounts
          </p>
        )}
        {selectedAccountName && (
          <AccountsByName
            accountName={selectedAccountName}
            data={aggregateTableData(selectedAccountName)}
          />
        )}
      </div>
    </div>
  );
}
