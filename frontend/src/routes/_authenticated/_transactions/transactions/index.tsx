import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import type { Transaction } from "@/shared/types";
import { transactionsQueryOptions } from "@/lib/api";
import DataTable, { ColumnDef } from "@/components/transactions/Transactions";

export const Route = createFileRoute(
  "/_authenticated/_transactions/transactions/",
)({
  component: TransactionsComponent,
});

function TransactionsComponent() {
  const { isPending, data, error } = useQuery(transactionsQueryOptions);
  if (isPending) return "loading";
  if (error) return "error";

  return (
    <div>
      <div className="overflow-x-auto gap-2">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <DataTable<Transaction> data={data} columnDefs={columnDefs} />
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
