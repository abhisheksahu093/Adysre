'use client';

import { Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './verdant-reveal';

/**
 * VERDANT - the founding story, opening the about page.
 *
 * Two columns: the narrative, and a floor-plan drawing standing in for the
 * measured surveys the copy is about. The drawing is CSS line art, so the
 * template still ships without an image.
 */
export function VerdantAbout({ content }: { content: TemplateContent }) {
  const { about } = content;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="grid items-start gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="verdant-eyebrow">{about.eyebrow}</p>
            <span className="verdant-rule mt-4" aria-hidden />
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
              {about.title}
            </h1>
          </Reveal>

          {about.body.map((paragraph, index) => (
            // Keyed on a prefix of the paragraph: the copy is the identity here,
            // and index keys would reorder badly if a paragraph is inserted.
            <Reveal key={paragraph.slice(0, 24)} delay={0.06 * (index + 1)}>
              <p className="mt-6 text-[15px] leading-[1.85] text-[var(--verdant-ink-soft)] sm:text-base">
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.24}>
            <ul className="mt-9 space-y-3.5">
              {about.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--verdant-brass-soft)]">
                    <Check className="h-3 w-3 text-[var(--verdant-brass)]" aria-hidden />
                  </span>
                  <span className="text-[var(--verdant-ink-soft)]">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.14}>
          {/* `relative` is a utility; the scoped `.verdant-plan` rule sets no
              position, so the drawn rooms anchor to this box. */}
          <div className="verdant-plan relative h-72 w-full bg-[var(--verdant-sand-warm)] sm:h-96" aria-hidden />
        </Reveal>
      </div>
    </section>
  );
}
