'use client';

import { Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { NORTHGATE_LABELS } from '@/data/templates/northgate-pay-content';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the founding story.
 *
 * Two columns of prose against a ruled list of commitments. The founder is
 * credited under the prose rather than shown as a portrait, because the
 * template ships no photography and a monogram would read as a law firm.
 */
export function NorthgateAbout({ content }: { content: TemplateContent }) {
  const { about } = content;

  return (
    <section className="border-b border-[var(--ngp-rule)] bg-[var(--ngp-bg-2)]">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <Reveal>
          <p className="ngp-eyebrow">{about.eyebrow}</p>
          <h2 className="ngp-display ngp-display-lg mt-6">{about.title}</h2>

          <div className="mt-8 space-y-6">
            {about.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-pretty text-[15.5px] leading-[1.85] text-[var(--ngp-ink-soft)]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <p className="ngp-mono mt-8 border-t border-[var(--ngp-rule)] pt-6 text-[12px] tracking-[0.06em] text-[var(--ngp-ink-faint)]">
            {NORTHGATE_LABELS.aboutFounder}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="ngp-card ngp-card-lg h-full divide-y divide-[var(--ngp-rule)] p-8 sm:p-10">
            {about.points.map((point) => (
              <li key={point} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                <Check
                  className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[var(--ngp-indigo-deep)]"
                  aria-hidden
                />
                <span className="text-[14.5px] leading-[1.75] text-[var(--ngp-ink-soft)]">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
