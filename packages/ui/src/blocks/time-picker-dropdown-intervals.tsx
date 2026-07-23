'use client';

/**
 * Live preview for `time-picker-dropdown-intervals`.
 *
 * Mirrors the `typescript` code variant. A fixed sample value keeps the render
 * deterministic - no `new Date()`. Keep in step with
 * `src/data/components/time-pickers.ts`.
 */
import { useMemo, useState } from 'react';

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

interface TimePickerDropdownIntervalsProps {
  value: string;
  onChange: (value: string) => void;
  intervalMinutes?: number;
  label?: string;
  id?: string;
  className?: string;
}

export function TimePickerDropdownIntervals({
  value,
  onChange,
  intervalMinutes = 30,
  label = 'Time',
  id = 'time-dropdown',
  className = '',
}: TimePickerDropdownIntervalsProps) {
  const options = useMemo<TimeOption[]>(() => {
    const step = Math.min(60, Math.max(5, intervalMinutes));
    const out: TimeOption[] = [];
    for (let mins = 0; mins < 1440; mins += step) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      out.push({ value: pad2(h) + ':' + pad2(m), label: to12h(h, m) });
    }
    return out;
  }, [intervalMinutes]);

  return (
    <div className={'w-full max-w-xs ' + className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-9 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

export default function TimePickerDropdownIntervalsPreview() {
  const [value, setValue] = useState<string>('09:30');
  return <TimePickerDropdownIntervals value={value} onChange={setValue} />;
}
