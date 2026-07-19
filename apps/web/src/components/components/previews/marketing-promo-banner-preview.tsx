/**
 * Live preview for `marketing-promo-banner`.
 *
 * Mirrors the `typescript` code variant verbatim. Text sits on a gradient, so a
 * `bg-black/25` scrim layer sits between the two to hold WCAG-AA contrast
 * regardless of where the gradient lands. The CTA goes full width and stacks
 * below the copy on mobile. Keep in step with `src/data/components/marketing.ts`.
 */
interface PromoBannerProps {
  title: string;
  copy?: string;
  badge?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

function PromoBanner({
  title,
  copy,
  badge,
  ctaLabel = 'Claim offer',
  ctaHref = '#',
  className = '',
}: PromoBannerProps) {
  return (
    <section
      className={`relative w-full max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 ${className}`}
    >
      {/* Scrim: keeps white text at AA over any point of the gradient. */}
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
      <div className="relative flex flex-col items-start gap-5 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          {badge ? (
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {badge}
            </span>
          ) : null}
          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          {copy ? <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">{copy}</p> : null}
        </div>
        <a
          href={ctaHref}
          className="inline-flex w-full flex-none items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-600 motion-reduce:transition-none md:w-auto"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}

export default function MarketingPromoBannerPreview() {
  return (
    <PromoBanner
      title="Save 30% on annual plans"
      copy="Switch to yearly billing before the end of the month and lock in the launch price for good."
      badge="Limited time"
      ctaLabel="Claim offer"
      ctaHref="#"
    />
  );
}

export const minHeight = 260;
