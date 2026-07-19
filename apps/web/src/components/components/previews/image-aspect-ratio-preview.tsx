/**
 * Live preview for `image-aspect-ratio`.
 * Shows the three ratios side by side.
 * Keep in step with `src/data/components/images.ts`.
 */
function ImageAspectRatio() {
  return (
    <div className="flex w-full max-w-2xl flex-wrap items-start justify-center gap-4">
      <div className="w-28">
        <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500" aria-hidden="true" />
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">Square</p>
      </div>
      <div className="w-44">
        <div className="aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500" aria-hidden="true" />
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">16:9</p>
      </div>
      <div className="w-28">
        <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-rose-400 to-orange-300" aria-hidden="true" />
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">Portrait</p>
      </div>
    </div>
  );
}

export default function ImageAspectRatioPreview() {
  return <ImageAspectRatio />;
}
