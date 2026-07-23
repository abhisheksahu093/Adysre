/**
 * Live preview for `hero-bento-grid`.
 *
 * Mirrors the `typescript` code variant verbatim. The bento grid runs taller
 * than the default stage, so `minHeight` gives it room. Keep this in step with
 * `src/data/components/hero.ts`.
 */
import type { ReactNode } from 'react';

const TILE_STYLES = [
  'from-blue-500 to-indigo-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-600',
  'from-fuchsia-500 to-purple-600',
  'from-sky-400 to-cyan-600',
] as const;

const DEFAULT_FEATURES = [
  'Realtime docs',
  'Tasks & sprints',
  'Automations',
  'Live dashboards',
  'Team inbox',
];

interface HeroBentoGridProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function HeroBentoGrid({
  title,
  kicker,
  copy,
  features = DEFAULT_FEATURES,
  ctaLabel = 'Explore the platform',
  ctaHref = '#',
  className = '',
}: HeroBentoGridProps) {
  const tiles = features.slice(0, 5);
  return (
    <section className={`mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-2xl text-center">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
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
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2 sm:gap-4">
        {tiles.map((label, i) => (
          <div
            key={label}
            className={`flex flex-col justify-end rounded-2xl bg-gradient-to-br ${TILE_STYLES[i % TILE_STYLES.length]} p-4 ${
              i === 0 ? 'col-span-2 min-h-[9rem] sm:row-span-2 sm:min-h-[15rem]' : 'min-h-[7rem]'
            }`}
          >
            <span className="text-sm font-semibold text-white">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HeroBentoGridPreview() {
  return (
    <HeroBentoGrid
      title="One workspace for every team"
      kicker="Platform"
      copy="Docs, tasks and dashboards in a single, fast, keyboard-first surface."
      ctaLabel="Explore the platform"
      ctaHref="#"
    />
  );
}

export const minHeight = 460;
