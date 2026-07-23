'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tabs-nested`.
 *
 * Tabs inside a tab panel. The key correctness point is that each `tablist` runs
 * its OWN roving tabindex and arrow keys - the inner strip must not answer the
 * outer strip's keys - which one self-contained `Tabs` component reused at two
 * levels gives for free. The inner strip is styled as pills to read as a
 * subordinate level. Keep this in step with `src/data/components/tabs.ts`.
 */
interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  variant?: 'underline' | 'pills';
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

export function Tabs({ items, variant = 'underline', defaultTabId, className = '', ariaLabel = 'Tabs' }: TabsProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    setActiveId(item.id);
    tabRefs.current[item.id]?.focus();
  };

  const isPills = variant === 'pills';

  return (
    <div className={className}>
      <div
        className={
          isPills
            ? 'inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-gray-100 p-1 dark:bg-gray-800'
            : 'flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800'
        }
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;
          const base = isPills
            ? 'rounded-full px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400'
            : 'relative px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
          const activeCls = isPills
            ? 'bg-blue-600 text-white'
            : 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400';
          const idleCls = isPills
            ? 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100';

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${baseId}-${item.id}-tab`}
              aria-controls={`${baseId}-${item.id}-panel`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => setActiveId(item.id)}
              onKeyDown={onKeyDown}
              className={`whitespace-nowrap ${base} ${isActive ? activeCls : idleCls}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-${item.id}-panel`}
          aria-labelledby={`${baseId}-${item.id}-tab`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

const INNER_BILLING: TabItem[] = [
  { id: 'plan', label: 'Plan', content: <p>Team plan, 24 seats, renews monthly.</p> },
  { id: 'invoices', label: 'Invoices', content: <p>12 paid invoices, all downloadable as PDF.</p> },
];

const OUTER_ITEMS: TabItem[] = [
  {
    id: 'account',
    label: 'Account',
    content: <p>Your profile, email and password live here.</p>,
  },
  {
    id: 'workspace',
    label: 'Workspace',
    content: (
      <div>
        <p className="mb-3">Manage how billing works for the whole workspace.</p>
        <Tabs items={INNER_BILLING} variant="pills" ariaLabel="Billing sections" />
      </div>
    ),
  },
  {
    id: 'security',
    label: 'Security',
    content: <p>Two-factor authentication is enforced for every member.</p>,
  },
];

export default function TabsNestedPreview() {
  return <Tabs items={OUTER_ITEMS} ariaLabel="Settings" className="w-full max-w-2xl" />;
}

export const minHeight = 240;
