/**
 * Live preview for `image-card-overlay`.
 * Keep in step with `src/data/components/images.ts`.
 */
export function ImageCardOverlay() {
  return (
    <a href="#" className="group relative flex aspect-[3/4] w-full max-w-xs items-end overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
      <div className="relative p-4">
        <h3 className="text-base font-semibold text-white">Hands and clay</h3>
        <p className="mt-0.5 text-xs text-gray-200">Studio series &middot; No. 04</p>
      </div>
    </a>
  );
}

export const minHeight = 340;

export default function ImageCardOverlayPreview() {
  return <ImageCardOverlay />;
}
