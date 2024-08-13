import { ColumnDef } from "@tanstack/react-table";

export type Stats = {
  accountName: string;
  totalAmount: string;
};

export const collectioncolumns: ColumnDef<Stats>[] = [
  {
    accessorKey: "accountName",
    header: "Account Name",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return (
        <div className={amount < 0.0 ? "text-red-500 font-semibold" : ""}>
          {formatted}
        </div>
      );
    },
  },
];
