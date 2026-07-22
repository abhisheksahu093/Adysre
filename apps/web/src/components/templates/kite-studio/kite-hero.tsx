'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { KITE_UI } from '@/data/templates/kite-studio-content';
import { Counter } from './kite-reveal';

/**
 * KITE - the home hero.
 *
 * The template's whole argument in one screen: an off-black field, a drifting
 * mesh blob behind it, and a headline large enough to be uncomfortable, whose
 * last word is an outline rather than a fill.
 *
 * The stagger is written here rather than composed from `Reveal` because the
 * hero is above the fold - there is nothing to observe into view, so it animates
 * on mount with hand-set delays.
 */
export function KiteHero({ content }: { content: TemplateContent }) {
  const reduce = useReducedMotion();
  const { hero } = content;

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 34 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative overflow-hidden">
      <div
        className="kite-blob pointer-events-none absolute -left-24 -top-32 h-[42rem] w-[42rem]"
        aria-hidden
      />
      <div
        className="kite-blob pointer-events-none absolute -bottom-56 right-0 h-[30rem] w-[30rem]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
        <motion.p {...rise(0)} className="kite-eyebrow">
          {hero.badge}
        </motion.p>

        <motion.h1 {...rise(0.08)} className="kite-display mt-8">
          {hero.title} <span className="kite-outline">{hero.titleAccent}</span>
        </motion.h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <motion.div {...rise(0.18)}>
            <p className="max-w-xl text-pretty text-base leading-[1.75] text-[var(--kite-paper-soft)] sm:text-lg">
              {hero.subtitle}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="?page=work"
                className="kite-pill-hot inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold"
              >
                {hero.ctaPrimary}
                <ArrowDownRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="?page=services"
                className="inline-flex items-center justify-center rounded-full border border-[var(--kite-line-strong)] px-8 py-4 text-sm font-semibold text-[var(--kite-paper-soft)] transition-colors hover:border-[var(--kite-acid)] hover:text-[var(--kite-acid)]"
              >
                {hero.ctaSecondary}
              </a>
            </div>
          </motion.div>

          {/*
           * The counters sit in the hero's right column on desktop and below the
           * copy on mobile, so the numbers are never the first thing read - the
           * headline is.
           */}
          <motion.dl
            {...rise(0.28)}
            className="grid grid-cols-1 gap-8 border-t border-[var(--kite-line)] pt-8 sm:grid-cols-3"
          >
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="kite-gradient-text text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-3 text-[11px] uppercase leading-relaxed tracking-[0.2em] text-[var(--kite-paper-faint)]">
                  {stat.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.p
          {...rise(0.36)}
          className="mt-16 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[var(--kite-paper-faint)]"
        >
          <span className="h-px w-10 bg-[var(--kite-acid)]" aria-hidden />
          {KITE_UI.scrollHint}
        </motion.p>
      </div>
    </section>
  );
}
