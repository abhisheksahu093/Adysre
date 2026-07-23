'use client';

/**
 * Live preview for `time-picker-range-start-end`.
 *
 * Mirrors the `typescript` code variant. Fixed sample range; no `new Date()`.
 * Keep in step with `src/data/components/time-pickers.ts`.
 */
import { useMemo, useState } from 'react';

interface TimeRange {
  start: string;
  end: string;
}

interface TimePickerRangeStartEndProps {
  start: string;
  end: string;
  onChange: (range: TimeRange) => void;
  intervalMinutes?: number;
  className?: string;
}

interface TimeOption {
  value: string;
  label: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function to12h(hour24: number, minute: number): string {
  const period = hour24 < 12 ? 'AM' : 'PM';
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return h + ':' + pad2(minute) + ' ' + period;
}

function buildOptions(step: number): TimeOption[] {
  const out: TimeOption[] = [];
  for (let mins = 0; mins < 1440; mins += step) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    out.push({ value: pad2(h) + ':' + pad2(m), label: to12h(h, m) });
  }
  return out;
}

const selectCls =
  'w-full appearance-none rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

export function TimePickerRangeStartEnd({ start, end, onChange, intervalMinutes = 30, className = '' }: TimePickerRangeStartEndProps) {
  const options = useMemo<TimeOption[]>(() => buildOptions(Math.min(60, Math.max(5, intervalMinutes))), [intervalMinutes]);
  const invalid = end <= start;

  return (
    <div className={'w-full max-w-md ' + className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="range-start" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Start</label>
          <select id="range-start" value={start} onChange={(event) => onChange({ start: event.target.value, end })} className={selectCls + ' border-gray-300 dark:border-gray-700'}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <span aria-hidden="true" className="hidden pb-2.5 text-gray-400 sm:block">-</span>

        <div className="flex-1">
          <label htmlFor="range-end" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">End</label>
          <select
            id="range-end"
            value={end}
            onChange={(event) => onChange({ start, end: event.target.value })}
            aria-invalid={invalid}
            className={selectCls + (invalid ? ' border-red-500 dark:border-red-500' : ' border-gray-300 dark:border-gray-700')}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {invalid ? (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">End time must be after the start time.</p>
      ) : null}
    </div>
  );
}

export default function TimePickerRangeStartEndPreview() {
  const [range, setRange] = useState<TimeRange>({ start: '09:00', end: '10:30' });
  return <TimePickerRangeStartEnd start={range.start} end={range.end} onChange={setRange} />;
}
