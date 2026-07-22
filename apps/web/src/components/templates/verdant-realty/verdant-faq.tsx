'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './verdant-reveal';

/**
 * VERDANT - FAQ accordion.
 *
 * Open state is real state on a real `<button>` with `aria-expanded`, and the
 * answer animates via `grid-template-rows: 0fr -> 1fr`, which transitions
 * smoothly without measuring height or pinning the panel to a fixed size.
 */
export function VerdantFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 border-t border-[var(--verdant-rule)]">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="verdant-eyebrow">{faq.eyebrow}</p>
          <span className="verdant-rule mt-4" aria-hidden />
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            {faq.title}
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-[var(--verdant-rule)] border-y border-[var(--verdant-rule)]">
          {faq.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `verdant-faq-panel-${index}`;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-[var(--verdant-brass)]"
                  >
                    <span className="text-[15px] font-medium sm:text-base">{item.question}</span>
                    <Plus
                      className={`h-4 w-4 shrink-0 text-[var(--verdant-ink-faint)] transition-transform duration-300 ${
                        open ? 'rotate-45' : ''
                      }`}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  className={`grid transition-all duration-300 ease-out ${
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-8 text-[15px] leading-relaxed text-[var(--verdant-ink-soft)]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
