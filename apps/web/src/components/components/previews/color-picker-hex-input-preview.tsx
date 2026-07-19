'use client';

import { useState, type ChangeEvent } from 'react';

/**
 * Live preview for `color-picker-hex-input`.
 *
 * Mirrors the `typescript` code variant from a fixed valid hex. Keep in step with
 * `src/data/components/color-pickers.ts`.
 */
interface ColorPickerHexInputProps {
  value?: string;
  onChange?: (hex: string) => void;
  label?: string;
}

const HEX = /^#[0-9a-fA-F]{6}$/;

function ColorPickerHexInput({ value = '#3b82f6', onChange, label = 'Hex color' }: ColorPickerHexInputProps) {
  const [draft, setDraft] = useState<string>(value);
  const valid = HEX.test(draft);

  const commit = (next: string) => {
    setDraft(next);
    if (HEX.test(next)) onChange?.(next);
  };

  return (
    <div className="w-full max-w-xs">
      <label htmlFor="hex-in" className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{label}</label>
      <div className="flex items-center gap-2">
        <label className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundColor: valid ? draft : '#e5e7eb' }}>
          <span className="sr-only">Pick with system color picker</span>
          <input type="color" value={valid ? draft : '#3b82f6'} onChange={(e: ChangeEvent<HTMLInputElement>) => commit(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
        </label>
        <input
          id="hex-in"
          type="text"
          value={draft}
          onChange={(e: ChangeEvent<HTMLInputElement>) => commit(e.target.value)}
          inputMode="text"
          spellCheck={false}
          aria-invalid={!valid}
          aria-describedby="hex-hint"
          className={`h-10 w-full rounded-lg border bg-transparent px-3 font-mono text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 dark:text-gray-100 ${valid ? 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400' : 'border-rose-500 focus-visible:ring-rose-500 dark:border-rose-400'}`}
        />
      </div>
      {valid ? (
        <p id="hex-hint" className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">Enter a 6-digit hex, e.g. #1e293b.</p>
      ) : (
        <p id="hex-hint" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden="true"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.9.9 0 01.9.9v4a.9.9 0 01-1.8 0v-4A.9.9 0 018 4zm0 8.4a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" /></svg>
          Not a valid 6-digit hex.
        </p>
      )}
    </div>
  );
}

export default function ColorPickerHexInputPreview() {
  return <ColorPickerHexInput value="#3b82f6" />;
}
