'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './lumen-reveal';
import { LumenSectionHeading } from './lumen-section-heading';

/**
 * LUMEN - the four decisions.
 *
 * Set as a two-column list with the index as a quiet amber numeral, so it reads
 * as an argument in order rather than four equivalent features. Deliberately not
 * the same shape as the services strip above it.
 */
export function LumenWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section
      id="why"
      className="scroll-mt-24 border-y border-[var(--lum-rule)] bg-[var(--lum-paper-2)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <LumenSectionHeading eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle} />

        <div className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-2">
          {why.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.06 * index}>
                <div className="flex gap-6">
                  <span
                    className="lum-price shrink-0 text-[15px] font-medium text-[var(--lum-accent-deep)]"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-[var(--lum-ink-faint)]" aria-hidden />
                      <h3 className="text-[19px] font-medium tracking-[-0.01em]">{item.title}</h3>
                    </div>
                    <p className="mt-3 text-[15px] leading-[1.75] text-[var(--lum-ink-soft)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
