import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ChartBar, Eye } from "lucide-react";
import { useDataStore } from "@/stores/data-stores";
import { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { AccountChart } from "../account-chart";

export type Stats = {
  accountName: string;
  totalTransactions: number;
  totalNegative: number;
  totalAmount: string;
};

export const statcolumns: ColumnDef<Stats>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const { data } = useDataStore();
      const filterData = data?.filter(
        (f) => f.accountName == row.original.accountName
      );
      const [showPreview, setShowPreview] = useState(false);
      const [showChart, setShowChart] = useState(false);
      return (
        <>
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="min-w-[1200px]">
              <DialogTitle>
                Viewing all of{" "}
                <span className="underline font-bold text-green-500">
                  {row.original.accountName}
                </span>{" "}
                transactional record's
              </DialogTitle>
              <div className="max-h-[720px] overflow-y-auto">
                <DataTable
                  columns={columns}
                  data={filterData}
                  showRecordSize={false}
                />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showChart} onOpenChange={setShowChart}>
            <DialogContent className="min-w-[1200px]">
              <DialogTitle>{row.original.accountName} analytics</DialogTitle>
              <div className="max-h-[720px] overflow-y-auto">
                <AccountChart data={filterData} />
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center space-x-3">
            <Button
              variant={"ghost"}
              onClick={() => {
                setShowPreview(true);
                console.log(showPreview);
              }}
            >
              <Eye />
            </Button>

            <Button
              variant={"ghost"}
              className="hover:text-green-500"
              onClick={() => {
                setShowChart(true);
              }}
            >
              <ChartBar />
            </Button>
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "accountName",
    header: "Account Name",
  },
  {
    accessorKey: "totalTransactions",
    header: "Total Transactions",
  },
  {
    accessorKey: "totalNegative",
    header: "Total Negative Transactions",
    cell: ({ row }) => {
      const { data } = useDataStore();
      const filterData = data?.filter(
        (f) => f.accountName == row.original.accountName && f.amount < 0.0
      );
      const [showPreview, setShowPreview] = useState(false);

      return (
        <>
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="min-w-[1200px]">
              <DialogTitle>
                Viewing all of{" "}
                <span className="underline font-bold text-green-500">
                  {row.original.accountName}
                </span>{" "}
                negative transactional record's
              </DialogTitle>
              <div className="max-h-[720px] overflow-y-auto">
                <DataTable
                  columns={columns}
                  data={filterData}
                  showRecordSize={false}
                />
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant={"link"}
            onClick={() => {
              setShowPreview(true);
            }}
            className="underline"
          >
            {row.original.totalNegative}
          </Button>
        </>
      );
    },
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
      return <>{formatted}</>;
    },
  },
];
