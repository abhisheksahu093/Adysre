'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - the asset-class grid.
 *
 * Six cards on a hairline gap grid: the 1px background showing between cells is
 * the only divider, which is the cheap way to get the hairline-against-huge-radius
 * contrast this design is built on without drawing twelve borders.
 */
export function VantaServices({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section className="border-t border-[var(--vanta-line)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="vanta-eyebrow">{services.eyebrow}</p>
          <span className="vanta-rule mt-5" aria-hidden />
          <h2 className="vanta-display-sm mt-7 max-w-3xl text-balance">{services.title}</h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-[1.9] text-[var(--vanta-muted)]">
            {services.subtitle}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--vanta-radius)] border border-[var(--vanta-line)] bg-[var(--vanta-line)] sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05} className="bg-[var(--vanta-ink)]">
              <article className="h-full p-7 transition-colors hover:bg-[var(--vanta-surface)] sm:p-9">
                <item.icon className="h-5 w-5 text-[var(--vanta-brand)]" aria-hidden />
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em]">{item.title}</h3>
                <p className="mt-4 text-[15px] leading-[1.8] text-[var(--vanta-muted)]">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
