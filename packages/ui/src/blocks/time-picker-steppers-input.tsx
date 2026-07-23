'use client';

/**
 * Live preview for `time-picker-steppers-input`.
 *
 * Mirrors the `typescript` code variant. Fixed sample value; no `new Date()`.
 * Keep in step with `src/data/components/time-pickers.ts`.
 */
import { useState } from 'react';

interface TimePickerSteppersInputProps {
  value: string;
  onChange: (value: string) => void;
  minuteStep?: number;
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

function wrap(n: number, max: number): number {
  return ((n % max) + max) % max;
}

const btnCls =
  'flex h-10 w-14 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400';
const readoutCls =
  'flex h-12 w-14 items-center justify-center rounded-lg border border-gray-300 bg-white text-2xl font-semibold tabular-nums text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

function ChevronUp() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}

export function TimePickerSteppersInput({
  value,
  onChange,
  minuteStep = 5,
  label = 'Time',
  className = '',
}: TimePickerSteppersInputProps) {
  const [hour, minute] = parseHM(value);
  const step = Math.min(30, Math.max(1, minuteStep));

  const setHour = (next: number): void => onChange(pad2(wrap(next, 24)) + ':' + pad2(minute));
  const setMinute = (next: number): void => onChange(pad2(hour) + ':' + pad2(wrap(next, 60)));

  return (
    <div className={'w-full max-w-xs ' + className}>
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <button type="button" aria-label="Increment hours" className={btnCls} onClick={() => setHour(hour + 1)}>
            <ChevronUp />
          </button>
          <div
            role="spinbutton"
            tabIndex={0}
            aria-label="Hours"
            aria-valuenow={hour}
            aria-valuemin={0}
            aria-valuemax={23}
            aria-valuetext={pad2(hour)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setHour(hour + 1);
              } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setHour(hour - 1);
              }
            }}
            className={readoutCls}
          >
            {pad2(hour)}
          </div>
          <button type="button" aria-label="Decrement hours" className={btnCls} onClick={() => setHour(hour - 1)}>
            <ChevronDown />
          </button>
        </div>

        <span className="pb-1 text-2xl font-semibold text-gray-400">:</span>

        <div className="flex flex-col items-center gap-1">
          <button type="button" aria-label="Increment minutes" className={btnCls} onClick={() => setMinute(minute + step)}>
            <ChevronUp />
          </button>
          <div
            role="spinbutton"
            tabIndex={0}
            aria-label="Minutes"
            aria-valuenow={minute}
            aria-valuemin={0}
            aria-valuemax={59}
            aria-valuetext={pad2(minute)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setMinute(minute + step);
              } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setMinute(minute - step);
              }
            }}
            className={readoutCls}
          >
            {pad2(minute)}
          </div>
          <button type="button" aria-label="Decrement minutes" className={btnCls} onClick={() => setMinute(minute - step)}>
            <ChevronDown />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TimePickerSteppersInputPreview() {
  const [value, setValue] = useState<string>('14:30');
  return <TimePickerSteppersInput value={value} onChange={setValue} />;
}
