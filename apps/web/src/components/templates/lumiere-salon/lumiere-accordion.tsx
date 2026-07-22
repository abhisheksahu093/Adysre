'use client';

import { useState } from 'react';

/**
 * LUMIERE - the accordion, used by the FAQ and by the product's detail panel.
 *
 * One implementation because both need the same accessible contract: a real
 * `<button>` inside a heading, `aria-expanded` reflecting state, `aria-controls`
 * pointing at the region it opens, and a `0fr -> 1fr` grid transition rather than
 * a measured pixel height, which cannot desynchronise when the text reflows.
 *
 * `headingLevel` is a prop because the FAQ sits under an `h2` while the product
 * detail sits under an `h3` - the markup must not skip a level.
 */
export function LumiereAccordion({
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
    <div className="lumi-panel overflow-hidden px-7 sm:px-10">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${idPrefix}-panel-${index}`;
        const buttonId = `${idPrefix}-button-${index}`;
        const last = index === items.length - 1;

        return (
          <div
            key={item.title}
            className={last ? '' : 'border-b border-[var(--lumi-rule)]'}
          >
            <Heading>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-baseline justify-between gap-8 py-6 text-left transition-colors hover:text-[var(--lumi-accent-deep)]"
              >
                <span className="lumi-subtitle">{item.title}</span>
                <span
                  aria-hidden
                  className={`shrink-0 text-[22px] leading-none text-[var(--lumi-accent-deep)] transition-transform duration-700 ${
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
              className={`grid transition-all duration-700 ease-out ${
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 pr-6 text-[15px] leading-[1.85] text-[var(--lumi-ink-soft)]">
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
