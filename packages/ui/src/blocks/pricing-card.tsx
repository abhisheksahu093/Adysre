'use client';

/**
 * Live preview for `pricing-card`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant differs
 * only in swapping the `<a>` for `next/link`). Rendered highlighted, since the
 * badge and the blue glow are what the entry is showing off.
 * Keep this in step with `src/data/components/cards.ts`.
 */
interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

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

export function PricingCard({
  name,
  price,
  period = '/month',
  features,
  highlighted = false,
  ctaLabel = 'Get started',
  ctaHref = '#',
}: PricingCardProps) {
  const headingId = `pricing-card-${name.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <article
      aria-labelledby={headingId}
      className={[
        'relative flex max-w-sm flex-col rounded-2xl bg-white p-7 dark:bg-gray-900',
        highlighted
          ? 'border border-blue-600 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]'
          : 'border border-gray-200 shadow-sm dark:border-gray-800',
      ].join(' ')}
    >
      {highlighted ? (
        <p className="absolute -top-3 left-7 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white">
          Most popular
        </p>
      ) : null}

      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100" id={headingId}>
        {name}
      </h3>

      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{price}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{period}</span>
      </p>

      <ul className="my-6 grid flex-1 gap-3">
        {features.map((feature: string) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={ctaHref}
        className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </article>
  );
}

export default function PricingCardPreview() {
  return (
    <PricingCard
      name="Pro"
      price="$29"
      period="/month"
      features={[
        'Unlimited projects',
        'Priority support',
        'Advanced analytics',
        'Custom domains',
      ]}
      highlighted
      ctaLabel="Get started"
      ctaHref="#"
    />
  );
}
