'use client';

/**
 * Live preview for `calendar-month-grid`. Mirrors the `typescript` variant and renders a
 * fixed July 2026 so the stage is deterministic. Keep in step with
 * `src/data/components/calendar.ts`.
 */
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
}: CalendarMonthGridProps) {
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
}

export default function CalendarMonthGridPreview() {
  return <CalendarMonthGrid />;
}

export const minHeight = 380;
