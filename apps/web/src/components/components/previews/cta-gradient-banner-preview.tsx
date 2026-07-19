/**
 * Live preview for `cta-gradient-banner`.
 * Mirrors the `typescript` code variant in `src/data/components/cta.ts`.
 */
interface CtaGradientBannerProps {
  title: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

function CtaGradientBanner({
  title,
  copy,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  className = '',
}: CtaGradientBannerProps) {
  return (
    <section className={`relative isolate mx-auto w-full max-w-5xl overflow-hidden rounded-2xl ${className}`}>
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" aria-hidden="true" />
      {/* The scrim guarantees 4.5:1 for white text across the whole gradient. */}
      <div className="absolute inset-0 -z-10 bg-black/30" aria-hidden="true" />

      <div className="px-6 py-12 text-center sm:px-10 sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-100">{copy}</p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none sm:w-auto"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

export const minHeight = 300;

export default function CtaGradientBannerPreview() {
  return (
    <CtaGradientBanner
      title="Everything your team needs, in one place"
      copy="Start free today. No credit card, no setup call, cancel whenever."
      ctaLabel="Start free trial"
    />
  );
}
