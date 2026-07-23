'use client';

/**
 * Live preview for `pricing-comparison-grid`.
 *
 * Mirrors the `typescript` code variant. The table semantics are the component -
 * `<caption>`, `scope="col"` on the plans, `scope="row"` on the features, and
 * real `sr-only` text beside every tick - so none of it is simplified away here.
 * Keep this in step with `src/data/components/pricing.ts`.
 */
interface Plan {
  id: string;
  name: string;
  price: string;
  highlighted?: boolean;
}

type Cell = string | boolean;

interface Row {
  id: string;
  label: string;
  cells: Cell[];
}

interface PricingComparisonGridProps {
  className?: string;
}

const PLANS: Plan[] = [
  { id: 'starter', name: 'Starter', price: '$0/month' },
  { id: 'pro', name: 'Pro', price: '$19/month', highlighted: true },
  { id: 'enterprise', name: 'Enterprise', price: '$49/month' },
];

const ROWS: Row[] = [
  { id: 'projects', label: 'Projects', cells: ['3', 'Unlimited', 'Unlimited'] },
  { id: 'storage', label: 'Storage', cells: ['1 GB', '100 GB', 'Unlimited'] },
  { id: 'support', label: 'Priority support', cells: [false, true, true] },
  { id: 'sso', label: 'SSO and SCIM', cells: [false, false, true] },
  { id: 'sla', label: 'Uptime SLA', cells: [false, '99.5%', '99.9%'] },
];

function BooleanCell({ value }: { value: boolean }) {
  return (
    <>
      {value ? (
        <svg
          className="inline h-5 w-5 text-green-700 dark:text-green-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
      ) : (
        <svg
          className="inline h-5 w-5 text-gray-400 dark:text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      )}
      <span className="sr-only">{value ? 'Included' : 'Not included'}</span>
    </>
  );
}

export function PricingComparisonGrid({ className = '' }: PricingComparisonGridProps) {
  const cell = 'border-b border-gray-100 px-5 py-3.5 dark:border-gray-800';

  return (
    <div
      role="region"
      aria-labelledby="matrix-caption"
      tabIndex={0}
      className={`mx-auto max-w-4xl overflow-x-auto rounded-xl border border-gray-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${className}`}
    >
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption
          className="px-5 py-4 text-left text-base font-semibold text-gray-900 dark:text-gray-100"
          id="matrix-caption"
        >
          Compare plans
        </caption>

        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-gray-200 bg-gray-50 px-5 py-3.5 align-bottom text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
            >
              Feature
            </th>
            {PLANS.map((plan: Plan) => (
              <th
                key={plan.id}
                scope="col"
                className={[
                  'border-b border-gray-200 bg-gray-50 px-5 py-3.5 text-center align-bottom text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100',
                  plan.highlighted ? 'shadow-[inset_0_-2px_0_0_#2563eb]' : '',
                ].join(' ')}
              >
                {plan.name}
                <span className="mt-0.5 block text-xs font-normal text-gray-600 dark:text-gray-400">
                  {plan.price}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {ROWS.map((row: Row) => (
            <tr key={row.id}>
              <th scope="row" className={`${cell} text-sm font-medium text-gray-700 dark:text-gray-300`}>
                {row.label}
              </th>
              {row.cells.map((value: Cell, index: number) => (
                <td
                  key={PLANS[index]?.id ?? index}
                  className={`${cell} text-center text-sm text-gray-700 dark:text-gray-300`}
                >
                  {typeof value === 'boolean' ? <BooleanCell value={value} /> : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PricingComparisonGridPreview() {
  return <PricingComparisonGrid className="w-full" />;
}
