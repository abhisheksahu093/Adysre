'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './meridian-reveal';

/**
 * MERIDIAN - FAQ accordion.
 *
 * Open/closed is real state on a real <button> carrying `aria-expanded`, and
 * the answer expands via `grid-template-rows: 0fr -> 1fr`, which transitions
 * smoothly without measuring height or pinning the panel to a fixed size.
 */
export function MeridianFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;
  // The first answer is open on load: a firm's billing question is the one
  // every visitor came for, so it should not need a click.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-[var(--mer-rule)] bg-[var(--mer-ivory-2)]">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10 sm:py-28">
        <Reveal className="text-center">
          <p className="mer-eyebrow">{faq.eyebrow}</p>
          <h2 className="mer-display mt-5 text-balance text-3xl sm:text-4xl">{faq.title}</h2>
          <div className="mt-6 flex justify-center">
            <span className="mer-hairline" aria-hidden />
          </div>
        </Reveal>

        <div className="mt-14 border-t border-[var(--mer-rule)]">
          {faq.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `meridian-faq-panel-${index}`;
            return (
              <div key={item.question} className="border-b border-[var(--mer-rule)]">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-start justify-between gap-8 py-6 text-left transition-colors hover:text-[var(--mer-gold-ink)]"
                  >
                    <span className="mer-display text-lg leading-snug">{item.question}</span>
                    <Plus
                      className={`mt-1 h-4 w-4 shrink-0 text-[var(--mer-gold-ink)] transition-transform duration-300 ${
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
                    <p className="pb-7 pr-10 text-[14px] leading-[1.9] text-[var(--mer-ink-soft)]">
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
