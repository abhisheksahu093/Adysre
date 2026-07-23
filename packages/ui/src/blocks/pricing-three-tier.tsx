'use client';

/**
 * Live preview for `pricing-three-tier`.
 *
 * Mirrors the `typescript` code variant (the `nextjs` one differs only in
 * swapping the `<a>` for `next/link`). The heading is scaled down from `text-3xl`
 * so the section fits the preview stage without dominating it.
 * Keep this in step with `src/data/components/pricing.ts`.
 */
interface Tier {
  id: string;
  name: string;
  blurb: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

interface PricingThreeTierProps {
  tiers?: Tier[];
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    blurb: 'For side projects and trials.',
    price: '$0',
    period: '/month',
    features: ['3 projects', 'Community support', '1 GB storage'],
  },
  {
    id: 'pro',
    name: 'Pro',
    blurb: 'For teams shipping to production.',
    price: '$19',
    period: '/month',
    features: ['Unlimited projects', 'Priority support', '100 GB storage'],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    blurb: 'For organisations with contracts.',
    price: '$49',
    period: '/month',
    features: ['SSO and SCIM', '99.9% uptime SLA', 'Unlimited storage'],
  },
];

function CheckIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingThreeTier({ tiers = TIERS, ctaLabel = 'Get started', className = '' }: PricingThreeTierProps) {
  return (
    <section className={`mx-auto max-w-5xl ${className}`} aria-labelledby="tiers-heading">
      <h2
        className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        id="tiers-heading"
      >
        Simple, predictable pricing
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        No setup fees. Cancel any time.
      </p>

      <ul className="mt-8 grid gap-6 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier: Tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={`tiers-${tier.id}`}
              className={[
                'relative flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                tier.highlighted
                  ? 'border border-blue-600 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]'
                  : 'border border-gray-200 shadow-sm dark:border-gray-800',
              ].join(' ')}
            >
              {tier.highlighted ? (
                <p className="absolute -top-3 left-6 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white">
                  Most popular
                </p>
              ) : null}

              <h3
                className="text-base font-semibold text-gray-900 dark:text-gray-100"
                id={`tiers-${tier.id}`}
              >
                {tier.name}
              </h3>
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{tier.blurb}</p>

              <p className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {tier.price}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{tier.period}</span>
              </p>

              <ul className="my-6 grid flex-1 gap-3">
                {tier.features.map((feature: string) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={[
                  'block rounded-lg border px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                  tier.highlighted
                    ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-gray-300 text-blue-700 hover:bg-gray-100 dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800',
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

export default function PricingThreeTierPreview() {
  return <PricingThreeTier className="w-full" />;
}
