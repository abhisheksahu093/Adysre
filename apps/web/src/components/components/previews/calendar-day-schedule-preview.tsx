'use client';

/**
 * Live preview for `calendar-day-schedule`. Mirrors the `typescript` variant and renders a
 * fixed July 2026 so the stage is deterministic. Keep in step with
 * `src/data/components/calendar.ts`.
 */
interface ScheduleEvent {
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

function CalendarDaySchedule({
  heading = 'Friday, July 17',
  fromHour = 8,
  toHour = 17,
  events = DEFAULT_DAY_EVENTS,
  className = '',
}: CalendarDayScheduleProps) {
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
}

export default function CalendarDaySchedulePreview() {
  return <CalendarDaySchedule />;
}

export const minHeight = 440;
