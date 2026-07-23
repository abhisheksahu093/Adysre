'use client';

import { useState, type ChangeEvent } from 'react';

/**
 * Live preview for `color-picker-gradient-builder`.
 *
 * Mirrors the `typescript` code variant from fixed endpoints. Keep in step with
 * `src/data/components/color-pickers.ts`.
 */
export const minHeight = 320;

interface ColorPickerGradientBuilderProps {
  from?: string;
  to?: string;
  angle?: number;
  onChange?: (css: string) => void;
}

export function ColorPickerGradientBuilder({ from = '#6366f1', to = '#ec4899', angle = 90, onChange }: ColorPickerGradientBuilderProps) {
  const [f, setF] = useState<string>(from);
  const [t, setT] = useState<string>(to);
  const [a, setA] = useState<number>(angle);
  const css = `linear-gradient(${a}deg, ${f}, ${t})`;

  return (
    <div className="w-full max-w-sm">
      <div className="h-28 w-full rounded-xl border border-black/10 dark:border-white/15" style={{ background: css }} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <input type="color" value={f} onChange={(e: ChangeEvent<HTMLInputElement>) => { setF(e.target.value); onChange?.(`linear-gradient(${a}deg, ${e.target.value}, ${t})`); }} aria-label="From color" className="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />
          From
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <input type="color" value={t} onChange={(e: ChangeEvent<HTMLInputElement>) => { setT(e.target.value); onChange?.(`linear-gradient(${a}deg, ${f}, ${e.target.value})`); }} aria-label="To color" className="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />
          To
        </label>
        <label className="ml-auto flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          Angle
          <input type="range" min={0} max={360} value={a} onChange={(e: ChangeEvent<HTMLInputElement>) => { const n = Number(e.target.value); setA(n); onChange?.(`linear-gradient(${n}deg, ${f}, ${t})`); }} aria-label={`Angle, ${a} degrees`} className="w-24 accent-indigo-600 dark:accent-indigo-400" />
        </label>
      </div>
      <code className="mt-3 block overflow-x-auto whitespace-nowrap rounded-md bg-gray-100 px-3 py-2 font-mono text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">{css}</code>
    </div>
  );
}

export default function ColorPickerGradientBuilderPreview() {
  return <ColorPickerGradientBuilder from="#6366f1" to="#ec4899" angle={90} />;
}
