/**
 * Live preview for `hero-announcement-banner`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/hero.ts`.
 */
import type { ReactNode } from 'react';

interface HeroAnnouncementBannerProps {
  title: ReactNode;
  copy?: string;
  bannerLabel?: string;
  bannerText: string;
  bannerHref?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

function HeroAnnouncementBanner({
  title,
  copy,
  bannerLabel = 'New',
  bannerText,
  bannerHref = '#',
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  className = '',
}: HeroAnnouncementBannerProps) {
  return (
    <section className={`mx-auto w-full max-w-3xl px-4 py-12 text-center sm:py-16 ${className}`}>
      <a
        href={bannerHref}
        className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
          {bannerLabel}
        </span>
        <span className="font-medium">{bannerText}</span>
        <span aria-hidden="true" className="text-gray-400">
          &rarr;
        </span>
      </a>

      <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-7 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </section>
  );
}

export default function HeroAnnouncementBannerPreview() {
  return (
    <HeroAnnouncementBanner
      title="The fastest way to ship your next idea"
      copy="From prototype to production without leaving the editor."
      bannerLabel="New"
      bannerText="Version 3.0 is live - see what changed"
      bannerHref="#"
      ctaLabel="Start free trial"
      ctaHref="#"
    />
  );
}

export const minHeight = 300;
