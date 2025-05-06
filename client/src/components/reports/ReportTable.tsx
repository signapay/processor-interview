import React from "react";

interface Column<T> {
  Header: string;
  accessor: keyof T | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Cell?: (value: any) => React.ReactNode;
}

interface ReportTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
}

export default function ReportTable<T>({
  title,
  data,
  columns,
}: ReportTableProps<T>) {
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
                  key={String(col.accessor)}
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
                {columns.map((col) => {
                  const accessor = String(col.accessor);
                  // Use type assertion to handle dynamic property access
                  const value = row[accessor as keyof T];

                  return (
                    <td
                      key={accessor}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {col.Cell
                        ? col.Cell(value)
                        : // Safely convert the value to a React-renderable type
                          value === null || value === undefined
                          ? ""
                          : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
