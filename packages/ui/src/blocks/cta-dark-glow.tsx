/**
 * Live preview for `cta-dark-glow`.
 * Mirrors the `typescript` code variant in `src/data/components/cta.ts`.
 */
interface CtaDarkGlowProps {
  title: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
}

export function CtaDarkGlow({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}: CtaDarkGlowProps) {
  return (
    <section className={`relative isolate mx-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-gray-950 ${className}`}>
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" aria-hidden="true" />

      <div className="px-6 py-14 text-center sm:px-10 sm:py-20">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-300">{copy}</p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
          >
            {ctaLabel}
          </a>
          {secondaryCtaLabel ? (
            <a
              href={secondaryCtaHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
            >
              {secondaryCtaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export const minHeight = 320;

export default function CtaDarkGlowPreview() {
  return (
    <CtaDarkGlow
      title="Build in the dark, ship in the light"
      copy="A focused workspace for teams that would rather ship than configure."
      ctaLabel="Get started"
      secondaryCtaLabel="Read the docs"
    />
  );
}
