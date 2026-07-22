'use client';

import type { TemplateContent } from '@/data/templates/types';
import { MERIDIAN_LABELS } from '@/data/templates/meridian-law-content';
import { Reveal } from './meridian-reveal';
import { meridianHref } from './meridian-links';

/**
 * MERIDIAN - practice preview on the home page.
 *
 * A ruled grid rather than cards: each group is separated from its neighbours
 * by hairlines, which keeps the page reading as a printed page rather than a
 * dashboard. The full treatment lives on the practices page, so this section
 * ends with the link across to it.
 */
export function MeridianServices({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section className="border-b border-[var(--mer-rule)] bg-[var(--mer-ivory)]">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mer-eyebrow">{services.eyebrow}</p>
          <h2 className="mer-display mt-5 text-balance text-3xl sm:text-4xl">{services.title}</h2>
          <div className="mt-6 flex justify-center">
            <span className="mer-hairline" aria-hidden />
          </div>
          <p className="mt-6 text-[15px] leading-[1.85] text-[var(--mer-ink-soft)]">
            {services.subtitle}
          </p>
        </Reveal>

        <div className="mt-16 grid border-t border-[var(--mer-rule)] sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.05 * index}>
                <article className="h-full border-b border-[var(--mer-rule)] px-0 py-9 sm:px-8">
                  <Icon className="h-6 w-6 text-[var(--mer-gold-ink)]" aria-hidden />
                  <h3 className="mer-display mt-5 text-xl">{item.title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.8] text-[var(--mer-ink-soft)]">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href={meridianHref('practices')}
            className="inline-block border-b border-[var(--mer-gold)] pb-1 text-[11px] uppercase tracking-[0.22em] text-[var(--mer-ink)] transition-colors hover:text-[var(--mer-gold-ink)]"
          >
            {MERIDIAN_LABELS.servicesMore}
          </a>
        </div>
      </div>
    </section>
  );
}
