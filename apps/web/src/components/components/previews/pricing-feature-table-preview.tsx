/**
 * Live preview for `pricing-feature-table`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/pricing.ts`. The wrapper scrolls (not the table) so the
 * last plan is never clipped at 320px.
 */
interface FeatureRow {
  feature: string;
  values: Array<string | boolean>;
}

interface PricingFeatureTableProps {
  plans?: string[];
  rows?: FeatureRow[];
  className?: string;
}

const PLANS = ['Starter', 'Team', 'Business'];

const ROWS: FeatureRow[] = [
  { feature: 'Projects', values: ['3', '25', 'Unlimited'] },
  { feature: 'Team members', values: ['1', '10', 'Unlimited'] },
  { feature: 'Priority support', values: [false, true, true] },
  { feature: 'SSO / SAML', values: [false, false, true] },
  { feature: 'Audit log', values: [false, true, true] },
];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === 'string') {
    return <span className="text-gray-700 dark:text-gray-300">{value}</span>;
  }
  if (value) {
    return (
      <span className="inline-flex items-center gap-1.5 text-green-700 dark:text-green-400">
        <svg className="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
        Included
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
      <svg className="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M6.4 5A1 1 0 0 0 5 6.4L8.6 10 5 13.6A1 1 0 0 0 6.4 15L10 11.4 13.6 15a1 1 0 0 0 1.4-1.4L11.4 10 15 6.4A1 1 0 0 0 13.6 5L10 8.6 6.4 5Z" />
      </svg>
      Not included
    </span>
  );
}

function PricingFeatureTable({ plans = PLANS, rows = ROWS, className = '' }: PricingFeatureTableProps) {
  return (
    <section
      className={`mx-auto w-full max-w-4xl px-4 ${className}`}
      aria-labelledby="feature-table-heading"
    >
      <h2
        className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        id="feature-table-heading"
      >
        Compare every plan
      </h2>

      <div
        className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800"
        tabIndex={0}
        role="region"
        aria-label="Plan comparison, scrollable"
      >
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th scope="col" className="p-4 font-semibold text-gray-900 dark:text-gray-100">
                Feature
              </th>
              {plans.map((plan) => (
                <th
                  key={plan}
                  scope="col"
                  className="p-4 font-semibold text-gray-900 dark:text-gray-100"
                >
                  {plan}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.feature}
                className="border-b border-gray-100 last:border-0 dark:border-gray-800/60"
              >
                <th
                  scope="row"
                  className="p-4 font-medium text-gray-700 dark:text-gray-300"
                >
                  {row.feature}
                </th>
                {row.values.map((value, i) => (
                  <td key={`${row.feature}-${plans[i] ?? i}`} className="p-4">
                    <CellValue value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export const minHeight = 400;

export default function PricingFeatureTablePreview() {
  return <PricingFeatureTable />;
}
