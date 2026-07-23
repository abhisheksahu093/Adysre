/**
 * Live preview for `image-gallery-grid`.
 * Keep in step with `src/data/components/images.ts`.
 */
const TILES = [
  'from-blue-400 to-indigo-500',
  'from-rose-400 to-orange-300',
  'from-emerald-400 to-teal-500',
  'from-violet-500 to-fuchsia-500',
  'from-cyan-400 to-blue-500',
  'from-amber-300 to-orange-400',
];

export function ImageGalleryGrid() {
  return (
    <ul className="grid w-full max-w-2xl grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
      {TILES.map((gradient, i) => (
        <li key={i}>
          <span className={`block aspect-square overflow-hidden rounded-lg bg-gradient-to-br ${gradient}`} aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

export const minHeight = 260;

export default function ImageGalleryGridPreview() {
  return <ImageGalleryGrid />;
}
