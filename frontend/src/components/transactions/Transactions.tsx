export type ColumnDef<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T]) => React.ReactNode;
};

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columnDefs: ColumnDef<T>[];
}

const DataTable = <T extends { id: string | number }>({
  data,
  columnDefs,
}: DataTableProps<T>) => {
  return (
    <table className="table table-xs table-zebra">
      <thead>
        <tr>
          {columnDefs.map((column) => (
            <th key={`${String(column.key)}-header`}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={String(row)}>
            {columnDefs.map((column) => (
              <td key={`${row.id}-${String(column.key)}`}>
                {column.render && typeof column.render === "function"
                  ? column.render(row[column.key])
                  : String(row[column.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
