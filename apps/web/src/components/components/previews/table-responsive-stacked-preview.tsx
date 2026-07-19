'use client';

/**
 * Live preview for `table-responsive-stacked`.
 *
 * Mirrors the `typescript` code variant verbatim. On the narrow preview stage the
 * rows render as labelled cards; the same markup becomes a grid at `md`. Keep this
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

interface TableResponsiveStackedProps {
  columns: DataColumn[];
  rows: DataRow[];
  className?: string;
}

function TableResponsiveStacked({ columns, rows, className = '' }: TableResponsiveStackedProps) {
  return (
    <table className={`block w-full border-collapse text-sm md:table ${className}`}>
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
}

const COLUMNS: DataColumn[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'location', header: 'Location' },
];

const ROWS: DataRow[] = [
  { id: 's1', name: 'Dana Lee', role: 'Admin', location: 'Berlin' },
  { id: 's2', name: 'Sam Ford', role: 'Editor', location: 'Toronto' },
  { id: 's3', name: 'Priya Nair', role: 'Viewer', location: 'Mumbai' },
];

export const minHeight = 380;

export default function TableResponsiveStackedPreview() {
  return <TableResponsiveStacked columns={COLUMNS} rows={ROWS} className="max-w-2xl" />;
}
