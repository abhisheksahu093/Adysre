'use client';

import { useId, useState } from 'react';

/**
 * Live preview for `accordion-nested`.
 *
 * Mirrors the `typescript` code variant verbatim: outer questions in h3, inner
 * ones in h4, with outer and child open state tracked separately.
 * Keep this in step with `src/data/components/faq.ts`.
 */
interface NestedFaqChild {
  id: string;
  question: string;
  answer: string;
}

interface NestedFaqItem {
  id: string;
  question: string;
  children: NestedFaqChild[];
}

interface AccordionNestedProps {
  items: NestedFaqItem[];
  defaultOpenId?: string;
  className?: string;
}

function AccordionNested({ items, defaultOpenId, className = '' }: AccordionNestedProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const [openChildId, setOpenChildId] = useState<string | null>(null);

  return (
    <div className={`w-full ${className}`}>
      {items.map((item: NestedFaqItem) => {
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
                className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-base font-semibold text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
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
              <div className="mb-3 ml-3 border-l-2 border-gray-200 pl-3 dark:border-gray-800">
                {item.children.map((child: NestedFaqChild, index: number) => {
                  const isChildOpen = openChildId === child.id;
                  const childButtonId = `${baseId}-${child.id}-button`;
                  const childPanelId = `${baseId}-${child.id}-panel`;

                  return (
                    <div
                      key={child.id}
                      className={index > 0 ? 'border-t border-gray-100 dark:border-gray-900' : ''}
                    >
                      {/* h4, not h3: the inner level must not skip a heading rank. */}
                      <h4 className="m-0">
                        <button
                          type="button"
                          id={childButtonId}
                          aria-expanded={isChildOpen}
                          aria-controls={childPanelId}
                          onClick={() => setOpenChildId(isChildOpen ? null : child.id)}
                          className="flex w-full items-center justify-between gap-4 px-1 py-2.5 text-left text-sm font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400"
                        >
                          {child.question}
                          <svg
                            className={`h-4 w-4 flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 ${isChildOpen ? 'rotate-180' : ''}`}
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </h4>

                      <div
                        id={childPanelId}
                        role="region"
                        aria-labelledby={childButtonId}
                        hidden={!isChildOpen}
                      >
                        <p className="px-1 pb-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {child.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SAMPLE_ITEMS: NestedFaqItem[] = [
  {
    id: 'billing',
    question: 'Billing',
    children: [
      {
        id: 'vat',
        question: 'Do prices include VAT?',
        answer:
          'Prices are shown excluding VAT. The correct rate is added at checkout based on your billing country.',
      },
      {
        id: 'invoice',
        question: 'Can I pay by invoice?',
        answer: 'Annual plans over ten seats can be invoiced on net-30 terms. Contact sales to switch.',
      },
    ],
  },
  {
    id: 'security',
    question: 'Security',
    children: [
      {
        id: 'encryption',
        question: 'Is data encrypted at rest?',
        answer:
          'Yes - AES-256 at rest and TLS 1.3 in transit, with keys rotated automatically every 90 days.',
      },
    ],
  },
];

export default function AccordionNestedPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <AccordionNested items={SAMPLE_ITEMS} defaultOpenId="billing" />
      </div>
    </section>
  );
}
