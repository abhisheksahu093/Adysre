'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Live preview for `table-selectable-rows`.
 *
 * Mirrors the `typescript` code variant verbatim, opening with one of three rows
 * selected so the select-all box paints its indeterminate dash on first render.
 * Keep this in step with `src/data/components/tables.ts`.
 */
interface DataColumn {
  key: string;
  header: string;
}

interface DataRow {
  id: string;
  [key: string]: string | number;
}

interface TableSelectableRowsProps {
  columns: DataColumn[];
  rows: DataRow[];
  className?: string;
}

function TableSelectableRows({ columns, rows, className = '' }: TableSelectableRowsProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(['u1']));
  const allRef = useRef<HTMLInputElement>(null);

  const allChecked = rows.length > 0 && selected.size === rows.length;
  const someChecked = selected.size > 0 && !allChecked;

  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = someChecked;
  }, [someChecked]);

  function toggleAll(): void {
    setSelected(allChecked ? new Set() : new Set(rows.map((r) => r.id)));
  }

  function toggleRow(id: string): void {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const firstKey = columns[0]?.key;

  return (
    <div className={`w-full ${className}`}>
      <p className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400" aria-live="polite">
        {selected.size} selected
      </p>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th scope="col" className="w-10 px-3 py-2.5">
                <input
                  ref={allRef}
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="h-4 w-4 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500"
                />
              </th>
              {columns.map((col) => (
                <th key={col.key} scope="col" className="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSel = selected.has(row.id);
              const label = firstKey ? String(row[firstKey]) : row.id;
              return (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 dark:border-gray-800 ${isSel ? 'bg-blue-50/60 dark:bg-blue-500/10' : ''}`}
                >
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      aria-label={`Select ${label}`}
                      checked={isSel}
                      onChange={() => toggleRow(row.id)}
                      className="h-4 w-4 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500"
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const COLUMNS: DataColumn[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'team', header: 'Team' },
];

const ROWS: DataRow[] = [
  { id: 'u1', name: 'Dana Lee', role: 'Admin', team: 'Platform' },
  { id: 'u2', name: 'Sam Ford', role: 'Editor', team: 'Growth' },
  { id: 'u3', name: 'Priya Nair', role: 'Viewer', team: 'Design' },
];

export const minHeight = 210;

export default function TableSelectableRowsPreview() {
  return <TableSelectableRows columns={COLUMNS} rows={ROWS} className="max-w-2xl" />;
}
