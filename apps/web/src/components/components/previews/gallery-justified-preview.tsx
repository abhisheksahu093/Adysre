/**
 * Live preview for `gallery-justified`.
 *
 * Mirrors the `typescript` code variant. A fixed row height plus `grow` on each
 * tile stretches every row edge-to-edge; the per-tile `basisClass` varies the
 * natural widths. Media are CSS gradient tiles - no network.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface JustifiedTile {
  id: string;
  label: string;
  gradient: string;
  basisClass: string;
}

interface GalleryJustifiedProps {
  items: JustifiedTile[];
  className?: string;
}

function GalleryJustified({ items, className = '' }: GalleryJustifiedProps) {
  return (
    <ul className={`flex list-none flex-wrap gap-2 p-0 ${className}`}>
      {items.map((item: JustifiedTile) => (
        <li key={item.id} className={`h-28 grow sm:h-36 ${item.basisClass}`}>
          <div role="img" aria-label={item.label} className={`h-full w-full rounded-lg bg-gradient-to-br ${item.gradient}`} />
        </li>
      ))}
    </ul>
  );
}

const SAMPLE_TILES: JustifiedTile[] = [
  { id: 'coast', label: 'Sky-blue to indigo gradient', gradient: 'from-sky-400 to-indigo-600', basisClass: 'basis-52' },
  { id: 'canyon', label: 'Rose to orange gradient', gradient: 'from-rose-400 to-orange-500', basisClass: 'basis-40' },
  { id: 'forest', label: 'Emerald to teal gradient', gradient: 'from-emerald-400 to-teal-600', basisClass: 'basis-64' },
  { id: 'dusk', label: 'Violet to fuchsia gradient', gradient: 'from-violet-400 to-fuchsia-600', basisClass: 'basis-44' },
  { id: 'desert', label: 'Amber to red gradient', gradient: 'from-amber-400 to-red-500', basisClass: 'basis-56' },
  { id: 'harbour', label: 'Cyan to blue gradient', gradient: 'from-cyan-400 to-blue-600', basisClass: 'basis-48' },
];

export default function GalleryJustifiedPreview() {
  return <GalleryJustified items={SAMPLE_TILES} className="w-full max-w-xl" />;
}
