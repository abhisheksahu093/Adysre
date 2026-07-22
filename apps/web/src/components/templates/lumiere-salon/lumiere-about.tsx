'use client';

import { Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { LumiereSectionHeading } from './lumiere-section-heading';
import { Reveal } from './lumiere-reveal';

/**
 * LUMIERE - the house story.
 *
 * Two paragraphs beside a stack of three arches, which is the only place in the
 * template where the arch appears purely as ornament rather than as a frame for
 * something. It earns its place by giving the section a silhouette a full-bleed
 * photograph would otherwise have provided.
 */
export function LumiereAbout({ content }: { content: TemplateContent }) {
  const { about } = content;

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
      <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <LumiereSectionHeading eyebrow={about.eyebrow} title={about.title} />

          <Reveal delay={0.08}>
            <div className="mt-8 space-y-6">
              {about.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="max-w-xl text-[17px] leading-[1.85] text-[var(--lumi-ink-soft)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="mt-10 space-y-4">
              {about.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--lumi-accent-soft)]"
                  >
                    <Check className="h-3.5 w-3.5 text-[var(--lumi-accent-deep)]" />
                  </span>
                  <span className="text-[15px] leading-[1.7]">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Ornament only, so the whole column is hidden from assistive tech. */}
        <Reveal delay={0.16} className="hidden lg:block">
          <div aria-hidden className="grid grid-cols-2 gap-5">
            <div className="lumi-arch lumi-arch--petal h-72" />
            <div className="lumi-arch lumi-arch--bloom mt-14 h-72" />
            <div className="lumi-arch lumi-arch--wave col-span-2 h-40" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
