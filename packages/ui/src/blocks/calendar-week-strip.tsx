'use client';

/**
 * Live preview for `calendar-week-strip`. Mirrors the `typescript` variant and renders a
 * fixed July 2026 so the stage is deterministic. Keep in step with
 * `src/data/components/calendar.ts`.
 */
interface WeekDay {
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
}: CalendarWeekStripProps) {
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
}

export default function CalendarWeekStripPreview() {
  return <CalendarWeekStrip />;
}
