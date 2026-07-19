'use client';

/**
 * Live preview for `table-basic-striped`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/tables.ts`.
 */
interface DataColumn {
  key: string;
  header: string;
  align?: 'left' | 'right';
}

interface DataRow {
  id: string;
  [key: string]: string | number;
}

interface TableBasicStripedProps {
  columns: DataColumn[];
  rows: DataRow[];
  caption?: string;
  className?: string;
}

function TableBasicStriped({ columns, rows, caption, className = '' }: TableBasicStripedProps) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
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
                className={`whitespace-nowrap px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
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
                  className={`whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300 ${col.align === 'right' ? 'text-right' : 'text-left'}`}
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

const COLUMNS: DataColumn[] = [
  { key: 'invoice', header: 'Invoice' },
  { key: 'client', header: 'Client' },
  { key: 'status', header: 'Status' },
  { key: 'amount', header: 'Amount', align: 'right' },
];

const ROWS: DataRow[] = [
  { id: 'i1', invoice: 'INV-1024', client: 'Acme Inc', status: 'Paid', amount: '$1,200.00' },
  { id: 'i2', invoice: 'INV-1025', client: 'Globex', status: 'Pending', amount: '$820.00' },
  { id: 'i3', invoice: 'INV-1026', client: 'Umbrella', status: 'Paid', amount: '$3,410.00' },
  { id: 'i4', invoice: 'INV-1027', client: 'Initech', status: 'Overdue', amount: '$540.00' },
];

export const minHeight = 240;

export default function TableBasicStripedPreview() {
  return <TableBasicStriped columns={COLUMNS} rows={ROWS} caption="Recent invoices" className="max-w-2xl" />;
}
