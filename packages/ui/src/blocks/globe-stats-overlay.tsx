/**
 * Live preview for `globe-stats-overlay`.
 *
 * Mirrors the `typescript` code variant verbatim. The badges are `<dl>` content
 * outside the aria-hidden globe. Keep in step with
 * `src/data/components/globes.ts`.
 */
const GSO_KEYFRAMES = `
  @keyframes gso-spin { to { transform: rotate(1turn); } }
`;

const POS = [
  'sm:absolute sm:left-2 sm:top-8',
  'sm:absolute sm:right-2 sm:top-16',
  'sm:absolute sm:bottom-8 sm:left-8',
  'sm:absolute sm:bottom-6 sm:right-6',
] as const;

interface GlobeStat {
  value: string;
  label: string;
}

interface GlobeStatsOverlayProps {
  stats: GlobeStat[];
  className?: string;
}

export function GlobeStatsOverlay({ stats, className = '' }: GlobeStatsOverlayProps) {
  return (
    <div className={`mx-auto w-full max-w-md px-4 py-8 ${className}`}>
      <style>{GSO_KEYFRAMES}</style>
      <div className="relative mx-auto aspect-square w-full max-w-[260px]" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-emerald-600/55 animate-[gso-spin_34s_linear_infinite] motion-reduce:animate-none dark:text-emerald-400/55">
          <defs>
            <pattern id="gso-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="gso-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#gso-clip)">
            <rect width="200" height="200" fill="url(#gso-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.5),transparent_55%)]" />
      </div>

      <div className="relative mt-6 flex flex-wrap justify-center gap-3 sm:mt-0 sm:block">
        {stats.slice(0, 4).map((s, i) => (
          <dl key={s.label} className={`rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-center shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/90 ${POS[i] ?? ''}`}>
            <dt className="text-lg font-bold text-gray-900 dark:text-gray-100">{s.value}</dt>
            <dd className="text-xs text-gray-500 dark:text-gray-400">{s.label}</dd>
          </dl>
        ))}
      </div>
    </div>
  );
}

export const minHeight = 380;

export default function GlobeStatsOverlayPreview() {
  return (
    <GlobeStatsOverlay
      stats={[
        { value: '99.99%', label: 'Uptime' },
        { value: '34', label: 'Regions' },
        { value: '28ms', label: 'p50 latency' },
      ]}
    />
  );
}
