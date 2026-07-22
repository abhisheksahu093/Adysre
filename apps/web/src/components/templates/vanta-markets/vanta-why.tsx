'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - the four claims the firm can be measured on.
 *
 * Numbered rather than iconified in the corner, because each of these is an
 * argument and the sequence matters; the icon stays as a quiet mark beside it.
 */
export function VantaWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section className="border-t border-[var(--vanta-line)] bg-[var(--vanta-ink-deep)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <p className="vanta-eyebrow">{why.eyebrow}</p>
            <span className="vanta-rule mt-5" aria-hidden />
            <h2 className="vanta-display-sm mt-7 text-balance">{why.title}</h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.9] text-[var(--vanta-muted)]">
              {why.subtitle}
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {why.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <article className="vanta-card h-full p-7 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <item.icon className="h-5 w-5 text-[var(--vanta-up)]" aria-hidden />
                    <span className="vanta-mono text-[13px] text-[var(--vanta-faint)]">
                      {`0${index + 1}`}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em]">{item.title}</h3>
                  <p className="mt-4 text-[15px] leading-[1.8] text-[var(--vanta-muted)]">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
