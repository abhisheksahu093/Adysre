'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './nova-reveal';

/**
 * NOVA - why choose us. Numbered cards: the index is decorative, so it is
 * derived from position rather than stored in content.
 */
export function NovaWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section id="why" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32">
      <Reveal className="max-w-2xl">
        <p className="nova-mono text-[10px] text-[var(--nova-accent-2)]">{why.eyebrow}</p>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">{why.title}</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--nova-muted)]">{why.subtitle}</p>
      </Reveal>

      <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
        {why.items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={0.06 * index}>
              <div className="relative border-t border-[var(--nova-line)] pt-6">
                <span className="nova-mono absolute -top-3 left-0 bg-[var(--nova-bg)] pr-3 text-[10px] text-[var(--nova-faint)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex items-start gap-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--nova-accent)]" aria-hidden />
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--nova-muted)]">{item.body}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
