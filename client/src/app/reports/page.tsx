"use client";

import { useState } from "react";
import ByCardType from "@/components/reports/ByCardType";
import ByCard from "@/components/reports/ByCard";
import ByDay from "@/components/reports/ByDay";
import RejectedTransactions from "@/components/reports/RejectedTransactions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type ReportTypeOption = "cardType" | "day" | "card" | "rejected" | "";

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] =
    useState<ReportTypeOption>("");

  const today = new Date(2025, 4, 6);
  const firstDayCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  );

  const [startDate, setStartDate] = useState<Date>(firstDayCurrentMonth);
  const [endDate, setEndDate] = useState<Date>(today);
  const [triggerDayReportFetch, setTriggerDayReportFetch] = useState(false);

  const reportTypes: { label: string; value: ReportTypeOption }[] = [
    { label: "By Day", value: "day" },
    { label: "By Card", value: "card" },
    { label: "By Card Type", value: "cardType" },
    { label: "Rejected Transactions", value: "rejected" },
  ];

  const handleReportTypeSelect = (reportType: ReportTypeOption) => {
    setSelectedReportType(reportType);
    if (reportType === "day") {
      setTriggerDayReportFetch(false);
    }
  };

  const handleDateChange = (date: Date | null, isStartDate: boolean) => {
    if (!date) return;
    
    if (isStartDate) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setTriggerDayReportFetch(false);
  };

  const renderReportComponent = () => {
    switch (selectedReportType) {
      case "cardType":
        return <ByCardType />;
      case "card":
        return <ByCard />;
      case "day":
        return (
          <ByDay
            startDate={formatDate(startDate)}
            endDate={formatDate(endDate)}
            triggerFetch={triggerDayReportFetch}
          />
        );
      case "rejected":
        return <RejectedTransactions />;
      default:
        return null;
    }
  };

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
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => handleDateChange(date, true)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => handleDateChange(date, false)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={today}
                className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                onClick={() => setTriggerDayReportFetch(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Load Report
              </button>
            </div>
          </div>
        )}
      </div>

      {renderReportComponent()}
    </div>
  );
}
