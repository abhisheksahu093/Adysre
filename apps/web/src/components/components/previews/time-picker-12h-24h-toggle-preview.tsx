'use client';

/**
 * Live preview for `time-picker-12h-24h-toggle`.
 *
 * Mirrors the `typescript` code variant. Fixed sample value; no `new Date()`.
 * Keep in step with `src/data/components/time-pickers.ts`.
 */
import { useState } from 'react';

interface TimePicker12h24hToggleProps {
  value: string;
  onChange: (value: string) => void;
  minuteStep?: number;
  className?: string;
}

type TimeFormat = '12' | '24';

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function parseHM(value: string): [number, number] {
  const parts = value.split(':');
  const h = Number(parts[0] ?? '0') || 0;
  const m = Number(parts[1] ?? '0') || 0;
  return [h, m];
}

const selectCls =
  'appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
const pillCls =
  'rounded-md px-2.5 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400';

function TimePicker12h24hToggle({ value, onChange, minuteStep = 5, className = '' }: TimePicker12h24hToggleProps) {
  const [format, setFormat] = useState<TimeFormat>('12');
  const [hour, minute] = parseHM(value);
  const isPM = hour >= 12;
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  const step = Math.min(30, Math.max(1, minuteStep));
  const minutes: number[] = [];
  for (let m = 0; m < 60; m += step) minutes.push(m);
  const hours: number[] = format === '12'
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  const setHour24 = (h: number): void => onChange(pad2((h + 24) % 24) + ':' + pad2(minute));
  const setMinute = (m: number): void => onChange(pad2(hour) + ':' + pad2(m));
  const setHour12 = (h12: number): void => setHour24(isPM ? (h12 % 12) + 12 : h12 % 12);
  const setPeriod = (pm: boolean): void => setHour24(pm ? (hour % 12) + 12 : hour % 12);

  return (
    <div className={'w-full max-w-sm ' + className}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</span>
        <div className="inline-flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-700" role="group" aria-label="Time format">
          <button type="button" aria-pressed={format === '12'} onClick={() => setFormat('12')} className={pillCls + ' py-1 ' + (format === '12' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>12h</button>
          <button type="button" aria-pressed={format === '24'} onClick={() => setFormat('24')} className={pillCls + ' py-1 ' + (format === '24' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>24h</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Hour"
          value={format === '12' ? hour12 : hour}
          onChange={(event) => (format === '12' ? setHour12(Number(event.target.value)) : setHour24(Number(event.target.value)))}
          className={selectCls}
        >
          {hours.map((h) => (
            <option key={h} value={h}>{format === '12' ? h : pad2(h)}</option>
          ))}
        </select>

        <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">:</span>

        <select aria-label="Minute" value={minute} onChange={(event) => setMinute(Number(event.target.value))} className={selectCls}>
          {minutes.map((m) => (
            <option key={m} value={m}>{pad2(m)}</option>
          ))}
        </select>

        {format === '12' ? (
          <div className="inline-flex rounded-lg border border-gray-300 p-0.5 dark:border-gray-700" role="group" aria-label="AM or PM">
            <button type="button" aria-pressed={!isPM} onClick={() => setPeriod(false)} className={pillCls + ' ' + (!isPM ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>AM</button>
            <button type="button" aria-pressed={isPM} onClick={() => setPeriod(true)} className={pillCls + ' ' + (isPM ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400')}>PM</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function TimePicker12h24hTogglePreview() {
  const [value, setValue] = useState<string>('09:30');
  return <TimePicker12h24hToggle value={value} onChange={setValue} />;
}
