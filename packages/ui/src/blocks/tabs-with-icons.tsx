'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tabs-with-icons`.
 *
 * Mirrors the `typescript` code variant with three sample mailbox tabs. Icons
 * are inline SVG drawn with currentColor and hidden from AT - the visible label
 * is the accessible name. Keep this in step with `src/data/components/tabs.ts`.
 */
interface TabItem {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

interface TabsWithIconsProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

export function TabsWithIcons({ items, defaultTabId, className = '', ariaLabel = 'Tabs' }: TabsWithIconsProps) {
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
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
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
              className={`-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              <span
                className="flex h-[1.125rem] w-[1.125rem] flex-none items-center justify-center"
                aria-hidden="true"
              >
                {item.icon}
              </span>
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
    id: 'inbox',
    label: 'Inbox',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-full w-full">
        <path
          d="M2.5 12.5h4l1 2h5l1-2h4M2.5 12.5 4 4.5h12l1.5 8v3a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-3Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    content: <p>12 unread messages, 3 of them flagged as urgent.</p>,
  },
  {
    id: 'starred',
    label: 'Starred',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-full w-full">
        <path
          d="m10 2.5 2.35 4.76 5.25.76-3.8 3.7.9 5.23L10 14.48l-4.7 2.47.9-5.23-3.8-3.7 5.25-.76L10 2.5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    content: <p>4 starred threads. Nothing new since Tuesday.</p>,
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-full w-full">
        <path
          d="M2.5 6.5h15m-13.5 0v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9M3.5 3.5h13v3h-13v-3ZM8 10h4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    content: <p>1,204 archived messages, searchable for two years.</p>,
  },
];

export default function TabsWithIconsPreview() {
  return <TabsWithIcons items={SAMPLE_ITEMS} ariaLabel="Mailbox" className="w-full" />;
}
