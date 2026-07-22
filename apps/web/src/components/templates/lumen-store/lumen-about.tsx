'use client';

import type { LumenProduct } from '@/data/templates/lumen-store-content';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './lumen-reveal';
import { LumenProductVisual } from './lumen-product-visual';
import { LumenSectionHeading } from './lumen-section-heading';

/**
 * LUMEN - the workshop story.
 *
 * Text left, a stacked pair of drawn pieces right. The second visual is offset
 * and overlaps the first by a quarter of its width, which is the only place in
 * the design where two elements touch - it stops a page of aligned rectangles
 * from reading as a spreadsheet.
 */
export function LumenAbout({
  content,
  products,
}: {
  content: TemplateContent;
  products: LumenProduct[];
}) {
  const { about } = content;
  const [first, second] = products;

  return (
    <section
      id="about"
      className="scroll-mt-24 border-y border-[var(--lum-rule)] bg-[var(--lum-paper-2)]"
    >
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-20 sm:px-10 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
        <div>
          <LumenSectionHeading eyebrow={about.eyebrow} title={about.title} />

          {about.body.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} delay={0.08 * (index + 1)}>
              <p className="mt-6 max-w-xl text-[17px] leading-[1.8] text-[var(--lum-ink-soft)]">
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.24}>
            <ul className="mt-10 divide-y divide-[var(--lum-rule)] border-y border-[var(--lum-rule)]">
              {about.points.map((point) => (
                <li key={point} className="py-4 text-[15px] leading-[1.6] text-[var(--lum-ink-soft)]">
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.14}>
          <div className="relative mx-auto max-w-md pb-16 pr-16 lg:max-w-none">
            {first !== undefined && (
              <LumenProductVisual art={first.art} aspect="aspect-[5/6]" label={first.name} />
            )}
            {second !== undefined && (
              <div className="absolute bottom-0 right-0 w-1/2">
                <LumenProductVisual art={second.art} aspect="aspect-square" label={second.name} />
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
