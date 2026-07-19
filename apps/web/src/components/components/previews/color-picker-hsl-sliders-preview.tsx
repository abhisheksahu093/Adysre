'use client';

import { useState, type ChangeEvent } from 'react';

/**
 * Live preview for `color-picker-hsl-sliders`.
 *
 * Mirrors the `typescript` code variant, self-managed from a fixed HSL start.
 * Keep in step with `src/data/components/color-pickers.ts`.
 */
export const minHeight = 280;

interface Hsl {
  h: number;
  s: number;
  l: number;
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function ColorPickerHslSliders() {
  const [hsl, setHsl] = useState<Hsl>({ h: 217, s: 91, l: 60 });
  const hex = hslToHex(hsl.h, hsl.s, hsl.l);

  const set = (key: keyof Hsl) => (event: ChangeEvent<HTMLInputElement>) => {
    setHsl((prev) => ({ ...prev, [key]: Number(event.target.value) }));
  };

  const track = (key: keyof Hsl): string => {
    if (key === 'h') return 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)';
    if (key === 's') return `linear-gradient(to right,${hslToHex(hsl.h, 0, hsl.l)},${hslToHex(hsl.h, 100, hsl.l)})`;
    return `linear-gradient(to right,#000,${hslToHex(hsl.h, hsl.s, 50)},#fff)`;
  };

  const rows: Array<{ key: keyof Hsl; label: string; max: number }> = [
    { key: 'h', label: 'Hue', max: 360 },
    { key: 's', label: 'Saturation', max: 100 },
    { key: 'l', label: 'Lightness', max: 100 },
  ];

  return (
    <div className="w-full max-w-xs space-y-3">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundColor: hex }} />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{hex}</span>
        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">hsl({hsl.h} {hsl.s}% {hsl.l}%)</span>
      </div>
      {rows.map((row) => (
        <label key={row.key} className="block text-xs font-medium text-gray-600 dark:text-gray-400">
          {row.label}
          <input
            type="range"
            min={0}
            max={row.max}
            value={hsl[row.key]}
            onChange={set(row.key)}
            aria-label={`${row.label}, ${hex}`}
            className="mt-1 h-3 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
            style={{ background: track(row.key) }}
          />
        </label>
      ))}
    </div>
  );
}

export default function ColorPickerHslSlidersPreview() {
  return <ColorPickerHslSliders />;
}
