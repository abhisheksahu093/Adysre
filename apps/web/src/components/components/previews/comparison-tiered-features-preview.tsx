/**
 * Live preview for `comparison-tiered-features`.
 *
 * Mirrors the `typescript` code variant. Tiers stack into a responsive grid;
 * each higher tier states what it inherits in words ("Everything in Team,
 * plus") rather than re-listing every lower feature. Keep this in step with
 * `src/data/components/comparisons.ts`.
 */
interface Tier {
  id: string;
  name: string;
  price?: string;
  inheritsFrom?: string;
  features: string[];
  featured?: boolean;
}

interface ComparisonTieredFeaturesProps {
  tiers: Tier[];
  className?: string;
}

function ComparisonTieredFeatures({ tiers, className = '' }: ComparisonTieredFeaturesProps) {
  return (
    <div className={`grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {tiers.map((tier) => (
        <section
          key={tier.id}
          aria-label={tier.name}
          className={`flex flex-col rounded-xl border bg-white p-5 dark:bg-gray-900 ${
            tier.featured ? 'border-blue-600 dark:border-blue-400' : 'border-gray-200 dark:border-gray-800'
          }`}
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{tier.name}</h3>
          {tier.price ? (
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{tier.price}</p>
          ) : null}
          {tier.inheritsFrom ? (
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Everything in {tier.inheritsFrom}, plus
            </p>
          ) : null}
          <ul className="mt-2 grid gap-2">
            {tier.features.map((feature) => (
              <li
                key={feature}
                className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">
                  ✓
                </span>
                <span>
                  <span className="sr-only">Included: </span>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const SAMPLE_TIERS: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$0',
    features: ['1 project', 'Community support', '7-day history'],
  },
  {
    id: 'team',
    name: 'Team',
    price: '$29',
    inheritsFrom: 'Starter',
    featured: true,
    features: ['Unlimited projects', 'Priority support', '1-year history'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    inheritsFrom: 'Team',
    features: ['SSO & SAML', 'Dedicated manager', 'Unlimited history'],
  },
];

export default function ComparisonTieredFeaturesPreview() {
  return <ComparisonTieredFeatures tiers={SAMPLE_TIERS} />;
}

export const minHeight = 440;
