/**
 * Live preview for `comparison-plan-matrix`.
 *
 * Mirrors the `typescript` code variant. A real <table> with a price under each
 * plan name; the wrapper scrolls (min-w on the table) so the feature column
 * never leaves the viewport at 320px. Keep this in step with
 * `src/data/components/comparisons.ts`.
 */
interface MatrixPlan {
  name: string;
  price: string;
}

interface MatrixRow {
  id: string;
  label: string;
  values: Array<boolean | string>;
}

interface ComparisonPlanMatrixProps {
  plans: MatrixPlan[];
  rows: MatrixRow[];
  className?: string;
}

function BoolCell({ on }: { on: boolean }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={on ? 'font-bold text-emerald-700 dark:text-emerald-400' : 'font-bold text-gray-400 dark:text-gray-600'}
      >
        {on ? '✓' : '✗'}
      </span>
      <span className="sr-only">{on ? 'Included' : 'Not included'}</span>
    </>
  );
}

function ComparisonPlanMatrix({ plans, rows, className = '' }: ComparisonPlanMatrixProps) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
            >
              Feature
            </th>
            {plans.map((plan) => (
              <th
                key={plan.name}
                scope="col"
                className="border-b border-gray-200 px-3 py-2.5 text-center dark:border-gray-800"
              >
                <span className="block font-semibold text-gray-900 dark:text-gray-100">{plan.name}</span>
                <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">{plan.price}</span>
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
              {row.values.map((value, i) => (
                <td
                  key={`${row.id}-${i}`}
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

const SAMPLE_PLANS: MatrixPlan[] = [
  { name: 'Starter', price: '$0' },
  { name: 'Pro', price: '$29' },
  { name: 'Enterprise', price: 'Custom' },
];

const SAMPLE_ROWS: MatrixRow[] = [
  { id: 'seats', label: 'Seats', values: ['1', '10', 'Unlimited'] },
  { id: 'support', label: 'Priority support', values: [false, true, true] },
  { id: 'audit', label: 'Audit log', values: [false, true, true] },
  { id: 'sso', label: 'SSO & SAML', values: [false, false, true] },
];

export default function ComparisonPlanMatrixPreview() {
  return <ComparisonPlanMatrix plans={SAMPLE_PLANS} rows={SAMPLE_ROWS} />;
}

export const minHeight = 300;
