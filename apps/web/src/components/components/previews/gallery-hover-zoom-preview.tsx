/**
 * Live preview for `gallery-hover-zoom`.
 *
 * Mirrors the `typescript` code variant. The zoom lives on the inner tile and
 * the clip on the button, so hover and focus-visible drive it identically;
 * motion-reduce cancels it. Media are CSS gradient tiles - no network.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface GalleryTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
}

interface GalleryHoverZoomProps {
  items: GalleryTile[];
  onSelect?: (index: number) => void;
  className?: string;
}

function GalleryHoverZoom({ items, onSelect, className = '' }: GalleryHoverZoomProps) {
  return (
    <ul className={`grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {items.map((item: GalleryTile, i: number) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onSelect?.(i)}
            className="group block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <span
              role="img"
              aria-label={item.label}
              className={`block aspect-square w-full bg-gradient-to-br ${item.gradient} transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100`}
            />
            <span className="sr-only">{item.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

const SAMPLE_TILES: GalleryTile[] = [
  { id: 'coast', title: 'Coastline', label: 'Sky-blue to indigo gradient', gradient: 'from-sky-400 to-indigo-600' },
  { id: 'canyon', title: 'Canyon', label: 'Rose to orange gradient', gradient: 'from-rose-400 to-orange-500' },
  { id: 'forest', title: 'Forest', label: 'Emerald to teal gradient', gradient: 'from-emerald-400 to-teal-600' },
  { id: 'dusk', title: 'Dusk', label: 'Violet to fuchsia gradient', gradient: 'from-violet-400 to-fuchsia-600' },
  { id: 'desert', title: 'Desert', label: 'Amber to red gradient', gradient: 'from-amber-400 to-red-500' },
  { id: 'harbour', title: 'Harbour', label: 'Cyan to blue gradient', gradient: 'from-cyan-400 to-blue-600' },
];

export default function GalleryHoverZoomPreview() {
  return <GalleryHoverZoom items={SAMPLE_TILES} className="w-full max-w-xl" />;
}
