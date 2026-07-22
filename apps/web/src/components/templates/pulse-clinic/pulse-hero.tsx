'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CalendarCheck, ShieldCheck } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Counter } from './pulse-reveal';

/**
 * PULSE - hero. Words on the left, and on the right a floating card that shows
 * the practice's real contact details rather than a stock photograph: for a
 * clinic, the phone number and the opening hours are the hero image.
 *
 * The two drifting orbs behind it are CSS gradients (pulse.css), so the
 * template ships with no binary assets and scales to any viewport.
 */
export function PulseHero({ content }: { content: TemplateContent }) {
  const reduce = useReducedMotion();
  const { hero, contact } = content;

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="pulse-orb pulse-orb-blue absolute -left-24 -top-32 -z-10 h-[34rem] w-[34rem]" aria-hidden />
      <div
        className="pulse-orb pulse-orb-mint absolute -right-32 top-24 -z-10 h-[26rem] w-[26rem]"
        aria-hidden
      />

      <div className="mx-auto grid max-w-6xl gap-14 px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
        <div>
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--pulse-mint-soft)] px-4 py-2 text-[13px] font-medium text-[var(--pulse-mint-deep)]"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {hero.badge}
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-7 max-w-2xl text-balance text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl md:text-6xl"
          >
            {hero.title} <span className="text-[var(--pulse-accent)]">{hero.titleAccent}</span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-6 max-w-xl text-pretty text-[17px] leading-[1.75] text-[var(--pulse-ink-soft)]"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--pulse-accent)] px-7 py-4 text-[15px] font-semibold text-[var(--pulse-on-accent)] shadow-[var(--pulse-shadow-lift)] transition-transform hover:-translate-y-0.5"
            >
              {hero.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--pulse-line)] bg-[var(--pulse-bg)] px-7 py-4 text-[15px] font-semibold text-[var(--pulse-ink-soft)] transition-colors hover:border-[var(--pulse-accent)] hover:text-[var(--pulse-accent)]"
            >
              {hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.dl {...rise(0.32)} className="mt-14 grid max-w-lg grid-cols-3 gap-6">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-2 text-[13px] leading-snug text-[var(--pulse-ink-faint)]">{stat.label}</dt>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div {...rise(0.2)}>
          <div className="pulse-card mx-auto w-full max-w-md p-7 sm:p-9">
            <span className="pulse-tile grid h-12 w-12 place-items-center">
              <CalendarCheck className="h-6 w-6" aria-hidden />
            </span>
            <p className="mt-6 text-lg font-semibold tracking-[-0.01em]">{contact.eyebrow}</p>

            <dl className="mt-6 divide-y divide-[var(--pulse-line)]">
              {contact.details.map((detail) => (
                <div key={detail.label} className="py-3.5">
                  <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--pulse-ink-faint)]">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-[15px] leading-relaxed">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
