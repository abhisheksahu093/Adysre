'use client';

/**
 * Live preview for `comparison-table`.
 *
 * Mirrors the `typescript` code variant. The semantics are the component - a
 * real <table> with <caption>, scoped column and row headers, and boolean cells
 * whose ✓/✗ is aria-hidden beside a visually-hidden word. Keep this in step with
 * `src/data/components/comparisons.ts`.
 *
 * The default export adds a page-section shell - padding plus a centred
 * max-width - which is preview-only; the component itself is width-agnostic
 * and takes its width from the caller.
 */
interface ComparisonRow {
  id: string;
  label: string;
  /** Positional - one entry per plan, in the same order as `plans`. */
  values: Array<boolean | string>;
}

interface ComparisonTableProps {
  items: ComparisonRow[];
  plans: string[];
  className?: string;
}

/** The glyph is decorative; the word beside it is what gets announced. */
function BoolCell({ on }: { on: boolean }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={on ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-500'}
      >
        {on ? '✓' : '✗'}
      </span>
      <span className="sr-only">{on ? 'Included' : 'Not included'}</span>
    </>
  );
}

function ComparisonTable({ items, plans, className = '' }: ComparisonTableProps) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="pb-3 text-left text-gray-600 dark:text-gray-400">
          Plan comparison - what each tier includes
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
            >
              Feature
            </th>
            {plans.map((plan: string) => (
              <th
                key={plan}
                scope="col"
                className="border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100"
              >
                {plan}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row: ComparisonRow) => (
            <tr key={row.id}>
              <th
                scope="row"
                className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
              >
                {row.label}
              </th>
              {row.values.map((value: boolean | string, i: number) => (
                <td
                  key={plans[i]}
                  className="border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
                  {typeof value === 'boolean' ? <BoolCell on={value} /> : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SAMPLE_PLANS: string[] = ['Starter', 'Pro', 'Enterprise'];

const SAMPLE_ROWS: ComparisonRow[] = [
  { id: 'projects', label: 'Projects', values: ['3', 'Unlimited', 'Unlimited'] },
  { id: 'members', label: 'Team members', values: ['1', '10', 'Unlimited'] },
  { id: 'support', label: 'Priority support', values: [false, true, true] },
  { id: 'audit', label: 'Audit log', values: [false, true, true] },
  { id: 'sso', label: 'SSO & SAML', values: [false, false, true] },
];

export default function ComparisonTablePreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <ComparisonTable items={SAMPLE_ROWS} plans={SAMPLE_PLANS} />
      </div>
    </section>
  );
}
