/**
 * Live preview for `image-thumbnail-strip`.
 * Static render with the first thumbnail selected.
 * Keep in step with `src/data/components/images.ts`.
 */
const THUMBS = [
  'from-blue-400 to-indigo-500',
  'from-rose-400 to-orange-300',
  'from-emerald-400 to-teal-500',
  'from-violet-500 to-fuchsia-500',
];

function ImageThumbnailStrip() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500" aria-hidden="true" />
      <div className="mt-3 flex gap-2">
        {THUMBS.map((gradient, i) => (
          <span
            key={i}
            className={`aspect-square w-16 overflow-hidden rounded-lg bg-gradient-to-br ${gradient} ${i === 0 ? 'ring-2 ring-blue-600' : 'ring-1 ring-gray-200 dark:ring-gray-700'}`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

export const minHeight = 320;

export default function ImageThumbnailStripPreview() {
  return <ImageThumbnailStrip />;
}
