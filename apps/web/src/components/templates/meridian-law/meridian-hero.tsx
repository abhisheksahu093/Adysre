'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { TemplateContent } from '@/data/templates/types';
import { Counter } from './meridian-reveal';
import { meridianHref } from './meridian-links';

/**
 * MERIDIAN - home hero.
 *
 * An inverted navy band with a fine CSS hatch behind it: no photography, no
 * gradient bloom, nothing that reads as a product page. The composition is
 * centred and the figures sit in a ruled row beneath, which is how a firm's
 * letterhead would set them.
 */
export function MeridianHero({ content }: { content: TemplateContent }) {
  const reduce = useReducedMotion();
  const { hero } = content;

  // Fades only - the art direction rules out vertical travel entirely.
  const fade = (delay: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: reduce ? 0 : 0.8,
      delay: reduce ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section className="mer-hatch bg-[var(--mer-navy)] text-[var(--mer-on-navy)]">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-10 sm:py-32">
        <motion.p {...fade(0)} className="mer-eyebrow mer-eyebrow-invert">
          {hero.badge}
        </motion.p>

        <motion.div {...fade(0.05)} className="flex justify-center">
          <span className="mer-hairline mt-6" aria-hidden />
        </motion.div>

        <motion.h1
          {...fade(0.1)}
          className="mer-display mt-8 text-balance text-4xl leading-[1.15] sm:text-5xl md:text-6xl"
        >
          {hero.title}
          <span className="block text-[var(--mer-gold-bright)]">{hero.titleAccent}</span>
        </motion.h1>

        <motion.p
          {...fade(0.18)}
          className="mx-auto mt-8 max-w-2xl text-pretty text-[15px] leading-[1.85] text-[var(--mer-on-navy-soft)]"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          {...fade(0.26)}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href={meridianHref('contact')}
            className="w-full border border-[var(--mer-gold)] bg-[var(--mer-gold)] px-7 py-3.5 text-[11px] uppercase tracking-[0.22em] text-[var(--mer-navy)] transition-colors hover:bg-transparent hover:text-[var(--mer-gold-bright)] sm:w-auto"
          >
            {hero.ctaPrimary}
          </a>
          <a
            href={meridianHref('practices')}
            className="w-full border border-[var(--mer-navy-rule)] px-7 py-3.5 text-[11px] uppercase tracking-[0.22em] text-[var(--mer-on-navy-soft)] transition-colors hover:border-[var(--mer-on-navy)] hover:text-[var(--mer-on-navy)] sm:w-auto"
          >
            {hero.ctaSecondary}
          </a>
        </motion.div>
      </div>

      <motion.dl
        {...fade(0.34)}
        className="mx-auto grid max-w-6xl grid-cols-1 border-t border-[var(--mer-navy-rule)] px-6 sm:grid-cols-3 sm:px-10"
      >
        {hero.stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`px-2 py-9 text-center sm:px-8 ${
              // Hairlines between the figures, never around them: the rule is
              // the ornament in this design.
              index > 0 ? 'border-t border-[var(--mer-navy-rule)] sm:border-l sm:border-t-0' : ''
            }`}
          >
            <dd className="mer-display text-4xl text-[var(--mer-gold-bright)] sm:text-5xl">
              <Counter value={stat.value} suffix={stat.suffix} />
            </dd>
            <dt className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[var(--mer-on-navy-faint)]">
              {stat.label}
            </dt>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
