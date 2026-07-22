'use client';

import { Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './pulse-reveal';

/**
 * PULSE - the practice. The story on the left, and on the right the same
 * checklist promoted into its own card stack, so the facts a nervous patient
 * scans for (who treats me, is it step-free, what does it cost) are readable
 * without going through the prose.
 */
export function PulseAbout({ content }: { content: TemplateContent }) {
  const { about } = content;

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="pulse-eyebrow">{about.eyebrow}</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.2] tracking-[-0.02em] sm:text-4xl">
              {about.title}
            </h2>
          </Reveal>

          {about.body.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} delay={0.06 * (index + 1)}>
              <p className="mt-5 text-[16px] leading-[1.8] text-[var(--pulse-ink-soft)]">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <ul className="grid gap-3">
            {about.points.map((point) => (
              <li key={point} className="pulse-card pulse-card-lift flex items-start gap-4 p-5 sm:p-6">
                <span className="pulse-tile pulse-tile-mint mt-0.5 grid h-9 w-9 shrink-0 place-items-center">
                  <Check className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-[15px] leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
