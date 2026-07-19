'use client';

import { Fragment, useState, type ReactNode } from 'react';

/**
 * Live preview for `table-expandable-rows`.
 *
 * Mirrors the `typescript` code variant verbatim, opening with one row expanded
 * so the detail row and rotated chevron are visible on first paint. Keep this in
 * step with `src/data/components/tables.ts`.
 */
interface DataColumn {
  key: string;
  header: string;
  align?: 'left' | 'right';
}

interface ExpandableRow {
  id: string;
  detail: ReactNode;
  [key: string]: ReactNode;
}

interface TableExpandableRowsProps {
  columns: DataColumn[];
  rows: ExpandableRow[];
  className?: string;
}

function TableExpandableRows({ columns, rows, className = '' }: TableExpandableRowsProps) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(['o1']));

  function toggle(id: string): void {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th scope="col" className="w-10 px-3 py-2.5"><span className="sr-only">Expand</span></th>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isOpen = open.has(row.id);
            const detailId = `row-detail-${row.id}`;
            return (
              <Fragment key={row.id}>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={detailId}
                      onClick={() => toggle(row.id)}
                      className="grid h-6 w-6 place-items-center rounded text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
                    >
                      <span aria-hidden="true" className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
                    </button>
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2.5 text-gray-700 dark:text-gray-300 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
                {isOpen ? (
                  <tr id={detailId} className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                    <td className="px-3 py-3" />
                    <td colSpan={columns.length} className="px-3 py-3 text-gray-600 dark:text-gray-400">
                      {row.detail}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const COLUMNS: DataColumn[] = [
  { key: 'order', header: 'Order' },
  { key: 'customer', header: 'Customer' },
  { key: 'total', header: 'Total', align: 'right' },
];

const ROWS: ExpandableRow[] = [
  { id: 'o1', order: '#1001', customer: 'Acme Inc', total: '$248.00', detail: '2× Keyboard, 1× Mouse - shipped to Berlin, DE' },
  { id: 'o2', order: '#1002', customer: 'Globex', total: '$92.00', detail: '1× Cable pack - awaiting fulfilment' },
  { id: 'o3', order: '#1003', customer: 'Initech', total: '$1,410.00', detail: '5× Monitor stand - delivered' },
];

export const minHeight = 230;

export default function TableExpandableRowsPreview() {
  return <TableExpandableRows columns={COLUMNS} rows={ROWS} className="max-w-2xl" />;
}
