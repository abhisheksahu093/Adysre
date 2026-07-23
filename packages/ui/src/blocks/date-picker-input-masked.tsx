'use client';

/**
 * Live preview for `date-picker-input-masked`. Mirrors the `typescript` variant.
 * Typing is masked to MM/DD/YYYY; a valid parse drives the mini calendar, and
 * clicking a day writes back into the field. Deterministic on a fixed July 2026.
 * Keep in step with `src/data/components/date-pickers.ts`.
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

function digitsOf(text: string): string {
  return text.replace(/\D/g, '').slice(0, 8);
}

function mask(text: string): string {
  const d = digitsOf(text);
  let out = d.slice(0, 2);
  if (d.length > 2) out += '/' + d.slice(2, 4);
  if (d.length > 4) out += '/' + d.slice(4, 8);
  return out;
}

interface Parsed {
  y: number;
  m: number;
  d: number;
}

function parse(text: string): Parsed | null {
  const d = digitsOf(text);
  if (d.length < 8) return null;
  const mm = Number(d.slice(0, 2));
  const dd = Number(d.slice(2, 4));
  const yyyy = Number(d.slice(4, 8));
  if (mm < 1 || mm > 12) return null;
  const daysInMonth = new Date(Date.UTC(yyyy, mm, 0)).getUTCDate();
  if (dd < 1 || dd > daysInMonth) return null;
  return { y: yyyy, m: mm - 1, d: dd };
}

function dayClass(isSelected: boolean, isToday: boolean): string {
  const base = 'flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
  if (isSelected) return base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700';
  if (isToday) return base + ' font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
  return base + ' text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}

interface DatePickerInputMaskedProps {
  year?: number;
  month?: number;
  today?: string;
  value?: string;
  className?: string;
}

export function DatePickerInputMasked({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  value = '',
  className = '',
}: DatePickerInputMaskedProps) {
  const [text, setText] = useState(value);
  const parsed = parse(text);
  const viewYear = parsed ? parsed.y : year;
  const viewMonth = parsed ? parsed.m : month;
  const selected = parsed ? iso(parsed.y, parsed.m, parsed.d) : '';
  const weeks = buildWeeks(viewYear, viewMonth);
  const complete = digitsOf(text).length === 8;

  return (
    <div className={['w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <label htmlFor="dpim-input" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Date (MM/DD/YYYY)</label>
      <input
        id="dpim-input"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="MM/DD/YYYY"
        aria-invalid={complete && !parsed}
        aria-describedby="dpim-hint"
        value={text}
        onChange={(e) => setText(mask(e.target.value))}
        className={['h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100', complete && !parsed ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400'].join(' ')}
      />
      <p id="dpim-hint" className={['mb-3 mt-1 text-xs', complete && !parsed ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'].join(' ')}>
        {complete && !parsed ? 'Not a valid date.' : parsed ? 'Parsed: ' + (MONTHS[parsed.m] ?? '') + ' ' + parsed.d + ', ' + parsed.y : 'Type a date or pick one below.'}
      </p>
      <table className="w-full border-collapse">
        <caption className="mb-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[viewMonth] ?? '') + ' ' + viewYear}</caption>
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
                    <button type="button" aria-selected={isSelected} aria-current={isToday ? 'date' : undefined} onClick={() => setText(String(viewMonth + 1).padStart(2, '0') + '/' + String(day).padStart(2, '0') + '/' + viewYear)} className={dayClass(isSelected, isToday)}>{day}</button>
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

export default function DatePickerInputMaskedPreview() {
  return <DatePickerInputMasked value="07/21/2026" />;
}

export const minHeight = 440;
