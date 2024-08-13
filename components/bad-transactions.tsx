"use client";
import { DataTable } from "./tables/data-table";
import { columns } from "./tables/columns";
import { useDataStore } from "@/stores/data-stores";
import TableCard from "./ui/table-card";
export default function BadTransactions() {
  const { badTransactionsData } = useDataStore();
  return (
    <>
      {badTransactionsData?.length == 0 && "No bad transactions found.."}
      {badTransactionsData && badTransactionsData?.length > 0 && (
        <TableCard
          title="Bad Transactions"
          desc={
            <>
              We are unable to processes these records due to the highlighted{" "}
              <span className="text-red-500 underline">red</span> fields.. please correct these issues and try again!
            </>
          }
        >
          <DataTable
            data={badTransactionsData}
            columns={columns}
            showRecordSize={false}
          />
        </TableCard>
      )}
    </>
  );
}
