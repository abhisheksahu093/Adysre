'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { TemplateContent } from '@/data/templates/types';
import { Parallax } from './saffron-reveal';

/**
 * SAFFRON - hero. An asymmetric split: the words on the left, a plated
 * composition on the right that drifts against the scroll. No photography -
 * the plate is layered radial gradients, so the template ships with no assets.
 */
export function SaffronHero({ content }: { content: TemplateContent }) {
  const reduce = useReducedMotion();
  const { hero } = content;

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 pb-24 pt-16 sm:px-10 sm:pb-32 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
        <div>
          <motion.p {...rise(0)} className="saf-eyebrow">
            {hero.badge}
          </motion.p>

          <motion.h1
            {...rise(0.1)}
            className="mt-7 text-balance text-5xl leading-[1.06] tracking-[-0.015em] sm:text-6xl md:text-7xl"
          >
            {hero.title}
            <br />
            <em className="not-italic text-[var(--saf-accent)]">{hero.titleAccent}</em>
          </motion.h1>

          <motion.p
            {...rise(0.2)}
            className="mt-8 max-w-xl text-pretty text-[17px] leading-[1.85] text-[var(--saf-ink-soft)]"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div {...rise(0.3)} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-[var(--saf-ink)] px-8 py-4 text-xs uppercase tracking-[0.22em] text-[var(--saf-paper)] transition-colors hover:bg-[var(--saf-accent)]"
            >
              {hero.ctaPrimary}
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center border-b border-[var(--saf-accent)] pb-1 text-xs uppercase tracking-[0.22em] text-[var(--saf-ink-soft)] transition-colors hover:text-[var(--saf-accent)] sm:border-b-0 sm:px-2"
            >
              {hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.dl {...rise(0.4)} className="mt-16 grid max-w-lg grid-cols-3 gap-8">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="text-4xl">
                  {stat.value}
                  {stat.suffix}
                </dd>
                <dt className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[var(--saf-ink-faint)]">
                  {stat.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        <Parallax range={80} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-square">
            <div className="saf-plate absolute inset-0" aria-hidden />
            <div
              className="saf-plate absolute -bottom-6 -left-6 h-32 w-32 sm:-bottom-10 sm:-left-10 sm:h-44 sm:w-44"
              aria-hidden
            />
          </div>
        </Parallax>
      </div>
    </section>
  );
}
