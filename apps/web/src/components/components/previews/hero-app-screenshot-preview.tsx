/**
 * Live preview for `hero-app-screenshot`.
 *
 * Mirrors the `typescript` code variant verbatim. The CSS browser mockup runs
 * tall, so `minHeight` gives it room. Keep this in step with
 * `src/data/components/hero.ts`.
 */
import type { ReactNode } from 'react';

interface HeroAppScreenshotProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

function HeroAppScreenshot({
  title,
  kicker,
  copy,
  ctaLabel = 'Start building',
  ctaHref = '#',
  className = '',
}: HeroAppScreenshotProps) {
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

      <div
        className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        aria-hidden="true"
      >
        <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-3 hidden h-5 flex-1 rounded bg-gray-200 sm:block dark:bg-gray-800" />
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[8rem_1fr]">
          <div className="hidden space-y-2 sm:block">
            <span className="block h-6 rounded bg-gradient-to-r from-blue-500 to-indigo-500" />
            <span className="block h-4 rounded bg-gray-100 dark:bg-gray-800" />
            <span className="block h-4 rounded bg-gray-100 dark:bg-gray-800" />
            <span className="block h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="space-y-3 text-left">
            <div className="grid grid-cols-3 gap-3">
              <span className="h-14 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500" />
              <span className="h-14 rounded-lg bg-gradient-to-br from-violet-400 to-fuchsia-500" />
              <span className="h-14 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500" />
            </div>
            <span className="block h-24 rounded-lg bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HeroAppScreenshotPreview() {
  return (
    <HeroAppScreenshot
      title="Your whole workflow, one screen"
      copy="A calm, fast interface that gets out of the way so the work stays in view."
      ctaLabel="Start building"
      ctaHref="#"
    />
  );
}

export const minHeight = 460;
