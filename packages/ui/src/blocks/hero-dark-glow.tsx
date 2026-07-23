/**
 * Live preview for `hero-dark-glow`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/hero.ts`.
 */
import type { ReactNode } from 'react';

interface HeroDarkGlowProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
}

export function HeroDarkGlow({
  title,
  kicker,
  copy,
  ctaLabel = 'Start free',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}: HeroDarkGlowProps) {
  return (
    <section className={`relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 ${className}`}>
      <div
        className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/3 rounded-full bg-blue-600/40 blur-3xl sm:h-96 sm:w-96"
        aria-hidden="true"
      />

      <div className="px-6 py-14 text-center sm:px-8 sm:py-24">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-200">
            {kicker}
          </p>
        ) : null}
        <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400">{copy}</p>
        ) : null}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
          >
            {ctaLabel}
          </a>
          {secondaryCtaLabel ? (
            <a
              href={secondaryCtaHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-gray-100 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
            >
              {secondaryCtaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function HeroDarkGlowPreview() {
  return (
    <HeroDarkGlow
      title="The dark-mode-native command center"
      kicker="Now in beta"
      copy="Built for the people who live in their terminal and never turn the lights on."
      ctaLabel="Start free"
      ctaHref="#"
      secondaryCtaLabel="Read the docs"
      secondaryCtaHref="#"
    />
  );
}

export const minHeight = 340;
