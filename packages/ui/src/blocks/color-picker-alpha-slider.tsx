'use client';

import { useState, type ChangeEvent } from 'react';

/**
 * Live preview for `color-picker-alpha-slider`.
 *
 * Mirrors the `typescript` code variant over a fixed base colour. Keep in step
 * with `src/data/components/color-pickers.ts`.
 */
interface ColorPickerAlphaSliderProps {
  color?: string;
  alpha?: number;
  onChange?: (alpha: number) => void;
}

function toRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function ColorPickerAlphaSlider({ color = '#3b82f6', alpha = 100, onChange }: ColorPickerAlphaSliderProps) {
  const [internal, setInternal] = useState<number>(alpha);
  const [r, g, b] = toRgb(color);
  const a = (internal / 100).toFixed(2);
  const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
  const check = 'repeating-conic-gradient(#ccc 0% 25%,#fff 0% 50%)';

  const handle = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div className="w-full max-w-xs">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-9 w-9 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundImage: `linear-gradient(${rgba},${rgba}),${check}`, backgroundSize: 'auto,10px 10px' }} />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{rgba}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={internal}
        onChange={handle}
        aria-label={`Opacity, ${rgba}`}
        className="h-4 w-full cursor-pointer appearance-none rounded-full border border-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        style={{ backgroundImage: `linear-gradient(to right,rgba(${r},${g},${b},0),rgba(${r},${g},${b},1)),${check}`, backgroundSize: 'auto,12px 12px' }}
      />
    </div>
  );
}

export default function ColorPickerAlphaSliderPreview() {
  return <ColorPickerAlphaSlider color="#3b82f6" alpha={60} />;
}
