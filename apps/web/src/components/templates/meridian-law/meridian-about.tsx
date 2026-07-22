'use client';

import type { TemplateContent } from '@/data/templates/types';
import { MERIDIAN_LABELS } from '@/data/templates/meridian-law-content';
import { Reveal } from './meridian-reveal';

/**
 * MERIDIAN - the founding story, on the firm page.
 *
 * Two symmetrical columns: the narrative on the left, the firm's written
 * commitments on the right inside a ruled panel bearing the crest. The crest is
 * drawn entirely in CSS (`.mer-crest`), so the template ships without a single
 * image dependency.
 */
export function MeridianAbout({ content }: { content: TemplateContent }) {
  const { about, brand } = content;

  return (
    <section className="border-b border-[var(--mer-rule)] bg-[var(--mer-ivory)]">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="mer-eyebrow">{about.eyebrow}</p>
              <h2 className="mer-display mt-5 text-balance text-3xl sm:text-4xl">{about.title}</h2>
              <span className="mer-hairline mt-6" aria-hidden />
            </Reveal>

            {about.body.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 28)} delay={0.06 * (index + 1)}>
                <p className="mt-6 text-[15px] leading-[1.9] text-[var(--mer-ink-soft)]">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12}>
            <div className="mer-panel h-full p-8 sm:p-10">
              {/* `relative` is a Tailwind utility here on purpose: the crest's
                  inset rule is a ::after, and scoped CSS must never set
                  `position` on an element Tailwind positions. */}
              <span
                className="mer-crest relative mx-auto block h-16 w-16 border border-[var(--mer-gold)]"
                aria-hidden
              />
              <p className="mer-display mt-7 text-center text-2xl uppercase tracking-[0.3em]">
                {brand}
              </p>
              <p className="mer-eyebrow mt-8 text-center">{MERIDIAN_LABELS.valuesTitle}</p>

              <ul className="mt-6 border-t border-[var(--mer-rule)]">
                {about.points.map((point) => (
                  <li
                    key={point}
                    className="border-b border-[var(--mer-rule)] py-5 text-[14px] leading-[1.8] text-[var(--mer-ink-soft)]"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
