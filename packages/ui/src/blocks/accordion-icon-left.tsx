'use client';

import { useId, useState } from 'react';

/**
 * Live preview for `accordion-icon-left`.
 *
 * Mirrors the `typescript` code variant verbatim: chevron leads the label and
 * rotates from right to down, answers indented to line up with the question.
 * Keep this in step with `src/data/components/faq.ts`.
 */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionIconLeftProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionIconLeft({ items, defaultOpenId, className = '' }: AccordionIconLeftProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={`w-full ${className}`}>
      {items.map((item: FaqItem) => {
        const isOpen = openId === item.id;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center gap-2.5 px-1 py-4 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                <svg
                  className={`h-4 w-4 flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 ${isOpen ? 'rotate-90' : ''}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m7.5 5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item.question}
              </button>
            </h3>

            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="pb-4 pl-[1.875rem] pr-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SAMPLE_ITEMS: FaqItem[] = [
  {
    id: 'api',
    question: 'Do you have a public API?',
    answer:
      'Yes - a REST API and webhooks on every plan, with a rate limit of 1,000 requests per minute.',
  },
  {
    id: 'sdks',
    question: 'Are there client libraries?',
    answer:
      'We publish official SDKs for TypeScript, Python, Go and Ruby, all generated from the same OpenAPI spec.',
  },
  {
    id: 'keys',
    question: 'How do I rotate an API key?',
    answer:
      'Create a second key in Settings, deploy it, then revoke the old one. Both stay valid until you revoke.',
  },
];

export default function AccordionIconLeftPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <AccordionIconLeft items={SAMPLE_ITEMS} defaultOpenId="api" />
      </div>
    </section>
  );
}
