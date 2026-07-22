'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { PINNACLE_LABELS, PINNACLE_METRICS } from '@/data/templates/pinnacle-advisory-content';
import { Reveal } from './pinnacle-reveal';

/**
 * PINNACLE - the results dashboard, and the template's one inverted band.
 *
 * Exactly one section inverts. That is what makes it emphasis rather than a
 * theme: the eye has travelled through four sand sections before this, so the
 * ink band reads as the page raising its voice for the only claim that matters.
 *
 * The chart is divs. Each metric is a pair of bars in one track - the faint bar
 * is where the client started, the brand bar is where they finished - and the
 * widths come from the data, so adding a sixth metric needs no CSS. The bars
 * grow from zero on entry, which is the one place scaleX is used in the design.
 */
export function PinnacleResults() {
  const reduce = useReducedMotion();

  // A bar that "grows" is decoration; under reduced motion it renders at its
  // final width immediately, because the width IS the information.
  const grow = (delay: number) => ({
    initial: reduce ? { scaleX: 1 } : { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: { once: true, margin: '-60px' },
    transition: {
      duration: reduce ? 0 : 1.1,
      delay: reduce ? 0 : delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <section className="pin-invert px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-[80rem] rounded-[var(--pin-r-xl)] bg-[var(--pin-ink)] px-7 py-20 text-[var(--pin-on-ink)] sm:px-14 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <Reveal>
            <p className="pin-eyebrow pin-eyebrow-invert">{PINNACLE_LABELS.resultsEyebrow}</p>
            <h2 className="pin-h2 mt-6 text-[var(--pin-on-ink)]">
              {PINNACLE_LABELS.resultsTitle}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="pin-body text-[var(--pin-on-ink-soft)] lg:pb-2">
              {PINNACLE_LABELS.resultsSubtitle}
            </p>
          </Reveal>
        </div>

        {/* Legend first, so the mark and the fill are explained before they appear. */}
        <Reveal delay={0.12}>
          <ul className="mt-14 flex flex-wrap items-center gap-6">
            <li className="flex items-center gap-2.5 text-[0.8125rem] text-[var(--pin-on-ink-faint)]">
              {/* Mirrors the marker on the bar: a tick, not a bar of its own. */}
              <span aria-hidden className="h-4 w-0.5 rounded-full bg-[var(--pin-on-ink-soft)]" />
              {PINNACLE_LABELS.figureLegendBefore}
            </li>
            <li className="flex items-center gap-2.5 text-[0.8125rem] text-[var(--pin-on-ink-faint)]">
              <span aria-hidden className="h-2.5 w-8 rounded-full bg-[var(--pin-brand-bright)]" />
              {PINNACLE_LABELS.figureLegendAfter}
            </li>
          </ul>
        </Reveal>

        <dl className="mt-10 space-y-9">
          {PINNACLE_METRICS.map((metric, index) => (
            <div key={metric.label} className="border-t border-[var(--pin-ink-line)]">
              <Reveal delay={index * 0.06} className="pt-7">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <dt className="text-[0.9375rem] text-[var(--pin-on-ink-soft)]">{metric.label}</dt>
                  <dd className="pin-figure-num text-[1.75rem] text-[var(--pin-brand-bright)] sm:text-[2rem]">
                    {metric.delta}
                  </dd>
                </div>

                {/*
                  ONE track per metric, not two stacked ones. Two full-width
                  tracks read as a duplicated progress bar - the eye sees a
                  rendering fault before it sees a comparison. So the finished
                  value is the only bar, and where the client STARTED is a
                  marker on that same bar: one line, and the change is the
                  distance between the marker and the end of the fill.

                  `relative`/`absolute` are Tailwind utilities on purpose - a
                  scoped `[data-template] .pin-bar-*` rule setting `position`
                  would outrank them.
                */}
                <div className="pin-bar-track relative mt-5">
                  <motion.div
                    {...grow(index * 0.06)}
                    className="pin-bar-after absolute inset-y-0 left-0 origin-left"
                    style={{ width: `${metric.after}%` }}
                  />
                  <span
                    aria-hidden
                    className="pin-bar-start absolute inset-y-0"
                    style={{ left: `${metric.before}%` }}
                  />
                </div>

                {/* The bar is decoration; this is the sentence a screen reader
                    hears, and it carries both numbers. */}
                <p className="sr-only">
                  {metric.label}: {metric.before}% to {metric.after}%.
                </p>
              </Reveal>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
