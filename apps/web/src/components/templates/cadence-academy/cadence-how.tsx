'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './cadence-reveal';

/**
 * CADENCE - how a cohort runs (the shared `services` block).
 *
 * Four cards on the warm panel, each numbered, because the four things happen
 * in a sequence a visitor is trying to picture. The number is derived from the
 * order rather than authored: it is a rendering of the list, not extra copy.
 */
export function CadenceHow({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section className="px-3 sm:px-4">
      <div className="cad-panel mx-auto max-w-6xl px-6 py-20 sm:px-12 sm:py-24">
        <Reveal className="max-w-2xl">
          <p className="cad-eyebrow">{services.eyebrow}</p>
          <span className="cad-underline mt-4" aria-hidden />
          <h2 className="cad-display-sm mt-7 text-balance">{services.title}</h2>
          <p className="mt-6 text-[17px] leading-[1.75] text-[var(--cad-ink-soft)]">
            {services.subtitle}
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {services.items.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={0.07 * index} className="h-full">
                <div className="cad-card flex h-full flex-col p-8 sm:p-9">
                  <div className="flex items-center gap-4">
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--cad-radius-pill)] bg-[var(--cad-violet-soft)]"
                      aria-hidden
                    >
                      <item.icon className="h-5 w-5 text-[var(--cad-violet)]" />
                    </span>
                    <span
                      className="cad-figures text-3xl font-bold text-[var(--cad-cream-deep)]"
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--cad-ink-soft)]">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
