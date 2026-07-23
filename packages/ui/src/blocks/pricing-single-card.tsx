'use client';

/**
 * Live preview for `pricing-single-card`.
 *
 * Mirrors the `typescript` code variant (the `nextjs` one differs only in
 * swapping the `<a>` for `next/link`).
 * Keep this in step with `src/data/components/pricing.ts`.
 */
interface PricingSingleCardProps {
  name?: string;
  price?: string;
  period?: string;
  copy?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const FEATURES: string[] = [
  'Unlimited projects',
  'Unlimited team members',
  '100 GB storage',
  'Priority support',
  'SSO and audit log',
  '99.9% uptime SLA',
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

export function PricingSingleCard({
  name = 'Pro',
  price = '$19',
  period = '/month',
  copy = 'Everything you need to ship, at one price. No seat maths, no feature gates, no sales call.',
  features = FEATURES,
  ctaLabel = 'Get access',
  ctaHref = '#',
  className = '',
}: PricingSingleCardProps) {
  return (
    <article
      aria-labelledby="solo-name"
      className={`mx-auto grid max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-[1.6fr_1fr] dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-blue-700 dark:text-blue-300">
          One plan
        </p>
        <h3
          className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
          id="solo-name"
        >
          {name}
        </h3>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.04em] text-gray-500 dark:text-gray-400">
          What&apos;s included
        </p>
        <ul className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
          {features.map((feature: string) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckIcon />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-center border-t border-gray-200 bg-gray-50 p-8 md:border-l md:border-t-0 dark:border-gray-800 dark:bg-gray-800">
        <p className="text-[0.8125rem] font-medium text-gray-600 dark:text-gray-400">Flat monthly rate</p>

        <p className="mt-2 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
            {price}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{period}</span>
        </p>

        <a
          href={ctaHref}
          className="mt-5 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-800"
        >
          {ctaLabel}
        </a>

        <p className="mt-3 text-xs leading-normal text-gray-500 dark:text-gray-400">
          Invoices and VAT receipts included. Cancel any time.
        </p>
      </div>
    </article>
  );
}

export default function PricingSingleCardPreview() {
  return <PricingSingleCard className="w-full" />;
}
