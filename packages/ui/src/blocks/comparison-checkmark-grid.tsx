/**
 * Live preview for `comparison-checkmark-grid`.
 *
 * Mirrors the `typescript` code variant. A pure support grid: every cell is a
 * boolean, rendered as an aria-hidden glyph plus a visually-hidden word, inside
 * a real <table> that scrolls in its wrapper. Keep this in step with
 * `src/data/components/comparisons.ts`.
 *
 * The default export adds a page-section shell - padding plus a centred
 * max-width - which is preview-only; the component itself is width-agnostic
 * and takes its width from the caller.
 */
interface CheckGridRow {
  id: string;
  label: string;
  support: boolean[];
}

interface ComparisonCheckmarkGridProps {
  options: string[];
  rows: CheckGridRow[];
  className?: string;
}

export function ComparisonCheckmarkGrid({ options, rows, className = '' }: ComparisonCheckmarkGridProps) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
            >
              Capability
            </th>
            {options.map((option) => (
              <th
                key={option}
                scope="col"
                className="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100"
              >
                {option}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th
                scope="row"
                className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 last:border-0 dark:border-gray-800 dark:text-gray-300"
              >
                {row.label}
              </th>
              {row.support.map((on, i) => (
                <td
                  key={`${row.id}-${i}`}
                  className="border-b border-gray-100 px-3 py-2.5 text-center dark:border-gray-800"
                >
                  <span
                    aria-hidden="true"
                    className={
                      on
                        ? 'font-bold text-emerald-700 dark:text-emerald-400'
                        : 'font-bold text-gray-400 dark:text-gray-600'
                    }
                  >
                    {on ? '✓' : '✗'}
                  </span>
                  <span className="sr-only">{on ? 'Supported' : 'Not supported'}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SAMPLE_OPTIONS = ['Free', 'Pro', 'Team'];

const SAMPLE_ROWS: CheckGridRow[] = [
  { id: 'api', label: 'REST API', support: [true, true, true] },
  { id: 'webhooks', label: 'Webhooks', support: [false, true, true] },
  { id: 'sso', label: 'SSO', support: [false, false, true] },
  { id: 'export', label: 'Data export', support: [false, true, true] },
];

export default function ComparisonCheckmarkGridPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ComparisonCheckmarkGrid options={SAMPLE_OPTIONS} rows={SAMPLE_ROWS} />
      </div>
    </section>
  );
}

export const minHeight = 280;
