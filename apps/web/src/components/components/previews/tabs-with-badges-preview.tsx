'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tabs-with-badges`.
 *
 * Underline tabs that carry a count badge. The badge is decorative next to a
 * visible label, so it stays out of the accessible name; when a count matters to
 * AT, fold it into an `aria-label` on the tab. Keep this in step with
 * `src/data/components/tabs.ts`.
 */
interface TabItem {
  id: string;
  label: string;
  badge?: number;
  content: ReactNode;
}

interface TabsWithBadgesProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

function TabsWithBadges({ items, defaultTabId, className = '', ariaLabel = 'Tabs' }: TabsWithBadgesProps) {
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

  return (
    <div className={`max-w-2xl ${className}`}>
      <div className="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
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
              onClick={() => setActiveId(item.id)}
              onKeyDown={onKeyDown}
              className={`relative inline-flex items-center gap-2 whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ${
                isActive
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              {item.label}
              {typeof item.badge === 'number' ? (
                <span
                  className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                    isActive
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                  aria-hidden="true"
                >
                  {item.badge}
                </span>
              ) : null}
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

const SAMPLE_ITEMS: TabItem[] = [
  { id: 'inbox', label: 'Inbox', badge: 12, content: <p>12 conversations need a first reply.</p> },
  { id: 'mentions', label: 'Mentions', badge: 3, content: <p>3 threads mention you directly.</p> },
  { id: 'assigned', label: 'Assigned', badge: 0, content: <p>Nothing is assigned to you right now.</p> },
];

export default function TabsWithBadgesPreview() {
  return <TabsWithBadges items={SAMPLE_ITEMS} ariaLabel="Conversations" className="w-full" />;
}
