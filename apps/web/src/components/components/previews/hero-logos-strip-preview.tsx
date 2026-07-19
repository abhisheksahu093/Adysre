/**
 * Live preview for `hero-logos-strip`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/hero.ts`.
 */
import type { ReactNode } from 'react';

interface HeroLogosStripProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  proofLabel?: string;
  logos?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const DEFAULT_LOGOS = ['Northwind', 'Adysre', 'Globex', 'Umbrella', 'Initech'];

function HeroLogosStrip({
  title,
  kicker,
  copy,
  proofLabel = 'Trusted by teams at',
  logos = DEFAULT_LOGOS,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}: HeroLogosStripProps) {
  return (
    <section className={`mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 ${className}`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>

      <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {proofLabel}
      </p>
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        {logos.map((logo) => (
          <li key={logo} className="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">
            {logo}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function HeroLogosStripPreview() {
  return (
    <HeroLogosStrip
      title="The backbone of modern product teams"
      copy="Ship confidently on infrastructure the best companies already rely on."
      ctaLabel="Get started"
      ctaHref="#"
    />
  );
}

export const minHeight = 320;
