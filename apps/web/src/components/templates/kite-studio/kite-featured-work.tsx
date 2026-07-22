'use client';

import { ArrowRight } from 'lucide-react';
import { KITE_CASE_STUDIES, KITE_FEATURED } from '@/data/templates/kite-studio-content';
import { Reveal } from './kite-reveal';
import { KiteWorkCard } from './kite-work-card';

/**
 * KITE - the three featured projects on the home page.
 *
 * The book is ordered newest-first in the content module, so "featured" is the
 * first three rather than a second, hand-maintained list that would drift out of
 * step with the work page.
 */
export function KiteFeaturedWork() {
  const featured = KITE_CASE_STUDIES.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kite-eyebrow">{KITE_FEATURED.eyebrow}</p>
            <h2 className="kite-display-sm mt-6">{KITE_FEATURED.title}</h2>
          </div>
          <a
            href={KITE_FEATURED.ctaHref}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--kite-line-strong)] px-7 py-3.5 text-sm font-semibold transition-colors hover:border-[var(--kite-acid)] hover:text-[var(--kite-acid)]"
          >
            {KITE_FEATURED.cta}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
              aria-hidden
            />
          </a>
        </div>
        <p className="mt-7 max-w-2xl text-[15px] leading-[1.8] text-[var(--kite-paper-soft)]">
          {KITE_FEATURED.subtitle}
        </p>
      </Reveal>

      <div className="mt-14 grid gap-8 lg:grid-cols-3">
        {featured.map((study, index) => (
          // Staggered by index so the row assembles left to right rather than
          // arriving as one block.
          <Reveal key={study.id} delay={index * 0.1}>
            <KiteWorkCard study={study} tilt={index % 2 === 0 ? 'l' : 'r'} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
