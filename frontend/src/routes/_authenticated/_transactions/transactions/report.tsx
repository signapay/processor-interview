import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

import {
  rejectedTransactionsQueryOptions,
  transactionSummaryByCardQueryOptions,
  transactionSummaryByCardTypeQueryOptions,
  transactionSummaryByDayQueryOptions,
} from "@/lib/api";
import DataTable, { ColumnDef } from "@/components/transactions/Transactions";
import type { CardSummary, CardTypeSummary, DaySummary, RejectedTransaction } from "@/shared/types";

export const Route = createFileRoute("/_authenticated/_transactions/transactions/report")({
  component: SummaryComponent,
});

function SummaryComponent() {
  // Fetch all summary data
  const {
    data: cardSummary,
    isPending: isCardSummaryPending,
    error: cardSummaryError
  } = useQuery(transactionSummaryByCardQueryOptions);

  const {
    data: cardTypeSummary,
    isPending: isCardTypeSummaryPending,
    error: cardTypeSummaryError
  } = useQuery(transactionSummaryByCardTypeQueryOptions);

  const {
    data: daySummary,
    isPending: isDaySummaryPending,
    error: daySummaryError
  } = useQuery(transactionSummaryByDayQueryOptions);

  const {
    data: rejectedTransactions,
    isPending: isRejectedTransactionsPending,
    error: rejectedTransactionsError
  } = useQuery(rejectedTransactionsQueryOptions);

  // Loading state
  if (isCardSummaryPending || isCardTypeSummaryPending || isDaySummaryPending || isRejectedTransactionsPending) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading summary data...</p>
      </div>
    );
  }

  // Error state
  if (cardSummaryError || cardTypeSummaryError || daySummaryError || rejectedTransactionsError) {
    return (
      <div className="rounded-md bg-destructive/15 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-destructive">Error loading summary data</h3>
            <div className="mt-2 text-sm text-destructive/80">
              <p>
                {cardSummaryError?.message ??
                 cardTypeSummaryError?.message ??
                 daySummaryError?.message ??
                 rejectedTransactionsError?.message ??
                 "An unknown error occurred"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Transaction Reports</h1>

      {/* Card Summary */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Summary by Card</h2>
          <div className="overflow-x-auto">
            <DataTable<CardSummary>
              data={cardSummary || []}
              columnDefs={cardSummaryColumns}
            />
          </div>
        </div>
      </div>

      {/* Card Type Summary */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Summary by Card Type</h2>
          <div className="overflow-x-auto">
            <DataTable<CardTypeSummary>
              data={cardTypeSummary || []}
              columnDefs={cardTypeSummaryColumns}
            />
          </div>
        </div>
      </div>

      {/* Day Summary */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Summary by Day</h2>
          <div className="overflow-x-auto">
            <DataTable<DaySummary>
              data={daySummary || []}
              columnDefs={daySummaryColumns}
            />
          </div>
        </div>
      </div>

      {/* Rejected Transactions */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Rejected Transactions</h2>
          <div className="overflow-x-auto">
            <DataTable<RejectedTransaction>
              data={rejectedTransactions || []}
              columnDefs={rejectedTransactionsColumns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Column definitions for each table
const cardSummaryColumns: ColumnDef<CardSummary>[] = [
  {
    key: "cardLastFour",
    header: "Card Last Four",
  },
  {
    key: "cardType",
    header: "Card Type",
  },
  {
    key: "totalAmount",
    header: "Total Amount",
    render: (value) => `$${Number(value).toFixed(2)}`,
  },
  {
    key: "transactionCount",
    header: "Transaction Count",
  },
];

const cardTypeSummaryColumns: ColumnDef<CardTypeSummary>[] = [
  {
    key: "cardType",
    header: "Card Type",
  },
  {
    key: "totalAmount",
    header: "Total Amount",
    render: (value) => `$${Number(value).toFixed(2)}`,
  },
  {
    key: "transactionCount",
    header: "Transaction Count",
  },
];

const daySummaryColumns: ColumnDef<DaySummary>[] = [
  {
    key: "date",
    header: "Date",
  },
  {
    key: "totalAmount",
    header: "Total Amount",
    render: (value) => `$${Number(value).toFixed(2)}`,
  },
  {
    key: "transactionCount",
    header: "Transaction Count",
  },
];

const rejectedTransactionsColumns: ColumnDef<RejectedTransaction>[] = [
  {
    key: "id",
    header: "ID",
  },
  {
    key: "rejectionReason",
    header: "Rejection Reason",
  },
  {
    key: "processedAt",
    header: "Processed At",
    render: (value) => new Date(String(value)).toLocaleString(),
  },
];
