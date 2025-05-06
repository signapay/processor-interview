"use client";

import { useState, useEffect, useCallback } from "react"; // Import useEffect and useCallback
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

// Helper function to format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() is 0-indexed
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] =
    useState<ReportTypeOption>("");

  // Initialize dates with defaults: first day of current month and today
  // Assuming current date is May 6, 2025, from your context
  const today = new Date(2025, 4, 6); // Month is 0-indexed (0=Jan, 4=May)
  const firstDayCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  );

  const [startDate, setStartDate] = useState<string>(
    formatDate(firstDayCurrentMonth),
  );
  const [endDate, setEndDate] = useState<string>(formatDate(today));

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
    setMainReportData(null); // Clear previous data
    setRejectedTransactionsData(null); // Clear previous data
    setError(null);
    setCurrentReportTitle(""); // Reset title, will be set by fetch
    // Dates (startDate, endDate) retain their values.
    // If 'day' is selected, date pickers will show them.
    // If another type is selected, date pickers are hidden, but values persist for next time.
  };

  const handleFetchReport = useCallback(async () => {
    if (!selectedReportType) {
      // This condition might be primarily for the 'day' report button,
      // as useEffect guards against empty selectedReportType for auto-fetches.
      setError("Please select a report type.");
      setMainReportData(null);
      setRejectedTransactionsData(null);
      return;
    }
    if (selectedReportType === "day" && (!startDate || !endDate)) {
      setError("Please select a valid start and end date for 'By Day' report.");
      setMainReportData(null);
      setRejectedTransactionsData(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setMainReportData(null); // Clear previous data before new fetch
    setRejectedTransactionsData(null); // Clear previous data
    setCurrentReportTitle(""); // Will be set based on fetched report

    try {
      let mainData: ReportDataItem[] | null = null;
      let rejectedData: RejectedTransaction[] | null = null;

      // Always prepare the rejected transactions promise
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

        // Fetch main report and rejected transactions report concurrently for non-rejected types
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
          // For non-"rejected" reports, we might want to display rejected transactions
          // separately or not at all, depending on UI/UX preference.
          // For now, we'll fetch it but only explicitly display it if 'rejected' is selected.
          // If you have a dedicated section for "always show rejected transactions summary",
          // you could use this data.
          // For this example, we assume 'rejectedData' is primarily for the 'rejected' report type.
          // If selectedReportType is not "rejected", this data isn't directly shown by current logic.
        } else {
          console.error(
            "Error fetching rejected transactions:",
            rejectedResultSettled.reason,
          );
          // Optionally append to existing error if main report also failed
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
  }, [selectedReportType, startDate, endDate]); // Dependencies for useCallback

  // useEffect to trigger fetch when selectedReportType changes (for non-'day' types)
  useEffect(() => {
    if (selectedReportType && selectedReportType !== "day") {
      handleFetchReport();
    }
    // No action needed if selectedReportType is empty or "day" -
    // "day" uses the button, empty means no report selected.
  }, [selectedReportType, handleFetchReport]); // handleFetchReport is a dependency

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
            Cell: (value: string | number) => currencyFormatter(value),
          },
        ];
      case "day":
        return [
          { Header: "Date", accessor: "date" },
          {
            Header: "Total Volume",
            accessor: "totalAmount",
            Cell: (value: string | number) => currencyFormatter(value),
          },
        ];
      case "card":
        return [
          { Header: "Card Number (Masked)", accessor: "cardNumber" },
          {
            Header: "Total Volume",
            accessor: "totalAmount",
            Cell: (value: string | number) => currencyFormatter(value),
          },
        ];
      default:
        return [];
    }
  };

  const rejectedTransactionColumns = [
    { Header: "Card Number", accessor: "cardNumber" },
    {
      Header: "Timestamp",
      accessor: "timestamp",
      Cell: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: (value: number | string) => currencyFormatter(value),
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-700">
          Transaction Reports
        </h1>
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

        {/* Fetch button only shown for "day" report type */}
        {selectedReportType === "day" && (
          <div className="pt-4 mt-4 md:border-t md:border-gray-200">
            <button
              onClick={handleFetchReport}
              disabled={isLoading || !startDate || !endDate} // Disable if loading or dates not set
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

      {/* Main Report Table (not for 'rejected' type directly) */}
      {selectedReportType &&
        selectedReportType !== "rejected" &&
        mainReportData &&
        mainReportData.length > 0 && (
          <ReportTable
            title={currentReportTitle}
            data={mainReportData}
            columns={getMainReportColumns()}
          />
        )}
      {/* No data message for Main Report */}
      {selectedReportType &&
        selectedReportType !== "rejected" &&
        mainReportData &&
        mainReportData.length === 0 &&
        !isLoading && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {currentReportTitle || "Report"}
            </h3>
            <p className="text-gray-500">
              No data available for this report with the selected criteria.
            </p>
          </div>
        )}

      {/* Rejected Transactions Table (only if 'rejected' type is selected) */}
      {selectedReportType === "rejected" &&
        rejectedTransactionsData &&
        rejectedTransactionsData.length > 0 && (
          <ReportTable
            title={currentReportTitle || "Rejected Transactions"} // currentReportTitle should be set
            data={rejectedTransactionsData}
            columns={rejectedTransactionColumns}
          />
        )}
      {/* No data message for Rejected Transactions Report */}
      {selectedReportType === "rejected" &&
        rejectedTransactionsData &&
        rejectedTransactionsData.length === 0 &&
        !isLoading && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {currentReportTitle || "Rejected Transactions"}
            </h3>
            <p className="text-gray-500">No rejected transactions found.</p>
          </div>
        )}
    </div>
  );
}
