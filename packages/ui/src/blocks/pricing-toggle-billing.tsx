'use client';

import { useState } from 'react';

/**
 * Live preview for `pricing-toggle-billing`.
 *
 * Mirrors the `typescript` code variant. Flipping the switch recomputes every
 * amount and its billing note - the point of the component, so the preview has
 * to actually do it rather than render a static "on" state.
 * Keep this in step with `src/data/components/pricing.ts`.
 */
interface Tier {
  id: string;
  name: string;
  monthly: number;
  annual: number;
  highlighted?: boolean;
}

interface PricingToggleBillingProps {
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  { id: 'starter', name: 'Starter', monthly: 0, annual: 0 },
  { id: 'pro', name: 'Pro', monthly: 19, annual: 15, highlighted: true },
  { id: 'enterprise', name: 'Enterprise', monthly: 49, annual: 39 },
];

export function PricingToggleBilling({ ctaLabel = 'Choose plan', className = '' }: PricingToggleBillingProps) {
  const [annual, setAnnual] = useState<boolean>(false);

  return (
    <section className={`mx-auto max-w-4xl ${className}`} aria-labelledby="billing-heading">
      <h2
        className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        id="billing-heading"
      >
        Pricing
      </h2>

      <div className="mt-6 flex items-center justify-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300" id="billing-switch-label">
          Bill annually
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          aria-labelledby="billing-switch-label"
          aria-describedby="billing-save"
          onClick={() => setAnnual((value: boolean) => !value)}
          className="group relative h-6 w-11 flex-none rounded-full bg-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none aria-checked:bg-blue-600 dark:bg-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <span
            className="absolute left-[0.1875rem] top-[0.1875rem] h-[1.125rem] w-[1.125rem] rounded-full bg-white transition-transform group-aria-checked:translate-x-5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </button>
        <span
          className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950 dark:text-green-200"
          id="billing-save"
        >
          Save 20%
        </span>
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {TIERS.map((tier: Tier) => {
          const amount: number = annual ? tier.annual : tier.monthly;
          const note: string =
            amount === 0
              ? 'Free forever'
              : annual
                ? `Billed $${tier.annual * 12} annually`
                : 'Billed monthly';

          return (
            <li className="flex" key={tier.id}>
              <article
                aria-labelledby={`billing-${tier.id}`}
                className={[
                  'flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                  tier.highlighted
                    ? 'border border-blue-600'
                    : 'border border-gray-200 dark:border-gray-800',
                ].join(' ')}
              >
                <h3
                  className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  id={`billing-${tier.id}`}
                >
                  {tier.name}
                </h3>

                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
                    ${amount}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
                </p>

                <p className="mb-5 mt-2 min-h-10 text-[0.8125rem] text-gray-600 dark:text-gray-400">
                  {note}
                </p>

                <a
                  href="#"
                  className={[
                    'mt-auto block rounded-lg border px-4 py-2.5 text-center text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                    tier.highlighted
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-blue-700 dark:border-gray-700 dark:text-blue-300',
                  ].join(' ')}
                >
                  {ctaLabel}
                  <span className="sr-only"> {tier.name}</span>
                </a>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function PricingToggleBillingPreview() {
  return <PricingToggleBilling className="w-full" />;
}
