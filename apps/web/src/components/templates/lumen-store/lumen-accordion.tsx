'use client';

import { useState } from 'react';

/**
 * LUMEN - the accordion, used by the FAQ and by the product specification.
 *
 * One implementation because both need the same accessible contract: a real
 * `<button>` inside the heading, `aria-expanded` reflecting state, `aria-controls`
 * pointing at the region it opens, and a `0fr -> 1fr` grid transition rather than
 * a measured pixel height, which cannot desynchronise when the text reflows.
 *
 * `headingLevel` is a prop because the FAQ sits under an `h2` while the product
 * specification sits under an `h3` - the markup must not skip a level.
 */
export function LumenAccordion({
  items,
  idPrefix,
  headingLevel = 'h3',
  defaultOpen = 0,
}: {
  items: { title: string; body: string }[];
  idPrefix: string;
  headingLevel?: 'h3' | 'h4';
  defaultOpen?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const Heading = headingLevel;

  return (
    <div className="border-t border-[var(--lum-rule)]">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${idPrefix}-panel-${index}`;
        const buttonId = `${idPrefix}-button-${index}`;

        return (
          <div key={item.title} className="border-b border-[var(--lum-rule)]">
            <Heading>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-baseline justify-between gap-8 py-5 text-left transition-colors hover:text-[var(--lum-accent-deep)]"
              >
                <span className="text-[17px] font-medium tracking-[-0.01em]">{item.title}</span>
                <span
                  aria-hidden
                  className={`shrink-0 text-[var(--lum-accent-deep)] transition-transform duration-500 ${
                    open ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
            </Heading>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-all duration-500 ease-out ${
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pr-8 text-[15px] leading-[1.8] text-[var(--lum-ink-soft)]">
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
