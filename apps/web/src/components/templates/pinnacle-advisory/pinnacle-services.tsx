'use client';

import { ArrowRight } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { PINNACLE_LABELS } from '@/data/templates/pinnacle-advisory-content';
import { Reveal } from './pinnacle-reveal';
import { pinnacleHref } from './pinnacle-links';

/**
 * PINNACLE - the six practices, as a card grid.
 *
 * Cards lift 4px on hover and nothing else moves: at a 40px radius the shape is
 * already doing the work, and a scale or a colour flood would cheapen it. The
 * stagger is by index so the grid fills diagonally rather than all at once.
 */
export function PinnacleServices({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-[80rem]">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="pin-eyebrow">{services.eyebrow}</p>
            <h2 className="pin-h2 mt-6">{services.title}</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="pin-body text-[var(--pin-text-muted)] lg:pb-2">{services.subtitle}</p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item, index) => (
            <li key={item.title} className="h-full">
              <Reveal delay={(index % 3) * 0.07} className="h-full">
                <div className="pin-card h-full p-8 sm:p-9">
                  <span className="pin-icon-well">
                    <item.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="pin-h3 mt-7">{item.title}</h3>
                  <p className="pin-body mt-4 text-[0.9375rem] text-[var(--pin-text-muted)]">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.14}>
          <div className="mt-12 flex justify-center">
            <a href={pinnacleHref('expertise')} className="pin-btn pin-btn-secondary inline-flex">
              {PINNACLE_LABELS.servicesMore}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
