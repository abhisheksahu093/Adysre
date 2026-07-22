'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './kite-reveal';

/**
 * KITE - why the studio stays small.
 *
 * Set as a two-column list rather than a card grid, so it reads as four claims
 * being made in sequence. Each one is numbered in the margin, which gives the
 * section the same counted rhythm as the process rail without repeating it.
 */
export function KiteWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <p className="kite-eyebrow">{why.eyebrow}</p>
          <h2 className="kite-display-sm mt-6">{why.title}</h2>
          <p className="mt-7 max-w-md text-[15px] leading-[1.8] text-[var(--kite-paper-soft)]">
            {why.subtitle}
          </p>
        </Reveal>

        <ul className="divide-y divide-[var(--kite-line)] border-y border-[var(--kite-line)]">
          {why.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <Reveal delay={index * 0.08}>
                  <div className="flex gap-6 py-8 sm:gap-9">
                    <span
                      className="kite-figures shrink-0 pt-1 text-sm font-semibold text-[var(--kite-acid)]"
                      aria-hidden
                    >
                      {`0${index + 1}`}
                    </span>
                    <div>
                      <h3 className="flex items-center gap-3 text-xl font-bold tracking-[-0.02em]">
                        <Icon className="h-5 w-5 text-[var(--kite-magenta)]" aria-hidden />
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-[15px] leading-[1.75] text-[var(--kite-paper-soft)]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
