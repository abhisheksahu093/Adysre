'use client';

/**
 * Live preview for `map-route-steps`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/maps.ts`.
 */
interface RouteStep {
  id: string;
  label: string;
  detail: string;
}

interface MapRouteStepsProps {
  steps?: RouteStep[];
  className?: string;
}

const DEFAULT_STEPS: RouteStep[] = [
  { id: 's1', label: 'Head north on Market St', detail: '400 m' },
  { id: 's2', label: 'Turn right onto 5th Ave', detail: '1.2 km' },
  { id: 's3', label: 'Continue past the park', detail: '600 m' },
  { id: 's4', label: 'Arrive at the office', detail: 'On the left' },
];

export function MapRouteSteps({ steps = DEFAULT_STEPS, className = '' }: MapRouteStepsProps) {
  const stops = steps.map((s, i) => ({
    id: s.id,
    n: i + 1,
    x: 30 + (i * 240) / Math.max(1, steps.length - 1),
    y: i % 2 === 0 ? 80 : 35,
  }));
  const line = stops.map((p) => p.x + ',' + p.y).join(' ');

  return (
    <div className={'w-full rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900">
        <svg viewBox="0 0 300 120" role="img" aria-label={'Route with ' + steps.length + ' stops'} className="h-auto w-full text-gray-300 dark:text-gray-700">
          <polyline points={line} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 8" />
          {stops.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={10} className="fill-blue-600 dark:fill-blue-500" />
              <text x={p.x} y={p.y + 4} textAnchor="middle" className="fill-white text-[11px] font-semibold">{p.n}</text>
            </g>
          ))}
        </svg>
      </div>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={s.id} className="flex gap-3">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white dark:bg-blue-500">{i + 1}</span>
            <span>
              <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{s.label}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">{s.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export const minHeight = 440;

export default function MapRouteStepsPreview() {
  return <MapRouteSteps className="w-full" />;
}
