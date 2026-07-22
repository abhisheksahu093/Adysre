'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { VANTA_ALLOCATION, VANTA_UI } from '@/data/templates/vanta-markets-content';
import { Counter } from './vanta-reveal';

/**
 * VANTA - the home masthead.
 *
 * Words on the left at display scale, and on the right the template's largest
 * CSS drawing: a gradient area cut to a price silhouette by `clip-path`, with a
 * second copy of the same polygon acting as the trace line. No canvas, no chart
 * library, no image - which is why the whole template downloads as text.
 *
 * The card also states the one thing the visual implies and cannot deliver: the
 * figures are a snapshot, not a feed.
 */
export function VantaHero({ content }: { content: TemplateContent }) {
  const reduce = useReducedMotion();
  const { hero } = content;

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    // `relative` comes from Tailwind so the bloom pseudo-elements anchor here.
    <section className="vanta-bloom relative overflow-hidden">
      <div className="vanta-grid absolute inset-0" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <motion.p {...rise(0)} className="vanta-eyebrow">
            {hero.badge}
          </motion.p>

          <motion.h1 {...rise(0.08)} className="vanta-display mt-7 text-balance">
            {hero.title}
            <br />
            <span className="text-[var(--vanta-up)]">{hero.titleAccent}</span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-8 max-w-xl text-pretty text-base leading-[1.8] text-[var(--vanta-muted)] sm:text-lg"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            {...rise(0.24)}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href={VANTA_UI.headerCtaHref}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--vanta-brand)] px-7 py-4 text-sm font-semibold text-[var(--vanta-ink)] transition-transform hover:-translate-y-0.5"
            >
              {hero.ctaPrimary}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
            <a
              href="?page=markets"
              className="inline-flex items-center justify-center rounded-full border border-[var(--vanta-line-strong)] px-7 py-4 text-sm font-medium text-[var(--vanta-muted)] transition-colors hover:border-[var(--vanta-up)] hover:text-[var(--vanta-text)]"
            >
              {hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.dl
            {...rise(0.32)}
            className="mt-14 grid max-w-xl grid-cols-1 gap-8 border-t border-[var(--vanta-line)] pt-8 sm:grid-cols-3"
          >
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="vanta-mono text-3xl font-semibold sm:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="vanta-label mt-3 block">{stat.label}</dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* The chart card. Every layer below is CSS; nothing here is an asset. */}
        <motion.div {...rise(0.2)} className="vanta-card vanta-card-lg p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="vanta-label">{VANTA_ALLOCATION.totalLabel}</p>
              <p className="vanta-mono mt-2 text-3xl font-semibold sm:text-4xl">
                {VANTA_ALLOCATION.totalValue}
              </p>
            </div>
            <div className="text-right">
              <p className="vanta-label">{VANTA_ALLOCATION.driftLabel}</p>
              <p className="vanta-mono vanta-up mt-2 text-sm">{VANTA_ALLOCATION.driftValue}</p>
            </div>
          </div>

          <div
            className="relative mt-8 h-52 overflow-hidden rounded-[var(--vanta-radius-sm)] sm:h-64"
            role="img"
            aria-label={VANTA_UI.chartAlt}
          >
            <div className="vanta-grid absolute inset-0" aria-hidden />
            <div className="vanta-area absolute inset-0" aria-hidden />
            <div className="vanta-area-line absolute inset-0" aria-hidden />
          </div>

          <div className="mt-6 flex items-center gap-2 border-t border-[var(--vanta-line)] pt-5">
            <span
              className="vanta-pulse h-1.5 w-1.5 rounded-full bg-[var(--vanta-up)]"
              aria-hidden
            />
            <p className="text-[12px] leading-relaxed text-[var(--vanta-faint)]">
              {VANTA_UI.disclaimer}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
