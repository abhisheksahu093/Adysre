'use client';

/**
 * Live preview for `calendar-upcoming-list`. Mirrors the `typescript` variant and renders a
 * fixed July 2026 so the stage is deterministic. Keep in step with
 * `src/data/components/calendar.ts`.
 */
interface UpcomingEvent {
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
}: CalendarUpcomingListProps) {
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
}

export default function CalendarUpcomingListPreview() {
  return <CalendarUpcomingList />;
}

export const minHeight = 320;
