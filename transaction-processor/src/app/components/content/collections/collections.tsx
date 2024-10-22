import { useTransactionContext } from "@/app/context/context";
import { formatUSD, getAccountBalance, getUniqueAccountNumbers } from "@/app/utils/helpers";
import Table from "../../table/table";


export default function Collections() {
  const { state } = useTransactionContext();

  if (state.transactions.length === 0) {
    return null;
  }

  const headers = ["Card Number", "Transaction Amount"];

  const getNegativeBalanceAccounts = (transactions) => {
    return getUniqueAccountNumbers(transactions)
      .filter((cardNumber) => getAccountBalance(transactions, cardNumber) < 0)
      .map((cardNumber) => {
        return {
          "Card Number": cardNumber,
          "Account Balance": formatUSD(getAccountBalance(transactions, cardNumber)),
        };
      });
  };

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="text-[40px]">Collections</h1>
      <Table headers={headers} data={getNegativeBalanceAccounts(state.transactions)} />
    </div>
  );
}
