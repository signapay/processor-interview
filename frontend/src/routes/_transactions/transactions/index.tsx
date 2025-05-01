import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { Transaction } from "@/shared/types";
import testData from "../../../../../test/test.json";
import DataTable, { ColumnDef } from "@/components/transactions/Transactions";

export const Route = createFileRoute("/_transactions/transactions/")({
  component: TransactionsComponent,
});

function TransactionsComponent() {
  return (
    <div>
      <div className="overflow-x-auto">
        <DataTable<Transaction>
          data={testData as Transaction[]}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
}

const columnDefs: ColumnDef<Transaction>[] = [
  {
    key: "id",
    header: "ID",
  },
  {
    key: "cardNumber",
    header: "Card Number",
  },
  {
    key: "timestamp",
    header: "Timestamp",
  },
  {
    key: "amount",
    header: "Amount",
  },
];
