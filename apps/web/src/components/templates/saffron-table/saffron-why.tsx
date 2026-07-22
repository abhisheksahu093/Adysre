'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './saffron-reveal';

/**
 * SAFFRON - the room. Oversized serif numerals set the rhythm; the icon is a
 * quiet second mark rather than the focus.
 */
export function SaffronWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section id="why" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
      <Reveal className="max-w-2xl">
        <p className="saf-eyebrow">{why.eyebrow}</p>
        <span className="saf-rule mt-4" aria-hidden />
        <h2 className="mt-6 text-balance text-4xl leading-[1.15] tracking-[-0.01em] sm:text-5xl">
          {why.title}
        </h2>
        <p className="mt-6 text-[17px] leading-[1.85] text-[var(--saf-ink-soft)]">{why.subtitle}</p>
      </Reveal>

      <div className="mt-16 grid gap-x-16 gap-y-14 sm:grid-cols-2">
        {why.items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={0.07 * index}>
              <div className="flex gap-7">
                <span className="saf-numeral shrink-0" aria-hidden>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[var(--saf-accent)]" aria-hidden />
                    <h3 className="text-2xl tracking-[-0.01em]">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-[16px] leading-[1.8] text-[var(--saf-ink-soft)]">{item.body}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
