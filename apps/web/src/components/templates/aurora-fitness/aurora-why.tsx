'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './aurora-reveal';

/**
 * AURORA - why us. Full-width rows rather than cards: a giant outlined index,
 * then the claim. Rows are the only place in the template where type is allowed
 * to run this large beside body copy, which is what makes the list feel loud.
 */
export function AuroraWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section id="why" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <Reveal className="max-w-3xl">
        <p className="aurora-tag text-[10px] text-[var(--aurora-acid)]">{why.eyebrow}</p>
        <h2 className="aurora-display mt-5 text-5xl sm:text-6xl md:text-7xl">{why.title}</h2>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--aurora-muted)]">{why.subtitle}</p>
      </Reveal>

      <div className="mt-14 border-t-2 border-[var(--aurora-line)]">
        {why.items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={0.05 * index}>
              <div className="group grid items-baseline gap-x-8 gap-y-4 border-b-2 border-[var(--aurora-line)] py-9 sm:grid-cols-[7rem_1fr] sm:py-11">
                <span
                  className="aurora-display text-6xl text-[var(--aurora-line-strong)] transition-colors duration-300 group-hover:text-[var(--aurora-acid)] sm:text-8xl"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="grid gap-x-10 gap-y-3 lg:grid-cols-[1fr_1.2fr]">
                  <h3 className="aurora-display flex items-center gap-3 text-3xl sm:text-4xl">
                    <Icon className="h-6 w-6 shrink-0 text-[var(--aurora-acid)]" aria-hidden />
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[var(--aurora-muted)]">{item.body}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
