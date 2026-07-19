'use client';

import { useState } from 'react';

/**
 * Live preview for `table-pagination-footer`.
 *
 * Mirrors the `typescript` code variant verbatim, with more rows than one page
 * holds so Prev/Next and the range readout are live. Keep this in step with
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

interface TablePaginationFooterProps {
  columns: DataColumn[];
  rows: DataRow[];
  pageSize?: number;
  className?: string;
}

function TablePaginationFooter({ columns, rows, pageSize = 5, className = '' }: TablePaginationFooterProps) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const clamped = Math.min(page, pageCount - 1);
  const start = clamped * pageSize;
  const slice = rows.slice(start, start + pageSize);
  const from = rows.length === 0 ? 0 : start + 1;
  const to = start + slice.length;

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            {columns.map((col) => (
              <th key={col.key} scope="col" className="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slice.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200 dark:border-gray-800">
            <td colSpan={columns.length} className="px-3 py-3">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400" aria-live="polite">
                  Showing {from}-{to} of {rows.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage(clamped - 1)}
                    disabled={clamped === 0}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage(clamped + 1)}
                    disabled={clamped >= pageCount - 1}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
                  >
                    Next
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

const COLUMNS: DataColumn[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
];

const ROWS: DataRow[] = [
  { id: 'a1', name: 'Ada Byron', email: 'ada@ex.co' },
  { id: 'a2', name: 'Alan Turing', email: 'alan@ex.co' },
  { id: 'a3', name: 'Grace Hopper', email: 'grace@ex.co' },
  { id: 'a4', name: 'Katherine J.', email: 'kj@ex.co' },
  { id: 'a5', name: 'Edsger D.', email: 'edd@ex.co' },
  { id: 'a6', name: 'Barbara L.', email: 'barb@ex.co' },
  { id: 'a7', name: 'Linus T.', email: 'linus@ex.co' },
];

export const minHeight = 270;

export default function TablePaginationFooterPreview() {
  return <TablePaginationFooter columns={COLUMNS} rows={ROWS} pageSize={4} className="max-w-2xl" />;
}
