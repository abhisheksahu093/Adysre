import type { ComponentEntry } from './types';

/**
 * FAQ category.
 *
 * Two honest implementations rather than one pattern forced into six tabs: the
 * html/css/tailwind trio uses native `<details name="faq">`, which is keyboard
 * operable and exclusive with zero JavaScript, while the React tabs use the
 * disclosure pattern (`button` + `aria-expanded` + `aria-controls`) because
 * that's what integrates with client state.
 */
export const faqComponents: ComponentEntry[] = [
  {
    slug: 'faq-accordion',
    category: 'faq',
    tags: ['faq', 'accordion', 'disclosure', 'collapse', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-22',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.3.0',
    featured: true,
    stats: { views: 1975, copies: 431, downloads: 127 },
    variants: [
      { id: 'single', labelKey: 'single' },
      { id: 'multiple', labelKey: 'multiple' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      {
        name: 'items',
        type: 'FaqItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'billing', question: '…', answer: '…' }]",
      },
      { name: 'allowMultiple', type: 'boolean', default: 'false', descriptionKey: 'allowMultiple' },
      { name: 'defaultOpenId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  <details name="faq"> gives an exclusive accordion natively: keyboard operable,
  screen-reader announced, and open by default for print and no-JS.
-->
<div class="faq">
  <h2 class="faq__heading">Frequently asked questions</h2>

  <details class="faq__item" name="faq" open>
    <summary class="faq__question">
      Can I change my plan later?
      <svg class="faq__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="faq__answer">
      <p>Yes. Upgrades apply immediately and downgrades take effect at the end of the current billing period.</p>
    </div>
  </details>

  <details class="faq__item" name="faq">
    <summary class="faq__question">
      Do you offer refunds?
      <svg class="faq__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="faq__answer">
      <p>We refund any annual plan in full within 30 days of purchase, no questions asked.</p>
    </div>
  </details>

  <details class="faq__item" name="faq">
    <summary class="faq__question">
      Is there a free tier?
      <svg class="faq__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="faq__answer">
      <p>Yes - the free tier includes three projects and never expires. No card required.</p>
    </div>
  </details>
</div>`,
      css: `.faq {
  max-width: 42rem;
}

.faq__heading {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.faq__item {
  border-bottom: 1px solid #e5e7eb;
}

.faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  list-style: none;
}

/* Suppress the native disclosure triangle in both engines. */
.faq__question::-webkit-details-marker {
  display: none;
}

.faq__question:hover {
  color: #2563eb;
}

.faq__question:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

.faq__icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #6b7280;
  transition: transform 200ms ease;
}

.faq__item[open] .faq__icon {
  transform: rotate(180deg);
}

.faq__answer {
  padding: 0 0.25rem 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
  animation: faq-reveal 200ms ease;
}

.faq__answer p {
  margin: 0;
}

@keyframes faq-reveal {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .faq__icon { transition: none; }
  .faq__answer { animation: none; }
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 */
@media (prefers-color-scheme: dark) {
  .faq__heading,
  .faq__question {
    color: #f3f4f6;
  }

  .faq__item {
    border-bottom-color: #1f2937;
  }

  .faq__question:hover {
    color: #60a5fa;
  }

  .faq__question:focus-visible {
    outline-color: #60a5fa;
  }

  .faq__icon {
    color: #9ca3af;
  }

  .faq__answer {
    color: #9ca3af;
  }
}`,
      tailwind: `<!--
  The chevron rotation uses the group-open: variant on <details>, and the
  motion-reduce: variant keeps it still for reduced-motion users.
-->
<div class="max-w-2xl">
  <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Frequently asked questions</h2>

  <details class="group border-b border-gray-200 dark:border-gray-800" name="faq" open>
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      Can I change my plan later?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      Yes. Upgrades apply immediately and downgrades take effect at the end of the current billing period.
    </p>
  </details>

  <details class="group border-b border-gray-200 dark:border-gray-800" name="faq">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      Do you offer refunds?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      We refund any annual plan in full within 30 days of purchase, no questions asked.
    </p>
  </details>

  <details class="group border-b border-gray-200 dark:border-gray-800" name="faq">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      Is there a free tier?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      Yes - the free tier includes three projects and never expires. No card required.
    </p>
  </details>
</div>`,
      react: `import { useId, useState } from 'react';

export function FaqAccordion({ items, allowMultiple = false, defaultOpenId, className = '' }) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState(() => (defaultOpenId ? [defaultOpenId] : []));

  function toggle(id) {
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((openId) => openId !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                {item.question}
                <svg
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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

            {/* hidden (not unmounted) keeps the panel findable by in-page search. */}
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
}

export function FaqAccordion({
  items,
  allowMultiple = false,
  defaultOpenId,
  className = '',
}: FaqAccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>(() => (defaultOpenId ? [defaultOpenId] : []));

  function toggle(id: string): void {
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((openId) => openId !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                {item.question}
                <svg
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
              <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
      typescript: `import { useId, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
}

export function FaqAccordion({
  items,
  allowMultiple = false,
  defaultOpenId,
  className = '',
}: FaqAccordionProps): JSX.Element {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>(() => (defaultOpenId ? [defaultOpenId] : []));

  const toggle = (id: string): void => {
    setOpenIds((current: string[]) => {
      if (current.includes(id)) return current.filter((openId) => openId !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item: FaqItem) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                {item.question}
                <svg
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
              <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
    },
  },

  {
    slug: 'accordion-multi-open',
    category: 'faq',
    tags: ['accordion', 'faq', 'multiple', 'disclosure', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-04-08',
    updatedAt: '2026-06-30',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 812, copies: 164, downloads: 41 },
    variants: [
      { id: 'multiple', labelKey: 'multiple' },
      { id: 'default', labelKey: 'default' },
    ],
    props: [
      {
        name: 'items',
        type: 'FaqItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'delivery', question: '…', answer: '…' }]",
      },
      { name: 'defaultOpenIds', type: 'string[]', default: '[]', descriptionKey: 'defaultOpenIds' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Multi-open: plain <details> elements with NO shared name attribute are
  independent, so opening one never closes another. The exclusive single-open
  behaviour is what <details name="…"> opts into - leaving it off is the whole
  difference. Expand all / Collapse all is a JS affordance; see the React tabs.
-->
<div class="acc-multi">
  <details class="acc-multi__item" open>
    <summary class="acc-multi__question">
      How long does delivery take?
      <svg class="acc-multi__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-multi__answer">
      <p>Standard delivery arrives in 3-5 working days. Express orders placed before 2pm ship the same day.</p>
    </div>
  </details>

  <details class="acc-multi__item" open>
    <summary class="acc-multi__question">
      Can I track my order?
      <svg class="acc-multi__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-multi__answer">
      <p>Every shipment gets a tracking link by email the moment it leaves our warehouse.</p>
    </div>
  </details>

  <details class="acc-multi__item">
    <summary class="acc-multi__question">
      What is your returns window?
      <svg class="acc-multi__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-multi__answer">
      <p>Send anything back within 60 days of delivery and we cover the return postage.</p>
    </div>
  </details>
</div>`,
      css: `.acc-multi {
  max-width: 42rem;
}

.acc-multi__item {
  border-bottom: 1px solid #e5e7eb;
}

.acc-multi__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  list-style: none;
}

.acc-multi__question::-webkit-details-marker {
  display: none;
}

.acc-multi__question:hover {
  color: #2563eb;
}

.acc-multi__question:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

.acc-multi__icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #6b7280;
  transition: transform 200ms ease;
}

.acc-multi__item[open] .acc-multi__icon {
  transform: rotate(180deg);
}

.acc-multi__answer {
  padding: 0 0.25rem 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.acc-multi__answer p {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .acc-multi__icon {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .acc-multi__item {
    border-bottom-color: #1f2937;
  }

  .acc-multi__question {
    color: #f3f4f6;
  }

  .acc-multi__question:hover {
    color: #60a5fa;
  }

  .acc-multi__question:focus-visible {
    outline-color: #60a5fa;
  }

  .acc-multi__icon {
    color: #9ca3af;
  }

  .acc-multi__answer {
    color: #d1d5db;
  }
}`,
      tailwind: `<!-- No name attribute => every panel is independent, so any number can be open. -->
<div class="max-w-2xl">
  <details class="group border-b border-gray-200 dark:border-gray-800" open>
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      How long does delivery take?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Standard delivery arrives in 3-5 working days. Express orders placed before 2pm ship the same day.
    </p>
  </details>

  <details class="group border-b border-gray-200 dark:border-gray-800" open>
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      Can I track my order?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Every shipment gets a tracking link by email the moment it leaves our warehouse.
    </p>
  </details>

  <details class="group border-b border-gray-200 dark:border-gray-800">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      What is your returns window?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Send anything back within 60 days of delivery and we cover the return postage.
    </p>
  </details>
</div>`,
      react: `import { useId, useState } from 'react';

export function AccordionMultiOpen({ items, defaultOpenIds = [], className = '' }) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState(() => new Set(defaultOpenIds));
  const allOpen = openIds.size === items.length;

  function toggle(id) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setOpenIds(allOpen ? new Set() : new Set(items.map((item) => item.id)));
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex justify-end pb-1">
        <button
          type="button"
          onClick={toggleAll}
          className="inline-flex min-h-10 items-center rounded-md px-2.5 text-xs font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-blue-950 dark:focus-visible:ring-blue-400"
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                {item.question}
                <svg
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
              <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionMultiOpenProps {
  items: FaqItem[];
  defaultOpenIds?: string[];
  className?: string;
}

export function AccordionMultiOpen({
  items,
  defaultOpenIds = [],
  className = '',
}: AccordionMultiOpenProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(defaultOpenIds));
  const allOpen = openIds.size === items.length;

  function toggle(id: string): void {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll(): void {
    setOpenIds(allOpen ? new Set() : new Set(items.map((item) => item.id)));
  }

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex justify-end pb-1">
        <button
          type="button"
          onClick={toggleAll}
          className="inline-flex min-h-10 items-center rounded-md px-2.5 text-xs font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-blue-950 dark:focus-visible:ring-blue-400"
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                {item.question}
                <svg
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
              <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
      typescript: `import { useId, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionMultiOpenProps {
  items: FaqItem[];
  defaultOpenIds?: string[];
  className?: string;
}

export function AccordionMultiOpen({
  items,
  defaultOpenIds = [],
  className = '',
}: AccordionMultiOpenProps): JSX.Element {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(defaultOpenIds));
  const allOpen = openIds.size === items.length;

  const toggle = (id: string): void => {
    setOpenIds((current: Set<string>) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = (): void => {
    setOpenIds(allOpen ? new Set<string>() : new Set(items.map((item: FaqItem) => item.id)));
  };

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <div className="flex justify-end pb-1">
        <button
          type="button"
          onClick={toggleAll}
          className="inline-flex min-h-10 items-center rounded-md px-2.5 text-xs font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-blue-950 dark:focus-visible:ring-blue-400"
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {items.map((item: FaqItem) => {
        const isOpen = openIds.has(item.id);
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                {item.question}
                <svg
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
              <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
    },
  },

  {
    slug: 'accordion-bordered',
    category: 'faq',
    tags: ['accordion', 'faq', 'bordered', 'outlined', 'disclosure'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-21',
    updatedAt: '2026-06-12',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 654, copies: 141, downloads: 33 },
    variants: [
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'single', labelKey: 'single' },
    ],
    props: [
      {
        name: 'items',
        type: 'FaqItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'seats', question: '…', answer: '…' }]",
      },
      { name: 'defaultOpenId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  One outlined container, hairline dividers between rows. The rounded corners
  live on the container, so the first and last rows clip correctly without any
  per-row corner rules.
-->
<div class="acc-bordered">
  <details class="acc-bordered__item" name="acc-bordered" open>
    <summary class="acc-bordered__question">
      How many seats are included?
      <svg class="acc-bordered__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-bordered__answer">
      <p>Every workspace starts with five seats. Extra seats are billed pro rata for the rest of the period.</p>
    </div>
  </details>

  <details class="acc-bordered__item" name="acc-bordered">
    <summary class="acc-bordered__question">
      Do you support SSO?
      <svg class="acc-bordered__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-bordered__answer">
      <p>SAML and OIDC are available on Business and Enterprise plans, with SCIM provisioning on Enterprise.</p>
    </div>
  </details>

  <details class="acc-bordered__item" name="acc-bordered">
    <summary class="acc-bordered__question">
      Where is my data stored?
      <svg class="acc-bordered__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-bordered__answer">
      <p>In the region you pick at signup - currently Frankfurt, Virginia or Sydney. Data never leaves it.</p>
    </div>
  </details>
</div>`,
      css: `.acc-bordered {
  max-width: 42rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #ffffff;
}

.acc-bordered__item + .acc-bordered__item {
  border-top: 1px solid #e5e7eb;
}

.acc-bordered__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  list-style: none;
}

.acc-bordered__question::-webkit-details-marker {
  display: none;
}

.acc-bordered__question:hover {
  color: #2563eb;
}

.acc-bordered__question:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}

.acc-bordered__icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #6b7280;
  transition: transform 200ms ease;
}

.acc-bordered__item[open] .acc-bordered__icon {
  transform: rotate(180deg);
}

.acc-bordered__answer {
  padding: 0 1rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.acc-bordered__answer p {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .acc-bordered__icon {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .acc-bordered {
    border-color: #1f2937;
    background-color: #030712;
  }

  .acc-bordered__item + .acc-bordered__item {
    border-top-color: #1f2937;
  }

  .acc-bordered__question {
    color: #f3f4f6;
  }

  .acc-bordered__question:hover {
    color: #60a5fa;
  }

  .acc-bordered__question:focus-visible {
    outline-color: #60a5fa;
  }

  .acc-bordered__icon {
    color: #9ca3af;
  }

  .acc-bordered__answer {
    color: #d1d5db;
  }
}`,
      tailwind: `<!-- divide-y draws the dividers; overflow-hidden clips the rows to the radius. -->
<div class="max-w-2xl divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-950">
  <details class="group" name="acc-bordered" open>
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
      How many seats are included?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-4 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Every workspace starts with five seats. Extra seats are billed pro rata for the rest of the period.
    </p>
  </details>

  <details class="group" name="acc-bordered">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
      Do you support SSO?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-4 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      SAML and OIDC are available on Business and Enterprise plans, with SCIM provisioning on Enterprise.
    </p>
  </details>

  <details class="group" name="acc-bordered">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
      Where is my data stored?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-4 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      In the region you pick at signup - currently Frankfurt, Virginia or Sydney. Data never leaves it.
    </p>
  </details>
</div>`,
      react: `import { useId, useState } from 'react';

export function AccordionBordered({ items, defaultOpenId, className = '' }) {
  const baseId = useId();
  const [openId, setOpenId] = useState(defaultOpenId ?? null);

  return (
    <div
      className={\`max-w-2xl divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-950 \${className}\`}
    >
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

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
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
}`,
      nextjs: `'use client';

import { useId, useState } from 'react';

export interface FaqItem {
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
      className={\`max-w-2xl divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-950 \${className}\`}
    >
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

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
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
}`,
      typescript: `import { useId, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionBorderedProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionBordered({
  items,
  defaultOpenId,
  className = '',
}: AccordionBorderedProps): JSX.Element {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div
      className={\`max-w-2xl divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-950 \${className}\`}
    >
      {items.map((item: FaqItem) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

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
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
}`,
    },
  },

  {
    slug: 'accordion-separated',
    category: 'faq',
    tags: ['accordion', 'faq', 'card', 'separated', 'stacked'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-04',
    updatedAt: '2026-06-18',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 731, copies: 158, downloads: 44 },
    variants: [
      { id: 'card', labelKey: 'card' },
      { id: 'multiple', labelKey: 'multiple' },
    ],
    props: [
      {
        name: 'items',
        type: 'FaqItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'setup', question: '…', answer: '…' }]",
      },
      { name: 'allowMultiple', type: 'boolean', default: 'true', descriptionKey: 'allowMultiple' },
      { name: 'defaultOpenId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Each question is its own detached card with a gap between them, so there are
  no dividers at all - the whitespace does the separating.
-->
<div class="acc-sep">
  <details class="acc-sep__item" open>
    <summary class="acc-sep__question">
      How long does setup take?
      <svg class="acc-sep__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-sep__answer">
      <p>Most teams are importing data within an hour. The guided setup walks you through it step by step.</p>
    </div>
  </details>

  <details class="acc-sep__item">
    <summary class="acc-sep__question">
      Can I migrate from another tool?
      <svg class="acc-sep__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-sep__answer">
      <p>Yes. We import CSV exports from every major competitor, and our team will run the migration for you on annual plans.</p>
    </div>
  </details>

  <details class="acc-sep__item">
    <summary class="acc-sep__question">
      Is training included?
      <svg class="acc-sep__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-sep__answer">
      <p>Every plan includes live onboarding sessions and unlimited access to the course library.</p>
    </div>
  </details>
</div>`,
      css: `.acc-sep {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 42rem;
}

.acc-sep__item {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
}

.acc-sep__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  list-style: none;
}

.acc-sep__question::-webkit-details-marker {
  display: none;
}

.acc-sep__question:hover {
  color: #2563eb;
}

.acc-sep__question:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
  border-radius: 0.75rem;
}

.acc-sep__icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #6b7280;
  transition: transform 200ms ease;
}

.acc-sep__item[open] .acc-sep__icon {
  transform: rotate(180deg);
}

.acc-sep__answer {
  padding: 0 1rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.acc-sep__answer p {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .acc-sep__icon {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .acc-sep__item {
    border-color: #1f2937;
    background-color: #030712;
    box-shadow: none;
  }

  .acc-sep__question {
    color: #f3f4f6;
  }

  .acc-sep__question:hover {
    color: #60a5fa;
  }

  .acc-sep__question:focus-visible {
    outline-color: #60a5fa;
  }

  .acc-sep__icon {
    color: #9ca3af;
  }

  .acc-sep__answer {
    color: #d1d5db;
  }
}`,
      tailwind: `<!-- space-y-3 between detached cards; no name attribute, so cards open independently. -->
<div class="max-w-2xl space-y-3">
  <details class="group rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:shadow-none" open>
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
      How long does setup take?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-4 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Most teams are importing data within an hour. The guided setup walks you through it step by step.
    </p>
  </details>

  <details class="group rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
      Can I migrate from another tool?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-4 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Yes. We import CSV exports from every major competitor, and our team will run the migration for you on annual plans.
    </p>
  </details>

  <details class="group rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
      Is training included?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-4 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Every plan includes live onboarding sessions and unlimited access to the course library.
    </p>
  </details>
</div>`,
      react: `import { useId, useState } from 'react';

export function AccordionSeparated({
  items,
  allowMultiple = true,
  defaultOpenId,
  className = '',
}) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState(() => (defaultOpenId ? [defaultOpenId] : []));

  function toggle(id) {
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((openId) => openId !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  }

  return (
    <div className={\`max-w-2xl space-y-3 \${className}\`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:shadow-none"
          >
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400"
              >
                {item.question}
                <svg
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
}`,
      nextjs: `'use client';

import { useId, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionSeparatedProps {
  items: FaqItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
}

export function AccordionSeparated({
  items,
  allowMultiple = true,
  defaultOpenId,
  className = '',
}: AccordionSeparatedProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>(() => (defaultOpenId ? [defaultOpenId] : []));

  function toggle(id: string): void {
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((openId) => openId !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  }

  return (
    <div className={\`max-w-2xl space-y-3 \${className}\`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:shadow-none"
          >
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400"
              >
                {item.question}
                <svg
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
}`,
      typescript: `import { useId, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionSeparatedProps {
  items: FaqItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
}

export function AccordionSeparated({
  items,
  allowMultiple = true,
  defaultOpenId,
  className = '',
}: AccordionSeparatedProps): JSX.Element {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>(() => (defaultOpenId ? [defaultOpenId] : []));

  const toggle = (id: string): void => {
    setOpenIds((current: string[]) => {
      if (current.includes(id)) return current.filter((openId) => openId !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  };

  return (
    <div className={\`max-w-2xl space-y-3 \${className}\`}>
      {items.map((item: FaqItem) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:shadow-none"
          >
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400"
              >
                {item.question}
                <svg
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
}`,
    },
  },

  {
    slug: 'accordion-icon-left',
    category: 'faq',
    tags: ['accordion', 'faq', 'icon', 'chevron', 'disclosure'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-19',
    updatedAt: '2026-06-24',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 498, copies: 97, downloads: 22 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'single', labelKey: 'single' },
    ],
    props: [
      {
        name: 'items',
        type: 'FaqItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'api', question: '…', answer: '…' }]",
      },
      { name: 'defaultOpenId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Chevron on the LEFT: it points right when closed and rotates down when open,
  so the arrow reads as "this expands" rather than as a dropdown marker. The
  answer is indented to line up with the label, not the icon.
-->
<div class="acc-left">
  <details class="acc-left__item" name="acc-left" open>
    <summary class="acc-left__question">
      <svg class="acc-left__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Do you have a public API?
    </summary>
    <div class="acc-left__answer">
      <p>Yes - a REST API and webhooks on every plan, with a rate limit of 1,000 requests per minute.</p>
    </div>
  </details>

  <details class="acc-left__item" name="acc-left">
    <summary class="acc-left__question">
      <svg class="acc-left__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Are there client libraries?
    </summary>
    <div class="acc-left__answer">
      <p>We publish official SDKs for TypeScript, Python, Go and Ruby, all generated from the same OpenAPI spec.</p>
    </div>
  </details>

  <details class="acc-left__item" name="acc-left">
    <summary class="acc-left__question">
      <svg class="acc-left__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      How do I rotate an API key?
    </summary>
    <div class="acc-left__answer">
      <p>Create a second key in Settings, deploy it, then revoke the old one. Both stay valid until you revoke.</p>
    </div>
  </details>
</div>`,
      css: `.acc-left {
  max-width: 42rem;
}

.acc-left__item {
  border-bottom: 1px solid #e5e7eb;
}

.acc-left__question {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 0.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  list-style: none;
}

.acc-left__question::-webkit-details-marker {
  display: none;
}

.acc-left__question:hover {
  color: #2563eb;
}

.acc-left__question:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

.acc-left__icon {
  flex: none;
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  transition: transform 200ms ease;
}

.acc-left__item[open] .acc-left__icon {
  transform: rotate(90deg);
}

/* 1rem icon + 0.625rem gap keeps the answer flush with the question text. */
.acc-left__answer {
  padding: 0 0.25rem 1rem 1.875rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.acc-left__answer p {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .acc-left__icon {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .acc-left__item {
    border-bottom-color: #1f2937;
  }

  .acc-left__question {
    color: #f3f4f6;
  }

  .acc-left__question:hover {
    color: #60a5fa;
  }

  .acc-left__question:focus-visible {
    outline-color: #60a5fa;
  }

  .acc-left__icon {
    color: #9ca3af;
  }

  .acc-left__answer {
    color: #d1d5db;
  }
}`,
      tailwind: `<!-- pl-[1.875rem] on the answer = 1rem icon + 0.625rem gap, so text lines up. -->
<div class="max-w-2xl">
  <details class="group border-b border-gray-200 dark:border-gray-800" name="acc-left" open>
    <summary class="flex cursor-pointer list-none items-center gap-2.5 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      <svg class="h-4 w-4 flex-none text-gray-500 transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Do you have a public API?
    </summary>
    <p class="pb-4 pl-[1.875rem] pr-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Yes - a REST API and webhooks on every plan, with a rate limit of 1,000 requests per minute.
    </p>
  </details>

  <details class="group border-b border-gray-200 dark:border-gray-800" name="acc-left">
    <summary class="flex cursor-pointer list-none items-center gap-2.5 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      <svg class="h-4 w-4 flex-none text-gray-500 transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Are there client libraries?
    </summary>
    <p class="pb-4 pl-[1.875rem] pr-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      We publish official SDKs for TypeScript, Python, Go and Ruby, all generated from the same OpenAPI spec.
    </p>
  </details>

  <details class="group border-b border-gray-200 dark:border-gray-800" name="acc-left">
    <summary class="flex cursor-pointer list-none items-center gap-2.5 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      <svg class="h-4 w-4 flex-none text-gray-500 transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m7.5 5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      How do I rotate an API key?
    </summary>
    <p class="pb-4 pl-[1.875rem] pr-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Create a second key in Settings, deploy it, then revoke the old one. Both stay valid until you revoke.
    </p>
  </details>
</div>`,
      react: `import { useId, useState } from 'react';

export function AccordionIconLeft({ items, defaultOpenId, className = '' }) {
  const baseId = useId();
  const [openId, setOpenId] = useState(defaultOpenId ?? null);

  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

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
                  className={\`h-4 w-4 flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-90' : ''}\`}
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
}`,
      nextjs: `'use client';

import { useId, useState } from 'react';

export interface FaqItem {
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
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

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
                  className={\`h-4 w-4 flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-90' : ''}\`}
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
}`,
      typescript: `import { useId, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionIconLeftProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionIconLeft({
  items,
  defaultOpenId,
  className = '',
}: AccordionIconLeftProps): JSX.Element {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item: FaqItem) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

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
                  className={\`h-4 w-4 flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-90' : ''}\`}
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
}`,
    },
  },

  {
    slug: 'accordion-plus-minus',
    category: 'faq',
    tags: ['accordion', 'faq', 'plus', 'minus', 'animation'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-27',
    updatedAt: '2026-07-02',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 903, copies: 219, downloads: 58 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'single', labelKey: 'single' },
    ],
    props: [
      {
        name: 'items',
        type: 'FaqItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'trial', question: '…', answer: '…' }]",
      },
      { name: 'defaultOpenId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The indicator is two 2px bars stacked at the same spot: the horizontal one is
  always visible, the vertical one collapses (scaleY(0)) when the panel opens,
  so + morphs into −. Both bars are aria-hidden - aria-expanded on the control
  is what a screen reader announces.
-->
<div class="acc-pm">
  <details class="acc-pm__item" name="acc-pm" open>
    <summary class="acc-pm__question">
      Is there a free trial?
      <span class="acc-pm__indicator" aria-hidden="true">
        <span class="acc-pm__bar"></span>
        <span class="acc-pm__bar acc-pm__bar--vertical"></span>
      </span>
    </summary>
    <div class="acc-pm__answer">
      <p>14 days on any paid plan, no card required. You keep everything you build during the trial.</p>
    </div>
  </details>

  <details class="acc-pm__item" name="acc-pm">
    <summary class="acc-pm__question">
      What happens when the trial ends?
      <span class="acc-pm__indicator" aria-hidden="true">
        <span class="acc-pm__bar"></span>
        <span class="acc-pm__bar acc-pm__bar--vertical"></span>
      </span>
    </summary>
    <div class="acc-pm__answer">
      <p>Your workspace drops to the free tier. Nothing is deleted, and you can upgrade again whenever you like.</p>
    </div>
  </details>

  <details class="acc-pm__item" name="acc-pm">
    <summary class="acc-pm__question">
      Can I extend my trial?
      <span class="acc-pm__indicator" aria-hidden="true">
        <span class="acc-pm__bar"></span>
        <span class="acc-pm__bar acc-pm__bar--vertical"></span>
      </span>
    </summary>
    <div class="acc-pm__answer">
      <p>Email support and we will add another 14 days once, no questions asked.</p>
    </div>
  </details>
</div>`,
      css: `.acc-pm {
  max-width: 42rem;
}

.acc-pm__item {
  border-bottom: 1px solid #e5e7eb;
}

.acc-pm__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  list-style: none;
}

.acc-pm__question::-webkit-details-marker {
  display: none;
}

.acc-pm__question:hover {
  color: #2563eb;
}

.acc-pm__question:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

.acc-pm__indicator {
  position: relative;
  flex: none;
  width: 0.875rem;
  height: 0.875rem;
}

.acc-pm__bar {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  margin-top: -1px;
  border-radius: 1px;
  background-color: #6b7280;
  transition: transform 200ms ease;
}

.acc-pm__bar--vertical {
  transform: rotate(90deg);
}

/* Collapsing the vertical bar turns the + into a −. */
.acc-pm__item[open] .acc-pm__bar--vertical {
  transform: rotate(90deg) scaleX(0);
}

.acc-pm__answer {
  padding: 0 0.25rem 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.acc-pm__answer p {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .acc-pm__bar {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .acc-pm__item {
    border-bottom-color: #1f2937;
  }

  .acc-pm__question {
    color: #f3f4f6;
  }

  .acc-pm__question:hover {
    color: #60a5fa;
  }

  .acc-pm__question:focus-visible {
    outline-color: #60a5fa;
  }

  .acc-pm__bar {
    background-color: #9ca3af;
  }

  .acc-pm__answer {
    color: #d1d5db;
  }
}`,
      tailwind: `<!--
  group-open:scale-x-0 collapses the vertical bar, morphing + into −.
  The rotate-90 stays applied, so the transition is a pure scale.
-->
<div class="max-w-2xl">
  <details class="group border-b border-gray-200 dark:border-gray-800" name="acc-pm" open>
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      Is there a free trial?
      <span class="relative h-3.5 w-3.5 flex-none" aria-hidden="true">
        <span class="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-gray-500 dark:bg-gray-400"></span>
        <span class="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-90 rounded-full bg-gray-500 transition-transform duration-200 group-open:scale-x-0 motion-reduce:transition-none dark:bg-gray-400"></span>
      </span>
    </summary>
    <p class="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      14 days on any paid plan, no card required. You keep everything you build during the trial.
    </p>
  </details>

  <details class="group border-b border-gray-200 dark:border-gray-800" name="acc-pm">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      What happens when the trial ends?
      <span class="relative h-3.5 w-3.5 flex-none" aria-hidden="true">
        <span class="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-gray-500 dark:bg-gray-400"></span>
        <span class="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-90 rounded-full bg-gray-500 transition-transform duration-200 group-open:scale-x-0 motion-reduce:transition-none dark:bg-gray-400"></span>
      </span>
    </summary>
    <p class="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Your workspace drops to the free tier. Nothing is deleted, and you can upgrade again whenever you like.
    </p>
  </details>

  <details class="group border-b border-gray-200 dark:border-gray-800" name="acc-pm">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      Can I extend my trial?
      <span class="relative h-3.5 w-3.5 flex-none" aria-hidden="true">
        <span class="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-gray-500 dark:bg-gray-400"></span>
        <span class="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-90 rounded-full bg-gray-500 transition-transform duration-200 group-open:scale-x-0 motion-reduce:transition-none dark:bg-gray-400"></span>
      </span>
    </summary>
    <p class="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Email support and we will add another 14 days once, no questions asked.
    </p>
  </details>
</div>`,
      react: `import { useId, useState } from 'react';

export function AccordionPlusMinus({ items, defaultOpenId, className = '' }) {
  const baseId = useId();
  const [openId, setOpenId] = useState(defaultOpenId ?? null);

  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                {item.question}
                {/* Decorative: aria-expanded already announces the state. */}
                <span className="relative h-3.5 w-3.5 flex-none" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-gray-500 dark:bg-gray-400" />
                  <span
                    className={\`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-90 rounded-full bg-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:bg-gray-400 \${isOpen ? 'scale-x-0' : ''}\`}
                  />
                </span>
              </button>
            </h3>

            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionPlusMinusProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionPlusMinus({
  items,
  defaultOpenId,
  className = '',
}: AccordionPlusMinusProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                {item.question}
                <span className="relative h-3.5 w-3.5 flex-none" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-gray-500 dark:bg-gray-400" />
                  <span
                    className={\`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-90 rounded-full bg-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:bg-gray-400 \${isOpen ? 'scale-x-0' : ''}\`}
                  />
                </span>
              </button>
            </h3>

            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
      typescript: `import { useId, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionPlusMinusProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionPlusMinus({
  items,
  defaultOpenId,
  className = '',
}: AccordionPlusMinusProps): JSX.Element {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item: FaqItem) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                {item.question}
                <span className="relative h-3.5 w-3.5 flex-none" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-gray-500 dark:bg-gray-400" />
                  <span
                    className={\`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-90 rounded-full bg-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:bg-gray-400 \${isOpen ? 'scale-x-0' : ''}\`}
                  />
                </span>
              </button>
            </h3>

            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
    },
  },

  {
    slug: 'accordion-native-details',
    category: 'faq',
    tags: ['accordion', 'faq', 'details', 'no-js', 'native'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-06-05',
    updatedAt: '2026-07-08',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 1187, copies: 302, downloads: 88 },
    variants: [
      { id: 'single', labelKey: 'single' },
      { id: 'default', labelKey: 'default' },
    ],
    props: [
      {
        name: 'items',
        type: 'FaqItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'privacy', question: '…', answer: '…' }]",
      },
      { name: 'name', type: 'string', default: "'faq-native'", descriptionKey: 'groupName' },
      { name: 'defaultOpenId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Zero JavaScript. <details name="faq-native"> makes the group exclusive the way
  a radio group is: the browser closes the open panel for you. Everything the
  ARIA disclosure pattern hand-builds - the expanded state, the keyboard
  handling, the screen-reader announcement - is already in the element.

  It ships open by default for no-JS, print and search-engine crawlers.
-->
<div class="acc-native">
  <details class="acc-native__item" name="faq-native" open>
    <summary class="acc-native__question">
      Do you sell my data?
      <svg class="acc-native__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-native__answer">
      <p>Never. We make money from subscriptions, and your content is yours - we do not sell or train on it.</p>
    </div>
  </details>

  <details class="acc-native__item" name="faq-native">
    <summary class="acc-native__question">
      Are you GDPR compliant?
      <svg class="acc-native__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-native__answer">
      <p>Yes, and we sign a DPA with every customer. Sub-processors are listed publicly on our trust page.</p>
    </div>
  </details>

  <details class="acc-native__item" name="faq-native">
    <summary class="acc-native__question">
      How do I delete my account?
      <svg class="acc-native__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-native__answer">
      <p>Settings → Account → Delete. Everything is erased from live systems immediately and from backups within 30 days.</p>
    </div>
  </details>
</div>`,
      css: `/*
 * Nothing here is load-bearing for behaviour - strip every rule and the
 * accordion still works. This only removes the default marker and dresses it.
 */
.acc-native {
  max-width: 42rem;
}

.acc-native__item {
  border-bottom: 1px solid #e5e7eb;
}

.acc-native__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  list-style: none;
}

.acc-native__question::-webkit-details-marker {
  display: none;
}

.acc-native__question:hover {
  color: #2563eb;
}

.acc-native__question:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

.acc-native__icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #6b7280;
  transition: transform 200ms ease;
}

.acc-native__item[open] .acc-native__icon {
  transform: rotate(180deg);
}

.acc-native__answer {
  padding: 0 0.25rem 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.acc-native__answer p {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .acc-native__icon {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .acc-native__item {
    border-bottom-color: #1f2937;
  }

  .acc-native__question {
    color: #f3f4f6;
  }

  .acc-native__question:hover {
    color: #60a5fa;
  }

  .acc-native__question:focus-visible {
    outline-color: #60a5fa;
  }

  .acc-native__icon {
    color: #9ca3af;
  }

  .acc-native__answer {
    color: #d1d5db;
  }
}`,
      tailwind: `<!-- Same zero-JS element, utilities instead of a stylesheet. -->
<div class="max-w-2xl">
  <details class="group border-b border-gray-200 dark:border-gray-800" name="faq-native" open>
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      Do you sell my data?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Never. We make money from subscriptions, and your content is yours - we do not sell or train on it.
    </p>
  </details>

  <details class="group border-b border-gray-200 dark:border-gray-800" name="faq-native">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      Are you GDPR compliant?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Yes, and we sign a DPA with every customer. Sub-processors are listed publicly on our trust page.
    </p>
  </details>

  <details class="group border-b border-gray-200 dark:border-gray-800" name="faq-native">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      How do I delete my account?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      Settings → Account → Delete. Everything is erased from live systems immediately and from backups within 30 days.
    </p>
  </details>
</div>`,
      react: `/*
 * No useState, no useEffect, no event handlers - the browser owns the state.
 * Pass a unique \`name\` when two of these share a page, or they will close
 * each other: the attribute is what scopes the exclusive group.
 */
export function AccordionNativeDetails({
  items,
  name = 'faq-native',
  defaultOpenId,
  className = '',
}) {
  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item) => (
        <details
          key={item.id}
          name={name}
          open={item.id === defaultOpenId}
          className="group border-b border-gray-200 dark:border-gray-800"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
            {item.question}
            <svg
              className="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}`,
      nextjs: `/*
 * Deliberately NOT a client component: there is no state to hydrate, so this
 * renders on the server and ships zero JavaScript to the browser. That is the
 * entire point of the native element.
 */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionNativeDetailsProps {
  items: FaqItem[];
  /** Scopes the exclusive group. Pass a unique value per accordion on a page. */
  name?: string;
  defaultOpenId?: string;
  className?: string;
}

export function AccordionNativeDetails({
  items,
  name = 'faq-native',
  defaultOpenId,
  className = '',
}: AccordionNativeDetailsProps) {
  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item) => (
        <details
          key={item.id}
          name={name}
          open={item.id === defaultOpenId}
          className="group border-b border-gray-200 dark:border-gray-800"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
            {item.question}
            <svg
              className="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}`,
      typescript: `export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionNativeDetailsProps {
  items: FaqItem[];
  /** Scopes the exclusive group. Pass a unique value per accordion on a page. */
  name?: string;
  defaultOpenId?: string;
  className?: string;
}

export function AccordionNativeDetails({
  items,
  name = 'faq-native',
  defaultOpenId,
  className = '',
}: AccordionNativeDetailsProps): JSX.Element {
  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item: FaqItem) => (
        <details
          key={item.id}
          name={name}
          open={item.id === defaultOpenId}
          className="group border-b border-gray-200 dark:border-gray-800"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
            {item.question}
            <svg
              className="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}`,
    },
  },

  {
    slug: 'accordion-nested',
    category: 'faq',
    tags: ['accordion', 'faq', 'nested', 'hierarchy', 'a11y'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-14',
    updatedAt: '2026-07-11',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 566, copies: 108, downloads: 29 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'single', labelKey: 'single' },
    ],
    props: [
      {
        name: 'items',
        type: 'NestedFaqItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'billing', question: '…', children: [{ id: 'vat', question: '…', answer: '…' }] }]",
      },
      { name: 'defaultOpenId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  An accordion inside an accordion panel. The heading levels are the thing to
  get right: outer questions sit in <h3>, inner ones in <h4>, so the document
  outline nests the same way the boxes do and a screen reader's heading list
  stays navigable. Skipping a level (h3 → h5) breaks that.
-->
<div class="acc-nest">
  <details class="acc-nest__item" name="acc-nest" open>
    <summary class="acc-nest__question">
      <h3 class="acc-nest__label">Billing</h3>
      <svg class="acc-nest__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>

    <div class="acc-nest__panel">
      <details class="acc-nest__child" name="acc-nest-billing" open>
        <summary class="acc-nest__question acc-nest__question--child">
          <h4 class="acc-nest__label acc-nest__label--child">Do prices include VAT?</h4>
          <svg class="acc-nest__icon acc-nest__icon--child" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </summary>
        <div class="acc-nest__answer">
          <p>Prices are shown excluding VAT. The correct rate is added at checkout based on your billing country.</p>
        </div>
      </details>

      <details class="acc-nest__child" name="acc-nest-billing">
        <summary class="acc-nest__question acc-nest__question--child">
          <h4 class="acc-nest__label acc-nest__label--child">Can I pay by invoice?</h4>
          <svg class="acc-nest__icon acc-nest__icon--child" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </summary>
        <div class="acc-nest__answer">
          <p>Annual plans over ten seats can be invoiced on net-30 terms. Contact sales to switch.</p>
        </div>
      </details>
    </div>
  </details>

  <details class="acc-nest__item" name="acc-nest">
    <summary class="acc-nest__question">
      <h3 class="acc-nest__label">Security</h3>
      <svg class="acc-nest__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>

    <div class="acc-nest__panel">
      <details class="acc-nest__child" name="acc-nest-security">
        <summary class="acc-nest__question acc-nest__question--child">
          <h4 class="acc-nest__label acc-nest__label--child">Is data encrypted at rest?</h4>
          <svg class="acc-nest__icon acc-nest__icon--child" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </summary>
        <div class="acc-nest__answer">
          <p>Yes - AES-256 at rest and TLS 1.3 in transit, with keys rotated automatically every 90 days.</p>
        </div>
      </details>
    </div>
  </details>
</div>`,
      css: `.acc-nest {
  max-width: 42rem;
}

.acc-nest__item {
  border-bottom: 1px solid #e5e7eb;
}

.acc-nest__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0.25rem;
  cursor: pointer;
  list-style: none;
}

.acc-nest__question::-webkit-details-marker {
  display: none;
}

.acc-nest__question:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

/* The heading carries no margin - the summary owns the spacing. */
.acc-nest__label {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.acc-nest__question:hover .acc-nest__label {
  color: #2563eb;
}

.acc-nest__label--child {
  font-size: 0.875rem;
  font-weight: 500;
}

.acc-nest__icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #6b7280;
  transition: transform 200ms ease;
}

.acc-nest__icon--child {
  width: 1rem;
  height: 1rem;
}

.acc-nest__item[open] > .acc-nest__question .acc-nest__icon,
.acc-nest__child[open] > .acc-nest__question .acc-nest__icon {
  transform: rotate(180deg);
}

/* Indent + rule makes the nesting legible without another border box. */
.acc-nest__panel {
  margin: 0 0 0.75rem 0.75rem;
  padding-left: 0.75rem;
  border-left: 2px solid #e5e7eb;
}

.acc-nest__child + .acc-nest__child {
  border-top: 1px solid #f3f4f6;
}

.acc-nest__question--child {
  padding: 0.625rem 0.25rem;
}

.acc-nest__answer {
  padding: 0 0.25rem 0.625rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.acc-nest__answer p {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .acc-nest__icon {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .acc-nest__item {
    border-bottom-color: #1f2937;
  }

  .acc-nest__label {
    color: #f3f4f6;
  }

  .acc-nest__question:hover .acc-nest__label {
    color: #60a5fa;
  }

  .acc-nest__question:focus-visible {
    outline-color: #60a5fa;
  }

  .acc-nest__icon {
    color: #9ca3af;
  }

  .acc-nest__panel {
    border-left-color: #1f2937;
  }

  .acc-nest__child + .acc-nest__child {
    border-top-color: #111827;
  }

  .acc-nest__answer {
    color: #d1d5db;
  }
}`,
      tailwind: `<!-- h3 outside, h4 inside: the heading outline nests with the boxes. -->
<div class="max-w-2xl">
  <details class="group border-b border-gray-200 dark:border-gray-800" name="acc-nest" open>
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      <h3 class="m-0 text-base font-semibold text-gray-900 dark:text-gray-100">Billing</h3>
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>

    <div class="mb-3 ml-3 border-l-2 border-gray-200 pl-3 dark:border-gray-800">
      <details class="group/child" name="acc-nest-billing" open>
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-2.5 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
          <h4 class="m-0 text-sm font-medium text-gray-900 dark:text-gray-100">Do prices include VAT?</h4>
          <svg class="h-4 w-4 flex-none text-gray-500 transition-transform duration-200 group-open/child:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </summary>
        <p class="px-1 pb-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Prices are shown excluding VAT. The correct rate is added at checkout based on your billing country.
        </p>
      </details>

      <details class="group/child border-t border-gray-100 dark:border-gray-900" name="acc-nest-billing">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-2.5 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
          <h4 class="m-0 text-sm font-medium text-gray-900 dark:text-gray-100">Can I pay by invoice?</h4>
          <svg class="h-4 w-4 flex-none text-gray-500 transition-transform duration-200 group-open/child:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </summary>
        <p class="px-1 pb-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Annual plans over ten seats can be invoiced on net-30 terms. Contact sales to switch.
        </p>
      </details>
    </div>
  </details>

  <details class="group border-b border-gray-200 dark:border-gray-800" name="acc-nest">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
      <h3 class="m-0 text-base font-semibold text-gray-900 dark:text-gray-100">Security</h3>
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>

    <div class="mb-3 ml-3 border-l-2 border-gray-200 pl-3 dark:border-gray-800">
      <details class="group/child" name="acc-nest-security">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-2.5 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
          <h4 class="m-0 text-sm font-medium text-gray-900 dark:text-gray-100">Is data encrypted at rest?</h4>
          <svg class="h-4 w-4 flex-none text-gray-500 transition-transform duration-200 group-open/child:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </summary>
        <p class="px-1 pb-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Yes - AES-256 at rest and TLS 1.3 in transit, with keys rotated automatically every 90 days.
        </p>
      </details>
    </div>
  </details>
</div>`,
      react: `import { useId, useState } from 'react';

export function AccordionNested({ items, defaultOpenId, className = '' }) {
  const baseId = useId();
  const [openId, setOpenId] = useState(defaultOpenId ?? null);
  const [openChildId, setOpenChildId] = useState(null);

  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

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
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
                {item.children.map((child, index) => {
                  const isChildOpen = openChildId === child.id;
                  const childButtonId = \`\${baseId}-\${child.id}-button\`;
                  const childPanelId = \`\${baseId}-\${child.id}-panel\`;

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
                            className={\`h-4 w-4 flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isChildOpen ? 'rotate-180' : ''}\`}
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
}`,
      nextjs: `'use client';

import { useId, useState } from 'react';

export interface NestedFaqChild {
  id: string;
  question: string;
  answer: string;
}

export interface NestedFaqItem {
  id: string;
  question: string;
  children: NestedFaqChild[];
}

interface AccordionNestedProps {
  items: NestedFaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionNested({ items, defaultOpenId, className = '' }: AccordionNestedProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const [openChildId, setOpenChildId] = useState<string | null>(null);

  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

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
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
                {item.children.map((child, index) => {
                  const isChildOpen = openChildId === child.id;
                  const childButtonId = \`\${baseId}-\${child.id}-button\`;
                  const childPanelId = \`\${baseId}-\${child.id}-panel\`;

                  return (
                    <div
                      key={child.id}
                      className={index > 0 ? 'border-t border-gray-100 dark:border-gray-900' : ''}
                    >
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
                            className={\`h-4 w-4 flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isChildOpen ? 'rotate-180' : ''}\`}
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
}`,
      typescript: `import { useId, useState } from 'react';

export interface NestedFaqChild {
  id: string;
  question: string;
  answer: string;
}

export interface NestedFaqItem {
  id: string;
  question: string;
  children: NestedFaqChild[];
}

export interface AccordionNestedProps {
  items: NestedFaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionNested({
  items,
  defaultOpenId,
  className = '',
}: AccordionNestedProps): JSX.Element {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const [openChildId, setOpenChildId] = useState<string | null>(null);

  return (
    <div className={\`max-w-2xl \${className}\`}>
      {items.map((item: NestedFaqItem) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

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
                  className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
                  const childButtonId = \`\${baseId}-\${child.id}-button\`;
                  const childPanelId = \`\${baseId}-\${child.id}-panel\`;

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
                            className={\`h-4 w-4 flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isChildOpen ? 'rotate-180' : ''}\`}
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
}`,
    },
  },

  {
    slug: 'accordion-filled',
    category: 'faq',
    tags: ['accordion', 'faq', 'filled', 'tinted', 'highlight'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-06-28',
    updatedAt: '2026-07-13',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 421, copies: 86, downloads: 19 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'highlighted', labelKey: 'highlighted' },
    ],
    props: [
      {
        name: 'items',
        type: 'FaqItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'support', question: '…', answer: '…' }]",
      },
      { name: 'defaultOpenId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The open item tints its whole card. The tint is redundant reinforcement, not
  the state itself - [open]/aria-expanded is what conveys it, so this still
  reads correctly with colour filtering or a forced-colours mode on.
-->
<div class="acc-fill">
  <details class="acc-fill__item" name="acc-fill" open>
    <summary class="acc-fill__question">
      What are your support hours?
      <svg class="acc-fill__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-fill__answer">
      <p>Support is staffed 24/5, Monday to Friday. Enterprise plans add weekend cover for urgent incidents.</p>
    </div>
  </details>

  <details class="acc-fill__item" name="acc-fill">
    <summary class="acc-fill__question">
      How fast do you reply?
      <svg class="acc-fill__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-fill__answer">
      <p>The median first reply is under two hours. Priority tickets carry a one-hour contractual SLA.</p>
    </div>
  </details>

  <details class="acc-fill__item" name="acc-fill">
    <summary class="acc-fill__question">
      Can I talk to a human?
      <svg class="acc-fill__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <div class="acc-fill__answer">
      <p>Always. There is no bot gate - every ticket goes straight to a support engineer.</p>
    </div>
  </details>
</div>`,
      css: `.acc-fill {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 42rem;
}

.acc-fill__item {
  border-radius: 0.75rem;
  background-color: transparent;
  transition: background-color 200ms ease;
}

/* The tint only appears when open. */
.acc-fill__item[open] {
  background-color: #eff6ff;
}

.acc-fill__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  list-style: none;
}

.acc-fill__question::-webkit-details-marker {
  display: none;
}

.acc-fill__item:not([open]) .acc-fill__question:hover {
  background-color: #f9fafb;
  border-radius: 0.75rem;
}

.acc-fill__item[open] .acc-fill__question {
  color: #1e3a8a;
}

.acc-fill__question:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
  border-radius: 0.75rem;
}

.acc-fill__icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #6b7280;
  transition: transform 200ms ease;
}

.acc-fill__item[open] .acc-fill__icon {
  color: #1d4ed8;
  transform: rotate(180deg);
}

.acc-fill__answer {
  padding: 0 1rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
}

.acc-fill__answer p {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .acc-fill__item,
  .acc-fill__icon {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .acc-fill__item[open] {
    background-color: #172554;
  }

  .acc-fill__question {
    color: #f3f4f6;
  }

  .acc-fill__item:not([open]) .acc-fill__question:hover {
    background-color: #111827;
  }

  .acc-fill__item[open] .acc-fill__question {
    color: #dbeafe;
  }

  .acc-fill__question:focus-visible {
    outline-color: #60a5fa;
  }

  .acc-fill__icon {
    color: #9ca3af;
  }

  .acc-fill__item[open] .acc-fill__icon {
    color: #93c5fd;
  }

  .acc-fill__answer {
    color: #d1d5db;
  }
}`,
      tailwind: `<!-- open:bg-blue-50 tints the card; the text darkens to keep 4.5:1 on the tint. -->
<div class="max-w-2xl space-y-2">
  <details class="group rounded-xl transition-colors duration-200 open:bg-blue-50 motion-reduce:transition-none dark:open:bg-blue-950" name="acc-fill" open>
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-[0.9375rem] font-medium text-gray-900 group-open:text-blue-900 hover:bg-gray-50 group-open:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:group-open:text-blue-100 dark:hover:bg-gray-900 dark:group-open:hover:bg-transparent dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
      What are your support hours?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 group-open:text-blue-700 motion-reduce:transition-none dark:text-gray-400 dark:group-open:text-blue-300" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-4 pb-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      Support is staffed 24/5, Monday to Friday. Enterprise plans add weekend cover for urgent incidents.
    </p>
  </details>

  <details class="group rounded-xl transition-colors duration-200 open:bg-blue-50 motion-reduce:transition-none dark:open:bg-blue-950" name="acc-fill">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-[0.9375rem] font-medium text-gray-900 group-open:text-blue-900 hover:bg-gray-50 group-open:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:group-open:text-blue-100 dark:hover:bg-gray-900 dark:group-open:hover:bg-transparent dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
      How fast do you reply?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 group-open:text-blue-700 motion-reduce:transition-none dark:text-gray-400 dark:group-open:text-blue-300" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-4 pb-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      The median first reply is under two hours. Priority tickets carry a one-hour contractual SLA.
    </p>
  </details>

  <details class="group rounded-xl transition-colors duration-200 open:bg-blue-50 motion-reduce:transition-none dark:open:bg-blue-950" name="acc-fill">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-[0.9375rem] font-medium text-gray-900 group-open:text-blue-900 hover:bg-gray-50 group-open:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:group-open:text-blue-100 dark:hover:bg-gray-900 dark:group-open:hover:bg-transparent dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
      Can I talk to a human?
      <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 group-open:text-blue-700 motion-reduce:transition-none dark:text-gray-400 dark:group-open:text-blue-300" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>
    <p class="px-4 pb-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      Always. There is no bot gate - every ticket goes straight to a support engineer.
    </p>
  </details>
</div>`,
      react: `import { useId, useState } from 'react';

export function AccordionFilled({ items, defaultOpenId, className = '' }) {
  const baseId = useId();
  const [openId, setOpenId] = useState(defaultOpenId ?? null);

  return (
    <div className={\`max-w-2xl space-y-2 \${className}\`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div
            key={item.id}
            className={\`rounded-xl transition-colors duration-200 motion-reduce:transition-none \${isOpen ? 'bg-blue-50 dark:bg-blue-950' : ''}\`}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className={\`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left text-[0.9375rem] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
                  isOpen
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-900'
                }\`}
              >
                {item.question}
                <svg
                  className={\`h-[1.125rem] w-[1.125rem] flex-none transition-transform duration-200 motion-reduce:transition-none \${
                    isOpen
                      ? 'rotate-180 text-blue-700 dark:text-blue-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }\`}
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
              <p className="px-4 pb-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionFilledProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionFilled({ items, defaultOpenId, className = '' }: AccordionFilledProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={\`max-w-2xl space-y-2 \${className}\`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div
            key={item.id}
            className={\`rounded-xl transition-colors duration-200 motion-reduce:transition-none \${isOpen ? 'bg-blue-50 dark:bg-blue-950' : ''}\`}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className={\`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left text-[0.9375rem] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
                  isOpen
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-900'
                }\`}
              >
                {item.question}
                <svg
                  className={\`h-[1.125rem] w-[1.125rem] flex-none transition-transform duration-200 motion-reduce:transition-none \${
                    isOpen
                      ? 'rotate-180 text-blue-700 dark:text-blue-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }\`}
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
              <p className="px-4 pb-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
      typescript: `import { useId, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionFilledProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionFilled({
  items,
  defaultOpenId,
  className = '',
}: AccordionFilledProps): JSX.Element {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={\`max-w-2xl space-y-2 \${className}\`}>
      {items.map((item: FaqItem) => {
        const isOpen = openId === item.id;
        const buttonId = \`\${baseId}-\${item.id}-button\`;
        const panelId = \`\${baseId}-\${item.id}-panel\`;

        return (
          <div
            key={item.id}
            className={\`rounded-xl transition-colors duration-200 motion-reduce:transition-none \${isOpen ? 'bg-blue-50 dark:bg-blue-950' : ''}\`}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className={\`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left text-[0.9375rem] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${
                  isOpen
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-900'
                }\`}
              >
                {item.question}
                <svg
                  className={\`h-[1.125rem] w-[1.125rem] flex-none transition-transform duration-200 motion-reduce:transition-none \${
                    isOpen
                      ? 'rotate-180 text-blue-700 dark:text-blue-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }\`}
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
              <p className="px-4 pb-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
    },
  },

  {
    slug: 'accordion-faq-search',
    category: 'faq',
    tags: ['accordion', 'faq', 'search', 'filter', 'live-region'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-06',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1342, copies: 361, downloads: 104 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'single', labelKey: 'single' },
    ],
    props: [
      {
        name: 'items',
        type: 'FaqItem[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'export', question: '…', answer: '…' }]",
      },
      { name: 'defaultOpenId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Progressive enhancement: with JS off this is a plain <details> list and the
  search field simply does nothing visible - every answer is still readable.
  The filtering itself is ~10 lines; see the React tabs for the stateful version.

  The result count lives in an aria-live="polite" region so a screen-reader user
  hears "2 questions" as they type, instead of the list silently reflowing.
-->
<div class="acc-search">
  <form class="acc-search__form" role="search" onsubmit="return false">
    <label class="acc-search__label" for="faq-search">Search questions</label>
    <input class="acc-search__input" id="faq-search" type="search" placeholder="Search questions…" autocomplete="off" />
  </form>

  <p class="acc-search__count" role="status" aria-live="polite">3 questions</p>

  <div class="acc-search__list">
    <details class="acc-search__item" name="acc-search" open>
      <summary class="acc-search__question">
        Can I export my data?
        <svg class="acc-search__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </summary>
      <div class="acc-search__answer">
        <p>Any time, from Settings → Export. You get a ZIP of CSV and JSON - no lock-in and no support ticket.</p>
      </div>
    </details>

    <details class="acc-search__item" name="acc-search">
      <summary class="acc-search__question">
        Do you have a mobile app?
        <svg class="acc-search__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </summary>
      <div class="acc-search__answer">
        <p>Native apps for iOS and Android, plus an installable web app that works offline.</p>
      </div>
    </details>

    <details class="acc-search__item" name="acc-search">
      <summary class="acc-search__question">
        Which integrations are supported?
        <svg class="acc-search__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </summary>
      <div class="acc-search__answer">
        <p>Slack, GitHub, Jira, Zapier and around forty more, all managed from the integrations directory.</p>
      </div>
    </details>
  </div>
</div>`,
      css: `.acc-search {
  max-width: 42rem;
}

.acc-search__form {
  margin: 0 0 0.75rem;
}

/* Visually hidden, still announced: the placeholder is not a label. */
.acc-search__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.acc-search__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: #ffffff;
}

.acc-search__input::placeholder {
  color: #6b7280;
}

.acc-search__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: transparent;
}

.acc-search__count {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  color: #4b5563;
}

.acc-search__item {
  border-bottom: 1px solid #e5e7eb;
}

.acc-search__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 0.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  list-style: none;
}

.acc-search__question::-webkit-details-marker {
  display: none;
}

.acc-search__question:hover {
  color: #2563eb;
}

.acc-search__question:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

.acc-search__icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #6b7280;
  transition: transform 200ms ease;
}

.acc-search__item[open] .acc-search__icon {
  transform: rotate(180deg);
}

.acc-search__answer {
  padding: 0 0.25rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.acc-search__answer p {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .acc-search__icon {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .acc-search__input {
    border-color: #374151;
    background-color: #030712;
    color: #f3f4f6;
  }

  .acc-search__input::placeholder {
    color: #9ca3af;
  }

  .acc-search__count {
    color: #d1d5db;
  }

  .acc-search__item {
    border-bottom-color: #1f2937;
  }

  .acc-search__question {
    color: #f3f4f6;
  }

  .acc-search__question:hover {
    color: #60a5fa;
  }

  .acc-search__question:focus-visible {
    outline-color: #60a5fa;
  }

  .acc-search__icon {
    color: #9ca3af;
  }

  .acc-search__answer {
    color: #d1d5db;
  }
}`,
      tailwind: `<!-- sr-only label + aria-live count; see the React tabs for the filtering. -->
<div class="max-w-2xl">
  <form class="mb-3" role="search" onsubmit="return false">
    <label class="sr-only" for="faq-search">Search questions</label>
    <input
      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      id="faq-search"
      type="search"
      placeholder="Search questions…"
      autocomplete="off"
    />
  </form>

  <p class="mb-2 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">3 questions</p>

  <div>
    <details class="group border-b border-gray-200 dark:border-gray-800" name="acc-search" open>
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-3.5 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
        Can I export my data?
        <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </summary>
      <p class="px-1 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        Any time, from Settings → Export. You get a ZIP of CSV and JSON - no lock-in and no support ticket.
      </p>
    </details>

    <details class="group border-b border-gray-200 dark:border-gray-800" name="acc-search">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-3.5 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
        Do you have a mobile app?
        <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </summary>
      <p class="px-1 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        Native apps for iOS and Android, plus an installable web app that works offline.
      </p>
    </details>

    <details class="group border-b border-gray-200 dark:border-gray-800" name="acc-search">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-3.5 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
        Which integrations are supported?
        <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </summary>
      <p class="px-1 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        Slack, GitHub, Jira, Zapier and around forty more, all managed from the integrations directory.
      </p>
    </details>
  </div>
</div>`,
      react: `import { useId, useMemo, useState } from 'react';

export function AccordionFaqSearch({ items, defaultOpenId, className = '' }) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(defaultOpenId ?? null);

  // Answers are searched too, so "refund" finds a question that never says it.
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term),
    );
  }, [items, query]);

  const searchId = \`\${baseId}-search\`;

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <form className="mb-3" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="sr-only" htmlFor={searchId}>
          Search questions
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions…"
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
      </form>

      {/* Announces the new count as the list reflows. */}
      <p className="mb-2 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'question' : 'questions'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">
          No questions match “{query}”.
        </p>
      ) : (
        results.map((item) => {
          const isOpen = openId === item.id;
          const buttonId = \`\${baseId}-\${item.id}-button\`;
          const panelId = \`\${baseId}-\${item.id}-panel\`;

          return (
            <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
              <h3 className="m-0">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-1 py-3.5 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400"
                >
                  {item.question}
                  <svg
                    className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
                <p className="px-1 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useMemo, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionFaqSearchProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionFaqSearch({
  items,
  defaultOpenId,
  className = '',
}: AccordionFaqSearchProps) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term),
    );
  }, [items, query]);

  const searchId = \`\${baseId}-search\`;

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <form className="mb-3" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="sr-only" htmlFor={searchId}>
          Search questions
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions…"
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
      </form>

      <p className="mb-2 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'question' : 'questions'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">
          No questions match “{query}”.
        </p>
      ) : (
        results.map((item) => {
          const isOpen = openId === item.id;
          const buttonId = \`\${baseId}-\${item.id}-button\`;
          const panelId = \`\${baseId}-\${item.id}-panel\`;

          return (
            <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
              <h3 className="m-0">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-1 py-3.5 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400"
                >
                  {item.question}
                  <svg
                    className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
                <p className="px-1 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}`,
      typescript: `import { useId, useMemo, useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionFaqSearchProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionFaqSearch({
  items,
  defaultOpenId,
  className = '',
}: AccordionFaqSearchProps): JSX.Element {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  // Answers are searched too, so "refund" finds a question that never says it.
  const results = useMemo<FaqItem[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (item: FaqItem) =>
        item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term),
    );
  }, [items, query]);

  const searchId = \`\${baseId}-search\`;

  return (
    <div className={\`max-w-2xl \${className}\`}>
      <form className="mb-3" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="sr-only" htmlFor={searchId}>
          Search questions
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions…"
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
      </form>

      {/* Announces the new count as the list reflows. */}
      <p className="mb-2 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'question' : 'questions'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">
          No questions match “{query}”.
        </p>
      ) : (
        results.map((item: FaqItem) => {
          const isOpen = openId === item.id;
          const buttonId = \`\${baseId}-\${item.id}-button\`;
          const panelId = \`\${baseId}-\${item.id}-panel\`;

          return (
            <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
              <h3 className="m-0">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-1 py-3.5 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400"
                >
                  {item.question}
                  <svg
                    className={\`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 \${isOpen ? 'rotate-180' : ''}\`}
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
                <p className="px-1 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}`,
    },
  },
];
