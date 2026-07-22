'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Counter } from './aurora-reveal';

/**
 * AURORA - hero. Left-aligned and oversized: the headline is the artwork, so it
 * runs to the edge of the column and the accent line sits on a solid acid slab
 * rather than a gradient. The diagonal hatch behind it is pure CSS (aurora.css),
 * so the section carries no image weight at all.
 */
export function AuroraHero({ content }: { content: TemplateContent }) {
  const reduce = useReducedMotion();
  const { hero } = content;

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Hatching fades out downward so it never sits behind the body copy. */}
      <div
        className="aurora-hatch absolute inset-x-0 top-0 -z-10 h-[70%] [mask-image:linear-gradient(180deg,#000,transparent)]"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
        <motion.div {...rise(0)}>
          <span className="aurora-tag inline-flex items-center gap-2.5 border-2 border-[var(--aurora-line-strong)] px-3.5 py-2.5 text-[10px] text-[var(--aurora-muted)]">
            <span className="h-2 w-2 bg-[var(--aurora-acid)]" aria-hidden />
            {hero.badge}
          </span>
        </motion.div>

        <motion.h1
          {...rise(0.08)}
          className="aurora-display mt-8 max-w-5xl text-[15vw] leading-[0.88] sm:text-[11rem] sm:leading-[0.86]"
        >
          {hero.title}{' '}
          <span className="inline-block bg-[var(--aurora-acid)] px-3 text-[var(--aurora-on-acid)]">
            {hero.titleAccent}
          </span>
        </motion.h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <motion.p
            {...rise(0.16)}
            className="max-w-xl text-pretty text-base leading-relaxed text-[var(--aurora-muted)] sm:text-lg"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div {...rise(0.24)} className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a
              href="#contact"
              className="aurora-tag group inline-flex items-center justify-center gap-2.5 bg-[var(--aurora-acid)] px-7 py-4 text-xs text-[var(--aurora-on-acid)] transition-colors hover:bg-[var(--aurora-text)]"
            >
              {hero.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
            <a
              href="#services"
              className="aurora-tag inline-flex items-center justify-center border-2 border-[var(--aurora-line-strong)] px-7 py-4 text-xs text-[var(--aurora-muted)] transition-colors hover:border-[var(--aurora-acid)] hover:text-[var(--aurora-acid)]"
            >
              {hero.ctaSecondary}
            </a>
          </motion.div>
        </div>

        <motion.dl
          {...rise(0.32)}
          className="mt-16 grid grid-cols-1 border-2 border-[var(--aurora-line)] sm:grid-cols-3"
        >
          {hero.stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-6 py-8 sm:px-8 ${
                // Internal rules only: the outer border already closes the row,
                // and a divider is horizontal when the grid stacks.
                index > 0 ? 'border-t-2 border-[var(--aurora-line)] sm:border-l-2 sm:border-t-0' : ''
              }`}
            >
              <dd className="aurora-display text-6xl text-[var(--aurora-acid)] sm:text-7xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="aurora-tag mt-3 text-[10px] text-[var(--aurora-faint)]">{stat.label}</dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
