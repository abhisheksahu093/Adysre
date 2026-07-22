'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Counter } from './nova-reveal';

/**
 * NOVA - hero. The gradient mesh and dotted grid are pure CSS (see nova.css),
 * so the section carries no image weight and scales to any viewport.
 */
export function NovaHero({ content }: { content: TemplateContent }) {
  const reduce = useReducedMotion();
  const { hero } = content;

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="top" className="nova-mesh relative isolate overflow-hidden">
      <div className="nova-grid absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 text-center sm:px-8 sm:pb-28 sm:pt-28">
        <motion.div {...rise(0)} className="flex justify-center">
          <span className="nova-mono inline-flex items-center gap-2 rounded-full border border-[var(--nova-line-strong)] bg-[var(--nova-accent-soft)] px-3.5 py-1.5 text-[10px] text-[var(--nova-text)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--nova-accent-2)]" aria-hidden />
            {hero.badge}
          </span>
        </motion.div>

        <motion.h1
          {...rise(0.08)}
          className="mx-auto mt-7 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl md:text-7xl"
        >
          {hero.title}{' '}
          <span className="bg-gradient-to-r from-[var(--nova-accent)] via-[#a78bfa] to-[var(--nova-accent-2)] bg-clip-text text-transparent">
            {hero.titleAccent}
          </span>
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[var(--nova-muted)] sm:text-lg"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div {...rise(0.24)} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#contact"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--nova-accent)] to-[#5b8cff] px-6 py-3.5 text-sm font-semibold shadow-[0_10px_40px_-12px_rgb(124_92_255/70%)] transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            {hero.ctaPrimary}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
          <a
            href="#about"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--nova-line-strong)] px-6 py-3.5 text-sm font-medium text-[var(--nova-muted)] transition-colors hover:border-[var(--nova-text)] hover:text-[var(--nova-text)] sm:w-auto"
          >
            <Play className="h-3.5 w-3.5" aria-hidden />
            {hero.ctaSecondary}
          </a>
        </motion.div>

        <motion.dl
          {...rise(0.32)}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--nova-line)] bg-[var(--nova-line)] sm:grid-cols-3"
        >
          {hero.stats.map((stat) => (
            <div key={stat.label} className="bg-[var(--nova-surface)] px-6 py-7">
              <dt className="nova-mono text-[10px] text-[var(--nova-faint)]">{stat.label}</dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
