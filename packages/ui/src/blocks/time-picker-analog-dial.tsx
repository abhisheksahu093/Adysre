'use client';

/**
 * Live preview for `time-picker-analog-dial`.
 *
 * Mirrors the `typescript` code variant. Fixed sample value; no `new Date()`.
 * `minHeight` - the dial is a square that needs more than the 192px default.
 * Keep in step with `src/data/components/time-pickers.ts`.
 */
import { useState } from 'react';

interface TimePickerAnalogDialProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function parseHM(value: string): [number, number] {
  const parts = value.split(':');
  const h = Number(parts[0] ?? '0') || 0;
  const m = Number(parts[1] ?? '0') || 0;
  return [h, m];
}

const HOURS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function TimePickerAnalogDial({ value, onChange, label = 'Select hour', className = '' }: TimePickerAnalogDialProps) {
  const [hour24, minute] = parseHM(value);
  const isPM = hour24 >= 12;
  const shown = hour24 % 12 === 0 ? 12 : hour24 % 12;

  const handAngle = shown * 30 * (Math.PI / 180);
  const handX = 50 + 32 * Math.sin(handAngle);
  const handY = 50 - 32 * Math.cos(handAngle);

  const pick = (h12: number): void => {
    const base = h12 % 12;
    const next = isPM ? base + 12 : base;
    onChange(pad2(next % 24) + ':' + pad2(minute));
  };

  return (
    <div className={'w-full max-w-[16rem] ' + className}>
      <p className="mb-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <div className="relative mx-auto aspect-square w-full rounded-full border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <line x1="50" y1="50" x2={handX} y2={handY} className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="50" r="2.5" className="fill-blue-600 dark:fill-blue-400" />
        </svg>
        {HOURS.map((h) => {
          const angle = h * 30 * (Math.PI / 180);
          const left = 50 + 40 * Math.sin(angle);
          const top = 50 - 40 * Math.cos(angle);
          const active = h === shown;
          return (
            <button
              key={h}
              type="button"
              onClick={() => pick(h)}
              aria-pressed={active}
              aria-label={h + " o'clock"}
              style={{ left: left + '%', top: top + '%' }}
              className={
                'absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-semibold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ' +
                (active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800')
              }
            >
              {h}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TimePickerAnalogDialPreview() {
  const [value, setValue] = useState<string>('10:00');
  return <TimePickerAnalogDial value={value} onChange={setValue} />;
}

export const minHeight = 340;
