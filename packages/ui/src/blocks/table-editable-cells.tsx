'use client';

import { useState } from 'react';

/**
 * Live preview for `table-editable-cells`.
 *
 * Mirrors the `typescript` code variant verbatim (the optional `onCommit` is
 * omitted, not passed as undefined). Click an editable cell to swap in the input.
 * Keep this in step with `src/data/components/tables.ts`.
 */
interface EditColumn {
  key: string;
  header: string;
  editable?: boolean;
}

interface DataRow {
  id: string;
  [key: string]: string | number;
}

interface EditingCell {
  id: string;
  key: string;
}

interface TableEditableCellsProps {
  columns: EditColumn[];
  rows: DataRow[];
  onCommit?: (id: string, key: string, value: string) => void;
  className?: string;
}

export function TableEditableCells({ columns, rows, onCommit, className = '' }: TableEditableCellsProps) {
  const [data, setData] = useState<DataRow[]>(rows);
  const [editing, setEditing] = useState<EditingCell | null>(null);
  const [draft, setDraft] = useState('');

  function begin(id: string, key: string, current: string | number): void {
    setEditing({ id, key });
    setDraft(String(current));
  }

  function commit(): void {
    if (!editing) return;
    const { id, key } = editing;
    setData((current) => current.map((r) => (r.id === id ? { ...r, [key]: draft } : r)));
    onCommit?.(id, key, draft);
    setEditing(null);
  }

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
          {data.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800">
              {columns.map((col) => {
                const active = editing?.id === row.id && editing?.key === col.key;
                if (col.editable && active) {
                  return (
                    <td key={col.key} className="px-1 py-1">
                      <input
                        type="text"
                        autoFocus
                        aria-label={`Edit ${col.header}`}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={commit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commit();
                          if (e.key === 'Escape') setEditing(null);
                        }}
                        className="w-full rounded border border-blue-500 bg-white px-2 py-1.5 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400"
                      />
                    </td>
                  );
                }
                if (col.editable) {
                  return (
                    <td key={col.key} className="px-1 py-1">
                      <button
                        type="button"
                        onClick={() => begin(row.id, col.key, row[col.key] ?? '')}
                        className="w-full rounded px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
                      >
                        {row[col.key]}
                      </button>
                    </td>
                  );
                }
                return (
                  <td key={col.key} className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                    {row[col.key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const COLUMNS: EditColumn[] = [
  { key: 'item', header: 'Item', editable: true },
  { key: 'qty', header: 'Qty', editable: true },
  { key: 'unit', header: 'Unit' },
];

const ROWS: DataRow[] = [
  { id: 'e1', item: 'Cardstock', qty: 12, unit: 'ream' },
  { id: 'e2', item: 'Toner', qty: 3, unit: 'cartridge' },
  { id: 'e3', item: 'Binder clips', qty: 40, unit: 'box' },
];

export default function TableEditableCellsPreview() {
  return <TableEditableCells columns={COLUMNS} rows={ROWS} className="max-w-2xl" />;
}
