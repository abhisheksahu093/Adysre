/**
 * Live preview for `about-cta-join`.
 * Mirrors the `typescript` variant in `src/data/components/about.ts` verbatim.
 */
export const minHeight = 320;

interface AboutCtaJoinProps {
  title: string;
  copy?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export function AboutCtaJoin({
  title,
  copy,
  primaryLabel = 'See open roles',
  primaryHref = '#',
  secondaryLabel,
  secondaryHref = '#',
  className = '',
}: AboutCtaJoinProps) {
  return (
    <section
      className={['mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16', className].filter(Boolean).join(' ')}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-12 text-center sm:px-12 sm:py-16">
        <span className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" aria-hidden="true" />
        <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
        {copy ? <p className="mx-auto mt-3 max-w-xl text-balance leading-relaxed text-blue-100">{copy}</p> : null}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={primaryHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 motion-reduce:transition-none sm:w-auto"
          >
            {primaryLabel}
          </a>
          {secondaryLabel ? (
            <a
              href={secondaryHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 motion-reduce:transition-none sm:w-auto"
            >
              {secondaryLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function AboutCtaJoinPreview() {
  return (
    <AboutCtaJoin
      title="Come build the unfashionable way"
      copy="Twelve people, nine countries, no account managers. If you would rather finish one good thing than plan ten, we should talk."
      primaryLabel="See open roles"
      secondaryLabel="Read our handbook"
    />
  );
}
