import { useState, useEffect } from "react";
import ReportTable from "./ReportTable";
import * as apiClient from "@/services/apiClient";

interface VolumeByDayItem {
  date: string;
  totalAmount: number;
}

export interface ByDayProps {
  startDate: string;
  endDate: string;
}

export default function ByDay({
  startDate,
  endDate,
}: ByDayProps) {
  const [data, setData] = useState<VolumeByDayItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = {
          startDate,
          endDate,
        };
        const result = await apiClient.getTransactionsReportByDay(params);
        setData(result || []);
      } catch (err) {
        console.error("Error fetching day report:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch day report",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const columns = [
    { Header: "Date", accessor: "date" },
    {
      Header: "Total Volume",
      accessor: "totalAmount",
      Cell: (value: string | number) =>
        value !== undefined ? `$${Number(value).toFixed(2)}` : "$0.00",
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
    <ReportTable<VolumeByDayItem>
      title="Volume by Day"
      data={data || []}
      columns={columns}
    />
  );
}
