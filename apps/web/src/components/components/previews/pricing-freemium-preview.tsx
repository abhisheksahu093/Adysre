/**
 * Live preview for `pricing-freemium`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/pricing.ts`.
 */
interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  blurb: string;
  features: string[];
  ctaLabel: string;
  paid?: boolean;
}

interface PricingFreemiumProps {
  plans?: Plan[];
  className?: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    blurb: 'Get started, no card required.',
    features: ['1 project', '100 monthly events', 'Community support'],
    ctaLabel: 'Create free account',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$18',
    period: '/month',
    blurb: 'Everything in Free, plus room to grow.',
    features: ['Unlimited projects', 'Unlimited events', 'Priority support', 'Custom domains'],
    ctaLabel: 'Upgrade to Pro',
    paid: true,
  },
];

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

function PricingFreemium({ plans = PLANS, className = '' }: PricingFreemiumProps) {
  return (
    <section className={`mx-auto w-full max-w-3xl px-4 ${className}`} aria-labelledby="freemium-heading">
      <h2
        className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        id="freemium-heading"
      >
        Start free, upgrade when ready
      </h2>

      <ul className="mt-8 grid gap-5 md:grid-cols-2 md:items-stretch">
        {plans.map((plan) => (
          <li className="flex" key={plan.id}>
            <article
              aria-labelledby={`freemium-${plan.id}`}
              className={[
                'flex flex-1 flex-col rounded-2xl p-6',
                plan.paid
                  ? 'bg-gray-900 text-white dark:bg-gray-800'
                  : 'border border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100',
              ].join(' ')}
            >
              <h3 className="text-base font-semibold" id={`freemium-${plan.id}`}>
                {plan.name}
              </h3>
              <p className={`mt-1 text-sm ${plan.paid ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                {plan.blurb}
              </p>

              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                <span className={`text-sm ${plan.paid ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  {plan.period}
                </span>
              </p>

              <ul className="my-5 grid flex-1 gap-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-start gap-2 text-sm ${plan.paid ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {plan.paid ? (
                      <svg className="mt-0.5 h-4 w-4 flex-none text-blue-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
                      </svg>
                    ) : (
                      <CheckIcon />
                    )}
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={[
                  'block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none',
                  plan.paid
                    ? 'bg-white text-gray-900 hover:bg-gray-200 focus-visible:ring-white focus-visible:ring-offset-gray-900'
                    : 'border border-gray-300 text-blue-700 hover:bg-gray-100 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:border-gray-700 dark:text-blue-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900',
                ].join(' ')}
              >
                {plan.ctaLabel}
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const minHeight = 480;

export default function PricingFreemiumPreview() {
  return <PricingFreemium />;
}
