import type { ComponentEntry } from './types';

/**
 * Calendar category.
 *
 * Ten calendars that are really four problems in different clothes: laying out
 * a month (grid, mini, events, dual, year), laying out a day (schedule, slots),
 * compressing a year (heatmap, overview) and compressing a week (strip,
 * upcoming). The shared constraint is the seven-column grid - at 320px each
 * column is ~41px, so every month here is a real `<table>` with abbreviated
 * `<th>` day names (the full name in an sr-only span) and h-10 cells, because
 * the column width *is* the tap target. The other shared decision: "today" is a
 * prop everywhere, never `new Date()`. A calendar that reads the clock renders
 * differently every day, which breaks previews, screenshots and tests alike -
 * so every sample here is the same fixed July 2026.
 */
export const calendarComponents: ComponentEntry[] = [
  {
    slug: 'calendar-month-grid',
    category: 'calendar',
    tags: ['calendar', 'month', 'grid', 'date', 'navigation'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1840, copies: 512, downloads: 121 },
    props: [
      { name: "year", type: "number", default: "2026", descriptionKey: "year" },
      { name: "month", type: "number", default: "6", descriptionKey: "month" },
      { name: "today", type: "string", default: "'2026-07-17'", descriptionKey: "today" },
      { name: "selected", type: "string", default: "'2026-07-21'", descriptionKey: "selected" },
      { name: "onSelect", type: "(isoDate: string) => void", descriptionKey: "onSelect" },
      { name: "className", type: "string", descriptionKey: "className" },
    ],
    code: {
      tailwind: `<!--
  A real <table>, not a grid of divs: the weekday <th scope="col"> means a
  screen reader announces "Friday" over every cell in that column for free.
  Headers are two letters because 320px / 7 columns is ~41px per cell - the
  full name rides along in an sr-only span. Every day is an h-10 button: the
  column width is the tap target, so the two can never disagree.
-->
<div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <div class="mb-2 flex items-center justify-between gap-2">
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">July 2026</h2>
    <div class="flex items-center gap-1">
      <button type="button" aria-label="Previous month" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">&lsaquo;</button>
      <button type="button" aria-label="Next month" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">&rsaquo;</button>
    </div>
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
            <td class="p-0.5 text-center"><button type="button" aria-pressed="true" class="flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">21</button></td>
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
      react: `function buildWeeks(year, month) {
  const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < start; i += 1) cells.push(null);
  for (let d = 1; d <= total; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];

export function CalendarMonthGrid({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  selected = '2026-07-21',
  onSelect,
  onPrevMonth,
  onNextMonth,
  className = '',
}) {
  const weeks = buildWeeks(year, month);
  return (
    <div className={['w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTH_NAMES[month] ?? '') + ' ' + year}</h2>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Previous month" onClick={onPrevMonth} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">&lsaquo;</button>
          <button type="button" aria-label="Next month" onClick={onNextMonth} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">&rsaquo;</button>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {DAY_HEADERS.map(([short, full], hi) => (
              <th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                <span aria-hidden="true">{short}</span>
                <span className="sr-only">{full}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (day === null) return <td key={di} className="p-0.5" aria-hidden="true" />;
                const date = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                const isToday = date === today;
                const isSelected = date === selected;
                return (
                  <td key={di} className="p-0.5 text-center">
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-current={isToday ? 'date' : undefined}
                      onClick={() => onSelect?.(date)}
                      className={[
                        'flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400',
                        isSelected ? 'bg-blue-600 font-semibold text-white hover:bg-blue-700' : isToday ? 'font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                      ].join(' ')}
                    >
                      {day}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      typescript: `function buildWeeks(year: number, month: number): Array<number | null>[] {
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

interface CalendarMonthGridProps {
  /** Year to render. */
  year?: number;
  /** Zero-based month (0 = January, 6 = July). */
  month?: number;
  /** ISO date drawn with the "today" ring. Pass it in - never read the clock. */
  today?: string;
  /** ISO date drawn as selected. */
  selected?: string;
  onSelect?: (isoDate: string) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  className?: string;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];

export function CalendarMonthGrid({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  selected = '2026-07-21',
  onSelect,
  onPrevMonth,
  onNextMonth,
  className = '',
}: CalendarMonthGridProps): JSX.Element {
  const weeks = buildWeeks(year, month);
  return (
    <div className={['w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{(MONTH_NAMES[month] ?? '') + ' ' + year}</h2>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Previous month" onClick={onPrevMonth} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">&lsaquo;</button>
          <button type="button" aria-label="Next month" onClick={onNextMonth} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">&rsaquo;</button>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {DAY_HEADERS.map(([short, full], hi) => (
              <th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                <span aria-hidden="true">{short}</span>
                <span className="sr-only">{full}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (day === null) return <td key={di} className="p-0.5" aria-hidden="true" />;
                const date = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                const isToday = date === today;
                const isSelected = date === selected;
                return (
                  <td key={di} className="p-0.5 text-center">
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-current={isToday ? 'date' : undefined}
                      onClick={() => onSelect?.(date)}
                      className={[
                        'flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400',
                        isSelected ? 'bg-blue-600 font-semibold text-white hover:bg-blue-700' : isToday ? 'font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                      ].join(' ')}
                    >
                      {day}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    },
  },
  {
    slug: 'calendar-mini-compact',
    category: 'calendar',
    tags: ['calendar', 'mini', 'compact', 'datepicker', 'popover'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1420, copies: 470, downloads: 98 },
    props: [
      { name: "year", type: "number", default: "2026", descriptionKey: "year" },
      { name: "month", type: "number", default: "6", descriptionKey: "month" },
      { name: "today", type: "string", default: "'2026-07-17'", descriptionKey: "today" },
      { name: "selected", type: "string", default: "'2026-07-15'", descriptionKey: "selected" },
      { name: "onSelect", type: "(isoDate: string) => void", descriptionKey: "onSelect" },
      { name: "className", type: "string", descriptionKey: "className" },
    ],
    code: {
      tailwind: `<!--
  The datepicker body: same <table> semantics as the full grid but h-8 cells
  and single-letter headers so it drops into a popover at ~260px wide. Single
  letters repeat (S/S, T/T), so the full weekday still lives in an sr-only span
  - the letter is a visual shorthand, not the accessible name.
-->
<div class="w-full max-w-[17rem] rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
  <p class="mb-2 px-1 text-xs font-semibold text-gray-900 dark:text-gray-100">July 2026</p>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5" aria-hidden="true"></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">1</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">2</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">3</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">4</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">5</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">6</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">7</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">8</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">9</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">10</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">11</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">12</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">13</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">14</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-pressed="true" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">15</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">16</button></td>
            <td class="p-0.5 text-center"><button type="button" aria-current="date" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 dark:text-blue-300 dark:ring-blue-400">17</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">18</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">19</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">20</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">21</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">22</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">23</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">24</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">25</button></td>
          </tr>
          <tr>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">26</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">27</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">28</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">29</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">30</button></td>
            <td class="p-0.5 text-center"><button type="button" class="flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">31</button></td>
            <td class="p-0.5" aria-hidden="true"></td>
          </tr>
        </tbody>
      </table>
</div>`,
      react: `function buildWeeks(year, month) {
  const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < start; i += 1) cells.push(null);
  for (let d = 1; d <= total; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const MINI_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MINI_HEADERS = [['S', 'Sunday'], ['M', 'Monday'], ['T', 'Tuesday'], ['W', 'Wednesday'], ['T', 'Thursday'], ['F', 'Friday'], ['S', 'Saturday']];

export function CalendarMiniCompact({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  selected = '2026-07-15',
  onSelect,
  className = '',
}) {
  const weeks = buildWeeks(year, month);
  return (
    <div className={['w-full max-w-[17rem] rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <p className="mb-2 px-1 text-xs font-semibold text-gray-900 dark:text-gray-100">{(MINI_MONTHS[month] ?? '') + ' ' + year}</p>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {MINI_HEADERS.map(([short, full], hi) => (
              <th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                <span aria-hidden="true">{short}</span>
                <span className="sr-only">{full}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (day === null) return <td key={di} className="p-0.5" aria-hidden="true" />;
                const date = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                const isToday = date === today;
                const isSelected = date === selected;
                return (
                  <td key={di} className="p-0.5 text-center">
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-current={isToday ? 'date' : undefined}
                      onClick={() => onSelect?.(date)}
                      className={[
                        'flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400',
                        isSelected ? 'bg-blue-600 font-semibold text-white hover:bg-blue-700' : isToday ? 'font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 dark:text-blue-300 dark:ring-blue-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                      ].join(' ')}
                    >
                      {day}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      typescript: `function buildWeeks(year: number, month: number): Array<number | null>[] {
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

interface CalendarMiniCompactProps {
  year?: number;
  month?: number;
  today?: string;
  selected?: string;
  onSelect?: (isoDate: string) => void;
  className?: string;
}

const MINI_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MINI_HEADERS = [['S', 'Sunday'], ['M', 'Monday'], ['T', 'Tuesday'], ['W', 'Wednesday'], ['T', 'Thursday'], ['F', 'Friday'], ['S', 'Saturday']];

export function CalendarMiniCompact({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  selected = '2026-07-15',
  onSelect,
  className = '',
}: CalendarMiniCompactProps): JSX.Element {
  const weeks = buildWeeks(year, month);
  return (
    <div className={['w-full max-w-[17rem] rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <p className="mb-2 px-1 text-xs font-semibold text-gray-900 dark:text-gray-100">{(MINI_MONTHS[month] ?? '') + ' ' + year}</p>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {MINI_HEADERS.map(([short, full], hi) => (
              <th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                <span aria-hidden="true">{short}</span>
                <span className="sr-only">{full}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (day === null) return <td key={di} className="p-0.5" aria-hidden="true" />;
                const date = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                const isToday = date === today;
                const isSelected = date === selected;
                return (
                  <td key={di} className="p-0.5 text-center">
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-current={isToday ? 'date' : undefined}
                      onClick={() => onSelect?.(date)}
                      className={[
                        'flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400',
                        isSelected ? 'bg-blue-600 font-semibold text-white hover:bg-blue-700' : isToday ? 'font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 dark:text-blue-300 dark:ring-blue-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                      ].join(' ')}
                    >
                      {day}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    },
  },
  {
    slug: 'calendar-week-strip',
    category: 'calendar',
    tags: ['calendar', 'week', 'strip', 'day-picker', 'compact'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1290, copies: 388, downloads: 84 },
    props: [
      { name: "startDate", type: "string", default: "'2026-07-12'", descriptionKey: "startDate" },
      { name: "today", type: "string", default: "'2026-07-17'", descriptionKey: "today" },
      { name: "selected", type: "string", default: "'2026-07-15'", descriptionKey: "selected" },
      { name: "onSelect", type: "(isoDate: string) => void", descriptionKey: "onSelect" },
      { name: "className", type: "string", descriptionKey: "className" },
    ],
    code: {
      tailwind: `<!--
  Seven equal columns that must survive 320px: min-w-0 + flex-1 lets each cell
  shrink to ~40px, and the weekday label abbreviates to three letters. The
  today ring and the selected fill are different signals - one marks "now",
  the other marks "chosen" - so both can show at once on different days.
-->
<div class="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
  <p class="mb-2 px-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Week of Jul 12&ndash;18</p>
  <ul class="flex items-stretch gap-1.5">
      <li class="min-w-0 flex-1">
        <button type="button" class="flex w-full flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
          <span class="text-[0.65rem] font-medium uppercase tracking-wide opacity-80">Sun</span>
          <span class="text-base font-semibold tabular-nums">12</span>
        </button>
      </li>
      <li class="min-w-0 flex-1">
        <button type="button" class="flex w-full flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
          <span class="text-[0.65rem] font-medium uppercase tracking-wide opacity-80">Mon</span>
          <span class="text-base font-semibold tabular-nums">13</span>
        </button>
      </li>
      <li class="min-w-0 flex-1">
        <button type="button" class="flex w-full flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
          <span class="text-[0.65rem] font-medium uppercase tracking-wide opacity-80">Tue</span>
          <span class="text-base font-semibold tabular-nums">14</span>
        </button>
      </li>
      <li class="min-w-0 flex-1">
        <button type="button" aria-pressed="true" class="flex w-full flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-transparent bg-blue-600 text-white">
          <span class="text-[0.65rem] font-medium uppercase tracking-wide opacity-80">Wed</span>
          <span class="text-base font-semibold tabular-nums">15</span>
        </button>
      </li>
      <li class="min-w-0 flex-1">
        <button type="button" class="flex w-full flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
          <span class="text-[0.65rem] font-medium uppercase tracking-wide opacity-80">Thu</span>
          <span class="text-base font-semibold tabular-nums">16</span>
        </button>
      </li>
      <li class="min-w-0 flex-1">
        <button type="button" aria-current="date" class="flex w-full flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300">
          <span class="text-[0.65rem] font-medium uppercase tracking-wide opacity-80">Fri</span>
          <span class="text-base font-semibold tabular-nums">17</span>
        </button>
      </li>
      <li class="min-w-0 flex-1">
        <button type="button" class="flex w-full flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
          <span class="text-[0.65rem] font-medium uppercase tracking-wide opacity-80">Sat</span>
          <span class="text-base font-semibold tabular-nums">18</span>
        </button>
      </li>
  </ul>
</div>`,
      react: `const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildWeek(startDate) {
  const base = new Date(startDate + 'T00:00:00Z');
  const out = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      weekday: WEEKDAY_LABELS[d.getUTCDay()] ?? '',
      day: d.getUTCDate(),
    });
  }
  return out;
}

export function CalendarWeekStrip({
  startDate = '2026-07-12',
  today = '2026-07-17',
  selected = '2026-07-15',
  onSelect,
  className = '',
}) {
  const week = buildWeek(startDate);
  return (
    <div className={['w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <ul className="flex items-stretch gap-1.5">
        {week.map((d) => {
          const isToday = d.iso === today;
          const isSelected = d.iso === selected;
          const tone = isSelected
            ? 'border-transparent bg-blue-600 text-white'
            : isToday
              ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
              : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800';
          return (
            <li key={d.iso} className="min-w-0 flex-1">
              <button
                type="button"
                aria-pressed={isSelected}
                aria-current={isToday ? 'date' : undefined}
                onClick={() => onSelect?.(d.iso)}
                className={['flex w-full flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400', tone].join(' ')}
              >
                <span className="text-[0.65rem] font-medium uppercase tracking-wide opacity-80">{d.weekday}</span>
                <span className="text-base font-semibold tabular-nums">{d.day}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}`,
      typescript: `interface WeekDay {
  iso: string;
  weekday: string;
  day: number;
}

interface CalendarWeekStripProps {
  /** ISO date of the first (leftmost) day. */
  startDate?: string;
  today?: string;
  selected?: string;
  onSelect?: (isoDate: string) => void;
  className?: string;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildWeek(startDate: string): WeekDay[] {
  const base = new Date(startDate + 'T00:00:00Z');
  const out: WeekDay[] = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      weekday: WEEKDAY_LABELS[d.getUTCDay()] ?? '',
      day: d.getUTCDate(),
    });
  }
  return out;
}

export function CalendarWeekStrip({
  startDate = '2026-07-12',
  today = '2026-07-17',
  selected = '2026-07-15',
  onSelect,
  className = '',
}: CalendarWeekStripProps): JSX.Element {
  const week = buildWeek(startDate);
  return (
    <div className={['w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <ul className="flex items-stretch gap-1.5">
        {week.map((d) => {
          const isToday = d.iso === today;
          const isSelected = d.iso === selected;
          const tone = isSelected
            ? 'border-transparent bg-blue-600 text-white'
            : isToday
              ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
              : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800';
          return (
            <li key={d.iso} className="min-w-0 flex-1">
              <button
                type="button"
                aria-pressed={isSelected}
                aria-current={isToday ? 'date' : undefined}
                onClick={() => onSelect?.(d.iso)}
                className={['flex w-full flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400', tone].join(' ')}
              >
                <span className="text-[0.65rem] font-medium uppercase tracking-wide opacity-80">{d.weekday}</span>
                <span className="text-base font-semibold tabular-nums">{d.day}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}`,
    },
  },
  {
    slug: 'calendar-day-schedule',
    category: 'calendar',
    tags: ['calendar', 'day', 'schedule', 'agenda', 'events'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1560, copies: 421, downloads: 110 },
    props: [
      { name: "heading", type: "string", default: "'Friday, July 17'", descriptionKey: "heading" },
      { name: "fromHour", type: "number", default: "8", descriptionKey: "fromHour" },
      { name: "toHour", type: "number", default: "17", descriptionKey: "toHour" },
      { name: "events", type: "ScheduleEvent[]", descriptionKey: "events" },
      { name: "className", type: "string", descriptionKey: "className" },
    ],
    code: {
      tailwind: `<!--
  An agenda, not an absolute-positioned timeline: each hour is a row, each event
  sits in the row it starts in. That trades pixel-accurate durations for a
  layout that never overlaps or overflows at 320px, and it reads top-to-bottom
  in the DOM in the order the day happens.
-->
<div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <h2 class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Friday, July 17</h2>
  <ul class="space-y-1">
      <li class="flex gap-3">
        <span class="w-12 shrink-0 pt-0.5 text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">8 AM</span>
        <div class="min-w-0 flex-1 border-t border-gray-100 pt-1 dark:border-gray-800">
        </div>
      </li>
      <li class="flex gap-3">
        <span class="w-12 shrink-0 pt-0.5 text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">9 AM</span>
        <div class="min-w-0 flex-1 border-t border-gray-100 pt-1 dark:border-gray-800">
        <div class="rounded-lg border-l-4 px-3 py-1.5 text-xs border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-100">
          <p class="font-semibold">Team standup</p>
          <p class="opacity-80">09:00&ndash;09:45</p>
        </div>
        </div>
      </li>
      <li class="flex gap-3">
        <span class="w-12 shrink-0 pt-0.5 text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">10 AM</span>
        <div class="min-w-0 flex-1 border-t border-gray-100 pt-1 dark:border-gray-800">
        </div>
      </li>
      <li class="flex gap-3">
        <span class="w-12 shrink-0 pt-0.5 text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">11 AM</span>
        <div class="min-w-0 flex-1 border-t border-gray-100 pt-1 dark:border-gray-800">
        <div class="rounded-lg border-l-4 px-3 py-1.5 text-xs border-violet-500 bg-violet-50 text-violet-900 dark:border-violet-400 dark:bg-violet-950 dark:text-violet-100">
          <p class="font-semibold">Design review</p>
          <p class="opacity-80">11:00&ndash;12:00</p>
        </div>
        </div>
      </li>
      <li class="flex gap-3">
        <span class="w-12 shrink-0 pt-0.5 text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">12 PM</span>
        <div class="min-w-0 flex-1 border-t border-gray-100 pt-1 dark:border-gray-800">
        </div>
      </li>
      <li class="flex gap-3">
        <span class="w-12 shrink-0 pt-0.5 text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">1 PM</span>
        <div class="min-w-0 flex-1 border-t border-gray-100 pt-1 dark:border-gray-800">
        </div>
      </li>
      <li class="flex gap-3">
        <span class="w-12 shrink-0 pt-0.5 text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">2 PM</span>
        <div class="min-w-0 flex-1 border-t border-gray-100 pt-1 dark:border-gray-800">
        <div class="rounded-lg border-l-4 px-3 py-1.5 text-xs border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-100">
          <p class="font-semibold">1:1 with Sam</p>
          <p class="opacity-80">14:30&ndash;15:30</p>
        </div>
        </div>
      </li>
      <li class="flex gap-3">
        <span class="w-12 shrink-0 pt-0.5 text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">3 PM</span>
        <div class="min-w-0 flex-1 border-t border-gray-100 pt-1 dark:border-gray-800">
        </div>
      </li>
      <li class="flex gap-3">
        <span class="w-12 shrink-0 pt-0.5 text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">4 PM</span>
        <div class="min-w-0 flex-1 border-t border-gray-100 pt-1 dark:border-gray-800">
        </div>
      </li>
      <li class="flex gap-3">
        <span class="w-12 shrink-0 pt-0.5 text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">5 PM</span>
        <div class="min-w-0 flex-1 border-t border-gray-100 pt-1 dark:border-gray-800">
        </div>
      </li>
  </ul>
</div>`,
      react: `const DEFAULT_DAY_EVENTS: ScheduleEvent[] = [
  { start: '09:00', end: '09:45', title: 'Team standup', tone: 'blue' },
  { start: '11:00', end: '12:00', title: 'Design review', tone: 'violet' },
  { start: '14:30', end: '15:30', title: '1:1 with Sam', tone: 'emerald' },
];

const DAY_TONES = {
  blue: 'border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-100',
  violet: 'border-violet-500 bg-violet-50 text-violet-900 dark:border-violet-400 dark:bg-violet-950 dark:text-violet-100',
  emerald: 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-100',
};

export function CalendarDaySchedule({
  heading = 'Friday, July 17',
  fromHour = 8,
  toHour = 17,
  events = DEFAULT_DAY_EVENTS,
  className = '',
}) {
  const hours = [];
  for (let h = fromHour; h <= toHour; h += 1) hours.push(h);
  const label = (h) => (((h + 11) % 12) + 1) + ' ' + (h < 12 ? 'AM' : 'PM');
  return (
    <div className={['w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{heading}</h2>
      <ul className="space-y-1">
        {hours.map((h) => {
          const ev = events.find((e) => Number(e.start.slice(0, 2)) === h);
          return (
            <li key={h} className="flex gap-3">
              <span className="w-12 shrink-0 pt-0.5 text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">{label(h)}</span>
              <div className="min-w-0 flex-1 border-t border-gray-100 pt-1 dark:border-gray-800">
                {ev ? (
                  <div className={['rounded-lg border-l-4 px-3 py-1.5 text-xs', DAY_TONES[ev.tone]].join(' ')}>
                    <p className="font-semibold">{ev.title}</p>
                    <p className="opacity-80">{ev.start + '-' + ev.end}</p>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}`,
      typescript: `interface ScheduleEvent {
  start: string;
  end: string;
  title: string;
  tone: 'blue' | 'violet' | 'emerald';
}

interface CalendarDayScheduleProps {
  heading?: string;
  /** First and last hour shown (24h). */
  fromHour?: number;
  toHour?: number;
  events?: ScheduleEvent[];
  className?: string;
}

const DEFAULT_DAY_EVENTS: ScheduleEvent[] = [
  { start: '09:00', end: '09:45', title: 'Team standup', tone: 'blue' },
  { start: '11:00', end: '12:00', title: 'Design review', tone: 'violet' },
  { start: '14:30', end: '15:30', title: '1:1 with Sam', tone: 'emerald' },
];

const DAY_TONES = {
  blue: 'border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-100',
  violet: 'border-violet-500 bg-violet-50 text-violet-900 dark:border-violet-400 dark:bg-violet-950 dark:text-violet-100',
  emerald: 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-100',
};

export function CalendarDaySchedule({
  heading = 'Friday, July 17',
  fromHour = 8,
  toHour = 17,
  events = DEFAULT_DAY_EVENTS,
  className = '',
}: CalendarDayScheduleProps): JSX.Element {
  const hours: number[] = [];
  for (let h = fromHour; h <= toHour; h += 1) hours.push(h);
  const label = (h: number) => (((h + 11) % 12) + 1) + ' ' + (h < 12 ? 'AM' : 'PM');
  return (
    <div className={['w-full max-w-md rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{heading}</h2>
      <ul className="space-y-1">
        {hours.map((h) => {
          const ev = events.find((e) => Number(e.start.slice(0, 2)) === h);
          return (
            <li key={h} className="flex gap-3">
              <span className="w-12 shrink-0 pt-0.5 text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">{label(h)}</span>
              <div className="min-w-0 flex-1 border-t border-gray-100 pt-1 dark:border-gray-800">
                {ev ? (
                  <div className={['rounded-lg border-l-4 px-3 py-1.5 text-xs', DAY_TONES[ev.tone]].join(' ')}>
                    <p className="font-semibold">{ev.title}</p>
                    <p className="opacity-80">{ev.start + '-' + ev.end}</p>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}`,
    },
  },
  {
    slug: 'calendar-events-month',
    category: 'calendar',
    tags: ['calendar', 'events', 'month', 'agenda', 'schedule'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1980, copies: 540, downloads: 133 },
    props: [
      { name: "year", type: "number", default: "2026", descriptionKey: "year" },
      { name: "month", type: "number", default: "6", descriptionKey: "month" },
      { name: "today", type: "string", default: "'2026-07-17'", descriptionKey: "today" },
      { name: "events", type: "Record<number, string[]>", descriptionKey: "events" },
      { name: "className", type: "string", descriptionKey: "className" },
    ],
    code: {
      tailwind: `<!--
  A month grid that carries content, so cells are align-top and event chips
  truncate rather than wrap the column wider. Only two chips show; the rest
  collapse to "+N more" so a busy day cannot blow the row height out. "Today"
  is a filled disc on the date number, independent of any event styling.
-->
<div class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
  <h2 class="mb-2 px-1 text-sm font-semibold text-gray-900 dark:text-gray-100">July 2026</h2>
  <table class="w-full table-fixed border-collapse">
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
            <td class="p-0.5 align-top" aria-hidden="true"></td>
            <td class="p-0.5 align-top" aria-hidden="true"></td>
            <td class="p-0.5 align-top" aria-hidden="true"></td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">1</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">2</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">3</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">4</span>
                <ul class="flex flex-col gap-0.5">
              <li class="truncate rounded px-1 py-0.5 text-left text-[0.65rem] leading-tight bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Holiday</li>
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">5</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">6</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">7</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">8</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">9</span>
                <ul class="flex flex-col gap-0.5">
              <li class="truncate rounded px-1 py-0.5 text-left text-[0.65rem] leading-tight bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Team sync</li>
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">10</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">11</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">12</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">13</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">14</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">15</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">16</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[0.7rem] font-semibold text-white" aria-current="date">17</span>
                <ul class="flex flex-col gap-0.5">
              <li class="truncate rounded px-1 py-0.5 text-left text-[0.65rem] leading-tight bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Design review</li>
              <li class="truncate rounded px-1 py-0.5 text-left text-[0.65rem] leading-tight bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">1:1 with Sam</li>
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">18</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">19</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">20</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">21</span>
                <ul class="flex flex-col gap-0.5">
              <li class="truncate rounded px-1 py-0.5 text-left text-[0.65rem] leading-tight bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Product launch</li>
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">22</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">23</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">24</span>
                <ul class="flex flex-col gap-0.5">
              <li class="truncate rounded px-1 py-0.5 text-left text-[0.65rem] leading-tight bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Sprint demo</li>
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">25</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">26</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">27</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">28</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">29</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">30</span>
                <ul class="flex flex-col gap-0.5">
              <li class="truncate rounded px-1 py-0.5 text-left text-[0.65rem] leading-tight bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Retro</li>
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top">
              <div class="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                <span class="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">31</span>
                <ul class="flex flex-col gap-0.5">
                </ul>
              </div>
            </td>
            <td class="p-0.5 align-top" aria-hidden="true"></td>
          </tr>
    </tbody>
  </table>
</div>`,
      react: `function buildWeeks(year, month) {
  const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < start; i += 1) cells.push(null);
  for (let d = 1; d <= total; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const EVENTS_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const EVENTS_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
const DEFAULT_MONTH_EVENTS: Record<number, string[]> = {
  4: ['Holiday'],
  9: ['Team sync'],
  17: ['Design review', '1:1 with Sam'],
  21: ['Product launch'],
  24: ['Sprint demo'],
  30: ['Retro'],
};

export function CalendarEventsMonth({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  events = DEFAULT_MONTH_EVENTS,
  className = '',
}) {
  const weeks = buildWeeks(year, month);
  return (
    <div className={['w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <h2 className="mb-2 px-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{(EVENTS_MONTHS[month] ?? '') + ' ' + year}</h2>
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            {EVENTS_HEADERS.map(([short, full], hi) => (
              <th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                <span aria-hidden="true">{short}</span>
                <span className="sr-only">{full}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (day === null) return <td key={di} className="p-0.5 align-top" aria-hidden="true" />;
                const date = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                const isToday = date === today;
                const list = events[day] ?? [];
                return (
                  <td key={di} className="p-0.5 align-top">
                    <div className="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                      <span
                        aria-current={isToday ? 'date' : undefined}
                        className={isToday
                          ? 'inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[0.7rem] font-semibold text-white'
                          : 'text-[0.7rem] font-medium text-gray-500 dark:text-gray-400'}
                      >
                        {day}
                      </span>
                      <ul className="flex flex-col gap-0.5">
                        {list.slice(0, 2).map((title) => (
                          <li key={title} className="truncate rounded px-1 py-0.5 text-left text-[0.65rem] leading-tight bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {title}
                          </li>
                        ))}
                        {list.length > 2 ? (
                          <li className="text-[0.6rem] text-gray-400 dark:text-gray-500">{'+' + (list.length - 2) + ' more'}</li>
                        ) : null}
                      </ul>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      typescript: `function buildWeeks(year: number, month: number): Array<number | null>[] {
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

interface CalendarEventsMonthProps {
  year?: number;
  month?: number;
  today?: string;
  /** Events keyed by day-of-month, e.g. { 17: ['Design review'] }. */
  events?: Record<number, string[]>;
  className?: string;
}

const EVENTS_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const EVENTS_HEADERS = [['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday']];
const DEFAULT_MONTH_EVENTS: Record<number, string[]> = {
  4: ['Holiday'],
  9: ['Team sync'],
  17: ['Design review', '1:1 with Sam'],
  21: ['Product launch'],
  24: ['Sprint demo'],
  30: ['Retro'],
};

export function CalendarEventsMonth({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  events = DEFAULT_MONTH_EVENTS,
  className = '',
}: CalendarEventsMonthProps): JSX.Element {
  const weeks = buildWeeks(year, month);
  return (
    <div className={['w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <h2 className="mb-2 px-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{(EVENTS_MONTHS[month] ?? '') + ' ' + year}</h2>
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            {EVENTS_HEADERS.map(([short, full], hi) => (
              <th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                <span aria-hidden="true">{short}</span>
                <span className="sr-only">{full}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (day === null) return <td key={di} className="p-0.5 align-top" aria-hidden="true" />;
                const date = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                const isToday = date === today;
                const list = events[day] ?? [];
                return (
                  <td key={di} className="p-0.5 align-top">
                    <div className="flex min-h-[3.75rem] flex-col gap-0.5 rounded-lg border border-transparent p-1 hover:border-gray-200 dark:hover:border-gray-800">
                      <span
                        aria-current={isToday ? 'date' : undefined}
                        className={isToday
                          ? 'inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[0.7rem] font-semibold text-white'
                          : 'text-[0.7rem] font-medium text-gray-500 dark:text-gray-400'}
                      >
                        {day}
                      </span>
                      <ul className="flex flex-col gap-0.5">
                        {list.slice(0, 2).map((title) => (
                          <li key={title} className="truncate rounded px-1 py-0.5 text-left text-[0.65rem] leading-tight bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {title}
                          </li>
                        ))}
                        {list.length > 2 ? (
                          <li className="text-[0.6rem] text-gray-400 dark:text-gray-500">{'+' + (list.length - 2) + ' more'}</li>
                        ) : null}
                      </ul>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    },
  },
  {
    slug: 'calendar-heatmap-year',
    category: 'calendar',
    tags: ['calendar', 'heatmap', 'year', 'activity', 'contributions'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2210, copies: 610, downloads: 152 },
    props: [
      { name: "startDate", type: "string", default: "'2025-12-28'", descriptionKey: "startDate" },
      { name: "weeks", type: "number", default: "53", descriptionKey: "weeks" },
      { name: "title", type: "string", default: "'Activity in 2026'", descriptionKey: "title" },
      { name: "levelFor", type: "(index: number) => number", descriptionKey: "levelFor" },
      { name: "className", type: "string", descriptionKey: "className" },
    ],
    code: {
      tailwind: `<!--
  A year of activity as a 53-week x 7-day grid. It cannot shrink below 53
  columns, so the honest move is a horizontal scroll container rather than a
  squeeze that makes every square unreadable. The grid is one role="img" with a
  summary label - 371 individually-announced squares would be noise, not
  information - and the colour legend is captioned Less -> More.
-->
<figure class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <figcaption class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Activity in 2026</figcaption>
  <div class="overflow-x-auto pb-1">
    <div class="inline-grid grid-flow-col grid-rows-7 gap-1" role="img" aria-label="Daily activity heatmap for 2026, one square per day">
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></div>
      <div class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></div>
    </div>
  </div>
  <div class="mt-3 flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
    <span>Less</span>
      <span class="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden="true"></span>
      <span class="h-3 w-3 rounded-sm bg-blue-200 dark:bg-blue-900" aria-hidden="true"></span>
      <span class="h-3 w-3 rounded-sm bg-blue-300 dark:bg-blue-800" aria-hidden="true"></span>
      <span class="h-3 w-3 rounded-sm bg-blue-500 dark:bg-blue-600" aria-hidden="true"></span>
      <span class="h-3 w-3 rounded-sm bg-blue-700 dark:bg-blue-400" aria-hidden="true"></span>
    <span>More</span>
  </div>
</figure>`,
      react: `const HEATMAP_LEVELS = [
  'bg-gray-100 dark:bg-gray-800',
  'bg-blue-200 dark:bg-blue-900',
  'bg-blue-300 dark:bg-blue-800',
  'bg-blue-500 dark:bg-blue-600',
  'bg-blue-700 dark:bg-blue-400',
];

export function CalendarHeatmapYear({
  startDate = '2025-12-28',
  weeks = 53,
  title = 'Activity in 2026',
  levelFor = (index) => (index * 31 + 7) % 5,
  className = '',
}) {
  const squares = [];
  for (let i = 0; i < weeks * 7; i += 1) squares.push(i);
  return (
    <figure className={['w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <figcaption className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</figcaption>
      <div className="overflow-x-auto pb-1">
        <div className="inline-grid grid-flow-col grid-rows-7 gap-1" role="img" aria-label={'Daily activity heatmap starting ' + startDate + ', one square per day'}>
          {squares.map((i) => (
            <div key={i} className={['h-3 w-3 rounded-sm', HEATMAP_LEVELS[Math.max(0, Math.min(4, levelFor(i)))]].join(' ')} aria-hidden="true" />
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        {HEATMAP_LEVELS.map((tone) => (
          <span key={tone} className={['h-3 w-3 rounded-sm', tone].join(' ')} aria-hidden="true" />
        ))}
        <span>More</span>
      </div>
    </figure>
  );
}`,
      typescript: `interface CalendarHeatmapYearProps {
  /** ISO date of the first (top-left) square - should be a Sunday. */
  startDate?: string;
  /** Number of week-columns to render. */
  weeks?: number;
  title?: string;
  /** Intensity 0-4 for a given zero-based day index. Deterministic by default. */
  levelFor?: (index: number) => number;
  className?: string;
}

const HEATMAP_LEVELS = [
  'bg-gray-100 dark:bg-gray-800',
  'bg-blue-200 dark:bg-blue-900',
  'bg-blue-300 dark:bg-blue-800',
  'bg-blue-500 dark:bg-blue-600',
  'bg-blue-700 dark:bg-blue-400',
];

export function CalendarHeatmapYear({
  startDate = '2025-12-28',
  weeks = 53,
  title = 'Activity in 2026',
  levelFor = (index: number) => (index * 31 + 7) % 5,
  className = '',
}: CalendarHeatmapYearProps): JSX.Element {
  const squares: number[] = [];
  for (let i = 0; i < weeks * 7; i += 1) squares.push(i);
  return (
    <figure className={['w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <figcaption className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</figcaption>
      <div className="overflow-x-auto pb-1">
        <div className="inline-grid grid-flow-col grid-rows-7 gap-1" role="img" aria-label={'Daily activity heatmap starting ' + startDate + ', one square per day'}>
          {squares.map((i) => (
            <div key={i} className={['h-3 w-3 rounded-sm', HEATMAP_LEVELS[Math.max(0, Math.min(4, levelFor(i)))]].join(' ')} aria-hidden="true" />
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        {HEATMAP_LEVELS.map((tone) => (
          <span key={tone} className={['h-3 w-3 rounded-sm', tone].join(' ')} aria-hidden="true" />
        ))}
        <span>More</span>
      </div>
    </figure>
  );
}`,
    },
  },
  {
    slug: 'calendar-upcoming-list',
    category: 'calendar',
    tags: ['calendar', 'upcoming', 'list', 'agenda', 'events'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1370, copies: 402, downloads: 91 },
    props: [
      { name: "heading", type: "string", default: "'Upcoming'", descriptionKey: "heading" },
      { name: "events", type: "UpcomingEvent[]", descriptionKey: "events" },
      { name: "className", type: "string", descriptionKey: "className" },
    ],
    code: {
      tailwind: `<!--
  A list, so it uses <ul>/<li> and each row is a single link - the whole row is
  the target, not a tiny hotspot. The date badge is a fixed 44px so titles align
  and can truncate instead of wrapping the badge. Coloured dots are decorative
  (aria-hidden); the title carries the meaning.
-->
<div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <h2 class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Upcoming</h2>
  <ul class="space-y-2">
      <li>
        <a href="#" class="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-800 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
          <span class="flex w-11 shrink-0 flex-col items-center rounded-lg bg-gray-50 py-1 dark:bg-gray-800">
            <span class="text-[0.6rem] font-medium uppercase text-gray-500 dark:text-gray-400">Fri</span>
            <span class="text-base font-semibold tabular-nums text-gray-900 dark:text-gray-100">17</span>
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-1.5">
              <span class="h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-hidden="true"></span>
              <span class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">Design review</span>
            </span>
            <span class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">11:00 AM</span>
          </span>
        </a>
      </li>
      <li>
        <a href="#" class="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-800 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
          <span class="flex w-11 shrink-0 flex-col items-center rounded-lg bg-gray-50 py-1 dark:bg-gray-800">
            <span class="text-[0.6rem] font-medium uppercase text-gray-500 dark:text-gray-400">Sat</span>
            <span class="text-base font-semibold tabular-nums text-gray-900 dark:text-gray-100">18</span>
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-1.5">
              <span class="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true"></span>
              <span class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">Team offsite</span>
            </span>
            <span class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">All day</span>
          </span>
        </a>
      </li>
      <li>
        <a href="#" class="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-800 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
          <span class="flex w-11 shrink-0 flex-col items-center rounded-lg bg-gray-50 py-1 dark:bg-gray-800">
            <span class="text-[0.6rem] font-medium uppercase text-gray-500 dark:text-gray-400">Tue</span>
            <span class="text-base font-semibold tabular-nums text-gray-900 dark:text-gray-100">21</span>
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-1.5">
              <span class="h-2 w-2 shrink-0 rounded-full bg-violet-500" aria-hidden="true"></span>
              <span class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">Product launch</span>
            </span>
            <span class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">3:00 PM</span>
          </span>
        </a>
      </li>
      <li>
        <a href="#" class="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-800 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
          <span class="flex w-11 shrink-0 flex-col items-center rounded-lg bg-gray-50 py-1 dark:bg-gray-800">
            <span class="text-[0.6rem] font-medium uppercase text-gray-500 dark:text-gray-400">Fri</span>
            <span class="text-base font-semibold tabular-nums text-gray-900 dark:text-gray-100">24</span>
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-1.5">
              <span class="h-2 w-2 shrink-0 rounded-full bg-amber-500" aria-hidden="true"></span>
              <span class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">Sprint demo</span>
            </span>
            <span class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">10:00 AM</span>
          </span>
        </a>
      </li>
  </ul>
</div>`,
      react: `const UPCOMING_DOTS = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
};

const DEFAULT_UPCOMING: UpcomingEvent[] = [
  { day: 17, weekday: 'Fri', title: 'Design review', time: '11:00 AM', tone: 'blue' },
  { day: 18, weekday: 'Sat', title: 'Team offsite', time: 'All day', tone: 'emerald' },
  { day: 21, weekday: 'Tue', title: 'Product launch', time: '3:00 PM', tone: 'violet' },
  { day: 24, weekday: 'Fri', title: 'Sprint demo', time: '10:00 AM', tone: 'amber' },
];

export function CalendarUpcomingList({
  heading = 'Upcoming',
  events = DEFAULT_UPCOMING,
  className = '',
}) {
  return (
    <div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{heading}</h2>
      <ul className="space-y-2">
        {events.map((e, i) => (
          <li key={i}>
            <a
              href={e.href ?? '#'}
              className="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-800 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
            >
              <span className="flex w-11 shrink-0 flex-col items-center rounded-lg bg-gray-50 py-1 dark:bg-gray-800">
                <span className="text-[0.6rem] font-medium uppercase text-gray-500 dark:text-gray-400">{e.weekday}</span>
                <span className="text-base font-semibold tabular-nums text-gray-900 dark:text-gray-100">{e.day}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className={['h-2 w-2 shrink-0 rounded-full', UPCOMING_DOTS[e.tone]].join(' ')} aria-hidden="true" />
                  <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{e.title}</span>
                </span>
                <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{e.time}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      typescript: `interface UpcomingEvent {
  day: number;
  weekday: string;
  title: string;
  time: string;
  tone: 'blue' | 'emerald' | 'violet' | 'amber';
  href?: string;
}

interface CalendarUpcomingListProps {
  heading?: string;
  events?: UpcomingEvent[];
  className?: string;
}

const UPCOMING_DOTS = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
};

const DEFAULT_UPCOMING: UpcomingEvent[] = [
  { day: 17, weekday: 'Fri', title: 'Design review', time: '11:00 AM', tone: 'blue' },
  { day: 18, weekday: 'Sat', title: 'Team offsite', time: 'All day', tone: 'emerald' },
  { day: 21, weekday: 'Tue', title: 'Product launch', time: '3:00 PM', tone: 'violet' },
  { day: 24, weekday: 'Fri', title: 'Sprint demo', time: '10:00 AM', tone: 'amber' },
];

export function CalendarUpcomingList({
  heading = 'Upcoming',
  events = DEFAULT_UPCOMING,
  className = '',
}: CalendarUpcomingListProps): JSX.Element {
  return (
    <div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{heading}</h2>
      <ul className="space-y-2">
        {events.map((e, i) => (
          <li key={i}>
            <a
              href={e.href ?? '#'}
              className="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-800 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
            >
              <span className="flex w-11 shrink-0 flex-col items-center rounded-lg bg-gray-50 py-1 dark:bg-gray-800">
                <span className="text-[0.6rem] font-medium uppercase text-gray-500 dark:text-gray-400">{e.weekday}</span>
                <span className="text-base font-semibold tabular-nums text-gray-900 dark:text-gray-100">{e.day}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className={['h-2 w-2 shrink-0 rounded-full', UPCOMING_DOTS[e.tone]].join(' ')} aria-hidden="true" />
                  <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{e.title}</span>
                </span>
                <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{e.time}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    },
  },
  {
    slug: 'calendar-availability-slots',
    category: 'calendar',
    tags: ['calendar', 'availability', 'slots', 'booking', 'scheduling'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1610, copies: 455, downloads: 118 },
    props: [
      { name: "heading", type: "string", default: "'Tuesday, July 21'", descriptionKey: "heading" },
      { name: "subheading", type: "string", default: "'Select a 30-minute slot'", descriptionKey: "subheading" },
      { name: "slots", type: "Slot[]", descriptionKey: "slots" },
      { name: "selected", type: "string", default: "'10:30 AM'", descriptionKey: "selected" },
      { name: "onSelect", type: "(time: string) => void", descriptionKey: "onSelect" },
      { name: "className", type: "string", descriptionKey: "className" },
    ],
    code: {
      tailwind: `<!--
  A booking grid. Two columns at 320px, three from sm: - never one wide column
  of stretched buttons. Taken slots are real disabled <button>s (struck through
  and aria-disabled), not removed, so the shape of the day stays legible: you
  can see it is busy, not just short.
-->
<div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Tuesday, July 21</h2>
  <p class="mb-3 text-xs text-gray-500 dark:text-gray-400">Select a 30-minute slot</p>
  <ul class="grid grid-cols-2 gap-2 sm:grid-cols-3">
      <li><button type="button" class="w-full rounded-lg border py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300">9:00 AM</button></li>
      <li><button type="button" class="w-full rounded-lg border py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300">9:30 AM</button></li>
      <li><button type="button" disabled aria-disabled="true" class="w-full cursor-not-allowed rounded-lg border border-gray-100 py-2 text-sm text-gray-300 line-through dark:border-gray-800 dark:text-gray-600">10:00 AM</button></li>
      <li><button type="button" aria-pressed="true" class="w-full rounded-lg border py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-transparent bg-blue-600 text-white">10:30 AM</button></li>
      <li><button type="button" class="w-full rounded-lg border py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300">11:00 AM</button></li>
      <li><button type="button" disabled aria-disabled="true" class="w-full cursor-not-allowed rounded-lg border border-gray-100 py-2 text-sm text-gray-300 line-through dark:border-gray-800 dark:text-gray-600">1:00 PM</button></li>
      <li><button type="button" class="w-full rounded-lg border py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300">1:30 PM</button></li>
      <li><button type="button" class="w-full rounded-lg border py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300">2:00 PM</button></li>
      <li><button type="button" class="w-full rounded-lg border py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300">3:00 PM</button></li>
      <li><button type="button" class="w-full rounded-lg border py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300">4:00 PM</button></li>
  </ul>
</div>`,
      react: `const DEFAULT_SLOTS: Slot[] = [
  { time: '9:00 AM' }, { time: '9:30 AM' }, { time: '10:00 AM', booked: true },
  { time: '10:30 AM' }, { time: '11:00 AM' }, { time: '1:00 PM', booked: true },
  { time: '1:30 PM' }, { time: '2:00 PM' }, { time: '3:00 PM' }, { time: '4:00 PM' },
];

export function CalendarAvailabilitySlots({
  heading = 'Tuesday, July 21',
  subheading = 'Select a 30-minute slot',
  slots = DEFAULT_SLOTS,
  selected = '10:30 AM',
  onSelect,
  className = '',
}) {
  return (
    <div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{heading}</h2>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{subheading}</p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((s) => {
          if (s.booked) {
            return (
              <li key={s.time}>
                <button type="button" disabled aria-disabled="true" className="w-full cursor-not-allowed rounded-lg border border-gray-100 py-2 text-sm text-gray-300 line-through dark:border-gray-800 dark:text-gray-600">
                  {s.time}
                </button>
              </li>
            );
          }
          const isSelected = s.time === selected;
          return (
            <li key={s.time}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect?.(s.time)}
                className={['w-full rounded-lg border py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400',
                  isSelected
                    ? 'border-transparent bg-blue-600 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300',
                ].join(' ')}
              >
                {s.time}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}`,
      typescript: `interface Slot {
  time: string;
  booked?: boolean;
}

interface CalendarAvailabilitySlotsProps {
  heading?: string;
  subheading?: string;
  slots?: Slot[];
  selected?: string;
  onSelect?: (time: string) => void;
  className?: string;
}

const DEFAULT_SLOTS: Slot[] = [
  { time: '9:00 AM' }, { time: '9:30 AM' }, { time: '10:00 AM', booked: true },
  { time: '10:30 AM' }, { time: '11:00 AM' }, { time: '1:00 PM', booked: true },
  { time: '1:30 PM' }, { time: '2:00 PM' }, { time: '3:00 PM' }, { time: '4:00 PM' },
];

export function CalendarAvailabilitySlots({
  heading = 'Tuesday, July 21',
  subheading = 'Select a 30-minute slot',
  slots = DEFAULT_SLOTS,
  selected = '10:30 AM',
  onSelect,
  className = '',
}: CalendarAvailabilitySlotsProps): JSX.Element {
  return (
    <div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{heading}</h2>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{subheading}</p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((s) => {
          if (s.booked) {
            return (
              <li key={s.time}>
                <button type="button" disabled aria-disabled="true" className="w-full cursor-not-allowed rounded-lg border border-gray-100 py-2 text-sm text-gray-300 line-through dark:border-gray-800 dark:text-gray-600">
                  {s.time}
                </button>
              </li>
            );
          }
          const isSelected = s.time === selected;
          return (
            <li key={s.time}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect?.(s.time)}
                className={['w-full rounded-lg border py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400',
                  isSelected
                    ? 'border-transparent bg-blue-600 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300',
                ].join(' ')}
              >
                {s.time}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}`,
    },
  },
  {
    slug: 'calendar-dual-month',
    category: 'calendar',
    tags: ['calendar', 'dual', 'range', 'date-range', 'two-month'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1720, copies: 489, downloads: 126 },
    props: [
      { name: "year", type: "number", default: "2026", descriptionKey: "year" },
      { name: "month", type: "number", default: "6", descriptionKey: "month" },
      { name: "rangeStart", type: "string", default: "'2026-07-21'", descriptionKey: "rangeStart" },
      { name: "rangeEnd", type: "string", default: "'2026-08-04'", descriptionKey: "rangeEnd" },
      { name: "today", type: "string", default: "'2026-07-17'", descriptionKey: "today" },
      { name: "className", type: "string", descriptionKey: "className" },
    ],
    code: {
      tailwind: `<!--
  Two months for range selection. They sit side by side from sm: up and stack to
  one column at 320px (two 7-col grids never fit a phone), which is why the
  wrapper is flex-col sm:flex-row. The range endpoints are filled; the days
  between get a lighter fill so the span reads as one continuous selection.
-->
<div class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <div class="flex flex-col gap-6 sm:flex-row sm:gap-4">
    <div class="min-w-0 flex-1">
      <p class="mb-2 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">July 2026</p>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
              <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
              <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
              <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
              <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
              <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
              <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
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
              <td class="p-0.5 text-center"><button type="button" aria-pressed="true" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">21</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">22</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">23</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">24</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">25</button></td>
            </tr>
            <tr>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">26</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">27</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">28</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">29</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">30</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">31</button></td>
              <td class="p-0.5" aria-hidden="true"></td>
            </tr>
        </tbody>
      </table>
    </div>
    <div class="min-w-0 flex-1">
      <p class="mb-2 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">August 2026</p>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
              <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
              <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
              <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
              <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
              <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
              <th scope="col" class="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
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
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">1</button></td>
            </tr>
            <tr>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">2</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100">3</button></td>
              <td class="p-0.5 text-center"><button type="button" aria-pressed="true" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 bg-blue-600 font-semibold text-white hover:bg-blue-700">4</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">5</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">6</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">7</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">8</button></td>
            </tr>
            <tr>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">9</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">10</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">11</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">12</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">13</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">14</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">15</button></td>
            </tr>
            <tr>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">16</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">17</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">18</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">19</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">20</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">21</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">22</button></td>
            </tr>
            <tr>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">23</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">24</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">25</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">26</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">27</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">28</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">29</button></td>
            </tr>
            <tr>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">30</button></td>
              <td class="p-0.5 text-center"><button type="button" class="flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">31</button></td>
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
      react: `function buildWeeks(year, month) {
  const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < start; i += 1) cells.push(null);
  for (let d = 1; d <= total; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const DUAL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DUAL_HEADERS = [['S', 'Sunday'], ['M', 'Monday'], ['T', 'Tuesday'], ['W', 'Wednesday'], ['T', 'Thursday'], ['F', 'Friday'], ['S', 'Saturday']];

export function CalendarDualMonth({
  year = 2026,
  month = 6,
  rangeStart = '2026-07-21',
  rangeEnd = '2026-08-04',
  today = '2026-07-17',
  className = '',
}) {
  const panels = [
    { y: year, m: month },
    { y: month === 11 ? year + 1 : year, m: (month + 1) % 12 },
  ];
  return (
    <div className={['w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        {panels.map((panel) => {
          const weeks = buildWeeks(panel.y, panel.m);
          return (
            <div key={panel.y + '-' + panel.m} className="min-w-0 flex-1">
              <p className="mb-2 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">{(DUAL_MONTHS[panel.m] ?? '') + ' ' + panel.y}</p>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {DUAL_HEADERS.map(([short, full], hi) => (
                      <th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        <span aria-hidden="true">{short}</span>
                        <span className="sr-only">{full}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((week, wi) => (
                    <tr key={wi}>
                      {week.map((day, di) => {
                        if (day === null) return <td key={di} className="p-0.5" aria-hidden="true" />;
                        const date = panel.y + '-' + String(panel.m + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                        const inRange = date >= rangeStart && date <= rangeEnd;
                        const isEnd = date === rangeStart || date === rangeEnd;
                        const isToday = date === today;
                        const tone = isEnd
                          ? 'bg-blue-600 font-semibold text-white hover:bg-blue-700'
                          : inRange
                            ? 'bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100'
                            : isToday
                              ? 'font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
                        return (
                          <td key={di} className="p-0.5 text-center">
                            <button
                              type="button"
                              aria-pressed={isEnd}
                              aria-current={isToday ? 'date' : undefined}
                              className={['flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400', tone].join(' ')}
                            >
                              {day}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
      typescript: `function buildWeeks(year: number, month: number): Array<number | null>[] {
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

interface CalendarDualMonthProps {
  /** ISO date of the first visible month's day 1 region. */
  year?: number;
  month?: number;
  rangeStart?: string;
  rangeEnd?: string;
  today?: string;
  className?: string;
}

const DUAL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DUAL_HEADERS = [['S', 'Sunday'], ['M', 'Monday'], ['T', 'Tuesday'], ['W', 'Wednesday'], ['T', 'Thursday'], ['F', 'Friday'], ['S', 'Saturday']];

export function CalendarDualMonth({
  year = 2026,
  month = 6,
  rangeStart = '2026-07-21',
  rangeEnd = '2026-08-04',
  today = '2026-07-17',
  className = '',
}: CalendarDualMonthProps): JSX.Element {
  const panels = [
    { y: year, m: month },
    { y: month === 11 ? year + 1 : year, m: (month + 1) % 12 },
  ];
  return (
    <div className={['w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        {panels.map((panel) => {
          const weeks = buildWeeks(panel.y, panel.m);
          return (
            <div key={panel.y + '-' + panel.m} className="min-w-0 flex-1">
              <p className="mb-2 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">{(DUAL_MONTHS[panel.m] ?? '') + ' ' + panel.y}</p>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {DUAL_HEADERS.map(([short, full], hi) => (
                      <th key={hi} scope="col" className="pb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        <span aria-hidden="true">{short}</span>
                        <span className="sr-only">{full}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((week, wi) => (
                    <tr key={wi}>
                      {week.map((day, di) => {
                        if (day === null) return <td key={di} className="p-0.5" aria-hidden="true" />;
                        const date = panel.y + '-' + String(panel.m + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                        const inRange = date >= rangeStart && date <= rangeEnd;
                        const isEnd = date === rangeStart || date === rangeEnd;
                        const isToday = date === today;
                        const tone = isEnd
                          ? 'bg-blue-600 font-semibold text-white hover:bg-blue-700'
                          : inRange
                            ? 'bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-100'
                            : isToday
                              ? 'font-semibold text-blue-700 ring-1 ring-inset ring-blue-600 hover:bg-gray-100 dark:text-blue-300 dark:ring-blue-400 dark:hover:bg-gray-800'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
                        return (
                          <td key={di} className="p-0.5 text-center">
                            <button
                              type="button"
                              aria-pressed={isEnd}
                              aria-current={isToday ? 'date' : undefined}
                              className={['flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400', tone].join(' ')}
                            >
                              {day}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'calendar-year-overview',
    category: 'calendar',
    tags: ['calendar', 'year', 'overview', 'twelve-month', 'grid'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1490, copies: 431, downloads: 104 },
    props: [
      { name: "year", type: "number", default: "2026", descriptionKey: "year" },
      { name: "today", type: "string", default: "'2026-07-17'", descriptionKey: "today" },
      { name: "className", type: "string", descriptionKey: "className" },
    ],
    code: {
      tailwind: `<!--
  Twelve mini-months. One column at 320px, two from sm:, three from lg: and four
  from xl: - the tiles reflow, they do not shrink below legibility. Each is still
  a real <table> with single-letter <th> headers (full weekday in an sr-only
  span), and today is the one filled disc across the whole year.
-->
<div class="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <h2 class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">2026</h2>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">January</p>
        <table class="w-full border-collapse">
          <thead>
            <tr>
            <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">1</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">2</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">3</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">4</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">5</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">6</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">7</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">8</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">9</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">10</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">11</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">12</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">13</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">14</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">15</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">16</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">17</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">18</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">19</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">20</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">21</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">22</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">23</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">24</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">25</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">26</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">27</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">28</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">29</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">30</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">31</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">February</p>
        <table class="w-full border-collapse">
          <thead>
            <tr>
            <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">1</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">2</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">3</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">4</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">5</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">6</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">7</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">8</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">9</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">10</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">11</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">12</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">13</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">14</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">15</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">16</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">17</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">18</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">19</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">20</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">21</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">22</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">23</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">24</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">25</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">26</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">27</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">28</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">March</p>
        <table class="w-full border-collapse">
          <thead>
            <tr>
            <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">1</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">2</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">3</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">4</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">5</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">6</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">7</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">8</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">9</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">10</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">11</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">12</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">13</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">14</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">15</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">16</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">17</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">18</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">19</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">20</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">21</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">22</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">23</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">24</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">25</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">26</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">27</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">28</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">29</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">30</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">31</span></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">April</p>
        <table class="w-full border-collapse">
          <thead>
            <tr>
            <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">1</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">2</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">3</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">4</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">5</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">6</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">7</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">8</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">9</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">10</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">11</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">12</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">13</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">14</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">15</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">16</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">17</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">18</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">19</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">20</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">21</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">22</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">23</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">24</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">25</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">26</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">27</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">28</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">29</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">30</span></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">May</p>
        <table class="w-full border-collapse">
          <thead>
            <tr>
            <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">1</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">2</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">3</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">4</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">5</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">6</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">7</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">8</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">9</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">10</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">11</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">12</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">13</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">14</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">15</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">16</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">17</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">18</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">19</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">20</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">21</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">22</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">23</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">24</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">25</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">26</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">27</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">28</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">29</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">30</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">31</span></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">June</p>
        <table class="w-full border-collapse">
          <thead>
            <tr>
            <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">1</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">2</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">3</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">4</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">5</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">6</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">7</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">8</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">9</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">10</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">11</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">12</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">13</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">14</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">15</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">16</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">17</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">18</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">19</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">20</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">21</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">22</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">23</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">24</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">25</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">26</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">27</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">28</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">29</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">30</span></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">July</p>
        <table class="w-full border-collapse">
          <thead>
            <tr>
            <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">1</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">2</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">3</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">4</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">5</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">6</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">7</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">8</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">9</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">10</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">11</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">12</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">13</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">14</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">15</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">16</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[0.6rem] font-semibold text-white" aria-current="date">17</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">18</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">19</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">20</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">21</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">22</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">23</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">24</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">25</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">26</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">27</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">28</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">29</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">30</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">31</span></td>
              <td class="p-px" aria-hidden="true"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">August</p>
        <table class="w-full border-collapse">
          <thead>
            <tr>
            <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">1</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">2</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">3</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">4</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">5</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">6</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">7</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">8</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">9</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">10</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">11</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">12</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">13</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">14</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">15</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">16</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">17</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">18</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">19</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">20</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">21</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">22</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">23</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">24</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">25</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">26</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">27</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">28</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">29</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">30</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">31</span></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">September</p>
        <table class="w-full border-collapse">
          <thead>
            <tr>
            <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">1</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">2</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">3</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">4</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">5</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">6</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">7</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">8</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">9</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">10</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">11</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">12</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">13</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">14</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">15</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">16</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">17</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">18</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">19</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">20</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">21</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">22</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">23</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">24</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">25</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">26</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">27</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">28</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">29</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">30</span></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">October</p>
        <table class="w-full border-collapse">
          <thead>
            <tr>
            <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">1</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">2</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">3</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">4</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">5</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">6</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">7</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">8</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">9</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">10</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">11</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">12</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">13</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">14</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">15</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">16</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">17</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">18</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">19</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">20</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">21</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">22</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">23</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">24</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">25</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">26</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">27</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">28</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">29</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">30</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">31</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">November</p>
        <table class="w-full border-collapse">
          <thead>
            <tr>
            <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">1</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">2</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">3</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">4</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">5</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">6</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">7</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">8</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">9</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">10</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">11</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">12</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">13</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">14</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">15</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">16</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">17</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">18</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">19</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">20</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">21</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">22</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">23</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">24</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">25</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">26</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">27</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">28</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">29</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">30</span></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">December</p>
        <table class="w-full border-collapse">
          <thead>
            <tr>
            <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Tuesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">W</span><span class="sr-only">Wednesday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">T</span><span class="sr-only">Thursday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">F</span><span class="sr-only">Friday</span></th>
                <th scope="col" class="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400"><span aria-hidden="true">S</span><span class="sr-only">Saturday</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">1</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">2</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">3</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">4</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">5</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">6</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">7</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">8</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">9</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">10</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">11</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">12</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">13</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">14</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">15</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">16</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">17</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">18</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">19</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">20</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">21</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">22</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">23</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">24</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">25</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">26</span></td>
            </tr>
            <tr>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">27</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">28</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">29</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">30</span></td>
              <td class="p-px text-center"><span class="flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300">31</span></td>
              <td class="p-px" aria-hidden="true"></td>
              <td class="p-px" aria-hidden="true"></td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
</div>`,
      react: `function buildWeeks(year, month) {
  const start = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < start; i += 1) cells.push(null);
  for (let d = 1; d <= total; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const YEAR_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEAR_HEADERS = [['S', 'Sunday'], ['M', 'Monday'], ['T', 'Tuesday'], ['W', 'Wednesday'], ['T', 'Thursday'], ['F', 'Friday'], ['S', 'Saturday']];

export function CalendarYearOverview({
  year = 2026,
  today = '2026-07-17',
  className = '',
}) {
  const months = [];
  for (let m = 0; m < 12; m += 1) months.push(m);
  return (
    <div className={['w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{String(year)}</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((m) => {
          const weeks = buildWeeks(year, m);
          return (
            <div key={m} className="min-w-0">
              <p className="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">{YEAR_MONTHS[m]}</p>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {YEAR_HEADERS.map(([short, full], hi) => (
                      <th key={hi} scope="col" className="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400">
                        <span aria-hidden="true">{short}</span>
                        <span className="sr-only">{full}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((week, wi) => (
                    <tr key={wi}>
                      {week.map((day, di) => {
                        if (day === null) return <td key={di} className="p-px" aria-hidden="true" />;
                        const date = year + '-' + String(m + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                        const isToday = date === today;
                        return (
                          <td key={di} className="p-px text-center">
                            <span
                              aria-current={isToday ? 'date' : undefined}
                              className={isToday
                                ? 'flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[0.6rem] font-semibold text-white'
                                : 'flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300'}
                            >
                              {day}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
      typescript: `function buildWeeks(year: number, month: number): Array<number | null>[] {
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

interface CalendarYearOverviewProps {
  year?: number;
  today?: string;
  className?: string;
}

const YEAR_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEAR_HEADERS = [['S', 'Sunday'], ['M', 'Monday'], ['T', 'Tuesday'], ['W', 'Wednesday'], ['T', 'Thursday'], ['F', 'Friday'], ['S', 'Saturday']];

export function CalendarYearOverview({
  year = 2026,
  today = '2026-07-17',
  className = '',
}: CalendarYearOverviewProps): JSX.Element {
  const months: number[] = [];
  for (let m = 0; m < 12; m += 1) months.push(m);
  return (
    <div className={['w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{String(year)}</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((m) => {
          const weeks = buildWeeks(year, m);
          return (
            <div key={m} className="min-w-0">
              <p className="mb-1 text-xs font-semibold text-gray-900 dark:text-gray-100">{YEAR_MONTHS[m]}</p>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {YEAR_HEADERS.map(([short, full], hi) => (
                      <th key={hi} scope="col" className="pb-1 text-center text-[0.55rem] font-medium text-gray-500 dark:text-gray-400">
                        <span aria-hidden="true">{short}</span>
                        <span className="sr-only">{full}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((week, wi) => (
                    <tr key={wi}>
                      {week.map((day, di) => {
                        if (day === null) return <td key={di} className="p-px" aria-hidden="true" />;
                        const date = year + '-' + String(m + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                        const isToday = date === today;
                        return (
                          <td key={di} className="p-px text-center">
                            <span
                              aria-current={isToday ? 'date' : undefined}
                              className={isToday
                                ? 'flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[0.6rem] font-semibold text-white'
                                : 'flex h-6 w-6 items-center justify-center text-[0.6rem] text-gray-600 dark:text-gray-300'}
                            >
                              {day}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
    },
  },
];
