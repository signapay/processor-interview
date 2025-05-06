import { useQuery } from '@tanstack/react-query';
import {
  type ColumnDef,
  type Row,
  type Table,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { type VirtualItem, type Virtualizer, useVirtualizer } from '@tanstack/react-virtual';
import { formatDateToLocale } from 'client/shared/dateFormatter';
import { formatAmount } from 'client/shared/numberFormatter';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { type RefObject, useRef } from 'react';
import type { Transaction } from '../shared/entity';
import { useTitle } from '../shared/hooks/useTitle';
import s from './TransactionList.module.css';
import { TransactionToolbar } from './TransactionToolbar';

const columns = [
  {
    header: 'Card Type',
    id: 'cardType',
    accessorFn: (row) => row.cardType,
  },
  {
    header: 'Card Number',
    id: 'cardNumber',
    accessorFn: (row) => row.cardNumber,
  },
  {
    header: 'Amount',
    id: 'amount',
    accessorFn: (row) => row.amount,
    cell: ({ row }) => (
      <span className={`amount ${row.original.amount >= 0 ? 'positive' : 'negative'}`}>
        {formatAmount(row.original.amount)}
      </span>
    ),
  },
  {
    header: 'Date',
    id: 'date',
    accessorFn: (row) => row.timestamp,
    cell: ({ row }) => formatDateToLocale(row.original.timestamp),
    size: 200,
  },
  {
    header: 'Status',
    id: 'status',
    accessorFn: (row) => row.isValid,
    cell: ({ row }) =>
      row.original.isValid ? (
        <span className="positive">ok</span>
      ) : (
        <span className="negative">{row.original.rejectionReason}</span>
      ),
  },
] satisfies ColumnDef<Transaction>[];

export default function TransactionList() {
  useTitle('Transactions');

  const { data = [] } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={`container ${s.container}`}>
      <TransactionToolbar />
      <div
        ref={tableContainerRef}
        style={{
          overflow: 'auto', //our scrollable table container
          position: 'relative', //needed for sticky header
          height: 'calc(100vh - 100px)', //should be a fixed height
        }}
      >
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <table style={{ display: 'grid' }}>
          <thead
            style={{
              display: 'grid',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      style={{
                        // display: 'flex',
                        width: header.getSize(),
                        ...(header.column.id === 'amount' ? { textAlign: 'center' } : {}),
                      }}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ArrowUpIcon size={12} />,
                          desc: <ArrowDownIcon size={12} />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <TableBody table={table} tableContainerRef={tableContainerRef} />
        </table>
      </div>
    </div>
  );
}

interface TableBodyProps {
  table: Table<Transaction>;
  tableContainerRef: RefObject<HTMLDivElement>;
}

function TableBody({ table, tableContainerRef }: TableBodyProps) {
  const { rows } = table.getRowModel();

  // Important: Keep the row virtualizer in the lowest component possible to avoid unnecessary re-renders.
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 30, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  return (
    <tbody
      style={{
        display: 'grid',
        height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
        position: 'relative', //needed for absolute positioning of rows
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<Transaction>;
        return <TableBodyRow key={row.id} row={row} virtualRow={virtualRow} rowVirtualizer={rowVirtualizer} />;
      })}
    </tbody>
  );
}

interface TableBodyRowProps {
  row: Row<Transaction>;
  virtualRow: VirtualItem;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
}

function TableBodyRow({ row, virtualRow, rowVirtualizer }: TableBodyRowProps) {
  return (
    <tr
      data-index={virtualRow.index} //needed for dynamic row height measurement
      ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
      key={row.id}
      style={{
        display: 'flex',
        position: 'absolute',
        transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
        width: '100%',
      }}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <td
            key={cell.id}
            style={{
              // display: 'flex',
              width: cell.column.getSize(),
              ...(cell.column.id === 'amount' ? { textAlign: 'right' } : {}),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
