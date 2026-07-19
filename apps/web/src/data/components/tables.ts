import type { ComponentEntry } from './types';

/**
 * Tables category.
 *
 * Ten data tables that are all the same shape underneath - a real <table> with a
 * <thead>, scoped <th scope="col"> headers and a <tbody> - and differ in the one
 * axis that actually matters at a desk vs on a phone. A table is the widest thing
 * a component library ships: a five-column grid is ~600px before it has any data
 * in it, and 600px does not fit a 320px phone. So the shared, non-negotiable
 * constraint here is the overflow strategy. Every variant either wraps the table
 * in an `overflow-x-auto` scroller with a `min-w-*` floor (the table keeps its
 * shape and the *container* scrolls, never the page) or drops the grid entirely
 * and re-renders as stacked cards (`table-responsive-stacked`). Sorting adds
 * `aria-sort`, selection adds a real checkbox column with a tri-state select-all,
 * and the sticky header pins the <thead> to the top of its own scroll box - none
 * of which changes that the thing is, first, a semantic table.
 */
export const tablesComponents: ComponentEntry[] = [
  {
    slug: 'table-basic-striped',
    category: 'tables',
    tags: ['table', 'striped', 'data', 'zebra', 'responsive'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'columns', type: 'DataColumn[]', required: true, descriptionKey: 'columns' },
      { name: 'rows', type: 'DataRow[]', required: true, descriptionKey: 'rows' },
      { name: 'caption', type: 'string', descriptionKey: 'caption' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The scroller is the whole responsiveness story. The table keeps a min-width so
  its columns never crush below legibility; the wrapping div scrolls sideways
  instead of the page. Zebra striping is odd:bg-* on the row, not a hand-coloured
  class per row.
-->
<div class="w-full overflow-x-auto">
  <table class="w-full min-w-[36rem] border-collapse text-left text-sm">
    <caption class="pb-3 text-left text-gray-600 dark:text-gray-400">Recent invoices</caption>
    <thead>
      <tr class="border-b border-gray-200 dark:border-gray-800">
        <th scope="col" class="whitespace-nowrap px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Invoice</th>
        <th scope="col" class="whitespace-nowrap px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Client</th>
        <th scope="col" class="whitespace-nowrap px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Status</th>
        <th scope="col" class="whitespace-nowrap px-3 py-2.5 text-right font-medium text-gray-700 dark:text-gray-300">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr class="odd:bg-gray-50 dark:odd:bg-gray-900/40">
        <td class="whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300">INV-1024</td>
        <td class="whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300">Acme Inc</td>
        <td class="whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300">Paid</td>
        <td class="whitespace-nowrap px-3 py-2.5 text-right text-gray-700 dark:text-gray-300">$1,200.00</td>
      </tr>
      <tr class="odd:bg-gray-50 dark:odd:bg-gray-900/40">
        <td class="whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300">INV-1025</td>
        <td class="whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300">Globex</td>
        <td class="whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300">Pending</td>
        <td class="whitespace-nowrap px-3 py-2.5 text-right text-gray-700 dark:text-gray-300">$820.00</td>
      </tr>
    </tbody>
  </table>
</div>`,
      react: `export function TableBasicStriped({ columns, rows, caption, className = '' }) {
  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        {caption ? (
          <caption className="pb-3 text-left text-gray-600 dark:text-gray-400">{caption}</caption>
        ) : null}
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={\`whitespace-nowrap px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300 \${col.align === 'right' ? 'text-right' : 'text-left'}\`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="odd:bg-gray-50 dark:odd:bg-gray-900/40">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={\`whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300 \${col.align === 'right' ? 'text-right' : 'text-left'}\`}
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
}`,
      typescript: `export interface DataColumn {
  /** Key into each row object. */
  key: string;
  header: string;
  align?: 'left' | 'right';
}

/** A row is keyed by column key; \`id\` is the stable React key, never rendered as a column unless you add it to \`columns\`. */
export interface DataRow {
  id: string;
  [key: string]: string | number;
}

export interface TableBasicStripedProps {
  columns: DataColumn[];
  rows: DataRow[];
  caption?: string;
  className?: string;
}

export function TableBasicStriped({
  columns,
  rows,
  caption,
  className = '',
}: TableBasicStripedProps): JSX.Element {
  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        {caption ? (
          <caption className="pb-3 text-left text-gray-600 dark:text-gray-400">{caption}</caption>
        ) : null}
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={\`whitespace-nowrap px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300 \${col.align === 'right' ? 'text-right' : 'text-left'}\`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="odd:bg-gray-50 dark:odd:bg-gray-900/40">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={\`whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300 \${col.align === 'right' ? 'text-right' : 'text-left'}\`}
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
}`,
    },
  },
  {
    slug: 'table-sortable-header',
    category: 'tables',
    tags: ['table', 'sortable', 'aria-sort', 'columns', 'data'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'asc', labelKey: 'ascending' },
      { id: 'desc', labelKey: 'descending' },
    ],
    props: [
      { name: 'columns', type: 'SortColumn[]', required: true, descriptionKey: 'columns' },
      { name: 'rows', type: 'SortRow[]', required: true, descriptionKey: 'rows' },
      { name: 'defaultSortKey', type: 'string', descriptionKey: 'defaultSortKey' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A sortable header is a BUTTON inside the <th>, not a click handler on the cell:
  it has to be reachable by keyboard and announce itself. The state lives on the
  <th> as aria-sort so a screen reader says "ascending" / "descending"; the arrow
  glyph is aria-hidden decoration echoing it. (Wire the button to your sort in
  React/TS - this markup shows the "amount, descending" resting state.)
-->
<div class="w-full overflow-x-auto">
  <table class="w-full min-w-[34rem] border-collapse text-left text-sm">
    <thead>
      <tr class="border-b border-gray-200 dark:border-gray-800">
        <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">
          <button type="button" class="inline-flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400">
            Product <span aria-hidden="true" class="text-gray-400">↕</span>
          </button>
        </th>
        <th scope="col" aria-sort="descending" class="px-3 py-2.5 text-right font-medium text-gray-900 dark:text-gray-100">
          <button type="button" class="inline-flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400">
            Revenue <span aria-hidden="true" class="text-blue-600 dark:text-blue-400">↓</span>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-gray-100 dark:border-gray-800">
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">Analytics</td>
        <td class="px-3 py-2.5 text-right text-gray-700 dark:text-gray-300">$9,400</td>
      </tr>
      <tr class="border-b border-gray-100 dark:border-gray-800">
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">Billing</td>
        <td class="px-3 py-2.5 text-right text-gray-700 dark:text-gray-300">$6,120</td>
      </tr>
    </tbody>
  </table>
</div>`,
      react: `import { useMemo, useState } from 'react';

export function TableSortableHeader({ columns, rows, defaultSortKey, className = '' }) {
  const [sortKey, setSortKey] = useState(defaultSortKey ?? null);
  const [sortDir, setSortDir] = useState('asc');

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function toggle(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            {columns.map((col) => {
              const active = sortKey === col.key;
              const ariaSort = active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={col.sortable ? ariaSort : undefined}
                  className={\`px-3 py-2.5 font-medium \${col.align === 'right' ? 'text-right' : 'text-left'} \${active ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}\`}
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
                  className={\`px-3 py-2.5 text-gray-700 dark:text-gray-300 \${col.align === 'right' ? 'text-right' : 'text-left'}\`}
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
}`,
      typescript: `import { useMemo, useState } from 'react';

export interface SortColumn {
  key: string;
  header: string;
  align?: 'left' | 'right';
  sortable?: boolean;
}

export interface SortRow {
  id: string;
  [key: string]: string | number;
}

type SortDir = 'asc' | 'desc';

export interface TableSortableHeaderProps {
  columns: SortColumn[];
  rows: SortRow[];
  defaultSortKey?: string;
  className?: string;
}

export function TableSortableHeader({
  columns,
  rows,
  defaultSortKey,
  className = '',
}: TableSortableHeaderProps): JSX.Element {
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
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
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
    <div className={\`w-full overflow-x-auto \${className}\`}>
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
                  className={\`px-3 py-2.5 font-medium \${col.align === 'right' ? 'text-right' : 'text-left'} \${active ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}\`}
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
                  className={\`px-3 py-2.5 text-gray-700 dark:text-gray-300 \${col.align === 'right' ? 'text-right' : 'text-left'}\`}
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
}`,
    },
  },
  {
    slug: 'table-selectable-rows',
    category: 'tables',
    tags: ['table', 'checkbox', 'selection', 'select-all', 'bulk'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'none', labelKey: 'none' },
      { id: 'some', labelKey: 'some' },
      { id: 'all', labelKey: 'all' },
    ],
    props: [
      { name: 'columns', type: 'DataColumn[]', required: true, descriptionKey: 'columns' },
      { name: 'rows', type: 'DataRow[]', required: true, descriptionKey: 'rows' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Two accessibility jobs here. The header checkbox is TRI-STATE: checked when all
  rows are, indeterminate when some are - and \`indeterminate\` is a DOM property
  with no HTML attribute, so it must be set from JS (see React/TS). Each row
  checkbox has an aria-label naming its row, because a bare checkbox in a grid is
  otherwise announced as just "checkbox". The selected row gets a tinted bg so the
  selection is not carried by the checkmark alone.
-->
<div class="w-full overflow-x-auto">
  <table class="w-full min-w-[34rem] border-collapse text-left text-sm">
    <thead>
      <tr class="border-b border-gray-200 dark:border-gray-800">
        <th scope="col" class="w-10 px-3 py-2.5">
          <input type="checkbox" aria-label="Select all rows" class="h-4 w-4 accent-blue-600 dark:accent-blue-500" />
        </th>
        <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Name</th>
        <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Role</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-gray-100 bg-blue-50/60 dark:border-gray-800 dark:bg-blue-500/10">
        <td class="px-3 py-2.5"><input type="checkbox" checked aria-label="Select Dana Lee" class="h-4 w-4 accent-blue-600 dark:accent-blue-500" /></td>
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">Dana Lee</td>
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">Admin</td>
      </tr>
      <tr class="border-b border-gray-100 dark:border-gray-800">
        <td class="px-3 py-2.5"><input type="checkbox" aria-label="Select Sam Ford" class="h-4 w-4 accent-blue-600 dark:accent-blue-500" /></td>
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">Sam Ford</td>
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">Editor</td>
      </tr>
    </tbody>
  </table>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function TableSelectableRows({ columns, rows, className = '' }) {
  const [selected, setSelected] = useState(() => new Set());
  const allRef = useRef(null);

  const allChecked = rows.length > 0 && selected.size === rows.length;
  const someChecked = selected.size > 0 && !allChecked;

  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = someChecked;
  }, [someChecked]);

  function toggleAll() {
    setSelected(allChecked ? new Set() : new Set(rows.map((r) => r.id)));
  }

  function toggleRow(id) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={\`w-full \${className}\`}>
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
              return (
                <tr
                  key={row.id}
                  className={\`border-b border-gray-100 dark:border-gray-800 \${isSel ? 'bg-blue-50/60 dark:bg-blue-500/10' : ''}\`}
                >
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      aria-label={\`Select \${String(row[columns[0].key])}\`}
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
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';

export interface DataColumn {
  key: string;
  header: string;
}

export interface DataRow {
  id: string;
  [key: string]: string | number;
}

export interface TableSelectableRowsProps {
  columns: DataColumn[];
  rows: DataRow[];
  className?: string;
}

export function TableSelectableRows({
  columns,
  rows,
  className = '',
}: TableSelectableRowsProps): JSX.Element {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const allRef = useRef<HTMLInputElement>(null);

  const allChecked = rows.length > 0 && selected.size === rows.length;
  const someChecked = selected.size > 0 && !allChecked;

  // \`indeterminate\` is a DOM property with no attribute - a ref in an effect is
  // the only way to write it.
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
    <div className={\`w-full \${className}\`}>
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
                  className={\`border-b border-gray-100 dark:border-gray-800 \${isSel ? 'bg-blue-50/60 dark:bg-blue-500/10' : ''}\`}
                >
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      aria-label={\`Select \${label}\`}
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
}`,
    },
  },
  {
    slug: 'table-with-avatars-status',
    category: 'tables',
    tags: ['table', 'avatar', 'status', 'badge', 'users'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'people', type: 'Person[]', required: true, descriptionKey: 'people' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  No <img>: the avatar is initials on a gradient derived from the name, so the
  table never ships a broken image or waits on a network round-trip. The status
  is a coloured dot PLUS a word - colour alone fails for colour-blind users, and
  the dot is aria-hidden so it is not announced twice.
-->
<div class="w-full overflow-x-auto">
  <table class="w-full min-w-[38rem] border-collapse text-left text-sm">
    <thead>
      <tr class="border-b border-gray-200 dark:border-gray-800">
        <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Member</th>
        <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Role</th>
        <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-gray-100 dark:border-gray-800">
        <td class="px-3 py-2.5">
          <div class="flex items-center gap-3">
            <span aria-hidden="true" class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white">DL</span>
            <div class="min-w-0">
              <div class="truncate font-medium text-gray-900 dark:text-gray-100">Dana Lee</div>
              <div class="truncate text-xs text-gray-500 dark:text-gray-400">dana@acme.co</div>
            </div>
          </div>
        </td>
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">Admin</td>
        <td class="px-3 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Active
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>`,
      react: `const STATUS_STYLES = {
  active: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', label: 'Active' },
  invited: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', label: 'Invited' },
  inactive: { dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', label: 'Inactive' },
};

const GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-sky-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
];

function initials(name) {
  return name.split(' ').map((p) => p[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function TableWithAvatarsStatus({ people, className = '' }) {
  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th scope="col" className="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Member</th>
            <th scope="col" className="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Role</th>
            <th scope="col" className="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person, i) => {
            const s = STATUS_STYLES[person.status];
            return (
              <tr key={person.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={\`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br \${GRADIENTS[i % GRADIENTS.length]} text-xs font-semibold text-white\`}
                    >
                      {initials(person.name)}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-gray-900 dark:text-gray-100">{person.name}</div>
                      <div className="truncate text-xs text-gray-500 dark:text-gray-400">{person.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">{person.role}</td>
                <td className="px-3 py-2.5">
                  <span className={\`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium \${s.badge}\`}>
                    <span aria-hidden="true" className={\`h-1.5 w-1.5 rounded-full \${s.dot}\`} />
                    {s.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}`,
      typescript: `export type MemberStatus = 'active' | 'invited' | 'inactive';

export interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  status: MemberStatus;
}

export interface TableWithAvatarsStatusProps {
  people: Person[];
  className?: string;
}

const STATUS_STYLES: Record<MemberStatus, { dot: string; badge: string; label: string }> = {
  active: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', label: 'Active' },
  invited: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', label: 'Invited' },
  inactive: { dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', label: 'Inactive' },
};

const GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-sky-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
] as const;

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TableWithAvatarsStatus({
  people,
  className = '',
}: TableWithAvatarsStatusProps): JSX.Element {
  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th scope="col" className="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Member</th>
            <th scope="col" className="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Role</th>
            <th scope="col" className="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person, i) => {
            const s = STATUS_STYLES[person.status];
            const gradient = GRADIENTS[i % GRADIENTS.length] ?? GRADIENTS[0];
            return (
              <tr key={person.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={\`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br \${gradient} text-xs font-semibold text-white\`}
                    >
                      {initials(person.name)}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-gray-900 dark:text-gray-100">{person.name}</div>
                      <div className="truncate text-xs text-gray-500 dark:text-gray-400">{person.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">{person.role}</td>
                <td className="px-3 py-2.5">
                  <span className={\`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium \${s.badge}\`}>
                    <span aria-hidden="true" className={\`h-1.5 w-1.5 rounded-full \${s.dot}\`} />
                    {s.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}`,
    },
  },
  {
    slug: 'table-sticky-header',
    category: 'tables',
    tags: ['table', 'sticky', 'scroll', 'header', 'data'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'tall', labelKey: 'tall' },
    ],
    props: [
      { name: 'columns', type: 'DataColumn[]', required: true, descriptionKey: 'columns' },
      { name: 'rows', type: 'DataRow[]', required: true, descriptionKey: 'rows' },
      { name: 'maxHeight', type: 'string', default: "'20rem'", descriptionKey: 'maxHeight' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  One box scrolls both ways: overflow-auto plus a max-height for the vertical
  scroll and a min-width on the table for the horizontal one. The header cells are
  \`sticky top-0\` so they pin as the body scrolls under them; they need their own
  opaque background or the body rows would show through the "gap" between cell
  borders. z-10 keeps them above the scrolling rows.
-->
<div class="w-full overflow-auto rounded-lg border border-gray-200 dark:border-gray-800" style="max-height: 20rem">
  <table class="w-full min-w-[34rem] border-collapse text-left text-sm">
    <thead>
      <tr>
        <th scope="col" class="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">Ticket</th>
        <th scope="col" class="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">Subject</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-gray-100 dark:border-gray-800">
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">#4821</td>
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">Login loop on Safari</td>
      </tr>
      <tr class="border-b border-gray-100 dark:border-gray-800">
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">#4822</td>
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">Export missing columns</td>
      </tr>
    </tbody>
  </table>
</div>`,
      react: `export function TableStickyHeader({ columns, rows, maxHeight = '20rem', className = '' }) {
  return (
    <div
      className={\`w-full overflow-auto rounded-lg border border-gray-200 dark:border-gray-800 \${className}\`}
      style={{ maxHeight }}
    >
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      typescript: `export interface DataColumn {
  key: string;
  header: string;
}

export interface DataRow {
  id: string;
  [key: string]: string | number;
}

export interface TableStickyHeaderProps {
  columns: DataColumn[];
  rows: DataRow[];
  /** Any CSS length; caps the scroll box so the header has something to stick to. */
  maxHeight?: string;
  className?: string;
}

export function TableStickyHeader({
  columns,
  rows,
  maxHeight = '20rem',
  className = '',
}: TableStickyHeaderProps): JSX.Element {
  return (
    <div
      className={\`w-full overflow-auto rounded-lg border border-gray-200 dark:border-gray-800 \${className}\`}
      style={{ maxHeight }}
    >
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    },
  },
  {
    slug: 'table-expandable-rows',
    category: 'tables',
    tags: ['table', 'expandable', 'accordion', 'detail', 'disclosure'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'collapsed', labelKey: 'collapsed' },
      { id: 'expanded', labelKey: 'expanded' },
    ],
    props: [
      { name: 'columns', type: 'DataColumn[]', required: true, descriptionKey: 'columns' },
      { name: 'rows', type: 'ExpandableRow[]', required: true, descriptionKey: 'rows' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The detail lives in a SECOND <tr> spanning every column, revealed below the
  summary row. The toggle is a real <button> carrying aria-expanded and
  aria-controls that points at the detail row's id - so a screen reader knows the
  control's state and where the revealed content is. The chevron is aria-hidden.
  (Wire the button to toggle the detail row in React/TS.)
-->
<div class="w-full overflow-x-auto">
  <table class="w-full min-w-[34rem] border-collapse text-left text-sm">
    <thead>
      <tr class="border-b border-gray-200 dark:border-gray-800">
        <th scope="col" class="w-10 px-3 py-2.5"><span class="sr-only">Expand</span></th>
        <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Order</th>
        <th scope="col" class="px-3 py-2.5 text-right font-medium text-gray-700 dark:text-gray-300">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-gray-100 dark:border-gray-800">
        <td class="px-3 py-2.5">
          <button type="button" aria-expanded="true" aria-controls="row-detail-1001" class="grid h-6 w-6 place-items-center rounded text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
            <span aria-hidden="true" class="rotate-90 transition-transform">›</span>
          </button>
        </td>
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">#1001</td>
        <td class="px-3 py-2.5 text-right text-gray-700 dark:text-gray-300">$248.00</td>
      </tr>
      <tr id="row-detail-1001" class="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
        <td class="px-3 py-3"></td>
        <td colspan="2" class="px-3 py-3 text-gray-600 dark:text-gray-400">2× Keyboard, 1× Mouse - shipped to Berlin, DE</td>
      </tr>
    </tbody>
  </table>
</div>`,
      react: `import { useState } from 'react';

export function TableExpandableRows({ columns, rows, className = '' }) {
  const [open, setOpen] = useState(() => new Set());

  function toggle(id) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th scope="col" className="w-10 px-3 py-2.5"><span className="sr-only">Expand</span></th>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={\`px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300 \${col.align === 'right' ? 'text-right' : 'text-left'}\`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isOpen = open.has(row.id);
            const detailId = \`row-detail-\${row.id}\`;
            return (
              <>
                <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={detailId}
                      onClick={() => toggle(row.id)}
                      className="grid h-6 w-6 place-items-center rounded text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
                    >
                      <span aria-hidden="true" className={\`transition-transform \${isOpen ? 'rotate-90' : ''}\`}>›</span>
                    </button>
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={\`px-3 py-2.5 text-gray-700 dark:text-gray-300 \${col.align === 'right' ? 'text-right' : 'text-left'}\`}
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
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}`,
      typescript: `import { Fragment, useState, type ReactNode } from 'react';

export interface DataColumn {
  key: string;
  header: string;
  align?: 'left' | 'right';
}

export interface ExpandableRow {
  id: string;
  detail: ReactNode;
  [key: string]: ReactNode;
}

export interface TableExpandableRowsProps {
  columns: DataColumn[];
  rows: ExpandableRow[];
  className?: string;
}

export function TableExpandableRows({
  columns,
  rows,
  className = '',
}: TableExpandableRowsProps): JSX.Element {
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  function toggle(id: string): void {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th scope="col" className="w-10 px-3 py-2.5"><span className="sr-only">Expand</span></th>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={\`px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300 \${col.align === 'right' ? 'text-right' : 'text-left'}\`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isOpen = open.has(row.id);
            const detailId = \`row-detail-\${row.id}\`;
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
                      <span aria-hidden="true" className={\`transition-transform \${isOpen ? 'rotate-90' : ''}\`}>›</span>
                    </button>
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={\`px-3 py-2.5 text-gray-700 dark:text-gray-300 \${col.align === 'right' ? 'text-right' : 'text-left'}\`}
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
}`,
    },
  },
  {
    slug: 'table-pagination-footer',
    category: 'tables',
    tags: ['table', 'pagination', 'footer', 'pages', 'data'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'columns', type: 'DataColumn[]', required: true, descriptionKey: 'columns' },
      { name: 'rows', type: 'DataRow[]', required: true, descriptionKey: 'rows' },
      { name: 'pageSize', type: 'number', default: '5', descriptionKey: 'pageSize' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The footer lives in a real <tfoot> so it belongs to the table, and its cell
  spans every column. The "Showing X-Y of Z" line is wrapped in aria-live=polite
  so the range is announced when the page changes; the Prev/Next buttons are
  disabled (not hidden) at the ends, which keeps their position stable. (Wire the
  buttons to page state in React/TS.)
-->
<div class="w-full overflow-x-auto">
  <table class="w-full min-w-[32rem] border-collapse text-left text-sm">
    <thead>
      <tr class="border-b border-gray-200 dark:border-gray-800">
        <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Name</th>
        <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Email</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-gray-100 dark:border-gray-800">
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">Ada Byron</td>
        <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">ada@ex.co</td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="border-t border-gray-200 dark:border-gray-800">
        <td colspan="2" class="px-3 py-3">
          <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <span class="text-xs text-gray-600 dark:text-gray-400">Showing 1-5 of 23</span>
            <div class="flex items-center gap-2">
              <button type="button" disabled class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300">Previous</button>
              <button type="button" class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Next</button>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</div>`,
      react: `import { useState } from 'react';

export function TablePaginationFooter({ columns, rows, pageSize = 5, className = '' }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const clamped = Math.min(page, pageCount - 1);
  const start = clamped * pageSize;
  const slice = rows.slice(start, start + pageSize);
  const from = rows.length === 0 ? 0 : start + 1;
  const to = start + slice.length;

  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
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
}`,
      typescript: `import { useState } from 'react';

export interface DataColumn {
  key: string;
  header: string;
}

export interface DataRow {
  id: string;
  [key: string]: string | number;
}

export interface TablePaginationFooterProps {
  columns: DataColumn[];
  rows: DataRow[];
  pageSize?: number;
  className?: string;
}

export function TablePaginationFooter({
  columns,
  rows,
  pageSize = 5,
  className = '',
}: TablePaginationFooterProps): JSX.Element {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const clamped = Math.min(page, pageCount - 1);
  const start = clamped * pageSize;
  const slice = rows.slice(start, start + pageSize);
  const from = rows.length === 0 ? 0 : start + 1;
  const to = start + slice.length;

  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
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
}`,
    },
  },
  {
    slug: 'table-editable-cells',
    category: 'tables',
    tags: ['table', 'editable', 'inline', 'input', 'crud'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'reading', labelKey: 'reading' },
      { id: 'editing', labelKey: 'editing' },
    ],
    props: [
      { name: 'columns', type: 'EditColumn[]', required: true, descriptionKey: 'columns' },
      { name: 'rows', type: 'DataRow[]', required: true, descriptionKey: 'rows' },
      { name: 'onCommit', type: '(id: string, key: string, value: string) => void', descriptionKey: 'onCommit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A reading cell is a full-width <button> so it is keyboard-reachable and clearly
  interactive; activating it swaps in an <input> with an aria-label naming the
  field. Commit on Enter or blur, cancel on Escape - a lost edit on a blur is the
  most common data-grid bug. Non-editable columns render as plain text. (State
  lives in React/TS; this markup shows one cell mid-edit.)
-->
<div class="w-full overflow-x-auto">
  <table class="w-full min-w-[32rem] border-collapse text-left text-sm">
    <thead>
      <tr class="border-b border-gray-200 dark:border-gray-800">
        <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Item</th>
        <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Qty</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-gray-100 dark:border-gray-800">
        <td class="px-1 py-1">
          <button type="button" class="w-full rounded px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Cardstock</button>
        </td>
        <td class="px-1 py-1">
          <input type="text" aria-label="Edit Qty" value="12" class="w-full rounded border border-blue-500 bg-white px-2 py-1.5 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
        </td>
      </tr>
    </tbody>
  </table>
</div>`,
      react: `import { useState } from 'react';

export function TableEditableCells({ columns, rows, onCommit, className = '' }) {
  const [data, setData] = useState(rows);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');

  function begin(id, key, current) {
    setEditing({ id, key });
    setDraft(String(current));
  }

  function commit() {
    if (!editing) return;
    const { id, key } = editing;
    setData((rows) => rows.map((r) => (r.id === id ? { ...r, [key]: draft } : r)));
    onCommit?.(id, key, draft);
    setEditing(null);
  }

  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
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
                const active = editing && editing.id === row.id && editing.key === col.key;
                if (col.editable && active) {
                  return (
                    <td key={col.key} className="px-1 py-1">
                      <input
                        type="text"
                        autoFocus
                        aria-label={\`Edit \${col.header}\`}
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
                        onClick={() => begin(row.id, col.key, row[col.key])}
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
}`,
      typescript: `import { useState } from 'react';

export interface EditColumn {
  key: string;
  header: string;
  editable?: boolean;
}

export interface DataRow {
  id: string;
  [key: string]: string | number;
}

interface EditingCell {
  id: string;
  key: string;
}

export interface TableEditableCellsProps {
  columns: EditColumn[];
  rows: DataRow[];
  onCommit?: (id: string, key: string, value: string) => void;
  className?: string;
}

export function TableEditableCells({
  columns,
  rows,
  onCommit,
  className = '',
}: TableEditableCellsProps): JSX.Element {
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
    <div className={\`w-full overflow-x-auto \${className}\`}>
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
                        aria-label={\`Edit \${col.header}\`}
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
}`,
    },
  },
  {
    slug: 'table-responsive-stacked',
    category: 'tables',
    tags: ['table', 'responsive', 'stacked', 'cards', 'mobile'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'stacked', labelKey: 'stacked' },
      { id: 'table', labelKey: 'table' },
    ],
    props: [
      { name: 'columns', type: 'DataColumn[]', required: true, descriptionKey: 'columns' },
      { name: 'rows', type: 'DataRow[]', required: true, descriptionKey: 'rows' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  ONE semantic <table> that changes its own display, not two markups. Below md
  every table part is set to \`block\`, the <thead> is visually hidden, and each
  <td> shows its column name from a data-label via
  before:content-[attr(data-label)] - so on a phone each row is a labelled card,
  not a headerless grid you have to scroll sideways. At md: the display utilities
  hand it back to the browser and it is a normal table. No horizontal scroll ever
  needed, because the grid never exists at 320px.
-->
<table class="block w-full border-collapse text-sm md:table">
  <thead class="hidden md:table-header-group">
    <tr class="border-b border-gray-200 dark:border-gray-800">
      <th scope="col" class="px-3 py-2.5 text-left font-medium text-gray-700 dark:text-gray-300">Name</th>
      <th scope="col" class="px-3 py-2.5 text-left font-medium text-gray-700 dark:text-gray-300">Role</th>
      <th scope="col" class="px-3 py-2.5 text-left font-medium text-gray-700 dark:text-gray-300">Location</th>
    </tr>
  </thead>
  <tbody class="block md:table-row-group">
    <tr class="mb-3 block rounded-lg border border-gray-200 p-3 md:mb-0 md:table-row md:border-0 md:border-b md:border-gray-100 md:p-0 dark:border-gray-800">
      <td data-label="Name" class="flex justify-between gap-4 py-1 font-medium text-gray-900 before:font-medium before:text-gray-500 before:content-[attr(data-label)] md:table-cell md:px-3 md:py-2.5 md:font-normal md:text-gray-700 md:before:content-none dark:text-gray-100 md:dark:text-gray-300">Dana Lee</td>
      <td data-label="Role" class="flex justify-between gap-4 py-1 text-gray-700 before:font-medium before:text-gray-500 before:content-[attr(data-label)] md:table-cell md:px-3 md:py-2.5 md:before:content-none dark:text-gray-300">Admin</td>
      <td data-label="Location" class="flex justify-between gap-4 py-1 text-gray-700 before:font-medium before:text-gray-500 before:content-[attr(data-label)] md:table-cell md:px-3 md:py-2.5 md:before:content-none dark:text-gray-300">Berlin</td>
    </tr>
  </tbody>
</table>`,
      react: `export function TableResponsiveStacked({ columns, rows, className = '' }) {
  return (
    <table className={\`block w-full border-collapse text-sm md:table \${className}\`}>
      <thead className="hidden md:table-header-group">
        <tr className="border-b border-gray-200 dark:border-gray-800">
          {columns.map((col) => (
            <th key={col.key} scope="col" className="px-3 py-2.5 text-left font-medium text-gray-700 dark:text-gray-300">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="block md:table-row-group">
        {rows.map((row) => (
          <tr
            key={row.id}
            className="mb-3 block rounded-lg border border-gray-200 p-3 md:mb-0 md:table-row md:border-0 md:border-b md:border-gray-100 md:p-0 dark:border-gray-800"
          >
            {columns.map((col) => (
              <td
                key={col.key}
                data-label={col.header}
                className="flex justify-between gap-4 py-1 text-gray-700 before:font-medium before:text-gray-500 before:content-[attr(data-label)] md:table-cell md:px-3 md:py-2.5 md:before:content-none dark:text-gray-300"
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
      typescript: `export interface DataColumn {
  key: string;
  header: string;
}

export interface DataRow {
  id: string;
  [key: string]: string | number;
}

export interface TableResponsiveStackedProps {
  columns: DataColumn[];
  rows: DataRow[];
  className?: string;
}

export function TableResponsiveStacked({
  columns,
  rows,
  className = '',
}: TableResponsiveStackedProps): JSX.Element {
  return (
    <table className={\`block w-full border-collapse text-sm md:table \${className}\`}>
      <thead className="hidden md:table-header-group">
        <tr className="border-b border-gray-200 dark:border-gray-800">
          {columns.map((col) => (
            <th key={col.key} scope="col" className="px-3 py-2.5 text-left font-medium text-gray-700 dark:text-gray-300">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="block md:table-row-group">
        {rows.map((row) => (
          <tr
            key={row.id}
            className="mb-3 block rounded-lg border border-gray-200 p-3 md:mb-0 md:table-row md:border-0 md:border-b md:border-gray-100 md:p-0 dark:border-gray-800"
          >
            {columns.map((col) => (
              <td
                key={col.key}
                data-label={col.header}
                className="flex justify-between gap-4 py-1 text-gray-700 before:font-medium before:text-gray-500 before:content-[attr(data-label)] md:table-cell md:px-3 md:py-2.5 md:before:content-none dark:text-gray-300"
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
    },
  },
  {
    slug: 'table-data-toolbar',
    category: 'tables',
    tags: ['table', 'toolbar', 'search', 'filter', 'columns'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'filtered', labelKey: 'filtered' },
    ],
    props: [
      { name: 'columns', type: 'DataColumn[]', required: true, descriptionKey: 'columns' },
      { name: 'rows', type: 'DataRow[]', required: true, descriptionKey: 'rows' },
      { name: 'filterKey', type: 'string', descriptionKey: 'filterKey' },
      { name: 'filterOptions', type: 'string[]', default: '[]', descriptionKey: 'filterOptions' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Three controls over one table: a search box (label sr-only, magnifier
  aria-hidden), a category <select> with a real <label>, and a column-toggle
  <details> whose summary is the button and whose panel is a list of checkboxes.
  The toolbar wraps (\`flex-wrap\`) so at 320px the three controls stack instead of
  overflowing. An aria-live count reports the filtered result set. (Wire filtering
  and column visibility to state in React/TS.)
-->
<div class="w-full">
  <div class="mb-3 flex flex-wrap items-center gap-2">
    <div class="relative min-w-0 flex-1">
      <label for="tbl-search" class="sr-only">Search rows</label>
      <span aria-hidden="true" class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
      <input id="tbl-search" type="search" placeholder="Search…" class="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-8 pr-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <label for="tbl-filter" class="sr-only">Filter by status</label>
    <select id="tbl-filter" class="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400">
      <option>All statuses</option>
      <option>Open</option>
      <option>Closed</option>
    </select>
    <details class="relative">
      <summary class="cursor-pointer list-none rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:focus-visible:ring-blue-400">Columns</summary>
      <div class="absolute right-0 z-10 mt-1 w-44 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <label class="flex items-center gap-2 px-1 py-1 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked class="h-4 w-4 accent-blue-600" /> Subject</label>
        <label class="flex items-center gap-2 px-1 py-1 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked class="h-4 w-4 accent-blue-600" /> Status</label>
      </div>
    </details>
  </div>
  <div class="w-full overflow-x-auto">
    <table class="w-full min-w-[30rem] border-collapse text-left text-sm">
      <thead>
        <tr class="border-b border-gray-200 dark:border-gray-800">
          <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Subject</th>
          <th scope="col" class="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-100 dark:border-gray-800">
          <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">Payment failed</td>
          <td class="px-3 py-2.5 text-gray-700 dark:text-gray-300">Open</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`,
      react: `import { useMemo, useState } from 'react';

export function TableDataToolbar({ columns, rows, filterKey, filterOptions = [], className = '' }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [hidden, setHidden] = useState(() => new Set());

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

  function toggleColumn(key) {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className={\`w-full \${className}\`}>
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
}`,
      typescript: `import { useMemo, useState } from 'react';

export interface DataColumn {
  key: string;
  header: string;
}

export interface DataRow {
  id: string;
  [key: string]: string | number;
}

export interface TableDataToolbarProps {
  columns: DataColumn[];
  rows: DataRow[];
  /** Column key the status <select> filters on. Omit to hide the select. */
  filterKey?: string;
  filterOptions?: string[];
  className?: string;
}

export function TableDataToolbar({
  columns,
  rows,
  filterKey,
  filterOptions = [],
  className = '',
}: TableDataToolbarProps): JSX.Element {
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
    <div className={\`w-full \${className}\`}>
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
}`,
    },
  },
];
