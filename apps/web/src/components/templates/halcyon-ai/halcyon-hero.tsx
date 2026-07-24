'use client';

import { ArrowRight, BookOpen } from 'lucide-react';
import { HALCYON_CONTENT } from '@/data/templates/halcyon-ai-content';
import { Counter, Mesh, useHeroIntro } from './halcyon-motion';

/**
 * HALCYON - the opening screen.
 *
 * The only sequence on the site that plays on load rather than on scroll,
 * because it is already in view when the page arrives. `data-hal-intro` marks
 * what participates and in what order; `useHeroIntro` reads them in document
 * order, so re-ordering the markup re-orders the animation with no other edit.
 *
 * The stat panel sits on glass rather than directly on the mesh: three numbers
 * over a moving gradient is exactly where glassmorphism stops being legible.
 */
export function HalcyonHero() {
  const ref = useHeroIntro<HTMLElement>();
  const { hero } = HALCYON_CONTENT;

  return (
    <section ref={ref} className="relative isolate overflow-hidden px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24">
      <Mesh className="pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="hal-grain pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto max-w-5xl text-center">
        <p
          data-hal-intro
          className="hal-glass mx-auto inline-flex items-center gap-2 !rounded-full px-4 py-1.5 text-[12.5px] text-[var(--hal-ink-soft)]"
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-[var(--hal-cyan-bright)]"
          />
          {hero.badge}
        </p>

        <h1
          data-hal-intro
          className="hal-display mt-7 text-[clamp(2.6rem,7vw,5.2rem)]"
        >
          {hero.title}{' '}
          <span className="hal-gradient-text">{hero.titleAccent}</span>
        </h1>

        <p
          data-hal-intro
          className="mx-auto mt-6 max-w-2xl text-pretty text-[16.5px] leading-[1.75] text-[var(--hal-ink-soft)]"
        >
          {hero.subtitle}
        </p>

        <div data-hal-intro className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="?page=pricing"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--hal-ink)] px-6 py-3 text-[14.5px] font-medium text-[var(--hal-bg)] transition-transform hover:-translate-y-0.5"
          >
            {hero.ctaPrimary}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="?page=platform"
            className="hal-glass inline-flex items-center gap-2 !rounded-full px-6 py-3 text-[14.5px] transition-transform hover:-translate-y-0.5"
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            {hero.ctaSecondary}
          </a>
        </div>

        <dl
          data-hal-intro
          className="hal-glass hal-glass-strong relative mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-px overflow-hidden sm:grid-cols-3"
        >
          {hero.stats.map((stat) => (
            <div key={stat.label} className="px-6 py-8">
              <dd className="hal-display text-[2.4rem] tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-1.5 text-[13px] text-[var(--hal-ink-faint)]">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
