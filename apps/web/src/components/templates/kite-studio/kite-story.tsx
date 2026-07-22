'use client';

import type { TemplateContent } from '@/data/templates/types';
import { KITE_STUDIO_PAGE, KITE_VALUE_ICONS } from '@/data/templates/kite-studio-content';
import { Reveal } from './kite-reveal';

/**
 * KITE - the founding story and the four operating rules.
 *
 * Two blocks in one file because they are one argument: the story explains why
 * the rules exist, and splitting them across components would only mean reading
 * the same paragraph twice.
 *
 * The value marks come from `KITE_VALUE_ICONS`, positionally matched to
 * `values`, so every icon choice stays in the content module with the copy it
 * belongs to.
 */
export function KiteStory({ content }: { content: TemplateContent }) {
  const { about } = content;

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="kite-eyebrow">{about.eyebrow}</p>
            <h2 className="kite-display-sm mt-6">{about.title}</h2>
          </Reveal>

          <Reveal delay={0.1}>
            {about.body.map((paragraph) => (
              <p
                key={paragraph}
                className="mb-6 text-base leading-[1.85] text-[var(--kite-paper-soft)] last:mb-0"
              >
                {paragraph}
              </p>
            ))}

            <ul className="mt-10 space-y-4 border-t border-[var(--kite-line)] pt-8">
              {about.points.map((point) => (
                <li key={point} className="flex items-start gap-4 text-[15px]">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-[var(--kite-acid)]"
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-[var(--kite-line)] bg-[var(--kite-void-deep)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <p className="kite-eyebrow">{KITE_STUDIO_PAGE.valuesEyebrow}</p>
            <h2 className="kite-display-sm mt-6 max-w-2xl">{KITE_STUDIO_PAGE.valuesTitle}</h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {KITE_STUDIO_PAGE.values.map((value, index) => {
              const Icon = KITE_VALUE_ICONS[index] ?? KITE_VALUE_ICONS[0];
              return (
                <Reveal key={value.title} delay={(index % 2) * 0.08}>
                  <div className="kite-panel h-full px-8 py-9 sm:px-10 sm:py-11">
                    <div className="flex items-center gap-4">
                      <Icon className="h-5 w-5 text-[var(--kite-magenta)]" aria-hidden />
                      <span
                        className="kite-figures text-sm font-semibold text-[var(--kite-paper-faint)]"
                        aria-hidden
                      >
                        {`0${index + 1}`}
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-bold leading-snug tracking-[-0.02em]">
                      {value.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-[1.8] text-[var(--kite-paper-soft)]">
                      {value.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
