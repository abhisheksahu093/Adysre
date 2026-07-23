'use client';

/**
 * Live preview for `date-picker-with-presets`. Mirrors the `typescript` variant.
 * Presets are computed by adding days to the `today` prop, so the whole picker
 * stays deterministic and never reads the clock. Keep in step with
 * `src/data/components/date-pickers.ts`.
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

function addDays(base: string, n: number): string {
  const parts = base.split('-').map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (!y || !m || !d) return base;
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

function dayClass(isSelected: boolean, isToday: boolean): string {
  const base = 'flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
  if (isSelected) return base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700';
  if (isToday) return base + ' font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
  return base + ' text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}

interface DatePickerWithPresetsProps {
  today?: string;
  selected?: string;
  className?: string;
}

export function DatePickerWithPresets({
  today = '2026-07-17',
  selected = '',
  className = '',
}: DatePickerWithPresetsProps) {
  const presets: Array<[string, string]> = [
    ['Today', today],
    ['Tomorrow', addDays(today, 1)],
    ['In 3 days', addDays(today, 3)],
    ['Next week', addDays(today, 7)],
    ['In 2 weeks', addDays(today, 14)],
  ];
  const initial = selected || today;
  const initialParts = initial.split('-').map(Number);
  const [sel, setSel] = useState(selected);
  const [viewYear, setViewYear] = useState(initialParts[0] ?? 2026);
  const [viewMonth, setViewMonth] = useState((initialParts[1] ?? 7) - 1);
  const weeks = buildWeeks(viewYear, viewMonth);

  function choose(date: string) {
    setSel(date);
    const parts = date.split('-').map(Number);
    setViewYear(parts[0] ?? viewYear);
    setViewMonth((parts[1] ?? viewMonth + 1) - 1);
  }

  return (
    <div className={['flex w-full max-w-md flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <ul className="flex flex-row flex-wrap gap-2 sm:w-32 sm:flex-none sm:flex-col">
        {presets.map(([name, date]) => {
          const active = date === sel;
          return (
            <li key={name}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => choose(date)}
                className={['w-full rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400', active ? 'bg-blue-600 font-semibold text-white hover:bg-blue-700' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'].join(' ')}
              >
                {name}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="min-w-0 flex-1">
        <h2 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[viewMonth] ?? '') + ' ' + viewYear}</h2>
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
                      <button type="button" aria-selected={isSelected} aria-current={isToday ? 'date' : undefined} onClick={() => choose(date)} className={dayClass(isSelected, isToday)}>{day}</button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DatePickerWithPresetsPreview() {
  return <DatePickerWithPresets selected="2026-07-24" />;
}

export const minHeight = 420;
