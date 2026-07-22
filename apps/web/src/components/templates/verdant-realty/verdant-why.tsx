'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './verdant-reveal';

/**
 * VERDANT - why us. A forest band between two sand sections, which is what
 * gives the long home page its rhythm. The numeral is derived from position:
 * it is ornament, so it never enters the content module.
 */
export function VerdantWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section id="why" className="scroll-mt-24 bg-[var(--verdant-forest)] text-[var(--verdant-on-forest)]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="max-w-2xl">
          <p className="verdant-eyebrow">{why.eyebrow}</p>
          <span className="verdant-rule mt-4" aria-hidden />
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            {why.title}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--verdant-on-forest-soft)]">
            {why.subtitle}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-7 sm:grid-cols-2">
          {why.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.06 * index} className="h-full">
                <article className="verdant-card-inverse h-full p-7">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--verdant-brass-soft)]">
                      <Icon className="h-5 w-5 text-[var(--verdant-brass)]" aria-hidden />
                    </span>
                    <span className="verdant-figures text-sm text-[var(--verdant-on-forest-faint)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em]">{item.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--verdant-on-forest-soft)]">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
