/**
 * Live preview for `pricing-highlight-popular`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/pricing.ts`. The "Most popular" cue is a text badge plus
 * a ring, never colour alone.
 */
interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

interface PricingHighlightPopularProps {
  tiers?: Tier[];
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  {
    id: 'hobby',
    name: 'Hobby',
    price: '$0',
    period: '/mo',
    features: ['1 project', 'Community support', '1 GB bandwidth'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$20',
    period: '/mo',
    features: ['Unlimited projects', 'Priority support', '100 GB bandwidth', 'Analytics'],
    popular: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: '$50',
    period: '/mo',
    features: ['Everything in Pro', 'SSO', 'Roles & permissions', 'Audit log'],
  },
];

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingHighlightPopular({ tiers = TIERS, ctaLabel = 'Get started', className = '' }: PricingHighlightPopularProps) {
  return (
    <section className={`mx-auto w-full max-w-5xl px-4 ${className}`} aria-labelledby="highlight-popular-heading">
      <h2
        className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        id="highlight-popular-heading"
      >
        Plans for every stage
      </h2>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={`popular-${tier.id}`}
              className={[
                'relative flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                tier.popular
                  ? 'ring-2 ring-blue-600 dark:ring-blue-500'
                  : 'border border-gray-200 dark:border-gray-800',
              ].join(' ')}
            >
              {tier.popular ? (
                <p className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
                  Most popular
                </p>
              ) : null}

              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100" id={`popular-${tier.id}`}>
                {tier.name}
              </h3>

              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{tier.price}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{tier.period}</span>
              </p>

              <ul className="my-5 grid flex-1 gap-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={[
                  'block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                  tier.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-gray-300 text-blue-700 hover:bg-gray-100 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800',
                ].join(' ')}
              >
                {ctaLabel}
                <span className="sr-only"> with {tier.name}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const minHeight = 520;

export default function PricingHighlightPopularPreview() {
  return <PricingHighlightPopular />;
}
