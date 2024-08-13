"use client";
import { useDataStore } from "@/stores/data-stores";
import { DataTable } from "./tables/data-table";
import TableCard from "./ui/table-card";
import { collectioncolumns } from "./tables/collection-columns";

export default function Collections() {
  const { collectionsData } = useDataStore();

  return (
    <>
      {collectionsData?.length == 0 && "No records reported for collection.."}
      {collectionsData && collectionsData?.length > 0 && (
        <TableCard title="Collections" desc="">
          <DataTable
            data={collectionsData}
            columns={collectioncolumns}
            showRecordSize={false}
          />
        </TableCard>
      )}
    </>
  );
}
