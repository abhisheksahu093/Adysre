'use client';

import { useState } from 'react';

/**
 * Live preview for `comparison-pricing-toggle`.
 *
 * Mirrors the `typescript` code variant. The toggle is a real radiogroup, so
 * the two options are reachable and announced as radios rather than as two
 * unlabelled buttons. Keep this in step with `src/data/components/comparisons.ts`.
 *
 * The default export adds a page-section shell - padding plus a centred
 * max-width - which is preview-only; the component itself is width-agnostic
 * and takes its width from the caller.
 */
type BillingCycle = 'monthly' | 'annual';

interface TogglePlan {
  id: string;
  name: string;
  monthly: number;
  annual: number;
  features: string[];
  featured?: boolean;
}

interface ComparisonPricingToggleProps {
  plans: TogglePlan[];
  currency?: string;
  className?: string;
}

function ComparisonPricingToggle({ plans, currency = '$', className = '' }: ComparisonPricingToggleProps) {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const annual = cycle === 'annual';

  return (
    <section className={`w-full ${className}`}>
      <div className="mb-6 flex justify-center">
        <div
          role="radiogroup"
          aria-label="Billing cycle"
          className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900"
        >
          {(['monthly', 'annual'] as const).map((option) => {
            const active = cycle === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setCycle(option)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ${
                  active
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {option}
                {option === 'annual' ? (
                  <span className="ml-1 text-emerald-700 dark:text-emerald-400">-20%</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <section
            key={plan.id}
            aria-label={plan.name}
            className={`flex flex-col rounded-xl border bg-white p-5 dark:bg-gray-900 ${
              plan.featured ? 'border-blue-600 dark:border-blue-400' : 'border-gray-200 dark:border-gray-800'
            }`}
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{plan.name}</h3>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {currency}
                {annual ? plan.annual : plan.monthly}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/{annual ? 'yr' : 'mo'}</span>
            </p>
            <ul className="mt-4 grid gap-2">
              {plan.features.map((feature) => (
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
    </section>
  );
}

const SAMPLE_PLANS: TogglePlan[] = [
  { id: 'starter', name: 'Starter', monthly: 12, annual: 115, features: ['3 projects', 'Community support'] },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 29,
    annual: 278,
    featured: true,
    features: ['Unlimited projects', 'Priority support', 'Audit log'],
  },
  { id: 'scale', name: 'Scale', monthly: 79, annual: 758, features: ['SSO & SAML', 'Dedicated manager'] },
];

export default function ComparisonPricingTogglePreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ComparisonPricingToggle plans={SAMPLE_PLANS} />
      </div>
    </section>
  );
}

export const minHeight = 420;
