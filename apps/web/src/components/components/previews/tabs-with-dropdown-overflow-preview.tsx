'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tabs-with-dropdown-overflow`.
 *
 * When there are more tabs than fit, the tail collapses into a "More" menu rather
 * than forcing a horizontal scroll. The trigger reports `aria-haspopup="menu"` /
 * `aria-expanded` and lights up when the active tab lives inside it; the menu
 * closes on Escape, outside click, or selection. Keep this in step with
 * `src/data/components/tabs.ts`.
 */
interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsWithDropdownOverflowProps {
  items: TabItem[];
  maxVisible?: number;
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

function TabsWithDropdownOverflow({
  items,
  maxVisible = 3,
  defaultTabId,
  className = '',
  ariaLabel = 'Tabs',
}: TabsWithDropdownOverflowProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const visible = items.slice(0, maxVisible);
  const overflow = items.slice(maxVisible);
  const activeInOverflow = overflow.some((item: TabItem) => item.id === activeId);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (event: MouseEvent): void => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = visible.findIndex((item: TabItem) => item.id === activeId);
    const from = index === -1 ? 0 : index;
    let next = -1;
    if (event.key === 'ArrowRight') next = (from + 1) % visible.length;
    else if (event.key === 'ArrowLeft') next = (from - 1 + visible.length) % visible.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = visible.length - 1;
    else return;

    event.preventDefault();
    const item = visible[next];
    if (!item) return;
    setActiveId(item.id);
    tabRefs.current[item.id]?.focus();
  };

  const pickFromMenu = (id: string): void => {
    setActiveId(id);
    setMenuOpen(false);
    moreRef.current?.focus();
  };

  // The first visible tab stays in the tab sequence when the active tab is
  // hidden in the menu, so Tab still reaches the strip.
  const rovingId = activeInOverflow ? visible[0]?.id : activeId;

  return (
    <div className={`max-w-2xl ${className}`}>
      <div className="flex items-stretch gap-6 border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {visible.map((item: TabItem) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${baseId}-${item.id}-tab`}
              aria-controls={`${baseId}-${item.id}-panel`}
              aria-selected={isActive}
              tabIndex={item.id === rovingId ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => setActiveId(item.id)}
              onKeyDown={onKeyDown}
              className={`relative whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ${
                isActive
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}

        {overflow.length > 0 ? (
          <div ref={wrapRef} className="relative flex items-stretch">
            <button
              type="button"
              ref={moreRef}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setMenuOpen(false);
              }}
              className={`relative inline-flex items-center gap-1 whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ${
                activeInOverflow
                  ? 'text-blue-600 after:bg-blue-600 dark:text-blue-400 dark:after:bg-blue-400'
                  : 'text-gray-600 after:bg-transparent hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              More
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden="true">
                <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {menuOpen ? (
              <div
                role="menu"
                aria-label="More tabs"
                className="absolute right-0 top-full z-10 mt-1 min-w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                {overflow.map((item: TabItem) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    onClick={() => pickFromMenu(item.id)}
                    className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ${
                      item.id === activeId
                        ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
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
  { id: 'general', label: 'General', content: <p>Workspace name, logo and default language.</p> },
  { id: 'members', label: 'Members', content: <p>24 members across 5 teams.</p> },
  { id: 'billing', label: 'Billing', content: <p>Team plan, renews on the 1st.</p> },
  { id: 'api', label: 'API keys', content: <p>Three active keys, last used two hours ago.</p> },
  { id: 'webhooks', label: 'Webhooks', content: <p>Two endpoints, both responding with 200.</p> },
  { id: 'audit', label: 'Audit log', content: <p>Every privileged action, retained for a year.</p> },
];

export default function TabsWithDropdownOverflowPreview() {
  return <TabsWithDropdownOverflow items={SAMPLE_ITEMS} ariaLabel="Settings" className="w-full" />;
}

export const minHeight = 240;
