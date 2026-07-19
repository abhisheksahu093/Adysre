/**
 * Live preview for `image-blur-load`.
 * Shows the loaded state over the gradient placeholder.
 * Keep in step with `src/data/components/images.ts`.
 */
function ImageBlurLoad() {
  return (
    <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500" aria-hidden="true" />
    </div>
  );
}

export default function ImageBlurLoadPreview() {
  return <ImageBlurLoad />;
}
