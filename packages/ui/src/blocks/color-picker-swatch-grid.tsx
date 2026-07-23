'use client';

import { useState } from 'react';

/**
 * Live preview for `color-picker-swatch-grid`.
 *
 * Mirrors the `typescript` code variant against a fixed selection so the chosen
 * swatch (ring + check) is always the same one. Keep in step with
 * `src/data/components/color-pickers.ts`.
 */
interface ColorPickerSwatchGridProps {
  colors?: string[];
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
}

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
  '#6366f1', '#a855f7', '#ec4899', '#64748b', '#111827', '#ffffff',
];

export function ColorPickerSwatchGrid({
  colors = DEFAULT_COLORS,
  value,
  onChange,
  label = 'Choose a color',
}: ColorPickerSwatchGridProps) {
  const [internal, setInternal] = useState<string>(value ?? colors[0] ?? '#000000');
  const selected = value ?? internal;

  const select = (color: string) => {
    setInternal(color);
    onChange?.(color);
  };

  return (
    <div role="radiogroup" aria-label={label} className="w-full max-w-xs">
      <div className="grid grid-cols-6 gap-2">
        {colors.map((color) => {
          const isSelected = color.toLowerCase() === selected.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={color}
              onClick={() => select(color)}
              style={{ backgroundColor: color }}
              className={`relative flex aspect-square w-full items-center justify-center rounded-lg border border-black/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:ring-blue-400 dark:ring-offset-gray-950' : ''}`}
            >
              {isSelected ? (
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="#fff" strokeWidth="3" style={{ mixBlendMode: 'difference' }} aria-hidden="true">
                  <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        Selected <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{selected}</span>
      </p>
    </div>
  );
}

export default function ColorPickerSwatchGridPreview() {
  // Self-managed: deterministic initial selection is the first swatch.
  return <ColorPickerSwatchGrid />;
}
