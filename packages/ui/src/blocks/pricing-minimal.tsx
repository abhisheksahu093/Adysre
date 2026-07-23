/**
 * Live preview for `pricing-minimal`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/pricing.ts`.
 */
interface PricingMinimalProps {
  name?: string;
  price?: string;
  period?: string;
  description?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const FEATURES = ['Unlimited projects', 'All integrations', 'No usage caps', 'Cancel anytime'];

export function PricingMinimal({
  name = 'Pro',
  price = '$16',
  period = '/month',
  description = 'One plan. Everything included.',
  features = FEATURES,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  className = '',
}: PricingMinimalProps) {
  return (
    <section
      className={`mx-auto w-full max-w-md px-4 text-center ${className}`}
      aria-labelledby="minimal-heading"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400" id="minimal-heading">
        {name}
      </h2>

      <p className="mt-3 flex items-baseline justify-center gap-1">
        <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{price}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">{period}</span>
      </p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>

      <ul className="mx-auto mt-6 grid max-w-xs gap-2.5 text-left">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg
              className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={ctaHref}
        className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </section>
  );
}

export const minHeight = 400;

export default function PricingMinimalPreview() {
  return <PricingMinimal />;
}
