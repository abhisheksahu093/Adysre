'use client';

import { ArrowRight } from 'lucide-react';
import { VERDANT_FEATURED, VERDANT_LISTINGS } from '@/data/templates/verdant-realty-content';
import { VerdantListingCard } from './verdant-listing-card';
import { Reveal } from './verdant-reveal';

/**
 * VERDANT - featured homes on the home page.
 *
 * Takes the first three from the same array the listings page renders, so the
 * agency's book exists once. Ordering is editorial and lives in the content
 * module; this section never sorts or filters.
 */
export function VerdantFeatured() {
  const featured = VERDANT_LISTINGS.slice(0, 3);

  return (
    <section id="featured" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <Reveal className="max-w-2xl">
        <p className="verdant-eyebrow">{VERDANT_FEATURED.eyebrow}</p>
        <span className="verdant-rule mt-4" aria-hidden />
        <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
          {VERDANT_FEATURED.title}
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--verdant-ink-soft)]">
          {VERDANT_FEATURED.subtitle}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((listing, index) => (
          <Reveal key={listing.id} delay={0.07 * index} className="h-full">
            <VerdantListingCard listing={listing} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.12}>
        <a
          href={VERDANT_FEATURED.ctaHref}
          className="group mt-12 inline-flex items-center gap-2 rounded-full border border-[var(--verdant-rule-strong)] px-7 py-3.5 text-sm font-medium transition-colors hover:border-[var(--verdant-forest)] hover:bg-[var(--verdant-forest)] hover:text-[var(--verdant-on-forest)]"
        >
          {VERDANT_FEATURED.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </a>
      </Reveal>
    </section>
  );
}
