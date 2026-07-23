'use client';

/**
 * Live preview for `calendar-dual-month`. Mirrors the `typescript` variant and renders a
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
}: CalendarDualMonthProps) {
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
}

export default function CalendarDualMonthPreview() {
  return <CalendarDualMonth />;
}

export const minHeight = 420;
