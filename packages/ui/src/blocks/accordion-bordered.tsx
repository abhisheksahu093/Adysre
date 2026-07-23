'use client';

import { useId, useState } from 'react';

/**
 * Live preview for `accordion-bordered`.
 *
 * Mirrors the `typescript` code variant verbatim: one outlined container,
 * dividers between rows, single answer open at a time.
 * Keep this in step with `src/data/components/faq.ts`.
 */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionBorderedProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionBordered({ items, defaultOpenId, className = '' }: AccordionBorderedProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div
      className={`w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-950 ${className}`}
    >
      {items.map((item: FaqItem) => {
        const isOpen = openId === item.id;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id}>
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400"
              >
                {item.question}
                <svg
                  className={`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </h3>

            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="px-4 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SAMPLE_ITEMS: FaqItem[] = [
  {
    id: 'seats',
    question: 'How many seats are included?',
    answer:
      'Every workspace starts with five seats. Extra seats are billed pro rata for the rest of the period.',
  },
  {
    id: 'sso',
    question: 'Do you support SSO?',
    answer:
      'SAML and OIDC are available on Business and Enterprise plans, with SCIM provisioning on Enterprise.',
  },
  {
    id: 'region',
    question: 'Where is my data stored?',
    answer:
      'In the region you pick at signup - currently Frankfurt, Virginia or Sydney. Data never leaves it.',
  },
];

export default function AccordionBorderedPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <AccordionBordered items={SAMPLE_ITEMS} defaultOpenId="seats" />
      </div>
    </section>
  );
}
