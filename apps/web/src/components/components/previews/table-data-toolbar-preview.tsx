'use client';

import { useMemo, useState } from 'react';

/**
 * Live preview for `table-data-toolbar`.
 *
 * Mirrors the `typescript` code variant verbatim: search, a status filter and a
 * column-visibility panel over a filtered table. Keep this in step with
 * `src/data/components/tables.ts`.
 */
interface DataColumn {
  key: string;
  header: string;
}

interface DataRow {
  id: string;
  [key: string]: string | number;
}

interface TableDataToolbarProps {
  columns: DataColumn[];
  rows: DataRow[];
  filterKey?: string;
  filterOptions?: string[];
  className?: string;
}

function TableDataToolbar({ columns, rows, filterKey, filterOptions = [], className = '' }: TableDataToolbarProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());

  const visible = columns.filter((c) => !hidden.has(c.key));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery =
        q === '' || columns.some((c) => String(row[c.key] ?? '').toLowerCase().includes(q));
      const matchesFilter = !filter || !filterKey || String(row[filterKey]) === filter;
      return matchesQuery && matchesFilter;
    });
  }, [rows, columns, query, filter, filterKey]);

  function toggleColumn(key: string): void {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="tbl-search" className="sr-only">Search rows</label>
          <span aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
          <input
            id="tbl-search"
            type="search"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-8 pr-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400"
          />
        </div>
        {filterKey && filterOptions.length > 0 ? (
          <>
            <label htmlFor="tbl-filter" className="sr-only">Filter</label>
            <select
              id="tbl-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400"
            >
              <option value="">All</option>
              {filterOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </>
        ) : null}
        <details className="relative">
          <summary className="cursor-pointer list-none rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:focus-visible:ring-blue-400">Columns</summary>
          <div className="absolute right-0 z-10 mt-1 w-44 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            {columns.map((col) => (
              <label key={col.key} className="flex items-center gap-2 px-1 py-1 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={!hidden.has(col.key)}
                  onChange={() => toggleColumn(col.key)}
                  className="h-4 w-4 accent-blue-600 dark:accent-blue-500"
                />
                {col.header}
              </label>
            ))}
          </div>
        </details>
      </div>

      <p className="mb-2 text-xs text-gray-600 dark:text-gray-400" aria-live="polite">
        {filtered.length} of {rows.length} rows
      </p>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              {visible.map((col) => (
                <th key={col.key} scope="col" className="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800">
                {visible.map((col) => (
                  <td key={col.key} className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const COLUMNS: DataColumn[] = [
  { key: 'subject', header: 'Subject' },
  { key: 'priority', header: 'Priority' },
  { key: 'status', header: 'Status' },
];

const ROWS: DataRow[] = [
  { id: 'd1', subject: 'Payment failed', priority: 'High', status: 'Open' },
  { id: 'd2', subject: 'Export request', priority: 'Low', status: 'Closed' },
  { id: 'd3', subject: 'Login loop', priority: 'High', status: 'Open' },
  { id: 'd4', subject: 'Typo in footer', priority: 'Low', status: 'Closed' },
];

export const minHeight = 290;

export default function TableDataToolbarPreview() {
  return (
    <TableDataToolbar
      columns={COLUMNS}
      rows={ROWS}
      filterKey="status"
      filterOptions={['Open', 'Closed']}
      className="max-w-2xl"
    />
  );
}
