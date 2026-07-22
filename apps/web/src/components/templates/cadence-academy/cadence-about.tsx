'use client';

import { Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './cadence-reveal';

/**
 * CADENCE - the founding story, on the home page.
 *
 * Two columns rather than a wide measure: the story is four long sentences and
 * the promises are three short ones, and setting them side by side lets a
 * visitor read only the right-hand column and still get the point.
 */
export function CadenceAbout({ content }: { content: TemplateContent }) {
  const { about } = content;

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal>
          <p className="cad-eyebrow">{about.eyebrow}</p>
          <span className="cad-underline mt-4" aria-hidden />
          <h2 className="cad-display-sm mt-7 text-balance">{about.title}</h2>
        </Reveal>

        <Reveal delay={0.1}>
          {about.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="mt-5 text-[17px] leading-[1.75] text-[var(--cad-ink-soft)] first:mt-0"
            >
              {paragraph}
            </p>
          ))}

          <ul className="mt-9 space-y-4">
            {about.points.map((point) => (
              <li key={point} className="flex items-start gap-4">
                <span
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-[var(--cad-radius-pill)] bg-[var(--cad-lime)]"
                  aria-hidden
                >
                  <Check className="h-4 w-4 text-[var(--cad-ink)]" />
                </span>
                <span className="text-[16px] font-semibold leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
