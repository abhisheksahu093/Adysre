'use client';

import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { TemplateContent } from '@/data/templates/types';
import { Counter } from './pinnacle-reveal';
import { pinnacleHref } from './pinnacle-links';

/**
 * PINNACLE - home hero.
 *
 * The display line is the design: clamped up to 120px at weight 500, leading
 * under 1, and a measure capped in `ch` so it re-wraps rather than stretching.
 * Everything else on the screen is deliberately quiet so that line carries it.
 *
 * The entrance is staggered rather than simultaneous - badge, line one, line
 * two, lead, actions - because a single-shot fade at this scale reads as a
 * screenshot appearing, and a stagger reads as a page arriving.
 */
export function PinnacleHero({ content }: { content: TemplateContent }) {
  const reduce = useReducedMotion();
  const { hero } = content;

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.9,
      delay: reduce ? 0 : delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <section className="overflow-hidden px-4 pt-16 pb-6 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-[80rem]">
        <motion.p {...rise(0)} className="pin-tag pin-tag-accent">
          {hero.badge}
        </motion.p>

        {/* Two motion elements rather than one heading, so the accent line
            arrives after the first - the stagger has to survive text wrapping. */}
        <h1 className="pin-display mt-8">
          <motion.span {...rise(0.08)} className="block">
            {hero.title}
          </motion.span>
          <motion.span {...rise(0.18)} className="block text-[var(--pin-brand)]">
            {hero.titleAccent}
          </motion.span>
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <motion.p {...rise(0.3)} className="pin-lead text-[var(--pin-text-soft)]">
            {hero.subtitle}
          </motion.p>

          <motion.div {...rise(0.38)} className="flex flex-wrap gap-3 lg:justify-end">
            <a href={pinnacleHref('contact')} className="pin-btn pin-btn-primary inline-flex">
              {hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href={pinnacleHref('expertise')} className="pin-btn pin-btn-secondary inline-flex">
              {hero.ctaSecondary}
            </a>
          </motion.div>
        </div>

        {/* The counters sit on their own rule, divided rather than boxed: at this
            type size a card around each figure would compete with the display line. */}
        <motion.dl
          {...rise(0.48)}
          className="mt-16 grid gap-px overflow-hidden rounded-[var(--pin-r-md)] border border-[var(--pin-line)] bg-[var(--pin-line)] sm:grid-cols-3"
        >
          {hero.stats.map((stat) => (
            <div key={stat.label} className="bg-[var(--pin-sand)] px-7 py-9 sm:px-9 sm:py-11">
              <dd className="pin-figure-num text-[clamp(2.5rem,4.6vw,4rem)] text-[var(--pin-brand)]">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-4 max-w-[24ch] text-[0.875rem] leading-[1.5] text-[var(--pin-text-faint)]">
                {stat.label}
              </dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
