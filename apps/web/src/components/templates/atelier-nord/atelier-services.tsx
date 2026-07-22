'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './atelier-reveal';

/**
 * ATELIER NORD - the practice index.
 *
 * Rows, not cards. Each is a hairline, a two-digit number, a large thin title
 * and a caption held to the right - the layout of a printed index, which is the
 * only ornament this design allows itself. The number is positional decoration,
 * so it is derived here rather than stored in content.
 *
 * Hover shifts the row six pixels right and darkens the caption. It is a
 * transform and a colour, nothing that reflows, and it reads the same to a
 * keyboard user because the whole row is not a link - only its title is.
 */
export function AtelierServices({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section
      id="services"
      className="scroll-mt-24 border-t border-[var(--atelier-rule)] bg-[var(--atelier-wash)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40">
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-16">
          <Reveal>
            <p className="atelier-label">{services.eyebrow}</p>
            <span className="atelier-draw mt-6 max-w-24" aria-hidden />
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="atelier-heading text-balance text-3xl sm:text-5xl">{services.title}</h2>
            <p className="mt-8 max-w-xl text-[15px] font-light leading-[1.9] text-[var(--atelier-ink-soft)]">
              {services.subtitle}
            </p>
          </Reveal>
        </div>

        <ol className="mt-20 border-t border-[var(--atelier-rule)]">
          {services.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.06 * index}>
                <li className="group border-b border-[var(--atelier-rule)] py-8 sm:py-10">
                  <div className="grid gap-4 transition-transform duration-500 ease-out group-hover:translate-x-1.5 sm:grid-cols-[4rem_1fr] sm:gap-8 lg:grid-cols-[4rem_1.1fr_1.3fr_2rem] lg:items-baseline lg:gap-10">
                    <span className="atelier-label">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="atelier-heading text-2xl sm:text-3xl">{item.title}</h3>
                    <p className="max-w-md text-[15px] font-light leading-[1.9] text-[var(--atelier-ink-soft)] transition-colors duration-500 group-hover:text-[var(--atelier-ink)]">
                      {item.body}
                    </p>
                    <Icon
                      className="h-4 w-4 self-center text-[var(--atelier-ink-faint)] opacity-40 transition-opacity duration-500 group-hover:opacity-100 lg:justify-self-end"
                      strokeWidth={1}
                      aria-hidden
                    />
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
