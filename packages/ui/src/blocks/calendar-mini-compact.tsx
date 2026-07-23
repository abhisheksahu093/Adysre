'use client';

/**
 * Live preview for `calendar-mini-compact`. Mirrors the `typescript` variant and renders a
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
}: CalendarMiniCompactProps) {
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
}

export default function CalendarMiniCompactPreview() {
  return <CalendarMiniCompact />;
}

export const minHeight = 300;
