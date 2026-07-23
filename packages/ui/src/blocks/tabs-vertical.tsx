'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tabs-vertical`.
 *
 * Mirrors the `typescript` code variant with four sample sections. The rail is
 * `aria-orientation="vertical"`, so Up/Down move between tabs (not Left/Right)
 * and the rail folds above the panel below `sm`.
 * Keep this in step with `src/data/components/tabs.ts`.
 */
interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsVerticalProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

export function TabsVertical({ items, defaultTabId, className = '', ariaLabel = 'Tabs' }: TabsVerticalProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowDown') next = (index + 1) % items.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={`flex max-w-2xl flex-col gap-3 sm:flex-row sm:gap-6 ${className}`}>
      <div
        className="flex shrink-0 flex-col gap-0.5 border-b border-gray-200 pb-3 sm:w-44 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3 dark:border-gray-800"
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="vertical"
      >
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;

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
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={`rounded-md px-3 py-2 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100'
              }`}
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
          className="min-w-0 flex-1 pt-2 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

const SAMPLE_ITEMS: TabItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    content: <p>Your display name and avatar are visible to everyone in the workspace.</p>,
  },
  {
    id: 'security',
    label: 'Security',
    content: <p>Two-factor authentication is on. Recovery codes were generated in April.</p>,
  },
  {
    id: 'billing',
    label: 'Billing',
    content: <p>The Team plan renews on 1 August. Invoices go to billing@example.com.</p>,
  },
  {
    id: 'api',
    label: 'API keys',
    content: <p>Three live keys. The oldest has not been used in 60 days - consider revoking it.</p>,
  },
];

export default function TabsVerticalPreview() {
  return <TabsVertical items={SAMPLE_ITEMS} ariaLabel="Settings sections" className="w-full" />;
}
