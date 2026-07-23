'use client';

import { useState, type ChangeEvent } from 'react';

/**
 * Live preview for `color-picker-recent-colors`.
 *
 * Mirrors the `typescript` code variant with a fixed recent list. Keep in step
 * with `src/data/components/color-pickers.ts`.
 */
export const minHeight = 220;

interface ColorPickerRecentColorsProps {
  value?: string;
  recent?: string[];
  onChange?: (hex: string) => void;
}

export function ColorPickerRecentColors({ value = '#3b82f6', recent = ['#3b82f6', '#ec4899', '#22c55e', '#eab308'], onChange }: ColorPickerRecentColorsProps) {
  const [current, setCurrent] = useState<string>(value);
  const [history, setHistory] = useState<string[]>(recent);

  const pick = (hex: string) => {
    setCurrent(hex);
    setHistory((prev) => [hex, ...prev.filter((c) => c.toLowerCase() !== hex.toLowerCase())].slice(0, 8));
    onChange?.(hex);
  };

  return (
    <div className="w-full max-w-xs">
      <div className="mb-3 flex items-center gap-3">
        <input type="color" value={current} onChange={(e: ChangeEvent<HTMLInputElement>) => pick(e.target.value)} aria-label="Current color" className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-black/10 bg-transparent dark:border-white/15" />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100" aria-live="polite">{current}</span>
      </div>
      <p className="mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">Recent</p>
      <div className="flex flex-wrap gap-2">
        {history.map((hex) => {
          const active = hex.toLowerCase() === current.toLowerCase();
          return (
            <button
              key={hex}
              type="button"
              onClick={() => pick(hex)}
              aria-label={hex}
              aria-pressed={active}
              style={{ backgroundColor: hex }}
              className={`relative flex h-8 w-8 items-center justify-center rounded-md border border-black/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${active ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:ring-blue-400 dark:ring-offset-gray-950' : ''}`}
            >
              {active ? (
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="#fff" strokeWidth="3" style={{ mixBlendMode: 'difference' }} aria-hidden="true">
                  <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ColorPickerRecentColorsPreview() {
  return <ColorPickerRecentColors />;
}
