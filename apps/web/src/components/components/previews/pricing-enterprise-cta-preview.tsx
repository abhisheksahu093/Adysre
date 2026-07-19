/**
 * Live preview for `pricing-enterprise-cta`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/pricing.ts`.
 */
interface PricingEnterpriseCtaProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

function PricingEnterpriseCta({
  eyebrow = 'Enterprise',
  title = 'Need a plan for your whole company?',
  description = 'Custom volume pricing, SSO, a dedicated success manager and a 99.9% uptime SLA. Tell us what you need and we will size a plan to fit.',
  ctaLabel = 'Contact sales',
  ctaHref = '#',
  secondaryLabel = 'View docs',
  secondaryHref = '#',
  className = '',
}: PricingEnterpriseCtaProps) {
  return (
    <section
      className={`mx-auto w-full max-w-4xl px-4 ${className}`}
      aria-labelledby="enterprise-cta-heading"
    >
      <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
            {eyebrow}
          </p>
          <h2
            className="mt-2 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100"
            id="enterprise-cta-heading"
          >
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-none">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </a>
          {secondaryLabel ? (
            <a
              href={secondaryHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {secondaryLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export const minHeight = 280;

export default function PricingEnterpriseCtaPreview() {
  return <PricingEnterpriseCta />;
}
