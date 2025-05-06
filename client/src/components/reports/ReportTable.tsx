import React from "react";

interface ReportTableProps {
  title: string;
  data: any[]; // Replace 'any' with a more specific type if possible
  columns: {
    Header: string;
    accessor: string;
    Cell?: (cell: any) => React.ReactNode;
  }[];
}

export default function ReportTable({
  title,
  data,
  columns,
}: ReportTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">{title}</h3>
        <p className="text-gray-500">No data available for this report.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td
                    key={col.accessor}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {col.Cell ? col.Cell(row[col.accessor]) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
