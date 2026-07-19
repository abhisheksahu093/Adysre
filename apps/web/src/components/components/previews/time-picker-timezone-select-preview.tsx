'use client';

/**
 * Live preview for `time-picker-timezone-select`.
 *
 * Mirrors the `typescript` code variant. Fixed sample time + zone; no
 * `new Date()`. Keep in step with `src/data/components/time-pickers.ts`.
 */
import { useMemo, useState } from 'react';

interface TimezoneOption {
  value: string;
  label: string;
}

interface TimePickerTimezoneValue {
  time: string;
  zone: string;
}

interface TimePickerTimezoneSelectProps {
  time: string;
  zone: string;
  onChange: (value: TimePickerTimezoneValue) => void;
  zones?: TimezoneOption[];
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

const DEFAULT_ZONES: TimezoneOption[] = [
  { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
  { value: 'America/New_York', label: 'Eastern (ET)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Berlin', label: 'Central Europe (CET)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

const selectCls =
  'w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

function TimePickerTimezoneSelect({
  time,
  zone,
  onChange,
  zones = DEFAULT_ZONES,
  intervalMinutes = 30,
  className = '',
}: TimePickerTimezoneSelectProps) {
  const options = useMemo<TimeOption[]>(() => buildOptions(Math.min(60, Math.max(5, intervalMinutes))), [intervalMinutes]);

  return (
    <div className={'w-full max-w-md ' + className}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:w-40">
          <label htmlFor="tz-time" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
          <select id="tz-time" value={time} onChange={(event) => onChange({ time: event.target.value, zone })} className={selectCls}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="tz-zone" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Time zone</label>
          <select id="tz-zone" value={zone} onChange={(event) => onChange({ time, zone: event.target.value })} className={selectCls}>
            {zones.map((z) => (
              <option key={z.value} value={z.value}>{z.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function TimePickerTimezoneSelectPreview() {
  const [value, setValue] = useState<TimePickerTimezoneValue>({ time: '09:30', zone: 'America/New_York' });
  return <TimePickerTimezoneSelect time={value.time} zone={value.zone} onChange={setValue} />;
}
