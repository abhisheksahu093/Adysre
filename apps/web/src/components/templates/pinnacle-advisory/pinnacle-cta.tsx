'use client';

import { ArrowRight } from 'lucide-react';
import { PINNACLE_LABELS } from '@/data/templates/pinnacle-advisory-content';
import { Reveal } from './pinnacle-reveal';
import { pinnacleHref } from './pinnacle-links';

/**
 * PINNACLE - the closing call to action.
 *
 * Sand on sand, framed at the largest radius in the system, with a single blue
 * word-mark rule above it. It stays light on purpose: the inverted band earlier
 * in the page is the emphasis, and a second dark block would flatten it.
 *
 * Shared across pages rather than written per page, so every route ends on the
 * same offer and the same button.
 */
export function PinnacleCta() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mx-auto max-w-[80rem] rounded-[var(--pin-r-xl)] border border-[var(--pin-line)] bg-[var(--pin-sand-2)] px-7 py-16 text-center sm:px-14 sm:py-20">
          <p className="pin-eyebrow">{PINNACLE_LABELS.ctaEyebrow}</p>

          {/* The measure caps at 22ch, so this line breaks the same way the
              section headings do and the page keeps one rhythm to the end. */}
          <h2 className="pin-h2 mx-auto mt-6">{PINNACLE_LABELS.ctaTitle}</h2>

          <p className="pin-body mx-auto mt-7 text-[var(--pin-text-muted)]">
            {PINNACLE_LABELS.ctaBody}
          </p>

          <div className="mt-10 flex justify-center">
            <a href={pinnacleHref('contact')} className="pin-btn pin-btn-primary inline-flex">
              {PINNACLE_LABELS.ctaAction}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
