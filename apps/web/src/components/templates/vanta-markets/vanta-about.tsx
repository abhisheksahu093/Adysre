'use client';

import { Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - the founding story.
 *
 * Two narrow measure columns rather than one wide one, because the paragraphs
 * are the only long-form prose in the template and a 70ch line under a 120px
 * headline reads as an afterthought.
 */
export function VantaAbout({ content }: { content: TemplateContent }) {
  const { about } = content;

  return (
    <section className="border-t border-[var(--vanta-line)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="vanta-eyebrow">{about.eyebrow}</p>
            <span className="vanta-rule mt-5" aria-hidden />
            <h2 className="vanta-display-sm mt-7 text-balance">{about.title}</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-6">
              {about.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-pretty text-[15px] leading-[1.9] text-[var(--vanta-muted)] sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="mt-10 grid gap-px overflow-hidden rounded-[var(--vanta-radius-sm)] border border-[var(--vanta-line)] bg-[var(--vanta-line)]">
              {about.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 bg-[var(--vanta-ink)] px-5 py-4 text-[15px] text-[var(--vanta-text)]"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--vanta-up)]" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
