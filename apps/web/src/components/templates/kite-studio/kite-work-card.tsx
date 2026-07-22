'use client';

import { ArrowUpRight } from 'lucide-react';
import {
  KITE_META_LABELS,
  KITE_UI,
  type KiteCaseStudy,
} from '@/data/templates/kite-studio-content';

/**
 * KITE - one case study.
 *
 * The card is the template's signature object: a gradient composition standing
 * in for photography, a metadata row that makes the work checkable, and the
 * measured result given more typographic weight than the project title, because
 * the result is the argument.
 *
 * `tilt` alternates down the grid so hover reads as a hand-set layout rather
 * than one repeated effect. The direction is a prop rather than an `:nth-child`
 * rule so a filtered grid keeps alternating after cards are removed.
 */
export function KiteWorkCard({
  study,
  tilt,
}: {
  study: KiteCaseStudy;
  tilt: 'l' | 'r';
}) {
  return (
    <article className={`kite-tilt kite-tilt--${tilt} kite-panel group overflow-hidden`}>
      {/*
       * `relative` comes from Tailwind and kite.css never sets `position` on
       * `.kite-canvas`, so the bloom pseudo-element anchors to this box rather
       * than to the page.
       */}
      <div
        className={`kite-canvas kite-canvas--${study.canvas} relative m-3 h-52 sm:h-64`}
        aria-hidden
      />

      <div className="px-7 pb-8 pt-4 sm:px-9 sm:pb-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="rounded-full bg-[var(--kite-surface-2)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--kite-paper-soft)]">
            {study.sector}
          </span>
          <span className="kite-figures text-[11px] uppercase tracking-[0.2em] text-[var(--kite-paper-faint)]">
            {KITE_META_LABELS.year} {study.year}
          </span>
        </div>

        <h3 className="mt-6 text-2xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-3xl">
          <span className="kite-gradient-text">{study.client}</span>
          <span className="block text-[var(--kite-paper)]">{study.title}</span>
        </h3>

        <p className="mt-5 text-[15px] leading-[1.75] text-[var(--kite-paper-soft)]">
          {study.summary}
        </p>

        <ul className="mt-7 flex flex-wrap gap-2">
          {study.scope.map((item) => (
            <li
              key={item}
              className="rounded-full border border-[var(--kite-line)] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[var(--kite-paper-faint)]"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-[var(--kite-line)] pt-6">
          <p className="kite-eyebrow">{KITE_META_LABELS.result}</p>
          <p className="kite-figures mt-3 text-lg font-semibold leading-snug text-[var(--kite-acid)]">
            {study.result}
          </p>
        </div>

        {/*
         * A link rather than a button: in a real build this would go to the case
         * study. It stays inside the card so `:focus-within` fires the tilt for
         * keyboard users too.
         */}
        <a
          href={KITE_UI.headerCtaHref}
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--kite-paper)] transition-colors hover:text-[var(--kite-acid)]"
        >
          {KITE_UI.viewCaseStudy}
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden
          />
        </a>
      </div>
    </article>
  );
}
