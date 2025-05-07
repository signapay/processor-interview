import { useState, useEffect } from "react";
import ReportTable from "./ReportTable";
import * as apiClient from "@/services/apiClient";

interface RejectedTransaction {
  cardNumber?: string;
  timestamp?: string;
  amount?: number;
}

export default function RejectedTransactions() {
  const [data, setData] = useState<RejectedTransaction[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.getRejectedTransactionsReport();
        setData(result || []);
      } catch (err) {
        console.error("Error fetching rejected transactions:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch rejected transactions",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { Header: "Card Number", accessor: "cardNumber" },
    {
      Header: "Timestamp",
      accessor: "timestamp",
      Cell: (val: string) => (val ? new Date(val).toLocaleDateString() : "N/A"),
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: (value: number | string | undefined) =>
        value !== undefined ? `$${Number(value).toFixed(2)}` : "$0.00",
    },
    {
      Header: "Reason",
      accessor: "reason",
    },
  ];

  if (isLoading) {
    return <div className="text-center text-gray-600">Loading report...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md shadow">
        {error}
      </div>
    );
  }

  return (
    <ReportTable<RejectedTransaction>
      title="Rejected Transactions"
      data={data || []}
      columns={columns}
    />
  );
}
