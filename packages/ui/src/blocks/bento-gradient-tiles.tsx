/**
 * Live preview for `bento-gradient-tiles`.
 * Mirrors the `typescript` code variant. Keep in step with
 * `src/data/components/bento.ts`.
 */
interface GradientTile {
  label: string;
  gradient: string;
  className?: string;
  minH?: string;
}

const TILES: GradientTile[] = [
  { label: 'Design', gradient: 'bg-gradient-to-br from-fuchsia-600 to-purple-700', className: 'sm:col-span-2 sm:row-span-2', minH: 'min-h-40' },
  { label: 'Build', gradient: 'bg-gradient-to-br from-sky-500 to-blue-600', minH: 'min-h-32' },
  { label: 'Ship', gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600', minH: 'min-h-32' },
  { label: 'Measure', gradient: 'bg-gradient-to-r from-amber-500 to-orange-600', className: 'sm:col-span-3', minH: 'min-h-32' },
];

export function BentoGradientTiles({ tiles = TILES, className = '' }: { tiles?: GradientTile[]; className?: string }) {
  return (
    <section className={`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 ${className}`}>
      {tiles.map((t, i) => (
        <div key={i} className={`flex items-end rounded-2xl p-5 ${t.minH ?? 'min-h-32'} ${t.gradient} ${t.className ?? ''}`}>
          <span className="text-base font-semibold text-white">{t.label}</span>
        </div>
      ))}
    </section>
  );
}

export const minHeight = 620;

export default function BentoGradientTilesPreview() {
  return <BentoGradientTiles />;
}
