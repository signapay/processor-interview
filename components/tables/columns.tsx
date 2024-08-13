import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { CircleX, Eye } from "lucide-react";
import { useDataStore } from "@/stores/data-stores";

const cardMask = (card: string) => {
  const cardNumber = card.toString();
  const n = cardNumber.length;
  const lastFour = cardNumber.slice(-4);
  const remaining = cardNumber.slice(0, n - 4);
  return "x".repeat(remaining.length) + lastFour;
};

export type Transactions = {
  accountName: string;
  cardNumber: number;
  amount: number;
  type: string;
  desc: string;
  target: number;
  hasErrors: false;
  badFields: [];
};

export const columns: ColumnDef<Transactions>[] = [
  {
    accessorKey: "accountName",
    header: "Account Name",
  },
  {
    accessorKey: "cardNumber",
    header: ({ column }) => {
      const { toggleCreditMask } = useDataStore();

      return (
        <div className="flex items-center space-x-3">
          <span>Card Number</span>
          <Button variant={"ghost"} onClick={toggleCreditMask}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      let error = false;
      if (row.original.badFields.includes("cardNumber")) error = true;

      const { creditMask } = useDataStore();
      const masked = cardMask(row.original.cardNumber.toString());

      return (
        <div className={error ? "text-red-500 underline" : ""}>
          {creditMask ? masked : row?.original.cardNumber}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      let error = false;
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      if (row.original.badFields.includes("amount")) error = true;
      return (
        <div className={error ? "text-red-500 underline" : ""}>
          {error ? row.getValue("amount") : formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "desc",
    header: "Desc",
  },
  {
    accessorKey: "target",
    header: ({ column }) => {
      const { toggleTargetMask } = useDataStore();

      return (
        <div className="flex items-center space-x-3">
          <span>Target</span>
          <Button variant={"ghost"} onClick={toggleTargetMask}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      let error = false;
      if (row.original.badFields.includes("target")) error = true;
      if (row.original.target) {
        const { targetMask } = useDataStore();
        const masked = cardMask(row.original.target.toString());

        return (
          <div className={error ? "text-red-500 underline" : ""}>
            {targetMask ? masked : row?.original.target}
          </div>
        );
      } else {
        <div className={error ? "text-red-500 underline" : ""}>
          {row.original.target}
        </div>;
      }
    },
  },
  {
    accessorKey: "hasError",
    header: "",
    cell: ({ row }) => {
      return (
        <div className={!row.original.hasErrors ? "hidden" : "text-red-500"}>
          <CircleX />
        </div>
      );
    },
  },
];
