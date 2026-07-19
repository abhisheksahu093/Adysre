'use client';

/**
 * Live preview for `calendar-heatmap-year`. Mirrors the `typescript` variant and renders a
 * fixed July 2026 so the stage is deterministic. Keep in step with
 * `src/data/components/calendar.ts`.
 */
interface CalendarHeatmapYearProps {
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

function CalendarHeatmapYear({
  startDate = '2025-12-28',
  weeks = 53,
  title = 'Activity in 2026',
  levelFor = (index: number) => (index * 31 + 7) % 5,
  className = '',
}: CalendarHeatmapYearProps) {
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
}

export default function CalendarHeatmapYearPreview() {
  return <CalendarHeatmapYear />;
}

export const minHeight = 200;
