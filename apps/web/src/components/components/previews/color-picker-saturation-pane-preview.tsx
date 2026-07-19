'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

/**
 * Live preview for `color-picker-saturation-pane`.
 *
 * Mirrors the `typescript` code variant at a fixed hue. Pointer- and keyboard-
 * driveable. Keep in step with `src/data/components/color-pickers.ts`.
 */
export const minHeight = 340;

interface ColorPickerSaturationPaneProps {
  hue?: number;
  onChange?: (hex: string) => void;
}

function svToHex(h: number, s: number, v: number): string {
  const nv = v / 100;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return nv - nv * (s / 100) * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
}

function ColorPickerSaturationPane({ hue = 217, onChange }: ColorPickerSaturationPaneProps) {
  const paneRef = useRef<HTMLDivElement>(null);
  const [sat, setSat] = useState<number>(80);
  const [val, setVal] = useState<number>(80);
  const hex = svToHex(hue, sat, val);

  const apply = (s: number, v: number) => {
    setSat(s);
    setVal(v);
    onChange?.(svToHex(hue, s, v));
  };

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const el = paneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    apply(Math.round(x * 100), Math.round((1 - y) * 100));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowRight') apply(Math.min(100, sat + step), val);
    else if (event.key === 'ArrowLeft') apply(Math.max(0, sat - step), val);
    else if (event.key === 'ArrowUp') apply(sat, Math.min(100, val + step));
    else if (event.key === 'ArrowDown') apply(sat, Math.max(0, val - step));
    else return;
    event.preventDefault();
  };

  return (
    <div className="w-full max-w-xs">
      <div
        ref={paneRef}
        role="slider"
        tabIndex={0}
        aria-label="Saturation and brightness"
        aria-valuetext={hex}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); fromPointer(e); }}
        onPointerMove={(e) => { if (e.buttons === 1) fromPointer(e); }}
        onKeyDown={onKeyDown}
        className="relative h-44 w-full cursor-crosshair touch-none rounded-lg border border-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        style={{ background: `linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(${hue} 100% 50%))` }}
      >
        <span className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ring-1 ring-black/30" style={{ left: `${sat}%`, top: `${100 - val}%` }} />
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        Selected <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{hex}</span>
      </p>
    </div>
  );
}

export default function ColorPickerSaturationPanePreview() {
  return <ColorPickerSaturationPane hue={217} />;
}
