'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './saffron-reveal';

/**
 * SAFFRON - the menu. A two-column list rather than cards: hairline rules,
 * generous leading and the accent reserved for the icon, so it reads like a
 * printed menu rather than a pricing grid.
 */
export function SaffronServices({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section id="services" className="scroll-mt-24 bg-[var(--saf-paper-2)]">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <Reveal className="max-w-2xl">
          <p className="saf-eyebrow">{services.eyebrow}</p>
          <span className="saf-rule mt-4" aria-hidden />
          <h2 className="mt-6 text-balance text-4xl leading-[1.15] tracking-[-0.01em] sm:text-5xl">
            {services.title}
          </h2>
          <p className="mt-6 text-[17px] leading-[1.85] text-[var(--saf-ink-soft)]">{services.subtitle}</p>
        </Reveal>

        <div className="mt-16 grid gap-x-16 sm:grid-cols-2">
          {services.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.07 * index}>
                <article className="group border-t border-[var(--saf-rule)] py-9">
                  <Icon
                    className="h-6 w-6 text-[var(--saf-accent)] transition-transform duration-500 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                  <h3 className="mt-5 text-2xl tracking-[-0.01em]">{item.title}</h3>
                  <p className="mt-3 text-[16px] leading-[1.8] text-[var(--saf-ink-soft)]">{item.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
