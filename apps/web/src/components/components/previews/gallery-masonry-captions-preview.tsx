/**
 * Live preview for `gallery-masonry-captions`.
 *
 * Mirrors the `typescript` code variant. Varied `heightClass` per tile is what
 * makes it read as masonry; captions sit on a dark-to-transparent scrim so they
 * stay legible on any tile colour. Media are CSS gradient tiles - no network.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface MasonryTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
  heightClass: string;
}

interface GalleryMasonryCaptionsProps {
  items: MasonryTile[];
  className?: string;
}

function GalleryMasonryCaptions({ items, className = '' }: GalleryMasonryCaptionsProps) {
  return (
    <ul className={`list-none columns-2 gap-3 p-0 sm:columns-3 ${className}`}>
      {items.map((item: MasonryTile) => (
        <li key={item.id} className="mb-3 break-inside-avoid">
          <figure className="relative m-0 overflow-hidden rounded-xl">
            <div role="img" aria-label={item.label} className={`w-full bg-gradient-to-br ${item.gradient} ${item.heightClass}`} />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-sm font-medium text-white">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

const SAMPLE_TILES: MasonryTile[] = [
  { id: 'coast', title: 'Coastline', label: 'Sky-blue to indigo gradient', gradient: 'from-sky-400 to-indigo-600', heightClass: 'h-40' },
  { id: 'canyon', title: 'Canyon', label: 'Rose to orange gradient', gradient: 'from-rose-400 to-orange-500', heightClass: 'h-56' },
  { id: 'forest', title: 'Forest', label: 'Emerald to teal gradient', gradient: 'from-emerald-400 to-teal-600', heightClass: 'h-48' },
  { id: 'dusk', title: 'Dusk', label: 'Violet to fuchsia gradient', gradient: 'from-violet-400 to-fuchsia-600', heightClass: 'h-36' },
  { id: 'desert', title: 'Desert', label: 'Amber to red gradient', gradient: 'from-amber-400 to-red-500', heightClass: 'h-52' },
  { id: 'harbour', title: 'Harbour', label: 'Cyan to blue gradient', gradient: 'from-cyan-400 to-blue-600', heightClass: 'h-44' },
];

export default function GalleryMasonryCaptionsPreview() {
  return <GalleryMasonryCaptions items={SAMPLE_TILES} className="w-full max-w-xl" />;
}
