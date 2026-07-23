/**
 * Live preview for `pricing-gradient-cards`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/pricing.ts`. The gradient is decorative; every price and
 * badge stays real text on a contrast-safe overlay.
 */
interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  gradient: string;
  featured?: boolean;
}

interface PricingGradientCardsProps {
  tiers?: Tier[];
  ctaLabel?: string;
  className?: string;
}

const TIERS: Tier[] = [
  {
    id: 'lite',
    name: 'Lite',
    price: '$9',
    period: '/mo',
    features: ['5 projects', '2 GB storage', 'Community support'],
    gradient: 'from-slate-700 to-slate-900',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$24',
    period: '/mo',
    features: ['Unlimited projects', '100 GB storage', 'Priority support'],
    gradient: 'from-blue-600 to-indigo-700',
    featured: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '$59',
    period: '/mo',
    features: ['Everything in Plus', 'SSO & SCIM', 'Dedicated manager'],
    gradient: 'from-violet-600 to-fuchsia-700',
  },
];

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-white/90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function PricingGradientCards({ tiers = TIERS, ctaLabel = 'Choose plan', className = '' }: PricingGradientCardsProps) {
  return (
    <section className={`mx-auto w-full max-w-5xl px-4 ${className}`} aria-labelledby="gradient-cards-heading">
      <h2
        className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        id="gradient-cards-heading"
      >
        Pick your gradient
      </h2>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        {tiers.map((tier) => (
          <li className="flex" key={tier.id}>
            <article
              aria-labelledby={`gradient-${tier.id}`}
              className={[
                'relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white',
                tier.gradient,
                tier.featured ? 'ring-2 ring-white/70 ring-offset-2 ring-offset-white dark:ring-offset-gray-950' : '',
              ].join(' ')}
            >
              {tier.featured ? (
                <p className="mb-3 inline-flex w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                  Most popular
                </p>
              ) : null}

              <h3 className="text-base font-semibold" id={`gradient-${tier.id}`}>
                {tier.name}
              </h3>

              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                <span className="text-sm text-white/80">{tier.period}</span>
              </p>

              <ul className="my-5 grid flex-1 gap-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-white/90">
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className="block rounded-lg bg-white/95 px-4 py-2.5 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none"
              >
                {ctaLabel}
                <span className="sr-only"> {tier.name}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const minHeight = 500;

export default function PricingGradientCardsPreview() {
  return <PricingGradientCards />;
}
