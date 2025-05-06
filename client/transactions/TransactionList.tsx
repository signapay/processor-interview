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
import { type Virtualizer, useVirtualizer } from '@tanstack/react-virtual';
import { formatDateToLocale } from 'client/shared/dateFormatter';
import { formatAmount } from 'client/shared/numberFormatter';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { type RefObject, memo, useLayoutEffect, useRef } from 'react';
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
          <TableBodyWrapper table={table} tableContainerRef={tableContainerRef} />
        </table>
      </div>
    </div>
  );
}

interface TableBodyWrapperProps {
  table: Table<Transaction>;
  tableContainerRef: RefObject<HTMLDivElement>;
}

function TableBodyWrapper({ table, tableContainerRef }: TableBodyWrapperProps) {
  const rowRefsMap = useRef<Map<number, HTMLTableRowElement>>(new Map());

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 33, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
    onChange: (instance) => {
      // requestAnimationFrame(() => {
      instance.getVirtualItems().forEach((virtualRow) => {
        const rowRef = rowRefsMap.current.get(virtualRow.index);
        if (!rowRef) return;
        rowRef.style.transform = `translateY(${virtualRow.start}px)`;
      });
      // })
    },
  });

  useLayoutEffect(() => {
    rowVirtualizer.measure();
  }, [table.getState()]);

  return <TableBody rowRefsMap={rowRefsMap} rowVirtualizer={rowVirtualizer} table={table} />;
}

interface TableBodyProps {
  table: Table<Transaction>;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  rowRefsMap: RefObject<Map<number, HTMLTableRowElement>>;
}

function TableBody({ rowVirtualizer, table, rowRefsMap }: TableBodyProps) {
  const { rows } = table.getRowModel();
  const virtualRowIndexes = rowVirtualizer.getVirtualIndexes();

  return (
    <tbody
      style={{
        display: 'grid',
        height: `${rowVirtualizer.getTotalSize()}px`, // tells scrollbar how big the table is
        position: 'relative', // needed for absolute positioning of rows
      }}
    >
      {virtualRowIndexes.map((virtualRowIndex) => {
        const row = rows[virtualRowIndex];
        return (
          <TableBodyRowMemo
            key={row.id}
            row={row}
            rowRefsMap={rowRefsMap}
            rowVirtualizer={rowVirtualizer}
            virtualRowIndex={virtualRowIndex}
          />
        );
      })}
    </tbody>
  );
}

interface TableBodyRowProps {
  row: Row<Transaction>;
  rowRefsMap: RefObject<Map<number, HTMLTableRowElement>>;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  virtualRowIndex: number;
}

function TableBodyRow({ row, rowRefsMap, rowVirtualizer, virtualRowIndex }: TableBodyRowProps) {
  return (
    <tr
      data-index={virtualRowIndex} // needed for dynamic row height measurement
      ref={(node) => {
        if (node && virtualRowIndex) {
          rowVirtualizer.measureElement(node); // measure dynamic row height
          rowRefsMap.current.set(virtualRowIndex, node); // store ref for virtualizer to apply scrolling transforms
        }
      }}
      key={row.id}
      style={{
        display: 'flex',
        position: 'absolute',
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

// test out when rows don't re-render at all (future TanStack Virtual release can make this unnecessary)
const TableBodyRowMemo = memo(TableBodyRow, (_prev, next) => next.rowVirtualizer.isScrolling) as typeof TableBodyRow;
