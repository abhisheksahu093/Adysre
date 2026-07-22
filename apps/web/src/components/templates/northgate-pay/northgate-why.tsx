'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the four published commitments.
 *
 * Set on the deep ground in a 2x2 of glass panels, each headed by a figure
 * rather than a promise: the title carries the number, the body says how it is
 * measured. That order is the point of the section.
 */
export function NorthgateWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section className="ngp-on-deep ngp-wash relative overflow-hidden bg-[var(--ngp-deep)] text-[var(--ngp-on-deep)]">
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-3xl">
          <p className="ngp-eyebrow ngp-eyebrow-invert">{why.eyebrow}</p>
          <h2 className="ngp-display ngp-display-lg mt-6">{why.title}</h2>
          <p className="mt-6 max-w-2xl text-pretty text-[15.5px] leading-[1.8] text-[var(--ngp-on-deep-soft)]">
            {why.subtitle}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {why.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.06 * (index % 2)}>
                <article className="ngp-glass h-full p-8 sm:p-10">
                  <Icon className="h-5 w-5 text-[var(--ngp-cyan-bright)]" aria-hidden />
                  {/* No `tracking-*` here: `.ngp-display` already sets the
                      letter-spacing, and a scoped rule outranks the utility. */}
                  <h3 className="ngp-display ngp-mono mt-7 text-[20px] leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[14px] leading-[1.8] text-[var(--ngp-on-deep-soft)]">
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
