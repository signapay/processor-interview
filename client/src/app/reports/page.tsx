"use client";

import { useState } from "react";
import ReportTable from "@/components/reports/ReportTable";
import * as apiClient from "@/services/apiClient";

interface VolumeByCardTypeItem {
  cardType: string;
  totalAmount: number;
}

interface VolumeByDayItem {
  date: string;
  totalAmount: number;
}

interface VolumeByCardItem {
  cardNumber: string;
  totalAmount: number;
}

type ReportDataItem = VolumeByCardTypeItem | VolumeByDayItem | VolumeByCardItem;

interface RejectedTransaction {
  cardNumber?: string;
  timestamp?: string;
  amount?: number;
}

type ReportTypeOption = "cardType" | "day" | "card" | "rejected" | "";

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] =
    useState<ReportTypeOption>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [mainReportData, setMainReportData] = useState<ReportDataItem[] | null>(
    null,
  );
  const [rejectedTransactionsData, setRejectedTransactionsData] = useState<
    RejectedTransaction[] | null
  >(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentReportTitle, setCurrentReportTitle] = useState<string>("");

  const reportTypes: { label: string; value: ReportTypeOption }[] = [
    { label: "By Day", value: "day" },
    { label: "By Card", value: "card" },
    { label: "By Card Type", value: "cardType" },
    { label: "Rejected Transactions", value: "rejected" },
  ];

  const handleReportTypeSelect = (reportType: ReportTypeOption) => {
    setSelectedReportType(reportType);
    setMainReportData(null);
    setRejectedTransactionsData(null);
    setError(null);
    setCurrentReportTitle("");
    if (reportType !== "day") {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleFetchReport = async () => {
    if (!selectedReportType) {
      setError("Please select a report type.");
      setMainReportData(null);
      setRejectedTransactionsData(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setMainReportData(null);
    setRejectedTransactionsData(null);
    setCurrentReportTitle("");

    try {
      let mainData: ReportDataItem[] | null = null;
      let rejectedData: RejectedTransaction[] | null = null;

      const rejectedReportPromise = apiClient.getRejectedTransactionsReport();

      if (selectedReportType === "rejected") {
        setCurrentReportTitle("Rejected Transactions");
        const rejectedResult = await rejectedReportPromise;
        rejectedData = rejectedResult || [];
      } else {
        const params: apiClient.GetTransactionsReportParams = {
          groupBy: selectedReportType as "cardType" | "day" | "card",
        };
        if (selectedReportType === "day") {
          if (startDate) params.startDate = startDate;
          if (endDate) params.endDate = endDate;
        }
        const mainReportPromise = apiClient.getTransactionsReport(params);

        const [mainResultSettled, rejectedResultSettled] =
          await Promise.allSettled([mainReportPromise, rejectedReportPromise]);

        if (mainResultSettled.status === "fulfilled") {
          mainData = mainResultSettled.value || [];
          switch (selectedReportType) {
            case "cardType":
              setCurrentReportTitle("Volume by Card Type");
              break;
            case "day":
              setCurrentReportTitle("Volume by Day");
              break;
            case "card":
              setCurrentReportTitle("Volume by Card");
              break;
          }
        } else {
          console.error(
            "Error fetching main report:",
            mainResultSettled.reason,
          );
          setError(
            mainResultSettled.reason?.message || "Failed to fetch main report.",
          );
        }

        if (rejectedResultSettled.status === "fulfilled") {
          rejectedData = rejectedResultSettled.value || [];
        } else {
          console.error(
            "Error fetching rejected transactions:",
            rejectedResultSettled.reason,
          );
          setError((prevError) =>
            prevError
              ? `${prevError} And failed to fetch rejected transactions.`
              : rejectedResultSettled.reason?.message ||
                "Failed to fetch rejected transactions.",
          );
        }
      }
      setMainReportData(mainData);
      setRejectedTransactionsData(rejectedData);
    } catch (err: any) {
      console.error("Error in handleFetchReport:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const currencyFormatter = (value: number | string) =>
    value !== undefined ? `$${Number(value).toFixed(2)}` : "$0.00";

  const getMainReportColumns = () => {
    switch (selectedReportType) {
      case "cardType":
        return [
          { Header: "Card Type", accessor: "cardType" },
          {
            Header: "Total Volume",
            accessor: "totalAmount",
            Cell: (val: number) => currencyFormatter(val),
          },
        ];
      case "day":
        return [
          { Header: "Date", accessor: "date" },
          {
            Header: "Total Volume",
            accessor: "totalAmount",
            Cell: (val: number) => currencyFormatter(val),
          },
        ];
      case "card":
        return [
          { Header: "Card Number (Masked)", accessor: "cardNumber" },
          {
            Header: "Total Volume",
            accessor: "totalAmount",
            Cell: (val: number) => currencyFormatter(val),
          },
        ];
      default:
        return [];
    }
  };

  const rejectedTransactionColumns = [
    { Header: "Card Number", accessor: "cardNumber" },
    { Header: "Timestamp", accessor: "timestamp" },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: (val: number) => currencyFormatter(val),
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Transaction Reports
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Report Type
          </label>
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleReportTypeSelect(type.value)}
                className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  ${
                    selectedReportType === type.value
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {selectedReportType === "day" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 mt-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm appearance-none"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm appearance-none"
              />
            </div>
          </div>
        )}

        {selectedReportType && (
          <div className="pt-4 mt-4 md:border-t md:border-gray-200">
            <button
              onClick={handleFetchReport}
              disabled={isLoading}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm
                         disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              {isLoading ? "Fetching..." : "Fetch Report"}
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="mt-6 text-center text-gray-600">Loading reports...</div>
      )}
      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md shadow">
          {error}
        </div>
      )}

      {selectedReportType !== "rejected" &&
        mainReportData &&
        mainReportData.length > 0 && (
          <ReportTable
            title={currentReportTitle}
            data={mainReportData}
            columns={getMainReportColumns()}
          />
        )}
      {selectedReportType !== "rejected" &&
        mainReportData &&
        mainReportData.length === 0 &&
        !isLoading &&
        selectedReportType && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {currentReportTitle}
            </h3>
            <p className="text-gray-500">
              No data available for this report with the selected criteria.
            </p>
          </div>
        )}

      {selectedReportType === "rejected" &&
        rejectedTransactionsData &&
        rejectedTransactionsData.length > 0 && (
          <ReportTable
            title={
              selectedReportType === "rejected"
                ? currentReportTitle
                : "Rejected Transactions"
            }
            data={rejectedTransactionsData}
            columns={rejectedTransactionColumns}
          />
        )}
      {rejectedTransactionsData &&
        rejectedTransactionsData.length === 0 &&
        !isLoading &&
        selectedReportType && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {selectedReportType === "rejected"
                ? currentReportTitle
                : "Rejected Transactions"}
            </h3>
            <p className="text-gray-500">No rejected transactions found.</p>
          </div>
        )}
    </div>
  );
}
