/**
 * Live preview for `globe-connections-arcs`.
 *
 * Mirrors the `typescript` code variant verbatim. Location pings are real
 * buttons with accessible names; the arcs are aria-hidden decoration. Keep in
 * step with `src/data/components/globes.ts`.
 */
const GCA_KEYFRAMES = `
  @keyframes gca-draw { from { stroke-dashoffset: 260; } to { stroke-dashoffset: 0; } }
`;

interface GlobePoint {
  label: string;
  x: number;
  y: number;
}

interface GlobeConnectionsArcsProps {
  points: GlobePoint[];
  caption?: string;
  className?: string;
}

function GlobeConnectionsArcs({ points, caption, className = '' }: GlobeConnectionsArcsProps) {
  return (
    <figure className={`mx-auto flex w-full max-w-sm flex-col items-center gap-5 px-4 py-8 ${className}`}>
      <style>{GCA_KEYFRAMES}</style>
      <div className="relative aspect-square w-full max-w-[280px]">
        <svg viewBox="0 0 200 200" className="h-full w-full text-sky-600/60 dark:text-sky-400/60" aria-hidden="true">
          <defs>
            <pattern id="gca-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.2" fill="currentColor" />
            </pattern>
            <clipPath id="gca-clip"><circle cx="100" cy="100" r="90" /></clipPath>
          </defs>
          <g clipPath="url(#gca-clip)">
            <rect width="200" height="200" fill="url(#gca-dots)" />
          </g>
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeOpacity="0.5" />
          <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="260" className="animate-[gca-draw_3.5s_ease-in-out_infinite] motion-reduce:animate-none">
            <path d="M58 132 Q100 40 150 92" />
            <path d="M58 132 Q70 70 118 58" />
          </g>
        </svg>

        {points.map((p) => (
          <button
            key={p.label}
            type="button"
            aria-label={p.label}
            className="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-sky-400/70 motion-reduce:hidden" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-sky-500 ring-2 ring-white dark:ring-gray-950" />
            <span className="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">
              {p.label}
            </span>
          </button>
        ))}
      </div>
      {caption ? <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400">{caption}</figcaption> : null}
    </figure>
  );
}

export const minHeight = 360;

export default function GlobeConnectionsArcsPreview() {
  return (
    <GlobeConnectionsArcs
      points={[
        { label: 'San Francisco', x: 29, y: 66 },
        { label: 'London', x: 75, y: 46 },
        { label: 'Berlin', x: 59, y: 29 },
      ]}
      caption="Live traffic across 3 regions"
    />
  );
}
