'use client';

import { ArrowUpRight } from 'lucide-react';
import { NORTHGATE_LABELS } from '@/data/templates/northgate-pay-content';
import { northgateHref } from './northgate-links';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the closing panel.
 *
 * One large-radius glass panel on paper, over a soft gradient wash. It appears
 * at the foot of every page except contact, so a visitor who has finished
 * reading anything always has the same two next steps in the same place.
 */
export function NorthgateCta() {
  return (
    <section className="ngp-wash ngp-wash-soft relative overflow-hidden bg-[var(--ngp-bg)]">
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <div className="ngp-card ngp-card-lg px-8 py-16 text-center sm:px-16 sm:py-20">
            <p className="ngp-eyebrow">{NORTHGATE_LABELS.ctaEyebrow}</p>
            <h2 className="ngp-display ngp-display-lg mx-auto mt-6 max-w-[18ch]">
              {NORTHGATE_LABELS.ctaTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-[15.5px] leading-[1.8] text-[var(--ngp-ink-soft)]">
              {NORTHGATE_LABELS.ctaBody}
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={northgateHref('developers')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ngp-ink)] px-7 py-3.5 text-[14px] text-[var(--ngp-bg)] transition-opacity hover:opacity-85"
              >
                {NORTHGATE_LABELS.ctaPrimary}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href={northgateHref('contact')}
                className="inline-flex items-center justify-center rounded-full border border-[var(--ngp-rule-strong)] px-7 py-3.5 text-[14px] transition-colors hover:border-[var(--ngp-indigo)] hover:text-[var(--ngp-indigo-deep)]"
              >
                {NORTHGATE_LABELS.ctaSecondary}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
