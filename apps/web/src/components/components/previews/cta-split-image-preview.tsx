/**
 * Live preview for `cta-split-image`.
 * Mirrors the `typescript` code variant in `src/data/components/cta.ts`.
 */
interface CtaSplitImageProps {
  title: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

function CtaSplitImage({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
}: CtaSplitImageProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid overflow-hidden rounded-2xl border border-gray-200 bg-white md:grid-cols-2 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            {title}
          </h2>
          {copy ? (
            <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
          ) : null}
          <div className="mt-7">
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </a>
          </div>
        </div>

        <div
          className="relative min-h-[12rem] overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"
          aria-hidden="true"
        >
          <svg className="absolute inset-0 h-full w-full text-white/20" preserveAspectRatio="xMidYMid slice" viewBox="0 0 200 200" fill="none">
            <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="8" />
            <circle cx="150" cy="130" r="70" stroke="currentColor" strokeWidth="8" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export const minHeight = 380;

export default function CtaSplitImagePreview() {
  return (
    <CtaSplitImage
      title="Bring your whole workflow together"
      copy="Plan, build and ship without switching tabs - one place for the whole team."
      ctaLabel="Get started"
    />
  );
}
