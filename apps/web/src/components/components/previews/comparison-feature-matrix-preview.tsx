'use client';

/**
 * Live preview for `comparison-feature-matrix`.
 *
 * Mirrors the `typescript` code variant. A real <table>: one <tbody> per group,
 * each headed by a <th scope="colgroup" colSpan>, with scoped column and row
 * headers and screen-reader-safe boolean cells.
 *
 * One deliberate divergence: the snippet's column headers are sticky, which
 * needs a scroll container the preview stage does not have - sticky here would
 * only cost the header its transparency. Everything load-bearing is identical.
 * Keep this in step with `src/data/components/comparisons.ts`.
 *
 * The default export adds a page-section shell - padding plus a centred
 * max-width - which is preview-only; the component itself is width-agnostic
 * and takes its width from the caller.
 */
interface MatrixPlan {
  id: string;
  label: string;
  /** The accessible half of "recommended" - a text node, not a colour. */
  badge?: string;
}

interface MatrixRow {
  id: string;
  label: string;
  values: Array<boolean | string>;
}

interface FeatureGroup {
  id: string;
  label: string;
  rows: MatrixRow[];
}

interface ComparisonFeatureMatrixProps {
  items: FeatureGroup[];
  plans: MatrixPlan[];
  highlighted?: string;
  className?: string;
}

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

function ComparisonFeatureMatrix({
  items,
  plans,
  highlighted,
  className = '',
}: ComparisonFeatureMatrixProps) {
  const accent = (planId: string): string =>
    planId === highlighted ? 'bg-blue-50 dark:bg-blue-950/50' : '';

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <caption className="pb-3 text-left text-gray-600 dark:text-gray-400">
          Feature availability by plan
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-gray-200 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
            >
              Feature
            </th>
            {plans.map((plan: MatrixPlan) => (
              <th
                key={plan.id}
                scope="col"
                className={`border-b border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100 ${accent(
                  plan.id,
                )}`}
              >
                {plan.label}
                {plan.badge ? (
                  <span className="mt-0.5 block text-[0.6875rem] font-semibold text-blue-700 dark:text-blue-300">
                    {plan.badge}
                  </span>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>

        {items.map((group: FeatureGroup) => (
          <tbody key={group.id}>
            <tr>
              {/* scope="colgroup" + colSpan is what makes this a heading for the
                  rows below rather than a wide, decorative cell. */}
              <th
                scope="colgroup"
                colSpan={plans.length + 1}
                className="border-b border-gray-200 bg-gray-50 px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
              >
                {group.label}
              </th>
            </tr>
            {group.rows.map((row: MatrixRow) => (
              <tr key={row.id}>
                <th
                  scope="row"
                  className="border-b border-gray-100 px-3 py-2.5 font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
                  {row.label}
                </th>
                {row.values.map((value: boolean | string, i: number) => (
                  <td
                    key={plans[i]?.id ?? i}
                    className={`border-b border-gray-100 px-3 py-2.5 text-center text-gray-700 dark:border-gray-800 dark:text-gray-300 ${accent(
                      plans[i]?.id ?? '',
                    )}`}
                  >
                    {typeof value === 'boolean' ? <BoolCell on={value} /> : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

const SAMPLE_PLANS: MatrixPlan[] = [
  { id: 'starter', label: 'Starter' },
  { id: 'pro', label: 'Pro', badge: 'Popular' },
  { id: 'enterprise', label: 'Enterprise' },
];

const SAMPLE_GROUPS: FeatureGroup[] = [
  {
    id: 'collaboration',
    label: 'Collaboration',
    rows: [
      { id: 'members', label: 'Team members', values: ['1', '10', 'Unlimited'] },
      { id: 'guests', label: 'Guest access', values: [false, true, true] },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    rows: [
      { id: 'sso', label: 'SSO & SAML', values: [false, false, true] },
      { id: 'audit', label: 'Audit log retention', values: ['7 days', '90 days', 'Unlimited'] },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    rows: [
      { id: 'response', label: 'Response time', values: ['Community', '24 hours', '1 hour'] },
      { id: 'csm', label: 'Dedicated manager', values: [false, false, true] },
    ],
  },
];

export default function ComparisonFeatureMatrixPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <ComparisonFeatureMatrix items={SAMPLE_GROUPS} plans={SAMPLE_PLANS} highlighted="pro" />
      </div>
    </section>
  );
}
