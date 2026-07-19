'use client';

import { useState, type ChangeEvent } from 'react';

/**
 * Live preview for `color-picker-hue-slider`.
 *
 * Mirrors the `typescript` code variant with a fixed starting hue. Keep in step
 * with `src/data/components/color-pickers.ts`.
 */
interface ColorPickerHueSliderProps {
  hue?: number;
  onChange?: (hue: number) => void;
  label?: string;
}

function hueToHex(h: number): string {
  const s = 1, l = 0.5;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function ColorPickerHueSlider({ hue, onChange, label = 'Hue' }: ColorPickerHueSliderProps) {
  const [internal, setInternal] = useState<number>(hue ?? 200);
  const current = hue ?? internal;
  const hex = hueToHex(current);

  const handle = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div className="w-full max-w-xs">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-9 w-9 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundColor: hex }} />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{hex}</span>
        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">{label} {current}&deg;</span>
      </div>
      <input
        type="range"
        min={0}
        max={360}
        value={current}
        onChange={handle}
        aria-label={`${label}, ${hex}`}
        className="h-3 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        style={{ background: 'linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)' }}
      />
    </div>
  );
}

export default function ColorPickerHueSliderPreview() {
  // Self-managed: deterministic initial hue of 200.
  return <ColorPickerHueSlider />;
}
