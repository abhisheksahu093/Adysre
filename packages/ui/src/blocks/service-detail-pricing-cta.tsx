'use client';

/**
 * Live preview for `service-detail-pricing-cta`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant differs
 * only in swapping the <a> for next/link). Rendered highlighted, since the blue
 * border and glow are part of what the entry offers. The CTA band wraps below
 * the copy on a narrow stage rather than squeezing the button.
 * Keep this in step with `src/data/components/services.ts`.
 */
interface ServiceDetailPricingCtaProps {
  name: string;
  price: string;
  period?: string;
  note?: string;
  features: string[];
  bandCopy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  highlighted?: boolean;
}

function TickIcon() {
  return (
    <svg
      className="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function ServiceDetailPricingCta({
  name,
  price,
  period = 'fixed fee',
  note,
  features,
  bandCopy,
  ctaLabel = 'Book a call',
  ctaHref = '#',
  highlighted = false,
}: ServiceDetailPricingCtaProps) {
  return (
    <section
      aria-labelledby="svc-price-title"
      className={[
        'mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-gray-900',
        highlighted
          ? 'border border-blue-600 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]'
          : 'border border-gray-200 dark:border-gray-800',
      ].join(' ')}
    >
      <div className="px-6 pt-8 sm:px-8">
        <h2 id="svc-price-title" className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {name}
        </h2>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight tabular-nums text-gray-900 dark:text-gray-100">
            {price}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{period}</span>
        </p>
        {note ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{note}</p> : null}
      </div>

      <ul className="mt-6 grid gap-3 px-6 pb-8 sm:px-8">
        {features.map((feature: string) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
          >
            <TickIcon />
            {feature}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-6 py-5 sm:px-8 dark:border-gray-800 dark:bg-gray-800">
        {bandCopy ? <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{bandCopy}</p> : null}
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-800"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}

const SAMPLE_FEATURES: string[] = [
  'Ten user interviews, recorded and tagged',
  'A clickable prototype of the core journey',
  "A costed backlog, sized by your team's velocity",
];

export default function ServiceDetailPricingCtaPreview() {
  return (
    <ServiceDetailPricingCta
      name="Discovery sprint"
      price="£18,000"
      period="fixed fee"
      note="Three weeks, invoiced 50% on kickoff and 50% on handover."
      features={SAMPLE_FEATURES}
      bandCopy="Two sprint slots left this quarter."
      ctaLabel="Book a call"
      ctaHref="#"
      highlighted
    />
  );
}
