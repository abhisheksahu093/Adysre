'use client';

import { useState, type ChangeEvent } from 'react';

/**
 * Live preview for `color-picker-contrast-checker`.
 *
 * Mirrors the `typescript` code variant from a fixed, passing colour pair. Keep in
 * step with `src/data/components/color-pickers.ts`.
 */
export const minHeight = 340;

function channel(hex: string, i: number): number {
  const v = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  return 0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);
}

function ratio(fg: string, bg: string): number {
  const a = luminance(fg), b = luminance(bg);
  const lighter = Math.max(a, b), darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function Verdict({ label, passed }: { label: string; passed: boolean }) {
  return (
    <li className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${passed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}`}>
      <span aria-hidden="true">{passed ? '✓' : '✗'}</span>
      {label} {passed ? 'Pass' : 'Fail'}
    </li>
  );
}

interface ColorPickerContrastCheckerProps {
  foreground?: string;
  background?: string;
}

function ColorPickerContrastChecker({ foreground = '#1e293b', background = '#f8fafc' }: ColorPickerContrastCheckerProps) {
  const [fg, setFg] = useState<string>(foreground);
  const [bg, setBg] = useState<string>(background);
  const r = ratio(fg, bg);

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-black/10 p-4 dark:border-white/15" style={{ backgroundColor: bg, color: fg }}>
        <p className="text-base font-semibold">Sample text</p>
        <p className="text-sm">The quick brown fox.</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><input type="color" value={fg} onChange={(e: ChangeEvent<HTMLInputElement>) => setFg(e.target.value)} aria-label="Text color" className="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />Text</label>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><input type="color" value={bg} onChange={(e: ChangeEvent<HTMLInputElement>) => setBg(e.target.value)} aria-label="Background color" className="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />Background</label>
        <span className="ml-auto font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{r.toFixed(2)}:1</span>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2" aria-live="polite">
        <Verdict label="AA" passed={r >= 4.5} />
        <Verdict label="AAA" passed={r >= 7} />
      </ul>
    </div>
  );
}

export default function ColorPickerContrastCheckerPreview() {
  return <ColorPickerContrastChecker foreground="#1e293b" background="#f8fafc" />;
}
