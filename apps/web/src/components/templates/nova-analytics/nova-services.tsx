'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './nova-reveal';

/**
 * NOVA - platform grid. Cards lift on hover and reveal a gradient edge; the
 * effect is transform + opacity only, so it stays on the compositor.
 */
export function NovaServices({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section
      id="services"
      className="scroll-mt-20 border-t border-[var(--nova-line)] bg-[var(--nova-surface)]/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-2xl">
          <p className="nova-mono text-[10px] text-[var(--nova-accent-2)]">{services.eyebrow}</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            {services.title}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--nova-muted)]">{services.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {services.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.06 * index}>
                <article className="nova-card group relative h-full overflow-hidden p-7 transition-transform duration-300 hover:-translate-y-1">
                  <span
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--nova-accent)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="grid h-11 w-11 place-items-center rounded-[var(--nova-radius-sm)] border border-[var(--nova-line-strong)] bg-[var(--nova-accent-soft)]">
                    <Icon className="h-5 w-5 text-[var(--nova-accent-2)]" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--nova-muted)]">{item.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
