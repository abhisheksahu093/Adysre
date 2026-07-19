import type { ComponentEntry } from './types';

/**
 * Date pickers category.
 *
 * Ten pickers that are really four jobs: choosing one day (input-popover,
 * inline, dropdown-selects, masked), choosing a range (single-month, dual-month),
 * choosing under constraints (min-max bounds, week), and the two edge cases a
 * calendar grid is wrong for -- presets (a range you name, not scroll to) and a
 * birthday (a date decades back, where selects beat scrolling 40 years). The
 * shared spine is the calendar exemplar's: a real <table> with abbreviated
 * <th scope="col"> day names (full name in an sr-only span) and h-10 cells,
 * because at 320px each of seven columns is ~41px and the column width *is* the
 * tap target. Two rules hold everywhere: "today" is always a prop, never
 * new Date() -- a picker that reads the clock renders differently every day, and
 * out-of-range days are truly `disabled`, not merely greyed, so they take no
 * click and leave the tab order. Every sample opens on a fixed July 2026.
 */
export const datePickersComponents: ComponentEntry[] = [
  {
    slug: 'date-picker-input-popover',
    category: 'date-pickers',
    tags: ['date-picker', 'popover', 'input', 'calendar', 'dropdown'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1720, copies: 468, downloads: 112 },
    props: [
      { name: 'year', type: 'number', default: '2026', descriptionKey: 'year' },
      { name: 'month', type: 'number', default: '6', descriptionKey: 'month' },
      { name: 'today', type: 'string', default: "'2026-07-17'", descriptionKey: 'today' },
      { name: 'value', type: 'string', default: "''", descriptionKey: 'value' },
      { name: 'label', type: 'string', default: "'Choose a date'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="relative w-full max-w-xs">
  <label for="dp-input" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Choose a date</label>
  <div class="flex">
    <input id="dp-input" type="text" readonly value="Jul 21, 2026" placeholder="Select a date" class="h-11 w-full min-w-0 rounded-l-lg border border-r-0 border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    <button type="button" aria-label="Open calendar" aria-expanded="true" class="inline-flex h-11 w-11 flex-none items-center justify-center rounded-r-lg border border-gray-300 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400">
      <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>
    </button>
  </div>
  <div class="absolute left-0 z-10 mt-2 w-full max-w-xs rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900">
    <div class="mb-2 flex items-center justify-between gap-2">
      <button type="button" aria-label="Previous month" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">&lsaquo;</button>
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">July 2026</span>
      <button type="button" aria-label="Next month" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">&rsaquo;</button>
    </div>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Su</span><span class="sr-only">Sunday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Mo</span><span class="sr-only">Monday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Tu</span><span class="sr-only">Tuesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">We</span><span class="sr-only">Wednesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Th</span><span class="sr-only">Thursday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Fr</span><span class="sr-only">Friday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Sa</span><span class="sr-only">Saturday</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">1</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">2</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">3</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">4</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">5</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">6</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">7</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">8</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">9</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">10</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">11</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">12</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">13</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">14</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">15</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">16</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-current="date" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800">17</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">18</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">19</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">20</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">21</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">22</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">23</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">24</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">25</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">26</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">27</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">28</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">29</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">30</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">31</button></td>
            <td class="p-0.5" aria-hidden="true"></td>
          </tr>
        </tbody>
      </table>
  </div>
</div>`,
      react: `'use client';
import { useState } from 'react';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
const NAV = 'inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400';
function buildWeeks(year, month) {
    const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = [];
    for (let i = 0; i < start; i += 1)
        cells.push(null);
    for (let d = 1; d <= total; d += 1)
        cells.push(d);
    while (cells.length % 7 !== 0)
        cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7)
        weeks.push(cells.slice(i, i + 7));
    return weeks;
}
function iso(year, month, day) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}
function formatIso(value) {
    const parts = value.split('-').map(Number);
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];
    if (!y || !m || !d)
        return '';
    return (ABBR[m - 1] ?? '') + ' ' + d + ', ' + y;
}
function dayClass(isSelected, isToday) {
    const base = 'flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
    if (isSelected)
        return base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700';
    if (isToday)
        return base + ' font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
    return base + ' text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}
export function DatePickerInputPopover({ year = 2026, month = 6, today = '2026-07-17', value = '', label = 'Choose a date', className = '', }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(value);
    const [viewYear, setViewYear] = useState(year);
    const [viewMonth, setViewMonth] = useState(month);
    const weeks = buildWeeks(viewYear, viewMonth);
    function go(delta) {
        const next = viewMonth + delta;
        setViewYear(viewYear + Math.floor(next / 12));
        setViewMonth(((next % 12) + 12) % 12);
    }
    return (<div className={['relative w-full max-w-xs', className].filter(Boolean).join(' ')}>
      <label htmlFor="dpip-input" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex">
        <input id="dpip-input" type="text" readOnly value={selected ? formatIso(selected) : ''} placeholder="Select a date" onClick={() => setOpen((o) => !o)} className="h-11 w-full min-w-0 rounded-l-lg border border-r-0 border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"/>
        <button type="button" aria-label="Open calendar" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-r-lg border border-gray-300 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
        </button>
      </div>

      {open ? (<div className="absolute left-0 z-10 mt-2 w-full max-w-xs rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center justify-between gap-2">
            <button type="button" aria-label="Previous month" onClick={() => go(-1)} className={NAV}>&lsaquo;</button>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[viewMonth] ?? '') + ' ' + viewYear}</span>
            <button type="button" aria-label="Next month" onClick={() => go(1)} className={NAV}>&rsaquo;</button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {DAY_HEADERS.map(([short, full], hi) => (<th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">{short}</span><span className="sr-only">{full}</span></th>))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, wi) => (<tr key={wi}>
                  {week.map((day, di) => {
                    if (day === null)
                        return <td key={di} className="p-0.5" aria-hidden="true"/>;
                    const date = iso(viewYear, viewMonth, day);
                    const isToday = date === today;
                    const isSelected = date === selected;
                    return (<td key={di} className="p-0.5 text-center">
                        <button type="button" aria-selected={isSelected} aria-current={isToday ? 'date' : undefined} onClick={() => { setSelected(date); setOpen(false); }} className={dayClass(isSelected, isToday)}>{day}</button>
                      </td>);
                })}
                </tr>))}
            </tbody>
          </table>
        </div>) : null}
    </div>);
}
`,
      typescript: `'use client';

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

export interface DatePickerInputPopoverProps {
  year?: number;
  month?: number;
  today?: string;
  value?: string;
  label?: string;
  className?: string;
}

export function DatePickerInputPopover({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  value = '',
  label = 'Choose a date',
  className = '',
}: DatePickerInputPopoverProps): JSX.Element {
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
`,
    },
  },
  {
    slug: 'date-picker-inline-calendar',
    category: 'date-pickers',
    tags: ['date-picker', 'calendar', 'inline', 'month', 'grid'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1610, copies: 442, downloads: 98 },
    props: [
      { name: 'year', type: 'number', default: '2026', descriptionKey: 'year' },
      { name: 'month', type: 'number', default: '6', descriptionKey: 'month' },
      { name: 'today', type: 'string', default: "'2026-07-17'", descriptionKey: 'today' },
      { name: 'selected', type: 'string', default: "''", descriptionKey: 'selected' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <div class="mb-2 flex items-center justify-between gap-2">
    <button type="button" aria-label="Previous month" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">&lsaquo;</button>
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">July 2026</h2>
    <button type="button" aria-label="Next month" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">&rsaquo;</button>
  </div>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Su</span><span class="sr-only">Sunday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Mo</span><span class="sr-only">Monday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Tu</span><span class="sr-only">Tuesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">We</span><span class="sr-only">Wednesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Th</span><span class="sr-only">Thursday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Fr</span><span class="sr-only">Friday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Sa</span><span class="sr-only">Saturday</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">1</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">2</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">3</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">4</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">5</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">6</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">7</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">8</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">9</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">10</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">11</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">12</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">13</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">14</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">15</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">16</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-current="date" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800">17</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">18</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">19</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">20</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">21</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">22</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">23</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">24</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">25</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">26</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">27</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">28</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">29</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">30</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">31</button></td>
            <td class="p-0.5" aria-hidden="true"></td>
          </tr>
        </tbody>
      </table>
</div>`,
      react: `'use client';
import { useState } from 'react';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
const NAV = 'inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400';
function buildWeeks(year, month) {
    const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = [];
    for (let i = 0; i < start; i += 1)
        cells.push(null);
    for (let d = 1; d <= total; d += 1)
        cells.push(d);
    while (cells.length % 7 !== 0)
        cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7)
        weeks.push(cells.slice(i, i + 7));
    return weeks;
}
function iso(year, month, day) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}
function dayClass(isSelected, isToday) {
    const base = 'flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
    if (isSelected)
        return base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700';
    if (isToday)
        return base + ' font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
    return base + ' text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}
export function DatePickerInlineCalendar({ year = 2026, month = 6, today = '2026-07-17', selected = '', className = '', }) {
    const [sel, setSel] = useState(selected);
    const [viewYear, setViewYear] = useState(year);
    const [viewMonth, setViewMonth] = useState(month);
    const weeks = buildWeeks(viewYear, viewMonth);
    function go(delta) {
        const next = viewMonth + delta;
        setViewYear(viewYear + Math.floor(next / 12));
        setViewMonth(((next % 12) + 12) % 12);
    }
    return (<div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <button type="button" aria-label="Previous month" onClick={() => go(-1)} className={NAV}>&lsaquo;</button>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[viewMonth] ?? '') + ' ' + viewYear}</h2>
        <button type="button" aria-label="Next month" onClick={() => go(1)} className={NAV}>&rsaquo;</button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {DAY_HEADERS.map(([short, full], hi) => (<th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">{short}</span><span className="sr-only">{full}</span></th>))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (<tr key={wi}>
              {week.map((day, di) => {
                if (day === null)
                    return <td key={di} className="p-0.5" aria-hidden="true"/>;
                const date = iso(viewYear, viewMonth, day);
                const isToday = date === today;
                const isSelected = date === sel;
                return (<td key={di} className="p-0.5 text-center">
                    <button type="button" aria-selected={isSelected} aria-current={isToday ? 'date' : undefined} onClick={() => setSel(date)} className={dayClass(isSelected, isToday)}>{day}</button>
                  </td>);
            })}
            </tr>))}
        </tbody>
      </table>
    </div>);
}
`,
      typescript: `'use client';

import { useState } from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS: ReadonlyArray<readonly [string, string]> = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
const NAV = 'inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400';

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

export interface DatePickerInlineCalendarProps {
  year?: number;
  month?: number;
  today?: string;
  selected?: string;
  className?: string;
}

export function DatePickerInlineCalendar({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  selected = '',
  className = '',
}: DatePickerInlineCalendarProps): JSX.Element {
  const [sel, setSel] = useState(selected);
  const [viewYear, setViewYear] = useState(year);
  const [viewMonth, setViewMonth] = useState(month);
  const weeks = buildWeeks(viewYear, viewMonth);

  function go(delta: number) {
    const next = viewMonth + delta;
    setViewYear(viewYear + Math.floor(next / 12));
    setViewMonth(((next % 12) + 12) % 12);
  }

  return (
    <div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <button type="button" aria-label="Previous month" onClick={() => go(-1)} className={NAV}>&lsaquo;</button>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[viewMonth] ?? '') + ' ' + viewYear}</h2>
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
`,
    },
  },
  {
    slug: 'date-picker-range-single-month',
    category: 'date-pickers',
    tags: ['date-picker', 'range', 'month', 'calendar', 'selection'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1490, copies: 408, downloads: 91 },
    props: [
      { name: 'year', type: 'number', default: '2026', descriptionKey: 'year' },
      { name: 'month', type: 'number', default: '6', descriptionKey: 'month' },
      { name: 'today', type: 'string', default: "'2026-07-17'", descriptionKey: 'today' },
      { name: 'startValue', type: 'string', default: "''", descriptionKey: 'startValue' },
      { name: 'endValue', type: 'string', default: "''", descriptionKey: 'endValue' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <div class="mb-2 flex items-center justify-between gap-2">
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">July 2026</h2>
    <p class="text-xs text-gray-500 dark:text-gray-400">Jul 12 &ndash; Jul 21</p>
  </div>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Su</span><span class="sr-only">Sunday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Mo</span><span class="sr-only">Monday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Tu</span><span class="sr-only">Tuesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">We</span><span class="sr-only">Wednesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Th</span><span class="sr-only">Thursday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Fr</span><span class="sr-only">Friday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Sa</span><span class="sr-only">Saturday</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">1</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">2</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">3</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">4</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">5</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">6</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">7</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">8</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">9</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">10</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">11</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700">12</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">13</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">14</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">15</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">16</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">17</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">18</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">19</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">20</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700">21</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">22</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">23</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">24</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">25</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">26</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">27</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">28</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">29</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">30</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">31</button></td>
            <td class="p-0.5" aria-hidden="true"></td>
          </tr>
        </tbody>
      </table>
</div>`,
      react: `'use client';
import { useState } from 'react';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
function buildWeeks(year, month) {
    const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = [];
    for (let i = 0; i < start; i += 1)
        cells.push(null);
    for (let d = 1; d <= total; d += 1)
        cells.push(d);
    while (cells.length % 7 !== 0)
        cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7)
        weeks.push(cells.slice(i, i + 7));
    return weeks;
}
function iso(year, month, day) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}
function label(value) {
    const parts = value.split('-').map(Number);
    const m = parts[1];
    const d = parts[2];
    if (!m || !d)
        return '';
    return (ABBR[m - 1] ?? '') + ' ' + d;
}
function cellClass(isEnd, inRange, isToday) {
    const base = 'flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
    if (isEnd)
        return base + ' rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700';
    if (inRange)
        return base + ' bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60';
    if (isToday)
        return base + ' rounded-lg font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
    return base + ' rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}
export function DatePickerRangeSingleMonth({ year = 2026, month = 6, today = '2026-07-17', startValue = '', endValue = '', className = '', }) {
    const [start, setStart] = useState(startValue);
    const [end, setEnd] = useState(endValue);
    const weeks = buildWeeks(year, month);
    function pick(date) {
        if (!start || (start && end)) {
            setStart(date);
            setEnd('');
        }
        else if (date < start) {
            setEnd(start);
            setStart(date);
        }
        else {
            setEnd(date);
        }
    }
    return (<div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[month] ?? '') + ' ' + year}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">{start ? label(start) + (end ? ' - ' + label(end) : ' - …') : 'Pick a start date'}</p>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {DAY_HEADERS.map(([short, full], hi) => (<th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">{short}</span><span className="sr-only">{full}</span></th>))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (<tr key={wi}>
              {week.map((day, di) => {
                if (day === null)
                    return <td key={di} className="p-0.5" aria-hidden="true"/>;
                const date = iso(year, month, day);
                const isToday = date === today;
                const isEnd = date === start || date === end;
                const inRange = Boolean(start && end && date > start && date < end);
                return (<td key={di} className="p-0.5 text-center">
                    <button type="button" aria-selected={isEnd || inRange} aria-current={isToday ? 'date' : undefined} onClick={() => pick(date)} className={cellClass(isEnd, inRange, isToday)}>{day}</button>
                  </td>);
            })}
            </tr>))}
        </tbody>
      </table>
    </div>);
}
`,
      typescript: `'use client';

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

export interface DatePickerRangeSingleMonthProps {
  year?: number;
  month?: number;
  today?: string;
  startValue?: string;
  endValue?: string;
  className?: string;
}

export function DatePickerRangeSingleMonth({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  startValue = '',
  endValue = '',
  className = '',
}: DatePickerRangeSingleMonthProps): JSX.Element {
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
`,
    },
  },
  {
    slug: 'date-picker-range-dual-month',
    category: 'date-pickers',
    tags: ['date-picker', 'range', 'dual', 'calendar', 'responsive'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1380, copies: 379, downloads: 84 },
    props: [
      { name: 'year', type: 'number', default: '2026', descriptionKey: 'year' },
      { name: 'month', type: 'number', default: '6', descriptionKey: 'month' },
      { name: 'today', type: 'string', default: "'2026-07-17'", descriptionKey: 'today' },
      { name: 'startValue', type: 'string', default: "''", descriptionKey: 'startValue' },
      { name: 'endValue', type: 'string', default: "''", descriptionKey: 'endValue' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <div class="mb-2 flex items-center justify-between gap-2">
    <button type="button" aria-label="Previous month" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">&lsaquo;</button>
    <p class="text-xs text-gray-500 dark:text-gray-400">Jul 21 &ndash; Aug 4</p>
    <button type="button" aria-label="Next month" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">&rsaquo;</button>
  </div>
  <div class="grid gap-4 sm:grid-cols-2">
    <div>
      <table class="w-full border-collapse">
        <caption class="mb-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">July 2026</caption>
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Su</span><span class="sr-only">Sunday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Mo</span><span class="sr-only">Monday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Tu</span><span class="sr-only">Tuesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">We</span><span class="sr-only">Wednesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Th</span><span class="sr-only">Thursday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Fr</span><span class="sr-only">Friday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Sa</span><span class="sr-only">Saturday</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">1</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">2</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">3</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">4</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">5</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">6</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">7</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">8</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">9</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">10</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">11</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">12</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">13</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">14</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">15</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">16</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-current="date" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800">17</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">18</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">19</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">20</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700">21</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">22</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">23</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">24</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">25</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">26</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">27</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">28</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">29</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">30</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">31</button></td>
            <td class="p-0.5" aria-hidden="true"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <table class="w-full border-collapse">
        <caption class="mb-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">August 2026</caption>
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Su</span><span class="sr-only">Sunday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Mo</span><span class="sr-only">Monday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Tu</span><span class="sr-only">Tuesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">We</span><span class="sr-only">Wednesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Th</span><span class="sr-only">Thursday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Fr</span><span class="sr-only">Friday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Sa</span><span class="sr-only">Saturday</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">1</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">2</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60">3</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700">4</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">5</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">6</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">7</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">8</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">9</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">10</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">11</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">12</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">13</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">14</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">15</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">16</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">17</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">18</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">19</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">20</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">21</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">22</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">23</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">24</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">25</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">26</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">27</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">28</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">29</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">30</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">31</button></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>`,
      react: `'use client';
import { useState } from 'react';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
const NAV = 'inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400';
function buildWeeks(year, month) {
    const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = [];
    for (let i = 0; i < start; i += 1)
        cells.push(null);
    for (let d = 1; d <= total; d += 1)
        cells.push(d);
    while (cells.length % 7 !== 0)
        cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7)
        weeks.push(cells.slice(i, i + 7));
    return weeks;
}
function iso(year, month, day) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}
function label(value) {
    const parts = value.split('-').map(Number);
    const m = parts[1];
    const d = parts[2];
    if (!m || !d)
        return '';
    return (ABBR[m - 1] ?? '') + ' ' + d;
}
function cellClass(isEnd, inRange, isToday) {
    const base = 'flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
    if (isEnd)
        return base + ' rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700';
    if (inRange)
        return base + ' bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60';
    if (isToday)
        return base + ' rounded-lg font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
    return base + ' rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}
export function DatePickerRangeDualMonth({ year = 2026, month = 6, today = '2026-07-17', startValue = '', endValue = '', className = '', }) {
    const [start, setStart] = useState(startValue);
    const [end, setEnd] = useState(endValue);
    const [baseYear, setBaseYear] = useState(year);
    const [baseMonth, setBaseMonth] = useState(month);
    function pick(date) {
        if (!start || (start && end)) {
            setStart(date);
            setEnd('');
        }
        else if (date < start) {
            setEnd(start);
            setStart(date);
        }
        else {
            setEnd(date);
        }
    }
    function go(delta) {
        const next = baseMonth + delta;
        setBaseYear(baseYear + Math.floor(next / 12));
        setBaseMonth(((next % 12) + 12) % 12);
    }
    const nextMonth = baseMonth + 1;
    const months = [
        [baseYear, baseMonth],
        [baseYear + Math.floor(nextMonth / 12), nextMonth % 12],
    ];
    function renderMonth(y, m) {
        const weeks = buildWeeks(y, m);
        return (<table className="w-full border-collapse">
        <caption className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[m] ?? '') + ' ' + y}</caption>
        <thead>
          <tr>
            {DAY_HEADERS.map(([short, full], hi) => (<th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">{short}</span><span className="sr-only">{full}</span></th>))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (<tr key={wi}>
              {week.map((day, di) => {
                    if (day === null)
                        return <td key={di} className="p-0.5" aria-hidden="true"/>;
                    const date = iso(y, m, day);
                    const isToday = date === today;
                    const isEnd = date === start || date === end;
                    const inRange = Boolean(start && end && date > start && date < end);
                    return (<td key={di} className="p-0.5 text-center">
                    <button type="button" aria-selected={isEnd || inRange} aria-current={isToday ? 'date' : undefined} onClick={() => pick(date)} className={cellClass(isEnd, inRange, isToday)}>{day}</button>
                  </td>);
                })}
            </tr>))}
        </tbody>
      </table>);
    }
    return (<div className={['w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <button type="button" aria-label="Previous month" onClick={() => go(-1)} className={NAV}>&lsaquo;</button>
        <p className="text-xs text-gray-500 dark:text-gray-400">{start ? label(start) + (end ? ' - ' + label(end) : ' - …') : 'Pick a start date'}</p>
        <button type="button" aria-label="Next month" onClick={() => go(1)} className={NAV}>&rsaquo;</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {months.map(([y, m], i) => (<div key={i}>{renderMonth(y, m)}</div>))}
      </div>
    </div>);
}
`,
      typescript: `'use client';

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

function label(value: string): string {
  const parts = value.split('-').map(Number);
  const m = parts[1];
  const d = parts[2];
  if (!m || !d) return '';
  return (ABBR[m - 1] ?? '') + ' ' + d;
}

function cellClass(isEnd: boolean, inRange: boolean, isToday: boolean): string {
  const base = 'flex h-9 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
  if (isEnd) return base + ' rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700';
  if (inRange) return base + ' bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:hover:bg-blue-900/60';
  if (isToday) return base + ' rounded-lg font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
  return base + ' rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}

export interface DatePickerRangeDualMonthProps {
  year?: number;
  month?: number;
  today?: string;
  startValue?: string;
  endValue?: string;
  className?: string;
}

export function DatePickerRangeDualMonth({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  startValue = '',
  endValue = '',
  className = '',
}: DatePickerRangeDualMonthProps): JSX.Element {
  const [start, setStart] = useState(startValue);
  const [end, setEnd] = useState(endValue);
  const [baseYear, setBaseYear] = useState(year);
  const [baseMonth, setBaseMonth] = useState(month);

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

  function go(delta: number) {
    const next = baseMonth + delta;
    setBaseYear(baseYear + Math.floor(next / 12));
    setBaseMonth(((next % 12) + 12) % 12);
  }

  const nextMonth = baseMonth + 1;
  const months: Array<[number, number]> = [
    [baseYear, baseMonth],
    [baseYear + Math.floor(nextMonth / 12), nextMonth % 12],
  ];

  function renderMonth(y: number, m: number) {
    const weeks = buildWeeks(y, m);
    return (
      <table className="w-full border-collapse">
        <caption className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[m] ?? '') + ' ' + y}</caption>
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
                const date = iso(y, m, day);
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
    );
  }

  return (
    <div className={['w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <button type="button" aria-label="Previous month" onClick={() => go(-1)} className={NAV}>&lsaquo;</button>
        <p className="text-xs text-gray-500 dark:text-gray-400">{start ? label(start) + (end ? ' - ' + label(end) : ' - …') : 'Pick a start date'}</p>
        <button type="button" aria-label="Next month" onClick={() => go(1)} className={NAV}>&rsaquo;</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {months.map(([y, m], i) => (
          <div key={i}>{renderMonth(y, m)}</div>
        ))}
      </div>
    </div>
  );
}
`,
    },
  },
  {
    slug: 'date-picker-with-presets',
    category: 'date-pickers',
    tags: ['date-picker', 'presets', 'shortcuts', 'calendar', 'quick'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1300, copies: 356, downloads: 79 },
    props: [
      { name: 'today', type: 'string', default: "'2026-07-17'", descriptionKey: 'today' },
      { name: 'selected', type: 'string', default: "''", descriptionKey: 'selected' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="flex w-full max-w-md flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row dark:border-gray-800 dark:bg-gray-900">
  <ul class="flex flex-row flex-wrap gap-2 sm:w-32 sm:flex-none sm:flex-col">
      <li><button type="button" aria-pressed="false" class="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Today</button></li>
      <li><button type="button" aria-pressed="false" class="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Tomorrow</button></li>
      <li><button type="button" aria-pressed="false" class="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">In 3 days</button></li>
      <li><button type="button" aria-pressed="false" class="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Next week</button></li>
      <li><button type="button" aria-pressed="true" class="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">In 2 weeks</button></li>
  </ul>
  <div class="min-w-0 flex-1">
    <h2 class="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">July 2026</h2>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Su</span><span class="sr-only">Sunday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Mo</span><span class="sr-only">Monday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Tu</span><span class="sr-only">Tuesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">We</span><span class="sr-only">Wednesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Th</span><span class="sr-only">Thursday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Fr</span><span class="sr-only">Friday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Sa</span><span class="sr-only">Saturday</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">1</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">2</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">3</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">4</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">5</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">6</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">7</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">8</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">9</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">10</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">11</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">12</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">13</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">14</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">15</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">16</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-current="date" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800">17</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">18</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">19</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">20</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">21</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">22</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">23</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">24</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">25</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">26</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">27</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">28</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">29</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">30</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">31</button></td>
            <td class="p-0.5" aria-hidden="true"></td>
          </tr>
        </tbody>
      </table>
  </div>
</div>`,
      react: `'use client';
import { useState } from 'react';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
function buildWeeks(year, month) {
    const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = [];
    for (let i = 0; i < start; i += 1)
        cells.push(null);
    for (let d = 1; d <= total; d += 1)
        cells.push(d);
    while (cells.length % 7 !== 0)
        cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7)
        weeks.push(cells.slice(i, i + 7));
    return weeks;
}
function iso(year, month, day) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}
function addDays(base, n) {
    const parts = base.split('-').map(Number);
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];
    if (!y || !m || !d)
        return base;
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() + n);
    return dt.toISOString().slice(0, 10);
}
function dayClass(isSelected, isToday) {
    const base = 'flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
    if (isSelected)
        return base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700';
    if (isToday)
        return base + ' font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
    return base + ' text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}
export function DatePickerWithPresets({ today = '2026-07-17', selected = '', className = '', }) {
    const presets = [
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
    function choose(date) {
        setSel(date);
        const parts = date.split('-').map(Number);
        setViewYear(parts[0] ?? viewYear);
        setViewMonth((parts[1] ?? viewMonth + 1) - 1);
    }
    return (<div className={['flex w-full max-w-md flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <ul className="flex flex-row flex-wrap gap-2 sm:w-32 sm:flex-none sm:flex-col">
        {presets.map(([name, date]) => {
            const active = date === sel;
            return (<li key={name}>
              <button type="button" aria-pressed={active} onClick={() => choose(date)} className={['w-full rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400', active ? 'bg-blue-600 font-semibold text-white hover:bg-blue-700' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'].join(' ')}>
                {name}
              </button>
            </li>);
        })}
      </ul>
      <div className="min-w-0 flex-1">
        <h2 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[viewMonth] ?? '') + ' ' + viewYear}</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {DAY_HEADERS.map(([short, full], hi) => (<th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">{short}</span><span className="sr-only">{full}</span></th>))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (<tr key={wi}>
                {week.map((day, di) => {
                if (day === null)
                    return <td key={di} className="p-0.5" aria-hidden="true"/>;
                const date = iso(viewYear, viewMonth, day);
                const isToday = date === today;
                const isSelected = date === sel;
                return (<td key={di} className="p-0.5 text-center">
                      <button type="button" aria-selected={isSelected} aria-current={isToday ? 'date' : undefined} onClick={() => choose(date)} className={dayClass(isSelected, isToday)}>{day}</button>
                    </td>);
            })}
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>);
}
`,
      typescript: `'use client';

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

export interface DatePickerWithPresetsProps {
  today?: string;
  selected?: string;
  className?: string;
}

export function DatePickerWithPresets({
  today = '2026-07-17',
  selected = '',
  className = '',
}: DatePickerWithPresetsProps): JSX.Element {
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
`,
    },
  },
  {
    slug: 'date-picker-dropdown-selects',
    category: 'date-pickers',
    tags: ['date-picker', 'select', 'dropdown', 'calendar', 'navigation'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1240, copies: 338, downloads: 74 },
    props: [
      { name: 'year', type: 'number', default: '2026', descriptionKey: 'year' },
      { name: 'month', type: 'number', default: '6', descriptionKey: 'month' },
      { name: 'today', type: 'string', default: "'2026-07-17'", descriptionKey: 'today' },
      { name: 'selected', type: 'string', default: "''", descriptionKey: 'selected' },
      { name: 'years', type: 'number[]', default: '[2024, 2025, 2026, 2027, 2028]', descriptionKey: 'years' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <div class="mb-3 flex gap-2">
    <label class="sr-only" for="dp-month">Month</label>
    <select id="dp-month" class="h-10 min-w-0 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 flex-1">
        <option value="0">January</option>
        <option value="1">February</option>
        <option value="2">March</option>
        <option value="3">April</option>
        <option value="4">May</option>
        <option value="5">June</option>
        <option value="6" selected>July</option>
        <option value="7">August</option>
        <option value="8">September</option>
        <option value="9">October</option>
        <option value="10">November</option>
        <option value="11">December</option>
    </select>
    <label class="sr-only" for="dp-year">Year</label>
    <select id="dp-year" class="h-10 min-w-0 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">
        <option value="2024">2024</option>
        <option value="2025">2025</option>
        <option value="2026" selected>2026</option>
        <option value="2027">2027</option>
        <option value="2028">2028</option>
    </select>
  </div>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Su</span><span class="sr-only">Sunday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Mo</span><span class="sr-only">Monday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Tu</span><span class="sr-only">Tuesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">We</span><span class="sr-only">Wednesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Th</span><span class="sr-only">Thursday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Fr</span><span class="sr-only">Friday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Sa</span><span class="sr-only">Saturday</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">1</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">2</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">3</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">4</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">5</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">6</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">7</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">8</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">9</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">10</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">11</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">12</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">13</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">14</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">15</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">16</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-current="date" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800">17</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">18</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">19</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">20</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">21</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">22</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">23</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">24</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">25</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">26</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">27</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">28</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">29</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">30</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">31</button></td>
            <td class="p-0.5" aria-hidden="true"></td>
          </tr>
        </tbody>
      </table>
</div>`,
      react: `'use client';
import { useState } from 'react';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
const SELECT = 'h-10 min-w-0 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
function buildWeeks(year, month) {
    const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = [];
    for (let i = 0; i < start; i += 1)
        cells.push(null);
    for (let d = 1; d <= total; d += 1)
        cells.push(d);
    while (cells.length % 7 !== 0)
        cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7)
        weeks.push(cells.slice(i, i + 7));
    return weeks;
}
function iso(year, month, day) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}
function dayClass(isSelected, isToday) {
    const base = 'flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
    if (isSelected)
        return base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700';
    if (isToday)
        return base + ' font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
    return base + ' text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}
export function DatePickerDropdownSelects({ year = 2026, month = 6, today = '2026-07-17', selected = '', years = [2024, 2025, 2026, 2027, 2028], className = '', }) {
    const [sel, setSel] = useState(selected);
    const [viewYear, setViewYear] = useState(year);
    const [viewMonth, setViewMonth] = useState(month);
    const weeks = buildWeeks(viewYear, viewMonth);
    return (<div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
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
            {DAY_HEADERS.map(([short, full], hi) => (<th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">{short}</span><span className="sr-only">{full}</span></th>))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (<tr key={wi}>
              {week.map((day, di) => {
                if (day === null)
                    return <td key={di} className="p-0.5" aria-hidden="true"/>;
                const date = iso(viewYear, viewMonth, day);
                const isToday = date === today;
                const isSelected = date === sel;
                return (<td key={di} className="p-0.5 text-center">
                    <button type="button" aria-selected={isSelected} aria-current={isToday ? 'date' : undefined} onClick={() => setSel(date)} className={dayClass(isSelected, isToday)}>{day}</button>
                  </td>);
            })}
            </tr>))}
        </tbody>
      </table>
    </div>);
}
`,
      typescript: `'use client';

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

export interface DatePickerDropdownSelectsProps {
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
}: DatePickerDropdownSelectsProps): JSX.Element {
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
`,
    },
  },
  {
    slug: 'date-picker-input-masked',
    category: 'date-pickers',
    tags: ['date-picker', 'input', 'mask', 'validation', 'keyboard'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1180, copies: 321, downloads: 70 },
    props: [
      { name: 'year', type: 'number', default: '2026', descriptionKey: 'year' },
      { name: 'month', type: 'number', default: '6', descriptionKey: 'month' },
      { name: 'today', type: 'string', default: "'2026-07-17'", descriptionKey: 'today' },
      { name: 'value', type: 'string', default: "''", descriptionKey: 'value' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <label for="dp-mask" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Date (MM/DD/YYYY)</label>
  <input id="dp-mask" type="text" inputmode="numeric" autocomplete="off" placeholder="MM/DD/YYYY" value="07/21/2026" aria-describedby="dp-mask-hint" class="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
  <p id="dp-mask-hint" class="mb-3 mt-1 text-xs text-gray-500 dark:text-gray-400">Parsed: July 21, 2026</p>
      <table class="w-full border-collapse">
        <caption class="mb-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">July 2026</caption>
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Su</span><span class="sr-only">Sunday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Mo</span><span class="sr-only">Monday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Tu</span><span class="sr-only">Tuesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">We</span><span class="sr-only">Wednesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Th</span><span class="sr-only">Thursday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Fr</span><span class="sr-only">Friday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Sa</span><span class="sr-only">Saturday</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">1</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">2</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">3</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">4</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">5</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">6</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">7</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">8</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">9</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">10</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">11</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">12</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">13</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">14</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">15</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">16</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-current="date" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800">17</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">18</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">19</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">20</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">21</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">22</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">23</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">24</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">25</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">26</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">27</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">28</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">29</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">30</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">31</button></td>
            <td class="p-0.5" aria-hidden="true"></td>
          </tr>
        </tbody>
      </table>
</div>`,
      react: `'use client';
import { useState } from 'react';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
function buildWeeks(year, month) {
    const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = [];
    for (let i = 0; i < start; i += 1)
        cells.push(null);
    for (let d = 1; d <= total; d += 1)
        cells.push(d);
    while (cells.length % 7 !== 0)
        cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7)
        weeks.push(cells.slice(i, i + 7));
    return weeks;
}
function iso(year, month, day) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}
function digitsOf(text) {
    return text.replace(/\\D/g, '').slice(0, 8);
}
function mask(text) {
    const d = digitsOf(text);
    let out = d.slice(0, 2);
    if (d.length > 2)
        out += '/' + d.slice(2, 4);
    if (d.length > 4)
        out += '/' + d.slice(4, 8);
    return out;
}
function parse(text) {
    const d = digitsOf(text);
    if (d.length < 8)
        return null;
    const mm = Number(d.slice(0, 2));
    const dd = Number(d.slice(2, 4));
    const yyyy = Number(d.slice(4, 8));
    if (mm < 1 || mm > 12)
        return null;
    const daysInMonth = new Date(Date.UTC(yyyy, mm, 0)).getUTCDate();
    if (dd < 1 || dd > daysInMonth)
        return null;
    return { y: yyyy, m: mm - 1, d: dd };
}
function dayClass(isSelected, isToday) {
    const base = 'flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
    if (isSelected)
        return base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700';
    if (isToday)
        return base + ' font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
    return base + ' text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}
export function DatePickerInputMasked({ year = 2026, month = 6, today = '2026-07-17', value = '', className = '', }) {
    const [text, setText] = useState(value);
    const parsed = parse(text);
    const viewYear = parsed ? parsed.y : year;
    const viewMonth = parsed ? parsed.m : month;
    const selected = parsed ? iso(parsed.y, parsed.m, parsed.d) : '';
    const weeks = buildWeeks(viewYear, viewMonth);
    const complete = digitsOf(text).length === 8;
    return (<div className={['w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <label htmlFor="dpim-input" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Date (MM/DD/YYYY)</label>
      <input id="dpim-input" type="text" inputMode="numeric" autoComplete="off" placeholder="MM/DD/YYYY" aria-invalid={complete && !parsed} aria-describedby="dpim-hint" value={text} onChange={(e) => setText(mask(e.target.value))} className={['h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100', complete && !parsed ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400'].join(' ')}/>
      <p id="dpim-hint" className={['mb-3 mt-1 text-xs', complete && !parsed ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'].join(' ')}>
        {complete && !parsed ? 'Not a valid date.' : parsed ? 'Parsed: ' + (MONTHS[parsed.m] ?? '') + ' ' + parsed.d + ', ' + parsed.y : 'Type a date or pick one below.'}
      </p>
      <table className="w-full border-collapse">
        <caption className="mb-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[viewMonth] ?? '') + ' ' + viewYear}</caption>
        <thead>
          <tr>
            {DAY_HEADERS.map(([short, full], hi) => (<th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">{short}</span><span className="sr-only">{full}</span></th>))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (<tr key={wi}>
              {week.map((day, di) => {
                if (day === null)
                    return <td key={di} className="p-0.5" aria-hidden="true"/>;
                const date = iso(viewYear, viewMonth, day);
                const isToday = date === today;
                const isSelected = date === selected;
                return (<td key={di} className="p-0.5 text-center">
                    <button type="button" aria-selected={isSelected} aria-current={isToday ? 'date' : undefined} onClick={() => setText(String(viewMonth + 1).padStart(2, '0') + '/' + String(day).padStart(2, '0') + '/' + viewYear)} className={dayClass(isSelected, isToday)}>{day}</button>
                  </td>);
            })}
            </tr>))}
        </tbody>
      </table>
    </div>);
}
`,
      typescript: `'use client';

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
  return text.replace(/\\D/g, '').slice(0, 8);
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

export interface DatePickerInputMaskedProps {
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
}: DatePickerInputMaskedProps): JSX.Element {
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
`,
    },
  },
  {
    slug: 'date-picker-min-max-bounds',
    category: 'date-pickers',
    tags: ['date-picker', 'min', 'max', 'disabled', 'bounds'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1120, copies: 305, downloads: 66 },
    props: [
      { name: 'year', type: 'number', default: '2026', descriptionKey: 'year' },
      { name: 'month', type: 'number', default: '6', descriptionKey: 'month' },
      { name: 'today', type: 'string', default: "'2026-07-17'", descriptionKey: 'today' },
      { name: 'min', type: 'string', default: "'2026-07-06'", descriptionKey: 'min' },
      { name: 'max', type: 'string', default: "'2026-07-24'", descriptionKey: 'max' },
      { name: 'selected', type: 'string', default: "''", descriptionKey: 'selected' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <div class="mb-2 flex items-baseline justify-between gap-2">
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">July 2026</h2>
    <p class="text-xs text-gray-500 dark:text-gray-400">Bookable 06&ndash;24</p>
  </div>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Su</span><span class="sr-only">Sunday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Mo</span><span class="sr-only">Monday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Tu</span><span class="sr-only">Tuesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">We</span><span class="sr-only">Wednesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Th</span><span class="sr-only">Thursday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Fr</span><span class="sr-only">Friday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Sa</span><span class="sr-only">Saturday</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5 text-center"><button type="button" disabled aria-disabled="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 cursor-not-allowed text-gray-300 line-through dark:text-gray-700">1</button></td>
            <td class="p-0.5 text-center"><button type="button" disabled aria-disabled="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 cursor-not-allowed text-gray-300 line-through dark:text-gray-700">2</button></td>
            <td class="p-0.5 text-center"><button type="button" disabled aria-disabled="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 cursor-not-allowed text-gray-300 line-through dark:text-gray-700">3</button></td>
            <td class="p-0.5 text-center"><button type="button" disabled aria-disabled="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 cursor-not-allowed text-gray-300 line-through dark:text-gray-700">4</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" disabled aria-disabled="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 cursor-not-allowed text-gray-300 line-through dark:text-gray-700">5</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">6</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">7</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">8</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">9</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">10</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">11</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">12</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">13</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">14</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">15</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">16</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">17</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">18</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">19</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">20</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">21</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">22</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">23</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">24</button></td>
            <td class="p-0.5 text-center"><button type="button" disabled aria-disabled="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 cursor-not-allowed text-gray-300 line-through dark:text-gray-700">25</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" disabled aria-disabled="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 cursor-not-allowed text-gray-300 line-through dark:text-gray-700">26</button></td>
            <td class="p-0.5 text-center"><button type="button" disabled aria-disabled="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 cursor-not-allowed text-gray-300 line-through dark:text-gray-700">27</button></td>
            <td class="p-0.5 text-center"><button type="button" disabled aria-disabled="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 cursor-not-allowed text-gray-300 line-through dark:text-gray-700">28</button></td>
            <td class="p-0.5 text-center"><button type="button" disabled aria-disabled="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 cursor-not-allowed text-gray-300 line-through dark:text-gray-700">29</button></td>
            <td class="p-0.5 text-center"><button type="button" disabled aria-disabled="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 cursor-not-allowed text-gray-300 line-through dark:text-gray-700">30</button></td>
            <td class="p-0.5 text-center"><button type="button" disabled aria-disabled="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 cursor-not-allowed text-gray-300 line-through dark:text-gray-700">31</button></td>
            <td class="p-0.5" aria-hidden="true"></td>
          </tr>
        </tbody>
      </table>
</div>`,
      react: `'use client';
import { useState } from 'react';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
function buildWeeks(year, month) {
    const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = [];
    for (let i = 0; i < start; i += 1)
        cells.push(null);
    for (let d = 1; d <= total; d += 1)
        cells.push(d);
    while (cells.length % 7 !== 0)
        cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7)
        weeks.push(cells.slice(i, i + 7));
    return weeks;
}
function iso(year, month, day) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}
function dayClass(isSelected, isToday, disabled) {
    const base = 'flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
    if (disabled)
        return base + ' cursor-not-allowed text-gray-300 line-through dark:text-gray-700';
    if (isSelected)
        return base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700';
    if (isToday)
        return base + ' font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800';
    return base + ' text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
}
export function DatePickerMinMaxBounds({ year = 2026, month = 6, today = '2026-07-17', min = '2026-07-06', max = '2026-07-24', selected = '', className = '', }) {
    const [sel, setSel] = useState(selected);
    const weeks = buildWeeks(year, month);
    return (<div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[month] ?? '') + ' ' + year}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Bookable {min.slice(8)}-{max.slice(8)}</p>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {DAY_HEADERS.map(([short, full], hi) => (<th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">{short}</span><span className="sr-only">{full}</span></th>))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (<tr key={wi}>
              {week.map((day, di) => {
                if (day === null)
                    return <td key={di} className="p-0.5" aria-hidden="true"/>;
                const date = iso(year, month, day);
                const disabled = date < min || date > max;
                const isToday = date === today;
                const isSelected = date === sel;
                return (<td key={di} className="p-0.5 text-center">
                    <button type="button" disabled={disabled} aria-disabled={disabled} aria-selected={isSelected} aria-current={isToday ? 'date' : undefined} onClick={() => setSel(date)} className={dayClass(isSelected, isToday, disabled)}>{day}</button>
                  </td>);
            })}
            </tr>))}
        </tbody>
      </table>
    </div>);
}
`,
      typescript: `'use client';

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

export interface DatePickerMinMaxBoundsProps {
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
}: DatePickerMinMaxBoundsProps): JSX.Element {
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
`,
    },
  },
  {
    slug: 'date-picker-birthday',
    category: 'date-pickers',
    tags: ['date-picker', 'birthday', 'select', 'dob', 'form'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1060, copies: 289, downloads: 61 },
    props: [
      { name: 'today', type: 'string', default: "'2026-07-17'", descriptionKey: 'today' },
      { name: 'maxYear', type: 'number', default: '2026', descriptionKey: 'maxYear' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Date of birth</p>
  <div class="grid grid-cols-3 gap-2">
    <div>
      <label class="sr-only" for="dp-day">Day</label>
      <select id="dp-day" class="h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">
        <option value="">Day</option>
        <option value="14">14</option>
      </select>
    </div>
    <div>
      <label class="sr-only" for="dp-bmonth">Month</label>
      <select id="dp-bmonth" class="h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">
        <option value="">Month</option>
        <option value="0">January</option>
        <option value="1">February</option>
        <option value="2">March</option>
        <option value="3">April</option>
        <option value="4">May</option>
        <option value="5">June</option>
        <option value="6">July</option>
        <option value="7">August</option>
        <option value="8">September</option>
        <option value="9">October</option>
        <option value="10">November</option>
        <option value="11">December</option>
      </select>
    </div>
    <div>
      <label class="sr-only" for="dp-byear">Year</label>
      <select id="dp-byear" class="h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400">
        <option value="">Year</option>
        <option value="1990">1990</option>
      </select>
    </div>
  </div>
  <p class="mt-3 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">Select all three fields.</p>
</div>`,
      react: `'use client';
import { useState } from 'react';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SELECT = 'h-11 min-w-0 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
function daysInMonth(monthIndex, year) {
    if (monthIndex < 0)
        return 31;
    return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}
function ageOf(y, m, d, todayIso) {
    const parts = todayIso.split('-').map(Number);
    const ty = parts[0];
    const tm = parts[1];
    const td = parts[2];
    if (!ty || !tm || !td)
        return null;
    let age = ty - y;
    if (tm < m + 1 || (tm === m + 1 && td < d))
        age -= 1;
    return age;
}
export function DatePickerBirthday({ today = '2026-07-17', maxYear = 2026, className = '', }) {
    const [dayStr, setDayStr] = useState('');
    const [monthStr, setMonthStr] = useState('');
    const [yearStr, setYearStr] = useState('');
    const years = Array.from({ length: 100 }, (_, i) => maxYear - i);
    const yearNum = yearStr ? Number(yearStr) : maxYear;
    const monthNum = monthStr ? Number(monthStr) : 0;
    const days = Array.from({ length: daysInMonth(monthStr ? monthNum : -1, yearNum) }, (_, i) => i + 1);
    const complete = dayStr !== '' && monthStr !== '' && yearStr !== '';
    const age = complete ? ageOf(yearNum, monthNum, Number(dayStr), today) : null;
    return (<div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
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
    </div>);
}
`,
      typescript: `'use client';

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

export interface DatePickerBirthdayProps {
  today?: string;
  maxYear?: number;
  className?: string;
}

export function DatePickerBirthday({
  today = '2026-07-17',
  maxYear = 2026,
  className = '',
}: DatePickerBirthdayProps): JSX.Element {
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
`,
    },
  },
  {
    slug: 'date-picker-week-picker',
    category: 'date-pickers',
    tags: ['date-picker', 'week', 'range', 'calendar', 'selection'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1010, copies: 274, downloads: 58 },
    props: [
      { name: 'year', type: 'number', default: '2026', descriptionKey: 'year' },
      { name: 'month', type: 'number', default: '6', descriptionKey: 'month' },
      { name: 'today', type: 'string', default: "'2026-07-17'", descriptionKey: 'today' },
      { name: 'selected', type: 'string', default: "''", descriptionKey: 'selected' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <div class="mb-2 flex items-baseline justify-between gap-2">
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">July 2026</h2>
    <p class="text-xs text-gray-500 dark:text-gray-400">Week of Jul 12 &ndash; Jul 18</p>
  </div>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Su</span><span class="sr-only">Sunday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Mo</span><span class="sr-only">Monday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Tu</span><span class="sr-only">Tuesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">We</span><span class="sr-only">Wednesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Th</span><span class="sr-only">Thursday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Fr</span><span class="sr-only">Friday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">Sa</span><span class="sr-only">Saturday</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">1</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">2</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">3</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">4</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">5</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">6</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">7</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">8</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">9</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">10</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">11</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700 rounded-l-lg">12</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">13</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">14</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">15</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">16</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">17</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-selected="true" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700 rounded-r-lg">18</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">19</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">20</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">21</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">22</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">23</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">24</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">25</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">26</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">27</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">28</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">29</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">30</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">31</button></td>
            <td class="p-0.5" aria-hidden="true"></td>
          </tr>
        </tbody>
      </table>
</div>`,
      react: `'use client';
import { useState } from 'react';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
function buildWeeks(year, month) {
    const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = [];
    for (let i = 0; i < start; i += 1)
        cells.push(null);
    for (let d = 1; d <= total; d += 1)
        cells.push(d);
    while (cells.length % 7 !== 0)
        cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7)
        weeks.push(cells.slice(i, i + 7));
    return weeks;
}
function iso(year, month, day) {
    return year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}
function shiftIso(value, n) {
    const parts = value.split('-').map(Number);
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];
    if (!y || !m || !d)
        return value;
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() + n);
    return dt.toISOString().slice(0, 10);
}
function weekBounds(value) {
    const parts = value.split('-').map(Number);
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];
    if (!y || !m || !d)
        return ['', ''];
    const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    const startIso = shiftIso(value, -dow);
    return [startIso, shiftIso(startIso, 6)];
}
function label(value) {
    const parts = value.split('-').map(Number);
    const m = parts[1];
    const d = parts[2];
    if (!m || !d)
        return '';
    return (ABBR[m - 1] ?? '') + ' ' + d;
}
export function DatePickerWeekPicker({ year = 2026, month = 6, today = '2026-07-17', selected = '', className = '', }) {
    const [sel, setSel] = useState(selected);
    const weeks = buildWeeks(year, month);
    const [weekStart, weekEnd] = sel ? weekBounds(sel) : ['', ''];
    return (<div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[month] ?? '') + ' ' + year}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">{weekStart ? 'Week of ' + label(weekStart) + ' - ' + label(weekEnd) : 'Pick a week'}</p>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {DAY_HEADERS.map(([short, full], hi) => (<th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">{short}</span><span className="sr-only">{full}</span></th>))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (<tr key={wi}>
              {week.map((day, di) => {
                if (day === null)
                    return <td key={di} className="p-0.5" aria-hidden="true"/>;
                const date = iso(year, month, day);
                const isToday = date === today;
                const inWeek = Boolean(weekStart && date >= weekStart && date <= weekEnd);
                const base = 'flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
                const cls = inWeek
                    ? base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700' + (date === weekStart ? ' rounded-l-lg' : '') + (date === weekEnd ? ' rounded-r-lg' : '')
                    : isToday
                        ? base + ' rounded-lg font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800'
                        : base + ' rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
                return (<td key={di} className="p-0.5 text-center">
                    <button type="button" aria-selected={inWeek} aria-current={isToday ? 'date' : undefined} onClick={() => setSel(date)} className={cls}>{day}</button>
                  </td>);
            })}
            </tr>))}
        </tbody>
      </table>
    </div>);
}
`,
      typescript: `'use client';

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

function shiftIso(value: string, n: number): string {
  const parts = value.split('-').map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (!y || !m || !d) return value;
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

function weekBounds(value: string): [string, string] {
  const parts = value.split('-').map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (!y || !m || !d) return ['', ''];
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const startIso = shiftIso(value, -dow);
  return [startIso, shiftIso(startIso, 6)];
}

function label(value: string): string {
  const parts = value.split('-').map(Number);
  const m = parts[1];
  const d = parts[2];
  if (!m || !d) return '';
  return (ABBR[m - 1] ?? '') + ' ' + d;
}

export interface DatePickerWeekPickerProps {
  year?: number;
  month?: number;
  today?: string;
  selected?: string;
  className?: string;
}

export function DatePickerWeekPicker({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  selected = '',
  className = '',
}: DatePickerWeekPickerProps): JSX.Element {
  const [sel, setSel] = useState(selected);
  const weeks = buildWeeks(year, month);
  const [weekStart, weekEnd] = sel ? weekBounds(sel) : ['', ''];

  return (
    <div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTHS[month] ?? '') + ' ' + year}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">{weekStart ? 'Week of ' + label(weekStart) + ' - ' + label(weekEnd) : 'Pick a week'}</p>
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
                const inWeek = Boolean(weekStart && date >= weekStart && date <= weekEnd);
                const base = 'flex h-10 w-full items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400';
                const cls = inWeek
                  ? base + ' bg-blue-600 font-semibold text-white hover:bg-blue-700' + (date === weekStart ? ' rounded-l-lg' : '') + (date === weekEnd ? ' rounded-r-lg' : '')
                  : isToday
                    ? base + ' rounded-lg font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800'
                    : base + ' rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
                return (
                  <td key={di} className="p-0.5 text-center">
                    <button type="button" aria-selected={inWeek} aria-current={isToday ? 'date' : undefined} onClick={() => setSel(date)} className={cls}>{day}</button>
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
`,
    },
  },
];
