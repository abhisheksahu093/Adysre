'use client';

/**
 * Live preview for `calendar-year-overview`. Mirrors the `typescript` variant and renders a
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

interface CalendarYearOverviewProps {
  year?: number;
  today?: string;
  className?: string;
}

const YEAR_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEAR_HEADERS = [['S', 'Sunday'], ['M', 'Monday'], ['T', 'Tuesday'], ['W', 'Wednesday'], ['T', 'Thursday'], ['F', 'Friday'], ['S', 'Saturday']];

function CalendarYearOverview({
  year = 2026,
  today = '2026-07-17',
  className = '',
}: CalendarYearOverviewProps) {
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
}

export default function CalendarYearOverviewPreview() {
  return <CalendarYearOverview />;
}

export const minHeight = 560;
