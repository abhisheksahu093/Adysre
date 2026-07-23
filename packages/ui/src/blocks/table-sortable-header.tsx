'use client';

import { useMemo, useState } from 'react';

/**
 * Live preview for `table-sortable-header`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/tables.ts`.
 */
interface SortColumn {
  key: string;
  header: string;
  align?: 'left' | 'right';
  sortable?: boolean;
}

interface SortRow {
  id: string;
  [key: string]: string | number;
}

type SortDir = 'asc' | 'desc';

interface TableSortableHeaderProps {
  columns: SortColumn[];
  rows: SortRow[];
  defaultSortKey?: string;
  className?: string;
}

export function TableSortableHeader({ columns, rows, defaultSortKey, className = '' }: TableSortableHeaderProps) {
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey ?? null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      if (av === undefined) return 1;
      if (bv === undefined) return -1;
      const cmp =
        typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function toggle(key: string): void {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            {columns.map((col) => {
              const active = sortKey === col.key;
              const ariaSort: 'ascending' | 'descending' | 'none' = active
                ? sortDir === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none';
              return (
                <th
                  key={col.key}
                  scope="col"
                  {...(col.sortable ? { 'aria-sort': ariaSort } : {})}
                  className={`px-3 py-2.5 font-medium ${col.align === 'right' ? 'text-right' : 'text-left'} ${active ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggle(col.key)}
                      className="inline-flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
                    >
                      {col.header}
                      <span aria-hidden="true" className={active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}>
                        {active ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-3 py-2.5 text-gray-700 dark:text-gray-300 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const COLUMNS: SortColumn[] = [
  { key: 'product', header: 'Product', sortable: true },
  { key: 'plan', header: 'Plan' },
  { key: 'revenue', header: 'Revenue', align: 'right', sortable: true },
];

const ROWS: SortRow[] = [
  { id: 'r1', product: 'Analytics', plan: 'Pro', revenue: 9400 },
  { id: 'r2', product: 'Billing', plan: 'Team', revenue: 6120 },
  { id: 'r3', product: 'Inbox', plan: 'Free', revenue: 2380 },
  { id: 'r4', product: 'Search', plan: 'Pro', revenue: 7550 },
];

export const minHeight = 220;

export default function TableSortableHeaderPreview() {
  return <TableSortableHeader columns={COLUMNS} rows={ROWS} defaultSortKey="revenue" className="max-w-2xl" />;
}
