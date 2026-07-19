/**
 * Live preview for `marquee-image-tiles`.
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/marquees.ts`.
 */
export const minHeight = 220;

interface Tile {
  label: string;
  gradient: string;
}

const TILES_KEYFRAMES = `
  @keyframes marquee-tiles-scroll {
    to { transform: translateX(-50%); }
  }
`;

const DEFAULT_TILES: Tile[] = [
  { label: 'Ridgeline', gradient: 'from-blue-500 to-indigo-600' },
  { label: 'Harbor', gradient: 'from-rose-500 to-orange-500' },
  { label: 'Canopy', gradient: 'from-emerald-500 to-teal-600' },
  { label: 'Dusk', gradient: 'from-violet-500 to-fuchsia-600' },
  { label: 'Tundra', gradient: 'from-cyan-500 to-sky-600' },
];

interface MarqueeImageTilesProps {
  tiles?: Tile[];
  durationSeconds?: number;
  className?: string;
}

function MarqueeImageTiles({ tiles = DEFAULT_TILES, durationSeconds = 36, className = '' }: MarqueeImageTilesProps) {
  const group = (hidden: boolean) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-4 pr-4 motion-reduce:hidden' : 'flex shrink-0 items-center gap-4 pr-4 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {tiles.map((tile) => (
        <li key={tile.label} className={`relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${tile.gradient}`}>
          <span className="absolute bottom-2 left-3 text-xs font-semibold text-white">{tile.label}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={`w-full overflow-hidden py-6 ${className}`} aria-label="Recent shots">
      <style>{TILES_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-tiles-scroll_36s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}

export default function MarqueeImageTilesPreview() {
  return <MarqueeImageTiles />;
}
