/**
 * Live preview for `globe-flat-world-dots`.
 *
 * Mirrors the `typescript` code variant verbatim. The dotted continents are
 * aria-hidden; location markers are real buttons with accessible names. Keep in
 * step with `src/data/components/globes.ts`.
 */
interface MapMarker {
  label: string;
  x: number;
  y: number;
}

interface GlobeFlatWorldDotsProps {
  markers: MapMarker[];
  caption?: string;
  className?: string;
}

export function GlobeFlatWorldDots({ markers, caption, className = '' }: GlobeFlatWorldDotsProps) {
  return (
    <figure className={`mx-auto w-full max-w-lg px-4 py-8 ${className}`}>
      <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60">
        <svg viewBox="0 0 320 170" className="block w-full text-slate-400/70 dark:text-slate-500/70" aria-hidden="true">
          <defs>
            <pattern id="gfw-dots" width="7" height="7" patternUnits="userSpaceOnUse">
              <circle cx="1.4" cy="1.4" r="1.2" fill="currentColor" />
            </pattern>
          </defs>
          <g fill="url(#gfw-dots)">
            <path d="M60 30 C80 25 90 45 85 65 C95 80 80 120 62 130 C50 138 40 120 44 100 C36 80 45 45 60 30 Z" />
            <path d="M150 35 C170 30 180 50 172 68 C185 85 175 125 158 135 C146 140 140 120 146 100 C138 78 138 48 150 35 Z" />
            <path d="M210 40 C245 30 285 45 288 62 C292 80 265 92 240 88 C220 92 200 70 210 40 Z" />
            <path d="M250 108 C266 104 276 118 268 128 C258 136 244 130 246 118 Z" />
          </g>
        </svg>

        {markers.map((m) => (
          <button
            key={m.label}
            type="button"
            aria-label={m.label}
            className="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-rose-400/70 motion-reduce:hidden" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900" />
            <span className="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">
              {m.label}
            </span>
          </button>
        ))}
      </div>
      {caption ? <figcaption className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">{caption}</figcaption> : null}
    </figure>
  );
}

export const minHeight = 260;

export default function GlobeFlatWorldDotsPreview() {
  return (
    <GlobeFlatWorldDots
      markers={[
        { label: 'São Paulo', x: 20, y: 48 },
        { label: 'Lagos', x: 51, y: 34 },
        { label: 'Singapore', x: 80, y: 38 },
      ]}
      caption="3 active regions"
    />
  );
}
