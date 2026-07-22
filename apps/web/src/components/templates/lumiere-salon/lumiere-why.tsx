'use client';

import type { TemplateContent } from '@/data/templates/types';
import { LumiereSectionHeading } from './lumiere-section-heading';
import { Reveal } from './lumiere-reveal';

/**
 * LUMIERE - the reasons to come here rather than elsewhere.
 *
 * The template's single inverse band: plum, once per home page, so it reads as a
 * pause rather than a theme. The numeral is ornament and the icon carries the
 * meaning, so the numeral is hidden and the icon is not announced either - the
 * heading beside them is the accessible content.
 */
export function LumiereWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <div className="lumi-inverse overflow-hidden rounded-[44px] px-8 py-20 sm:px-14 sm:py-24">
        <LumiereSectionHeading
          eyebrow={why.eyebrow}
          title={why.title}
          subtitle={why.subtitle}
          align="center"
        />

        <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
          {why.items.map((item, index) => (
            <Reveal key={item.title} delay={0.06 * (index % 2)}>
              <article className="flex gap-5">
                <span
                  aria-hidden
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--lumi-accent-soft)]"
                >
                  <item.icon className="h-5 w-5 text-[var(--lumi-accent)]" />
                </span>
                <div>
                  <h3 className="text-[19px] font-medium tracking-[-0.01em]">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.85] text-[var(--lumi-paper-dim)]">
                    {item.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
