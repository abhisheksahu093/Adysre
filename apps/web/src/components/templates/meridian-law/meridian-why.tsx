'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './meridian-reveal';

/**
 * MERIDIAN - the firm's commitments.
 *
 * Inverted navy so the home page alternates band by band, and set as a
 * two-column ruled list with a serif numeral per item. The numeral is derived
 * from position because it is ornament, not content.
 */
export function MeridianWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section className="mer-hatch bg-[var(--mer-navy)] text-[var(--mer-on-navy)]">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mer-eyebrow mer-eyebrow-invert">{why.eyebrow}</p>
          <h2 className="mer-display mt-5 text-balance text-3xl sm:text-4xl">{why.title}</h2>
          <div className="mt-6 flex justify-center">
            <span className="mer-hairline" aria-hidden />
          </div>
          <p className="mt-6 text-[15px] leading-[1.85] text-[var(--mer-on-navy-soft)]">
            {why.subtitle}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-16 sm:grid-cols-2">
          {why.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.05 * index}>
                <div className="border-t border-[var(--mer-navy-rule)] py-9">
                  <div className="flex items-baseline gap-4">
                    <span className="mer-year text-2xl text-[var(--mer-gold-bright)]" aria-hidden>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mer-display text-xl">{item.title}</h3>
                  </div>
                  <div className="mt-4 flex items-start gap-4">
                    <Icon
                      className="mt-1 h-5 w-5 shrink-0 text-[var(--mer-gold-bright)]"
                      aria-hidden
                    />
                    <p className="text-[14px] leading-[1.85] text-[var(--mer-on-navy-soft)]">
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
