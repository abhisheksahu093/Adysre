'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './pulse-reveal';

/**
 * PULSE - why choose us. Wide two-up rows on white, with the icon in a mint
 * tile so this section reads differently from the blue treatment grid above it
 * without introducing a third colour.
 */
export function PulseWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section id="why" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <Reveal className="max-w-2xl">
        <p className="pulse-eyebrow">{why.eyebrow}</p>
        <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.2] tracking-[-0.02em] sm:text-4xl">
          {why.title}
        </h2>
        <p className="mt-5 text-[16px] leading-[1.8] text-[var(--pulse-ink-soft)]">{why.subtitle}</p>
      </Reveal>

      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        {why.items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={0.06 * index}>
              <div className="pulse-card pulse-card-soft pulse-card-lift h-full p-7 sm:p-9">
                <div className="flex items-center gap-4">
                  <span className="pulse-tile pulse-tile-mint grid h-11 w-11 shrink-0 place-items-center">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">{item.title}</h3>
                </div>
                <p className="mt-5 text-[15px] leading-[1.8] text-[var(--pulse-ink-soft)]">{item.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
