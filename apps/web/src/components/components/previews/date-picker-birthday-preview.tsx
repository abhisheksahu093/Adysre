'use client';

/**
 * Live preview for `date-picker-birthday`. Mirrors the `typescript` variant.
 * Three native selects (day / month / year) - the right tool for a date decades
 * back, where scrolling a calendar 40 years is cruelty. Age is computed against
 * the `today` prop, never the clock. Keep in step with
 * `src/data/components/date-pickers.ts`.
 */
import { useState } from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SELECT = 'h-11 min-w-0 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

function daysInMonth(monthIndex: number, year: number): number {
  if (monthIndex < 0) return 31;
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function ageOf(y: number, m: number, d: number, todayIso: string): number | null {
  const parts = todayIso.split('-').map(Number);
  const ty = parts[0];
  const tm = parts[1];
  const td = parts[2];
  if (!ty || !tm || !td) return null;
  let age = ty - y;
  if (tm < m + 1 || (tm === m + 1 && td < d)) age -= 1;
  return age;
}

interface DatePickerBirthdayProps {
  today?: string;
  maxYear?: number;
  className?: string;
}

function DatePickerBirthday({
  today = '2026-07-17',
  maxYear = 2026,
  className = '',
}: DatePickerBirthdayProps) {
  const [dayStr, setDayStr] = useState('');
  const [monthStr, setMonthStr] = useState('');
  const [yearStr, setYearStr] = useState('');

  const years: number[] = Array.from({ length: 100 }, (_, i) => maxYear - i);
  const yearNum = yearStr ? Number(yearStr) : maxYear;
  const monthNum = monthStr ? Number(monthStr) : 0;
  const days: number[] = Array.from({ length: daysInMonth(monthStr ? monthNum : -1, yearNum) }, (_, i) => i + 1);

  const complete = dayStr !== '' && monthStr !== '' && yearStr !== '';
  const age = complete ? ageOf(yearNum, monthNum, Number(dayStr), today) : null;

  return (
    <div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Date of birth</p>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="sr-only" htmlFor="dpb-day">Day</label>
          <select id="dpb-day" value={dayStr} onChange={(e) => setDayStr(e.target.value)} className={SELECT + ' w-full'}>
            <option value="">Day</option>
            {days.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>
        <div>
          <label className="sr-only" htmlFor="dpb-month">Month</label>
          <select id="dpb-month" value={monthStr} onChange={(e) => setMonthStr(e.target.value)} className={SELECT + ' w-full'}>
            <option value="">Month</option>
            {MONTHS.map((name, i) => (<option key={name} value={i}>{name}</option>))}
          </select>
        </div>
        <div>
          <label className="sr-only" htmlFor="dpb-year">Year</label>
          <select id="dpb-year" value={yearStr} onChange={(e) => setYearStr(e.target.value)} className={SELECT + ' w-full'}>
            <option value="">Year</option>
            {years.map((y) => (<option key={y} value={y}>{y}</option>))}
          </select>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
        {age !== null ? (MONTHS[monthNum] ?? '') + ' ' + dayStr + ', ' + yearStr + ' · ' + age + ' years old' : 'Select all three fields.'}
      </p>
    </div>
  );
}

export default function DatePickerBirthdayPreview() {
  return <DatePickerBirthday />;
}

export const minHeight = 240;
