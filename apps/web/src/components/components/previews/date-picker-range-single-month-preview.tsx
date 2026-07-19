'use client';

/**
 * Live preview for `date-picker-range-single-month`. Mirrors the `typescript`
 * variant on a fixed July 2026. Range endpoints and the days between are derived
 * from two ISO strings that compare chronologically because they are zero-padded.
 * Keep in step with `src/data/components/date-pickers.ts`.
 */
import { useState } from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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

function label(value: string): string {
  const parts = value.split('-').map(Number);
  const m = parts[1];
  const d = parts[2];
  if (!m || !d) return '';
  return (ABBR[m - 1] ?? '') + ' ' + d;
}

function cellClass(isEnd: boolean, inRange: boolean, isToday: boolean): string {
  const base = 'flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
  if (isEnd) return base + ' rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700';
  if (inRange) return base + ' bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60';
  if (isToday) return base + ' rounded-lg font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
  return base + ' rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}

interface DatePickerRangeSingleMonthProps {
  year?: number;
  month?: number;
  today?: string;
  startValue?: string;
  endValue?: string;
  className?: string;
}

function DatePickerRangeSingleMonth({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  startValue = '',
  endValue = '',
  className = '',
}: DatePickerRangeSingleMonthProps) {
  const [start, setStart] = useState(startValue);
  const [end, setEnd] = useState(endValue);
  const weeks = buildWeeks(year, month);

  function pick(date: string) {
    if (!start || (start && end)) {
      setStart(date);
      setEnd('');
    } else if (date < start) {
      setEnd(start);
      setStart(date);
    } else {
      setEnd(date);
    }
  }

  return (
    <div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[month] ?? '') + ' ' + year}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">{start ? label(start) + (end ? ' - ' + label(end) : ' - …') : 'Pick a start date'}</p>
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
                const isToday = date === today;
                const isEnd = date === start || date === end;
                const inRange = Boolean(start && end && date > start && date < end);
                return (
                  <td key={di} className="p-0.5 text-center">
                    <button type="button" aria-selected={isEnd || inRange} aria-current={isToday ? 'date' : undefined} onClick={() => pick(date)} className={cellClass(isEnd, inRange, isToday)}>{day}</button>
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

export default function DatePickerRangeSingleMonthPreview() {
  return <DatePickerRangeSingleMonth startValue="2026-07-12" endValue="2026-07-21" />;
}

export const minHeight = 380;
