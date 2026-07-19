'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tabs-underline`.
 *
 * Mirrors the `typescript` code variant, rendered with three sample tabs. Fully
 * interactive: click a tab, or focus the strip and use Left/Right/Home/End -
 * the roving tabindex means Tab enters the strip once and then moves to the
 * panel. Keep this in step with `src/data/components/tabs.ts`.
 */
interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsUnderlineProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

function TabsUnderline({ items, defaultTabId, className = '', ariaLabel = 'Tabs' }: TabsUnderlineProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
  };

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
    select(item.id);
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
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={`relative px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ${
                isActive
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
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
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

const SAMPLE_ITEMS: TabItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    content: <p>Your workspace is on the Team plan with five of ten seats in use.</p>,
  },
  {
    id: 'activity',
    label: 'Activity',
    content: <p>Nine deployments shipped this week, the last one four minutes ago.</p>,
  },
  {
    id: 'settings',
    label: 'Settings',
    content: <p>Two-factor authentication is enforced for every member of this workspace.</p>,
  },
];

export default function TabsUnderlinePreview() {
  return <TabsUnderline items={SAMPLE_ITEMS} ariaLabel="Account settings" className="w-full" />;
}
