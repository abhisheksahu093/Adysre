/**
 * Live preview for `cta-full-bleed-pattern`.
 * Mirrors the `typescript` code variant in `src/data/components/cta.ts`.
 */
interface CtaFullBleedPatternProps {
  title: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function CtaFullBleedPattern({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}: CtaFullBleedPatternProps) {
  return (
    <section className={`relative isolate w-full overflow-hidden bg-gray-900 ${className}`}>
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:16px_16px]" aria-hidden="true" />
      {/* The scrim holds white text at 4.5:1 across a patterned surface. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-900/70 to-gray-900/95" aria-hidden="true" />

      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-300">{copy}</p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none sm:w-auto"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

export const minHeight = 340;

export default function CtaFullBleedPatternPreview() {
  return (
    <CtaFullBleedPattern
      title="Ship it. We'll handle the rest."
      copy="Push to main and watch it deploy - no pipelines to babysit, no servers to patch."
      ctaLabel="Get started"
    />
  );
}
