'use client';

import { Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { PinnacleFigure } from './pinnacle-figure';
import { Reveal } from './pinnacle-reveal';

/**
 * PINNACLE - the firm, beside the editorial figure.
 *
 * Two columns that are deliberately unequal: the copy column is wider, and the
 * figure sits in the narrower one, which keeps the block reading as an article
 * with an illustration rather than as a marketing split.
 *
 * The commitments below are a ruled list, not a card grid - four short lines do
 * not need four boxes, and the restraint is what makes the cards elsewhere land.
 */
export function PinnacleAbout({ content }: { content: TemplateContent }) {
  const { about } = content;

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-[80rem] gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="pin-eyebrow">{about.eyebrow}</p>
            <h2 className="pin-h2 mt-6">{about.title}</h2>
          </Reveal>

          {about.body.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 40)} delay={0.08 + index * 0.06}>
              <p className="pin-body mt-6 text-[var(--pin-text-muted)]">{paragraph}</p>
            </Reveal>
          ))}

          <ul className="mt-10 border-t border-[var(--pin-line)]">
            {about.points.map((point, index) => (
              <li key={point} className="border-b border-[var(--pin-line)]">
                <Reveal delay={0.2 + index * 0.06} className="flex items-start gap-4 py-5">
                  <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[var(--pin-brand-ink)]" aria-hidden />
                  <span className="text-[0.9375rem] leading-[1.55] text-[var(--pin-text-soft)]">
                    {point}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.12} className="flex items-center justify-center lg:justify-end">
          <PinnacleFigure />
        </Reveal>
      </div>
    </section>
  );
}
