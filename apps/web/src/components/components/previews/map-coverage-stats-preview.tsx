'use client';

/**
 * Live preview for `map-coverage-stats`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/maps.ts`.
 */
interface CoverageStat {
  id: string;
  label: string;
  value: string;
}

interface MapCoverageStatsProps {
  stats?: CoverageStat[];
  className?: string;
}

const DEFAULT_STATS: CoverageStat[] = [
  { id: 'countries', label: 'Countries', value: '150+' },
  { id: 'cities', label: 'Cities', value: '4,000' },
  { id: 'uptime', label: 'Uptime', value: '99.99%' },
];

function MapCoverageStats({ stats = DEFAULT_STATS, className = '' }: MapCoverageStatsProps) {
  return (
    <div className={'relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div className="relative aspect-[16/9] w-full">
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="coverage-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#coverage-dots)" />
        </svg>
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-gray-200 bg-white/90 p-3 backdrop-blur sm:inset-x-4 sm:bottom-4 dark:border-gray-800 dark:bg-gray-900/90">
          <dl className="grid grid-cols-3 gap-2 text-center">
            {stats.map((s) => (
              <div key={s.id}>
                <dt className="text-xs text-gray-500 dark:text-gray-400">{s.label}</dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export const minHeight = 300;

export default function MapCoverageStatsPreview() {
  return <MapCoverageStats className="w-full" />;
}
