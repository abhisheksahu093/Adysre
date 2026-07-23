'use client';

/**
 * Live preview for `time-picker-duration`.
 *
 * Mirrors the `typescript` code variant. Fixed sample value (150 minutes);
 * no `new Date()`. Keep in step with `src/data/components/time-pickers.ts`.
 */
import { useState } from 'react';

interface TimePickerDurationProps {
  value: number;
  onChange: (minutes: number) => void;
  maxHours?: number;
  minuteStep?: number;
  className?: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

const selectCls =
  'w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

export function TimePickerDuration({ value, onChange, maxHours = 12, minuteStep = 5, className = '' }: TimePickerDurationProps) {
  const total = Math.max(0, value);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  const hourOptions: number[] = [];
  for (let h = 0; h <= maxHours; h += 1) hourOptions.push(h);
  const step = Math.min(30, Math.max(1, minuteStep));
  const minuteOptions: number[] = [];
  for (let m = 0; m < 60; m += step) minuteOptions.push(m);

  return (
    <div className={'w-full max-w-sm ' + className}>
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Duration</span>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="dur-hours" className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Hours</label>
          <select id="dur-hours" value={hours} onChange={(event) => onChange(Number(event.target.value) * 60 + minutes)} className={selectCls}>
            {hourOptions.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dur-minutes" className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Minutes</label>
          <select id="dur-minutes" value={minutes} onChange={(event) => onChange(hours * 60 + Number(event.target.value))} className={selectCls}>
            {minuteOptions.map((m) => (
              <option key={m} value={m}>{pad2(m)}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        Total: <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">{hours}h {pad2(minutes)}m</span>
      </p>
    </div>
  );
}

export default function TimePickerDurationPreview() {
  const [value, setValue] = useState<number>(150);
  return <TimePickerDuration value={value} onChange={setValue} />;
}
