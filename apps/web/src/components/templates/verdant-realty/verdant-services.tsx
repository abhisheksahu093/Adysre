'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './verdant-reveal';

/**
 * VERDANT - what the agency does. Lives on the about page rather than the home
 * page: a visitor arriving at a realty site wants houses first, and the method
 * matters once they are considering instructing.
 */
export function VerdantServices({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section className="border-y border-[var(--verdant-rule)] bg-[var(--verdant-sand-warm)]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal className="max-w-2xl">
          <p className="verdant-eyebrow">{services.eyebrow}</p>
          <span className="verdant-rule mt-4" aria-hidden />
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            {services.title}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--verdant-ink-soft)]">
            {services.subtitle}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {services.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.06 * index}>
                <div className="border-t border-[var(--verdant-rule-strong)] pt-6">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--verdant-rule)] bg-[var(--verdant-sand)]">
                    <Icon className="h-5 w-5 text-[var(--verdant-forest)]" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em]">{item.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--verdant-ink-soft)]">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
