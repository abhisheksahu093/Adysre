'use client';

/**
 * Live preview for `calendar-events-month`. Mirrors the `typescript` variant and renders a
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

function CalendarEventsMonth({
  year = 2026,
  month = 6,
  today = '2026-07-17',
  events = DEFAULT_MONTH_EVENTS,
  className = '',
}: CalendarEventsMonthProps) {
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
}

export default function CalendarEventsMonthPreview() {
  return <CalendarEventsMonth />;
}

export const minHeight = 460;
