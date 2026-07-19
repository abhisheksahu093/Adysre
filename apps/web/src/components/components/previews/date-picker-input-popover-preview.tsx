'use client';

/**
 * Live preview for `date-picker-input-popover`. Mirrors the `typescript` variant
 * and opens on a fixed July 2026 so the stage is deterministic - `today` is a
 * prop, never `new Date()`. Keep in step with `src/data/components/date-pickers.ts`.
 */
import { useState } from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_HEADERS: ReadonlyArray<readonly [string, string]> = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
const NAV = 'inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400';

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

function formatIso(value: string): string {
  const parts = value.split('-').map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (!y || !m || !d) return '';
  return (ABBR[m - 1] ?? '') + ' ' + d + ', ' + y;
}

function dayClass(isSelected: boolean, isToday: boolean): string {
  const base = 'flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
  if (isSelected) return base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700';
  if (isToday) return base + ' font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
  return base + ' text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}

interface DatePickerInputPopoverProps {
  year?: number;
  month?: number;
  today?: string;
  value?: string;
  label?: string;
  className?: string;
}

function DatePickerInputPopover({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  value = '',
  label = 'Choose a date',
  className = '',
}: DatePickerInputPopoverProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const [viewYear, setViewYear] = useState(year);
  const [viewMonth, setViewMonth] = useState(month);
  const weeks = buildWeeks(viewYear, viewMonth);

  function go(delta: number) {
    const next = viewMonth + delta;
    setViewYear(viewYear + Math.floor(next / 12));
    setViewMonth(((next % 12) + 12) % 12);
  }

  return (
    <div className={['relative w-full max-w-xs', className].filter(Boolean).join(' ')}>
      <label htmlFor="dpip-input" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex">
        <input
          id="dpip-input"
          type="text"
          readOnly
          value={selected ? formatIso(selected) : ''}
          placeholder="Select a date"
          onClick={() => setOpen((o) => !o)}
          className="h-11 w-full min-w-0 rounded-l-lg border border-r-0 border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"
        />
        <button
          type="button"
          aria-label="Open calendar"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-r-lg border border-gray-300 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>
        </button>
      </div>

      {open ? (
        <div className="absolute left-0 z-10 mt-2 w-full max-w-xs rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center justify-between gap-2">
            <button type="button" aria-label="Previous month" onClick={() => go(-1)} className={NAV}>&lsaquo;</button>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[viewMonth] ?? '') + ' ' + viewYear}</span>
            <button type="button" aria-label="Next month" onClick={() => go(1)} className={NAV}>&rsaquo;</button>
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
                    const isSelected = date === selected;
                    return (
                      <td key={di} className="p-0.5 text-center">
                        <button type="button" aria-selected={isSelected} aria-current={isToday ? 'date' : undefined} onClick={() => { setSelected(date); setOpen(false); }} className={dayClass(isSelected, isToday)}>{day}</button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

export default function DatePickerInputPopoverPreview() {
  return <DatePickerInputPopover value="2026-07-21" />;
}

export const minHeight = 460;
