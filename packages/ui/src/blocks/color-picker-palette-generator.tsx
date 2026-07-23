'use client';

import { useState, type ChangeEvent } from 'react';

/**
 * Live preview for `color-picker-palette-generator`.
 *
 * Mirrors the `typescript` code variant from a fixed base colour. Keep in step
 * with `src/data/components/color-pickers.ts`.
 */
export const minHeight = 240;

const STEPS: Array<{ name: string; l: number }> = [
  { name: '50', l: 97 }, { name: '100', l: 94 }, { name: '200', l: 86 }, { name: '300', l: 77 },
  { name: '400', l: 68 }, { name: '500', l: 58 }, { name: '600', l: 48 }, { name: '700', l: 39 },
  { name: '800', l: 30 }, { name: '900', l: 22 },
];

function hexToHsl(hex: string): { h: number; s: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: Math.round(s * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

interface ColorPickerPaletteGeneratorProps {
  base?: string;
  onSelect?: (hex: string) => void;
}

export function ColorPickerPaletteGenerator({ base = '#3b82f6', onSelect }: ColorPickerPaletteGeneratorProps) {
  const [color, setColor] = useState<string>(base);
  const { h, s } = hexToHsl(color);
  const ramp = STEPS.map((step) => ({ name: step.name, hex: hslToHex(h, s, step.l), dark: step.l < 55 }));

  return (
    <div className="w-full max-w-sm">
      <div className="mb-3 flex items-center gap-3">
        <input type="color" value={color} onChange={(e: ChangeEvent<HTMLInputElement>) => setColor(e.target.value)} aria-label="Base color" className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-black/10 bg-transparent dark:border-white/15" />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">Base {color}</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {ramp.map((step) => (
          <button
            key={step.name}
            type="button"
            onClick={() => onSelect?.(step.hex)}
            aria-label={step.hex}
            style={{ backgroundColor: step.hex }}
            className={`flex aspect-square items-end justify-center rounded-md border border-black/10 pb-0.5 text-[9px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${step.dark ? 'text-white' : 'text-gray-700'}`}
          >
            {step.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ColorPickerPaletteGeneratorPreview() {
  return <ColorPickerPaletteGenerator base="#3b82f6" />;
}
