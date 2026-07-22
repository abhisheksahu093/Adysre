'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './atelier-reveal';

/**
 * ATELIER NORD - the studio story.
 *
 * The template's recurring layout: label alone in a narrow left column, prose
 * in a wide right one, and nothing in the gap between them. The method points
 * are numbered hairline rows rather than bullets - the same index device the
 * practice and work sections use, so the page reads as one document.
 */
export function AtelierAbout({ content }: { content: TemplateContent }) {
  const { about } = content;

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:px-10 sm:py-40">
      <div className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-16">
        <Reveal>
          <p className="atelier-label">{about.eyebrow}</p>
          <span className="atelier-draw mt-6 max-w-24" aria-hidden />
        </Reveal>

        <div>
          <Reveal delay={0.08}>
            <h2 className="atelier-heading max-w-3xl text-balance text-3xl sm:text-[2.75rem]">
              {about.title}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
            {about.body.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 28)} delay={0.12 + 0.08 * index}>
                <p className="max-w-prose text-[15px] font-light leading-[1.9] text-[var(--atelier-ink-soft)]">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.24}>
            <ol className="mt-16 border-t border-[var(--atelier-rule)]">
              {about.points.map((point, index) => (
                <li
                  key={point}
                  className="flex items-baseline gap-6 border-b border-[var(--atelier-rule)] py-5 sm:gap-10"
                >
                  <span className="atelier-label shrink-0">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-[15px] font-light leading-relaxed">{point}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
