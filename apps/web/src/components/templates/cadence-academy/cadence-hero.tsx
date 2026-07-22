'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { CADENCE_COURSES } from '@/data/templates/cadence-academy-content';
import { Counter } from './cadence-reveal';

/**
 * CADENCE - the home masthead.
 *
 * The template's loudest moment: display type up to ~110px on a cream field,
 * with the accent line in violet and a lime underline behind the last word.
 * Beside it, three course thumbnails fanned out as a stack - the same CSS
 * gradients the catalogue cards use, so the hero advertises the real product
 * rather than an illustration of it.
 */
/**
 * Where each fanned thumbnail sits. Declared as a list so the fan's size is one
 * number - the array's length also decides how many courses are drawn.
 */
const FAN_PLACEMENT = [
  'left-0 top-0 -rotate-6',
  'right-0 top-16 rotate-3',
  'bottom-0 left-10 rotate-6',
] as const;

export function CadenceHero({ content }: { content: TemplateContent }) {
  const reduce = useReducedMotion();
  const { hero } = content;

  // The art direction's curve, shared with `cadence.css` so the JS entrance and
  // the CSS underline decelerate identically.
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  // The fan behind the headline is the first three courses, drawn thumbnail-only.
  const fan = CADENCE_COURSES.slice(0, FAN_PLACEMENT.length);

  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-12">
      <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
        <div>
          <motion.p
            {...rise(0)}
            className="inline-block rounded-[var(--cad-radius-pill)] bg-[var(--cad-lime-soft)] px-5 py-2 text-[13px] font-bold text-[var(--cad-lime-ink)]"
          >
            {hero.badge}
          </motion.p>

          <motion.h1 {...rise(0.08)} className="cad-display mt-8 text-balance">
            {hero.title}{' '}
            {/* `relative` is a Tailwind utility so the lime bar can sit behind
                the accent line; the scoped CSS never sets position here. */}
            <span className="relative inline-block text-[var(--cad-violet)]">
              <span
                className="absolute inset-x-0 bottom-[0.08em] h-[0.22em] rounded-[var(--cad-radius-pill)] bg-[var(--cad-lime)]"
                aria-hidden
              />
              <span className="relative">{hero.titleAccent}</span>
            </span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-8 max-w-xl text-pretty text-lg leading-[1.7] text-[var(--cad-ink-soft)]"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            {...rise(0.24)}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="?page=courses"
              className="group inline-flex items-center justify-center gap-2 rounded-[var(--cad-radius-pill)] bg-[var(--cad-violet)] px-9 py-4 text-base font-semibold text-[var(--cad-on-ink)] transition-transform duration-300 hover:-translate-y-1"
            >
              {hero.ctaPrimary}
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </a>
            <a
              href="?page=mentors"
              className="inline-flex items-center justify-center rounded-[var(--cad-radius-pill)] bg-[var(--cad-cream-warm)] px-9 py-4 text-base font-semibold text-[var(--cad-ink)] transition-colors hover:bg-[var(--cad-cream-deep)]"
            >
              {hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.dl
            {...rise(0.32)}
            className="mt-14 grid max-w-xl grid-cols-1 gap-8 border-t border-[var(--cad-rule)] pt-9 sm:grid-cols-3"
          >
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="cad-figures text-4xl font-bold text-[var(--cad-violet)] sm:text-[2.75rem]">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-2 text-[13px] font-semibold leading-snug text-[var(--cad-ink-faint)]">
                  {stat.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/*
         * Decorative fan. `relative` comes from Tailwind and the scoped CSS
         * never sets `position` on `.cad-thumb`, so the offsets below are the
         * only thing placing these three.
         */}
        <motion.div
          {...rise(0.2)}
          className="relative mx-auto hidden h-[26rem] w-full max-w-sm lg:block"
          aria-hidden
        >
          {fan.map((course, index) => (
            <div
              key={course.id}
              className={`cad-thumb cad-thumb--${course.thumb} absolute h-56 w-56 shadow-[var(--cad-shadow)] ${FAN_PLACEMENT[index] ?? ''}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
