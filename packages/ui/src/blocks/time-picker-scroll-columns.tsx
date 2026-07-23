'use client';

/**
 * Live preview for `time-picker-scroll-columns`.
 *
 * Mirrors the `typescript` code variant. Fixed sample value; no `new Date()`.
 * Keep in step with `src/data/components/time-pickers.ts`.
 */
import { useState } from 'react';

interface TimePickerScrollColumnsProps {
  value: string;
  onChange: (value: string) => void;
  minuteStep?: number;
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
const colCls = 'h-40 flex-1 space-y-1 overflow-y-auto scroll-smooth p-1';

function cellCls(active: boolean): string {
  return (
    'w-full rounded-md px-2 py-2 text-sm font-medium tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ' +
    (active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800')
  );
}

export function TimePickerScrollColumns({ value, onChange, minuteStep = 5, className = '' }: TimePickerScrollColumnsProps) {
  const [hour24, minute] = parseHM(value);
  const isPM = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  const step = Math.min(30, Math.max(1, minuteStep));
  const minutes: number[] = [];
  for (let m = 0; m < 60; m += step) minutes.push(m);

  const commit = (h12: number, m: number, pm: boolean): void => {
    const base = h12 % 12;
    onChange(pad2((pm ? base + 12 : base) % 24) + ':' + pad2(m));
  };

  return (
    <div className={'w-full max-w-xs rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ' + className}>
      <div className="flex divide-x divide-gray-200 dark:divide-gray-800" role="group" aria-label="Select time">
        <div className={colCls} aria-label="Hour">
          {HOURS.map((h) => (
            <button key={h} type="button" aria-pressed={h === hour12} onClick={() => commit(h, minute, isPM)} className={cellCls(h === hour12)}>{pad2(h)}</button>
          ))}
        </div>
        <div className={colCls} aria-label="Minute">
          {minutes.map((m) => (
            <button key={m} type="button" aria-pressed={m === minute} onClick={() => commit(hour12, m, isPM)} className={cellCls(m === minute)}>{pad2(m)}</button>
          ))}
        </div>
        <div className={colCls} aria-label="Period">
          {[false, true].map((pm) => (
            <button key={pm ? 'PM' : 'AM'} type="button" aria-pressed={pm === isPM} onClick={() => commit(hour12, minute, pm)} className={cellCls(pm === isPM)}>{pm ? 'PM' : 'AM'}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TimePickerScrollColumnsPreview() {
  const [value, setValue] = useState<string>('14:30');
  return <TimePickerScrollColumns value={value} onChange={setValue} />;
}

export const minHeight = 220;
