'use client';

import { useMemo, useState } from 'react';
import {
  VERDANT_FILTERS,
  VERDANT_LISTINGS,
  VERDANT_LISTINGS_PAGE,
  VERDANT_UI,
} from '@/data/templates/verdant-realty-content';
import { VerdantListingCard } from './verdant-listing-card';
import { Reveal } from './verdant-reveal';

/**
 * VERDANT - the full book, with district filtering.
 *
 * The chips really filter rather than decorate, because a grid of nine homes is
 * exactly the size where a visitor tries them. They are buttons in a group with
 * `aria-pressed`, not links, since nothing about the page's address changes.
 *
 * The result count is announced politely: filtering removes cards without
 * moving focus, which a screen-reader user would otherwise not notice.
 */
export function VerdantListingsGrid() {
  const [district, setDistrict] = useState<string>('all');

  const visible = useMemo(
    () =>
      district === 'all'
        ? VERDANT_LISTINGS
        : VERDANT_LISTINGS.filter((listing) => listing.district === district),
    [district],
  );

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <Reveal className="max-w-2xl">
        <p className="verdant-eyebrow">{VERDANT_LISTINGS_PAGE.eyebrow}</p>
        <span className="verdant-rule mt-4" aria-hidden />
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
          {VERDANT_LISTINGS_PAGE.title}
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-[var(--verdant-ink-soft)]">
          {VERDANT_LISTINGS_PAGE.subtitle}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div
          role="group"
          aria-label={VERDANT_UI.listingsNav}
          className="mt-10 flex flex-wrap items-center gap-2.5 border-y border-[var(--verdant-rule)] py-5"
        >
          <span className="sr-only">{VERDANT_LISTINGS_PAGE.filterLegend}</span>
          {VERDANT_FILTERS.map((filter) => {
            const active = filter.id === district;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => setDistrict(filter.id)}
                className={`rounded-full border px-5 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                  active
                    ? 'border-[var(--verdant-forest)] bg-[var(--verdant-forest)] text-[var(--verdant-on-forest)]'
                    : 'border-[var(--verdant-rule-strong)] text-[var(--verdant-ink-soft)] hover:border-[var(--verdant-forest)] hover:text-[var(--verdant-ink)]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}

          <p
            aria-live="polite"
            className="verdant-figures ml-auto text-xs uppercase tracking-[0.16em] text-[var(--verdant-ink-faint)]"
          >
            {visible.length} {VERDANT_LISTINGS_PAGE.resultsSuffix}
          </p>
        </div>
      </Reveal>

      {visible.length === 0 ? (
        <p className="mt-16 text-center text-[15px] text-[var(--verdant-ink-soft)]">
          {VERDANT_LISTINGS_PAGE.empty}
        </p>
      ) : (
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((listing, index) => (
            // Keyed by id so React reuses the card when the filter narrows,
            // rather than re-mounting (and re-animating) every survivor.
            <Reveal key={listing.id} delay={0.05 * (index % 3)} className="h-full">
              <VerdantListingCard listing={listing} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
