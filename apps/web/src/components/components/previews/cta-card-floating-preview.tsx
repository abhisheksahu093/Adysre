/**
 * Live preview for `cta-card-floating`.
 * Mirrors the `typescript` code variant in `src/data/components/cta.ts`.
 */
interface CtaCardFloatingProps {
  title: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

function CtaCardFloating({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}: CtaCardFloatingProps) {
  return (
    <section className={`mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 ${className}`}>
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-900/5 ring-1 ring-black/5 sm:p-12 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20 dark:ring-white/10">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            {title}
          </h2>
          {copy ? (
            <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
          ) : null}
          <div className="mt-7 flex justify-center">
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export const minHeight = 340;

export default function CtaCardFloatingPreview() {
  return (
    <CtaCardFloating
      title="Your next release starts here"
      copy="Spin up a project, invite the team and ship - all before your coffee cools."
      ctaLabel="Get started"
    />
  );
}
