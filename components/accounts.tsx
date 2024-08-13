"use client";
import { useDataStore } from "@/stores/data-stores";
import { DataTable } from "./tables/data-table";
import { statcolumns } from "./tables/stats-columns";
import { useEffect, useState } from "react";
import TableCard from "./ui/table-card";

export default function Accounts() {
  const { statsData } = useDataStore();

  return (
    <>
      {statsData && statsData.length > 0 && (
        <TableCard title="Account" desc="">
          <DataTable
            data={statsData}
            columns={statcolumns}
            showRecordSize={false}
          />
        </TableCard>
      )}
    </>
  );
}
