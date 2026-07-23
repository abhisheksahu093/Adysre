/**
 * Live preview for `pricing-annual-discount`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/pricing.ts`. The discount is stated as text ("Save 20%"),
 * never colour alone; the crossed-out monthly price uses <s> for real semantics.
 */
interface Tier {
  id: string;
  name: string;
  annualPerMonth: string;
  monthlyPrice: string;
  billedNote: string;
  savings: string;
  features: string[];
  highlighted?: boolean;
}

interface PricingAnnualDiscountProps {
  tiers?: Tier[];
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  {
    id: 'solo',
    name: 'Solo',
    annualPerMonth: '$8',
    monthlyPrice: '$10',
    billedNote: 'Billed $96 yearly',
    savings: 'Save 20%',
    features: ['1 seat', '20 GB storage', 'Standard support'],
  },
  {
    id: 'team',
    name: 'Team',
    annualPerMonth: '$20',
    monthlyPrice: '$25',
    billedNote: 'Billed $240 yearly',
    savings: 'Save 20%',
    features: ['5 seats', '500 GB storage', 'Priority support', 'Audit log'],
    highlighted: true,
  },
];

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingAnnualDiscount({ tiers = TIERS, ctaLabel = 'Get started', className = '' }: PricingAnnualDiscountProps) {
  return (
    <section className={`mx-auto w-full max-w-3xl px-4 ${className}`} aria-labelledby="annual-discount-heading">
      <div className="text-center">
        <h2
          className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
          id="annual-discount-heading"
        >
          Save with annual billing
        </h2>
        <p className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">
          Two months free every year
        </p>
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 sm:items-stretch">
        {tiers.map((tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={`annual-${tier.id}`}
              className={[
                'flex flex-1 flex-col rounded-2xl bg-white p-6 dark:bg-gray-900',
                tier.highlighted
                  ? 'border-2 border-blue-600 dark:border-blue-500'
                  : 'border border-gray-200 dark:border-gray-800',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100" id={`annual-${tier.id}`}>
                  {tier.name}
                </h3>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">
                  {tier.savings}
                </span>
              </div>

              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {tier.annualPerMonth}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">/mo</span>
                <s className="text-sm text-gray-400 dark:text-gray-500">{tier.monthlyPrice}</s>
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{tier.billedNote}</p>

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
                  tier.highlighted
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

export default function PricingAnnualDiscountPreview() {
  return <PricingAnnualDiscount />;
}
