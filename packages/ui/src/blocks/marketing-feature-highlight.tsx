/**
 * Live preview for `marketing-feature-highlight`.
 *
 * Mirrors the `typescript` code variant verbatim. The media is a decorative
 * gradient panel with inline SVG - no external image - so nothing here needs a
 * scrim: no text sits on the gradient. The section itself is width-agnostic
 * (`w-full`); the preview supplies the page shell that centres it. Keep in step
 * with `src/data/components/marketing.ts`.
 */
interface FeatureHighlightProps {
  title: string;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function FeatureHighlight({
  title,
  kicker,
  copy,
  ctaLabel = 'Learn more',
  ctaHref = '#',
  className = '',
}: FeatureHighlightProps) {
  return (
    <section
      className={`grid w-full items-center gap-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 md:grid-cols-2 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="order-2 md:order-1">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}
        <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
        {copy ? (
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
            {copy}
          </p>
        ) : null}
        <a
          href={ctaHref}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>
      <div className="order-1 md:order-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
          <svg
            viewBox="0 0 200 150"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="150" cy="40" r="50" fill="rgba(255,255,255,0.15)" />
            <rect x="24" y="90" width="120" height="14" rx="7" fill="rgba(255,255,255,0.25)" />
            <rect x="24" y="112" width="80" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default function MarketingFeatureHighlightPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <FeatureHighlight
          title="Automate the busywork, keep the craft"
          kicker="Workflow"
          copy="Let the platform handle triage, routing and follow-ups so your team spends its hours on the work only people can do."
          ctaLabel="See how it works"
          ctaHref="#"
        />
      </div>
    </section>
  );
}

export const minHeight = 300;
