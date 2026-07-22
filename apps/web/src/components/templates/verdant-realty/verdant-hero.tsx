'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { VERDANT_UI } from '@/data/templates/verdant-realty-content';
import { Counter } from './verdant-reveal';

/**
 * VERDANT - home hero. A deep forest block holding the words on the left and,
 * on the right, a house composed entirely in CSS: a gradient elevation stacked
 * over a floor-plan drawing. No photography, so the template downloads with no
 * binary assets and scales to any viewport.
 */
export function VerdantHero({ content }: { content: TemplateContent }) {
  const reduce = useReducedMotion();
  const { hero } = content;

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="bg-[var(--verdant-forest)] text-[var(--verdant-on-forest)]">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
        <div>
          <motion.p {...rise(0)} className="verdant-eyebrow">
            {hero.badge}
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-6xl md:text-[4.25rem]"
          >
            {hero.title}
            <br />
            <span className="text-[var(--verdant-brass)]">{hero.titleAccent}</span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-7 max-w-xl text-pretty text-base leading-[1.8] text-[var(--verdant-on-forest-soft)] sm:text-lg"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="?page=listings"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--verdant-brass)] px-7 py-3.5 text-sm font-semibold text-[var(--verdant-forest-deep)] transition-transform hover:-translate-y-0.5"
            >
              {hero.ctaPrimary}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
            <a
              href={VERDANT_UI.headerCtaHref}
              className="inline-flex items-center justify-center rounded-full border border-[var(--verdant-rule-inverse)] px-7 py-3.5 text-sm font-medium text-[var(--verdant-on-forest-soft)] transition-colors hover:border-[var(--verdant-brass)] hover:text-[var(--verdant-on-forest)]"
            >
              {hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.dl
            {...rise(0.32)}
            className="mt-14 grid max-w-lg grid-cols-1 gap-8 border-t border-[var(--verdant-rule-inverse)] pt-8 sm:grid-cols-3"
          >
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="verdant-figures text-3xl font-semibold sm:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[var(--verdant-on-forest-faint)]">
                  {stat.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/*
         * Decorative composition. `relative` comes from Tailwind here and the
         * scoped CSS never sets `position`, so the plan's pseudo-element rooms
         * anchor to this box rather than to the page.
         */}
        <motion.div {...rise(0.2)} className="mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
          <div className="verdant-window verdant-window--c h-56 w-full sm:h-72" />
          <div className="verdant-plan relative -mt-10 ml-auto h-44 w-3/4 bg-[var(--verdant-sand-warm)] sm:h-52" />
        </motion.div>
      </div>
    </section>
  );
}
