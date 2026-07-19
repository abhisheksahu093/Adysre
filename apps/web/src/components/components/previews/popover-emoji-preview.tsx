'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `popover-emoji`.
 *
 * Mirrors the `typescript` code variant verbatim. A grid of reaction buttons in
 * a `role="dialog"`; each button carries an `aria-label` because the glyph alone
 * announces inconsistently across screen readers. Picking one closes and
 * restores focus to the trigger; Escape closes without choosing.
 *
 * Seeded open, with `pb-` reserving the absolutely positioned panel's room.
 * Keep this in step with `src/data/components/popover.ts`.
 */
interface Emoji {
  char: string;
  name: string;
}

const EMOJIS: readonly Emoji[] = [
  { char: '👍', name: 'Thumbs up' },
  { char: '❤️', name: 'Heart' },
  { char: '😂', name: 'Laughing' },
  { char: '🎉', name: 'Party' },
  { char: '👀', name: 'Eyes' },
  { char: '🚀', name: 'Rocket' },
  { char: '🔥', name: 'Fire' },
  { char: '✅', name: 'Check' },
  { char: '🙏', name: 'Thank you' },
  { char: '😮', name: 'Surprised' },
  { char: '😢', name: 'Sad' },
  { char: '💡', name: 'Idea' },
];

interface PopoverEmojiProps {
  label: string;
  emojis: readonly Emoji[];
  onSelect?: (char: string) => void;
  defaultOpen?: boolean;
}

function PopoverEmoji({ label, emojis, onSelect, defaultOpen = false }: PopoverEmojiProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') close();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((state) => !state)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="grid grid-cols-6 gap-0.5">
            {emojis.map((emoji) => (
              <button
                key={emoji.name}
                type="button"
                aria-label={emoji.name}
                onClick={() => {
                  onSelect?.(emoji.char);
                  close();
                }}
                className="flex h-9 w-full items-center justify-center rounded-md text-lg hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:ring-blue-400"
              >
                <span aria-hidden="true">{emoji.char}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PopoverEmojiPreview() {
  const [reaction, setReaction] = useState('none');

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-48 pt-4">
      <PopoverEmoji label="Add reaction" emojis={EMOJIS} onSelect={setReaction} defaultOpen />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Reacted: <span className="text-base">{reaction}</span>
      </p>
    </div>
  );
}
