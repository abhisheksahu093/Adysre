/**
 * Live preview for `comparison-three-column`.
 *
 * Mirrors the `typescript` code variant. Three plan columns that collapse to
 * two then one; excluded features keep their row with an aria-hidden cross plus
 * a visually-hidden "Not included:" prefix. Keep this in step with
 * `src/data/components/comparisons.ts`.
 *
 * The default export adds a page-section shell - padding plus a centred
 * max-width - which is preview-only; the component itself is width-agnostic
 * and takes its width from the caller.
 */
interface ThreeColFeature {
  label: string;
  included: boolean;
}

interface ThreeColItem {
  id: string;
  name: string;
  price?: string;
  highlight?: boolean;
  features: ThreeColFeature[];
}

interface ComparisonThreeColumnProps {
  columns: ThreeColItem[];
  className?: string;
}

function ComparisonThreeColumn({ columns, className = '' }: ComparisonThreeColumnProps) {
  return (
    <div className={`grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {columns.map((col) => (
        <section
          key={col.id}
          aria-label={col.name}
          className={`flex flex-col rounded-xl border bg-white p-5 dark:bg-gray-900 ${
            col.highlight
              ? 'border-blue-600 ring-1 ring-blue-600 dark:border-blue-400 dark:ring-blue-400'
              : 'border-gray-200 dark:border-gray-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{col.name}</h3>
            {col.highlight ? (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white dark:bg-blue-500">
                Popular
              </span>
            ) : null}
          </div>
          {col.price ? (
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{col.price}</p>
          ) : null}
          <ul className="mt-4 grid gap-2">
            {col.features.map((feature) => (
              <li
                key={feature.label}
                className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span
                  aria-hidden="true"
                  className={
                    feature.included
                      ? 'font-bold text-emerald-700 dark:text-emerald-400'
                      : 'font-bold text-gray-400 dark:text-gray-600'
                  }
                >
                  {feature.included ? '✓' : '✗'}
                </span>
                <span className={feature.included ? '' : 'text-gray-400 line-through dark:text-gray-600'}>
                  <span className="sr-only">{feature.included ? 'Included: ' : 'Not included: '}</span>
                  {feature.label}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const SAMPLE_COLUMNS: ThreeColItem[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    features: [
      { label: '1 workspace', included: true },
      { label: 'Community support', included: true },
      { label: 'Audit log', included: false },
    ],
  },
  {
    id: 'team',
    name: 'Team',
    price: '$29',
    highlight: true,
    features: [
      { label: 'Unlimited workspaces', included: true },
      { label: 'Priority support', included: true },
      { label: 'Audit log', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    features: [
      { label: 'Everything in Team', included: true },
      { label: 'SSO & SAML', included: true },
      { label: 'Dedicated manager', included: true },
    ],
  },
];

export default function ComparisonThreeColumnPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ComparisonThreeColumn columns={SAMPLE_COLUMNS} />
      </div>
    </section>
  );
}

export const minHeight = 440;
