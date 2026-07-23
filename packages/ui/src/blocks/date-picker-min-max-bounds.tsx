'use client';

/**
 * Live preview for `date-picker-min-max-bounds`. Mirrors the `typescript`
 * variant on a fixed July 2026. Days outside [min, max] are truly `disabled` -
 * not just greyed - so they take no click and leave the tab order. Keep in step
 * with `src/data/components/date-pickers.ts`.
 */
import { useState } from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS: ReadonlyArray<readonly [string, string]> = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];

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

function dayClass(isSelected: boolean, isToday: boolean, disabled: boolean): string {
  const base = 'flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
  if (disabled) return base + ' cursor-not-allowed text-gray-300 line-through dark:text-gray-700';
  if (isSelected) return base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700';
  if (isToday) return base + ' font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
  return base + ' text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}

interface DatePickerMinMaxBoundsProps {
  year?: number;
  month?: number;
  today?: string;
  min?: string;
  max?: string;
  selected?: string;
  className?: string;
}

export function DatePickerMinMaxBounds({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  min = '2026-07-06',
  max = '2026-07-24',
  selected = '',
  className = '',
}: DatePickerMinMaxBoundsProps) {
  const [sel, setSel] = useState(selected);
  const weeks = buildWeeks(year, month);

  return (
    <div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[month] ?? '') + ' ' + year}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Bookable {min.slice(8)}-{max.slice(8)}</p>
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
                const date = iso(year, month, day);
                const disabled = date < min || date > max;
                const isToday = date === today;
                const isSelected = date === sel;
                return (
                  <td key={di} className="p-0.5 text-center">
                    <button type="button" disabled={disabled} aria-disabled={disabled} aria-selected={isSelected} aria-current={isToday ? 'date' : undefined} onClick={() => setSel(date)} className={dayClass(isSelected, isToday, disabled)}>{day}</button>
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

export default function DatePickerMinMaxBoundsPreview() {
  return <DatePickerMinMaxBounds selected="2026-07-17" />;
}

export const minHeight = 380;
