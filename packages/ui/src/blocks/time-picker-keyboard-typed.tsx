'use client';

/**
 * Live preview for `time-picker-keyboard-typed`.
 *
 * Mirrors the `typescript` code variant. Fixed sample value; no `new Date()`.
 * Keep in step with `src/data/components/time-pickers.ts`.
 */
import { useRef, useState } from 'react';

interface TimePickerKeyboardTypedProps {
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

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function digitsOnly(raw: string): string {
  return raw.split('').filter((c) => c >= '0' && c <= '9').join('').slice(0, 2);
}

const inputCls = 'w-10 bg-transparent text-center text-lg font-semibold tabular-nums text-gray-900 focus:outline-none dark:text-gray-100';
const periodCls = 'px-2 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400';

export function TimePickerKeyboardTyped({ value, onChange, label = 'Time', className = '' }: TimePickerKeyboardTypedProps) {
  const minuteRef = useRef<HTMLInputElement | null>(null);
  const [hour, minute] = parseHM(value);
  const isPM = hour >= 12;
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  const commit = (h12: number, m: number, pm: boolean): void => {
    const base = h12 % 12;
    onChange(pad2((pm ? base + 12 : base) % 24) + ':' + pad2(m));
  };

  const onHour = (raw: string): void => {
    const digits = digitsOnly(raw);
    const h = digits === '' ? 12 : clamp(Number(digits), 1, 12);
    commit(h, minute, isPM);
    if (digits.length === 2 && minuteRef.current) minuteRef.current.focus();
  };

  const onMinute = (raw: string): void => {
    const digits = digitsOnly(raw);
    commit(hour12, digits === '' ? 0 : clamp(Number(digits), 0, 59), isPM);
  };

  return (
    <div className={'w-full max-w-xs ' + className}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" id="typed-label">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400" role="group" aria-labelledby="typed-label">
        <input
          inputMode="numeric"
          aria-label="Hours"
          value={pad2(hour12)}
          maxLength={2}
          onChange={(event) => onHour(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              commit(hour12 === 12 ? 1 : hour12 + 1, minute, isPM);
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              commit(hour12 === 1 ? 12 : hour12 - 1, minute, isPM);
            }
          }}
          className={inputCls}
        />
        <span aria-hidden="true" className="text-lg font-semibold text-gray-400">:</span>
        <input
          ref={minuteRef}
          inputMode="numeric"
          aria-label="Minutes"
          value={pad2(minute)}
          maxLength={2}
          onChange={(event) => onMinute(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              commit(hour12, (minute + 1) % 60, isPM);
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              commit(hour12, (minute + 59) % 60, isPM);
            }
          }}
          className={inputCls}
        />
        <div className="ml-auto inline-flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
          <button type="button" aria-pressed={!isPM} onClick={() => commit(hour12, minute, false)} className={periodCls + ' ' + (!isPM ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>AM</button>
          <button type="button" aria-pressed={isPM} onClick={() => commit(hour12, minute, true)} className={periodCls + ' ' + (isPM ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>PM</button>
        </div>
      </div>
    </div>
  );
}

export default function TimePickerKeyboardTypedPreview() {
  const [value, setValue] = useState<string>('09:05');
  return <TimePickerKeyboardTyped value={value} onChange={setValue} />;
}
