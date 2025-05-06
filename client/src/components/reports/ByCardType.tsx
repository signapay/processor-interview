import { useState, useEffect } from "react";
import ReportTable from "./ReportTable";
import * as apiClient from "@/services/apiClient";

interface VolumeByCardTypeItem {
  cardType: string;
  totalAmount: number;
}

export default function ByCardType() {
  const [data, setData] = useState<VolumeByCardTypeItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.getTransactionsReportByCardType();
        setData(result || []);
      } catch (err) {
        console.error("Error fetching card type report:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch card type report",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { Header: "Card Type", accessor: "cardType" },
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
    <ReportTable<VolumeByCardTypeItem>
      title="Volume by Card Type"
      data={data || []}
      columns={columns}
    />
  );
}
