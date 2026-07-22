'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Parallax, Reveal } from './saffron-reveal';

/**
 * SAFFRON - our story. Text on the right, a framed plated composition on the
 * left that drifts as the section passes, so the page has one slow-moving
 * element without any of it depending on images.
 */
export function SaffronAbout({ content }: { content: TemplateContent }) {
  const { about } = content;

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24">
        <Parallax range={64} className="order-2 lg:order-1">
          <div className="saf-frame relative aspect-[4/5] p-8">
            {/* Width from the insets, height from the ratio - `inset-8` alone
                would stretch the plate into an oval in a 4:5 frame. */}
            <div
              className="saf-plate absolute left-8 right-8 top-1/2 aspect-square -translate-y-1/2"
              aria-hidden
            />
            <span className="absolute bottom-6 left-8 text-[11px] uppercase tracking-[0.24em] text-[var(--saf-ink-faint)]">
              Bridge Street, 2017
            </span>
          </div>
        </Parallax>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="saf-eyebrow">{about.eyebrow}</p>
            <span className="saf-rule mt-4" aria-hidden />
            <h2 className="mt-6 text-balance text-4xl leading-[1.15] tracking-[-0.01em] sm:text-5xl">
              {about.title}
            </h2>
          </Reveal>

          {about.body.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} delay={0.08 * (index + 1)}>
              <p className="mt-7 text-[17px] leading-[1.85] text-[var(--saf-ink-soft)]">{paragraph}</p>
            </Reveal>
          ))}

          <Reveal delay={0.24}>
            <ul className="mt-10 divide-y divide-[var(--saf-rule)] border-y border-[var(--saf-rule)]">
              {about.points.map((point) => (
                <li key={point} className="py-4 text-[15px] text-[var(--saf-ink-soft)]">
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
