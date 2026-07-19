'use client';

import { useId, useMemo, useState } from 'react';

/**
 * Live preview for `search-inline-table-filter`.
 *
 * Mirrors the `typescript` code variant verbatim. Typing filters rows live
 * across every column; the visible-of-total count is announced via aria-live,
 * and the table scrolls sideways inside its wrapper. Keep this in step with
 * `src/data/components/search-bars.ts`.
 */
interface TableRow {
  id: string;
  cells: string[];
}

interface SearchInlineTableFilterProps {
  columns: string[];
  rows: TableRow[];
  placeholder?: string;
  className?: string;
}

function SearchInlineTableFilter({
  columns,
  rows,
  placeholder = 'Filter rows…',
  className = '',
}: SearchInlineTableFilterProps) {
  const inputId = useId();
  const [query, setQuery] = useState('');

  const filtered = useMemo<TableRow[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => row.cells.some((cell) => cell.toLowerCase().includes(term)));
  }, [rows, query]);

  return (
    <div className={`w-full ${className}`}>
      <label className="sr-only" htmlFor={inputId}>Filter rows</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
        className="mb-3 w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      <p className="mb-2 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {filtered.length} of {rows.length} rows
      </p>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full min-w-[24rem] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              {columns.map((col) => (
                <th key={col} scope="col" className="px-3 py-2 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6 text-center text-gray-600 dark:text-gray-300">No matching rows.</td>
              </tr>
            ) : filtered.map((row) => (
              <tr key={row.id} className="text-gray-800 dark:text-gray-100">
                {row.cells.map((cell, index) => (
                  <td key={index} className="px-3 py-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const SAMPLE_COLUMNS = ['Name', 'Role', 'Location'];

const SAMPLE_ROWS: TableRow[] = [
  { id: 'a', cells: ['Ada Lovelace', 'Engineer', 'London'] },
  { id: 'b', cells: ['Grace Hopper', 'Admiral', 'New York'] },
  { id: 'c', cells: ['Alan Turing', 'Researcher', 'Manchester'] },
  { id: 'd', cells: ['Katherine Johnson', 'Mathematician', 'Virginia'] },
  { id: 'e', cells: ['Linus Torvalds', 'Engineer', 'Portland'] },
];

export const minHeight = 320;

export default function SearchInlineTableFilterPreview() {
  return <SearchInlineTableFilter columns={SAMPLE_COLUMNS} rows={SAMPLE_ROWS} placeholder="Filter people…" />;
}
