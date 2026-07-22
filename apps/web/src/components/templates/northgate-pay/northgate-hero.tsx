'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { northgateHref } from './northgate-links';
import { Counter, NGP_EASE } from './northgate-reveal';

/**
 * NORTHGATE - home hero.
 *
 * The loudest element in the design and the only one allowed to be: display
 * type clamping to 110px on the deep ground, over a gradient wash and an
 * engineering grid. Everything below it on the page is quiet by comparison,
 * which is the whole reason this can be this large without shouting.
 *
 * The accent line is the second half of the headline rather than a word inside
 * it, so the gradient text sits on its own baseline and never has to be legible
 * against a mid-line background transition.
 */
export function NorthgateHero({ content }: { content: TemplateContent }) {
  const reduce = useReducedMotion();
  const { hero } = content;

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.9,
      delay: reduce ? 0 : delay,
      ease: NGP_EASE,
    },
  });

  return (
    <section className="ngp-on-deep ngp-wash relative overflow-hidden bg-[var(--ngp-deep)] text-[var(--ngp-on-deep)]">
      <div className="ngp-grid absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
        <motion.p
          {...rise(0)}
          className="ngp-mono inline-block rounded-full border border-[var(--ngp-deep-rule)] px-4 py-2 text-[11px] tracking-[0.16em] uppercase text-[var(--ngp-on-deep-soft)]"
        >
          {hero.badge}
        </motion.p>

        <motion.h1 {...rise(0.06)} className="ngp-display ngp-display-xl mt-9 max-w-[15ch]">
          {hero.title}{' '}
          <span className="ngp-grad-text">{hero.titleAccent}</span>
        </motion.h1>

        <motion.p
          {...rise(0.14)}
          className="mt-9 max-w-2xl text-pretty text-[16px] leading-[1.8] text-[var(--ngp-on-deep-soft)]"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div {...rise(0.2)} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href={northgateHref('developers')}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ngp-on-deep)] px-7 py-3.5 text-[14px] text-[var(--ngp-deep)] transition-opacity hover:opacity-85"
          >
            {hero.ctaPrimary}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href={northgateHref('pricing')}
            className="inline-flex items-center justify-center rounded-full border border-[var(--ngp-deep-rule-strong)] px-7 py-3.5 text-[14px] text-[var(--ngp-on-deep)] transition-colors hover:border-[var(--ngp-cyan-bright)] hover:text-[var(--ngp-cyan-bright)]"
          >
            {hero.ctaSecondary}
          </a>
        </motion.div>

        <motion.dl
          {...rise(0.28)}
          className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--ngp-radius)] border border-[var(--ngp-deep-rule)] sm:grid-cols-3"
        >
          {hero.stats.map((stat) => (
            <div key={stat.label} className="bg-[var(--ngp-deep-2)] px-7 py-9">
              <dd className="ngp-mono ngp-display-md tracking-[-0.04em] text-[var(--ngp-cyan-bright)]">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-3 text-[13px] leading-relaxed text-[var(--ngp-on-deep-faint)]">
                {stat.label}
              </dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
