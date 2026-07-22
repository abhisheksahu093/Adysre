'use client';

import { ArrowUpRight } from 'lucide-react';
import {
  VERDANT_METRICS,
  VERDANT_UI,
  type VerdantListing,
} from '@/data/templates/verdant-realty-content';

/**
 * VERDANT - one home.
 *
 * Shared by the home page's featured trio and the listings grid, because the
 * two must never drift apart: a card is the template's single unit of property
 * information. The gradient "photograph" is a CSS composition chosen by the
 * listing's `view`, so nine cards look varied without one image.
 *
 * The metadata row is a `<dl>` rather than styled spans - beds, baths and
 * square footage are labelled values, and a screen reader should hear the label.
 */
export function VerdantListingCard({ listing }: { listing: VerdantListing }) {
  const metrics = [
    { label: VERDANT_METRICS.beds, value: listing.beds },
    { label: VERDANT_METRICS.baths, value: listing.baths },
    { label: VERDANT_METRICS.sqft, value: listing.sqft.toLocaleString('en-US') },
  ];

  return (
    <article className="verdant-card group flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      {/* `relative` is a Tailwind utility so the status chip can sit on the composition. */}
      <div className="relative p-2.5">
        <div className={`verdant-window verdant-window--${listing.view} h-48 w-full sm:h-56`} aria-hidden />
        <span className="absolute left-5 top-5 rounded-full bg-[var(--verdant-sand-warm)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--verdant-forest)]">
          {listing.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--verdant-ink-faint)]">
          {listing.area}
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.01em]">{listing.title}</h3>
        <p className="verdant-figures mt-3 text-2xl font-semibold text-[var(--verdant-forest)]">
          {listing.price}
        </p>

        <p className="mt-4 text-[15px] leading-relaxed text-[var(--verdant-ink-soft)]">
          {listing.summary}
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-[var(--verdant-rule)] pt-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--verdant-ink-faint)]">
                {metric.label}
              </dt>
              <dd className="verdant-figures mt-1 text-lg font-semibold">{metric.value}</dd>
            </div>
          ))}
        </dl>

        <a
          href="?page=contact"
          className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-medium text-[var(--verdant-forest)] underline decoration-[var(--verdant-brass)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--verdant-brass)]"
        >
          {VERDANT_UI.viewListing}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
          {/* The card title is repeated for assistive tech, since "Arrange a
              viewing" is identical on every card in the grid. */}
          <span className="sr-only">{`: ${listing.title}, ${listing.area}`}</span>
        </a>
      </div>
    </article>
  );
}
