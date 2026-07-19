'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `menu-menubar-desktop`.
 *
 * Mirrors the `typescript` code variant verbatim. This is a `role="menubar"`:
 * Left/Right move between the top-level items, ArrowDown (or Enter) opens the
 * focused one, and once a menu is open Left/Right walk sideways to the adjacent
 * menu - the behaviour a desktop app menu bar implies the moment you give it the
 * role. Escape closes and returns focus to the trigger. Keep this in step with
 * `src/data/components/menus.ts`.
 */
interface MenuCommand {
  id: string;
  label: string;
}

interface MenubarSection {
  id: string;
  label: string;
  items: readonly MenuCommand[];
}

interface MenuMenubarProps {
  sections: readonly MenubarSection[];
  onCommand?: (id: string) => void;
  defaultOpenIndex?: number | null;
}

const SECTIONS: readonly MenubarSection[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New file' },
      { id: 'open', label: 'Open…' },
      { id: 'save', label: 'Save' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'undo', label: 'Undo' },
      { id: 'redo', label: 'Redo' },
      { id: 'find', label: 'Find…' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { id: 'zoom-in', label: 'Zoom in' },
      { id: 'zoom-out', label: 'Zoom out' },
      { id: 'sidebar', label: 'Toggle sidebar' },
    ],
  },
];

function MenuMenubar({ sections, onCommand, defaultOpenIndex = null }: MenuMenubarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<Array<HTMLButtonElement | null>>([]);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (openIndex === null) return undefined;
    function onDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpenIndex(null);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [openIndex]);

  function openAndFocus(index: number): void {
    setOpenIndex(index);
    window.requestAnimationFrame(() => itemsRef.current[0]?.focus());
  }

  function onTriggerKey(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    const count = sections.length;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const dir = event.key === 'ArrowRight' ? 1 : -1;
      const next = (((index + dir) % count) + count) % count;
      if (openIndex !== null) openAndFocus(next);
      else triggersRef.current[next]?.focus();
    } else if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openAndFocus(index);
    } else if (event.key === 'Escape') {
      setOpenIndex(null);
    }
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>, index: number): void {
    const count = sections.length;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpenIndex(null);
      triggersRef.current[index]?.focus();
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const dir = event.key === 'ArrowRight' ? 1 : -1;
      openAndFocus((((index + dir) % count) + count) % count);
      return;
    }
    const nodes = itemsRef.current.filter((n): n is HTMLButtonElement => n !== null);
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const dir = event.key === 'ArrowDown' ? 1 : -1;
      nodes[(((idx + dir) % nodes.length) + nodes.length) % nodes.length]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      nodes[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      nodes[nodes.length - 1]?.focus();
    }
  }

  return (
    <div
      ref={rootRef}
      role="menubar"
      aria-label="Application"
      aria-orientation="horizontal"
      className="flex w-full flex-wrap items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900"
    >
      {sections.map((section, index) => (
        <div key={section.id} className="relative">
          <button
            ref={(node) => {
              triggersRef.current[index] = node;
            }}
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={openIndex === index}
            onClick={() => (openIndex === index ? setOpenIndex(null) : openAndFocus(index))}
            onKeyDown={(event) => onTriggerKey(event, index)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
              openIndex === index
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {section.label}
          </button>

          {openIndex === index ? (
            <div
              role="menu"
              aria-label={section.label}
              onKeyDown={(event) => onMenuKey(event, index)}
              className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
            >
              {section.items.map((item, itemIndex) => (
                <button
                  key={item.id}
                  ref={(node) => {
                    itemsRef.current[itemIndex] = node;
                  }}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onCommand?.(item.id);
                    setOpenIndex(null);
                    triggersRef.current[index]?.focus();
                  }}
                  className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800"
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export const minHeight = 240;

export default function MenuMenubarDesktopPreview() {
  const [last, setLast] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col gap-2">
      <MenuMenubar sections={SECTIONS} onCommand={setLast} defaultOpenIndex={0} />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Last command: <span className="font-medium">{last}</span>
      </p>
    </div>
  );
}
