import { useState, useEffect } from "react";
import ReportTable from "./ReportTable";
import * as apiClient from "@/services/apiClient";

interface VolumeByCardItem {
  cardNumber: string;
  totalAmount: number;
}

export default function ByCard() {
  const [data, setData] = useState<VolumeByCardItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.getTransactionsReportByCard();
        setData(result || []);
      } catch (err) {
        console.error("Error fetching card report:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch card report",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { Header: "Card Number (Masked)", accessor: "cardNumber" },
    {
      Header: "Total Volume",
      accessor: "totalAmount",
      Cell: (value: number) => `$${Number(value).toFixed(2)}`,
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
    <ReportTable<VolumeByCardItem>
      title="Volume by Card"
      data={data || []}
      columns={columns}
    />
  );
}
