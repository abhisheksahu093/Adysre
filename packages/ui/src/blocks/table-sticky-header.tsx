'use client';

/**
 * Live preview for `table-sticky-header`.
 *
 * Mirrors the `typescript` code variant verbatim. The stage is short, so the row
 * list overflows the 14rem box and the header genuinely pins on scroll. Keep this
 * in step with `src/data/components/tables.ts`.
 */
interface DataColumn {
  key: string;
  header: string;
}

interface DataRow {
  id: string;
  [key: string]: string | number;
}

interface TableStickyHeaderProps {
  columns: DataColumn[];
  rows: DataRow[];
  maxHeight?: string;
  className?: string;
}

export function TableStickyHeader({ columns, rows, maxHeight = '20rem', className = '' }: TableStickyHeaderProps) {
  return (
    <div
      className={`w-full overflow-auto rounded-lg border border-gray-200 dark:border-gray-800 ${className}`}
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
}

const COLUMNS: DataColumn[] = [
  { key: 'ticket', header: 'Ticket' },
  { key: 'subject', header: 'Subject' },
  { key: 'assignee', header: 'Assignee' },
];

const ROWS: DataRow[] = [
  { id: 't1', ticket: '#4821', subject: 'Login loop on Safari', assignee: 'Dana' },
  { id: 't2', ticket: '#4822', subject: 'Export missing columns', assignee: 'Sam' },
  { id: 't3', ticket: '#4823', subject: 'Webhook retries stall', assignee: 'Priya' },
  { id: 't4', ticket: '#4824', subject: 'Slow dashboard load', assignee: 'Dana' },
  { id: 't5', ticket: '#4825', subject: 'Typo in invoice PDF', assignee: 'Sam' },
  { id: 't6', ticket: '#4826', subject: 'SSO callback 500', assignee: 'Priya' },
  { id: 't7', ticket: '#4827', subject: 'Dark mode contrast', assignee: 'Dana' },
];

export const minHeight = 240;

export default function TableStickyHeaderPreview() {
  return <TableStickyHeader columns={COLUMNS} rows={ROWS} maxHeight="14rem" className="max-w-2xl" />;
}
