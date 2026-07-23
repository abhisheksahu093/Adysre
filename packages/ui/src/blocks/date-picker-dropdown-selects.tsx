'use client';

/**
 * Live preview for `date-picker-dropdown-selects`. Mirrors the `typescript`
 * variant on a fixed July 2026. Month and year are native `<select>` menus so
 * the header is keyboard- and screen-reader-native. Keep in step with
 * `src/data/components/date-pickers.ts`.
 */
import { useState } from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS: ReadonlyArray<readonly [string, string]> = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
const SELECT = 'h-10 min-w-0 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';

function buildWeeks(year: number, month: number): Array<number | null>[] {
  const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: Array<number | null> = [];
  for (let i = 0; i < start; i += 1) cells.push(null);
  for (let d = 1; d <= total; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: Array<number | null>[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function iso(year: number, month: number, day: number): string {
  return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}

function dayClass(isSelected: boolean, isToday: boolean): string {
  const base = 'flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
  if (isSelected) return base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700';
  if (isToday) return base + ' font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
  return base + ' text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}

interface DatePickerDropdownSelectsProps {
  year?: number;
  month?: number;
  today?: string;
  selected?: string;
  years?: number[];
  className?: string;
}

export function DatePickerDropdownSelects({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  selected = '',
  years = [2024, 2025, 2026, 2027, 2028],
  className = '',
}: DatePickerDropdownSelectsProps) {
  const [sel, setSel] = useState(selected);
  const [viewYear, setViewYear] = useState(year);
  const [viewMonth, setViewMonth] = useState(month);
  const weeks = buildWeeks(viewYear, viewMonth);

  return (
    <div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-3 flex gap-2">
        <label className="sr-only" htmlFor="dpds-month">Month</label>
        <select id="dpds-month" value={viewMonth} onChange={(e) => setViewMonth(Number(e.target.value))} className={SELECT + ' flex-1'}>
          {MONTHS.map((name, i) => (<option key={name} value={i}>{name}</option>))}
        </select>
        <label className="sr-only" htmlFor="dpds-year">Year</label>
        <select id="dpds-year" value={viewYear} onChange={(e) => setViewYear(Number(e.target.value))} className={SELECT}>
          {years.map((y) => (<option key={y} value={y}>{y}</option>))}
        </select>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {DAY_HEADERS.map(([short, full], hi) => (
              <th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">{short}</span><span className="sr-only">{full}</span></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (day === null) return <td key={di} className="p-0.5" aria-hidden="true" />;
                const date = iso(viewYear, viewMonth, day);
                const isToday = date === today;
                const isSelected = date === sel;
                return (
                  <td key={di} className="p-0.5 text-center">
                    <button type="button" aria-selected={isSelected} aria-current={isToday ? 'date' : undefined} onClick={() => setSel(date)} className={dayClass(isSelected, isToday)}>{day}</button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DatePickerDropdownSelectsPreview() {
  return <DatePickerDropdownSelects selected="2026-07-21" />;
}

export const minHeight = 400;
