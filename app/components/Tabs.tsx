import { TabsProps } from "types/types";

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div>
      <button onClick={() => onTabChange("accounts")}>Accounts</button>
      <button onClick={() => onTabChange("collections")}>Collections</button>
      <button onClick={() => onTabChange("badTransactions")}>Bad Transactions</button>
    </div>
  );
}
