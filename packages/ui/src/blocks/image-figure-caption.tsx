/**
 * Live preview for `image-figure-caption`.
 * The photo is a gradient panel rather than a network image.
 * Keep in step with `src/data/components/images.ts`.
 */
export function ImageFigureCaption() {
  return (
    <figure className="mx-auto w-full max-w-lg">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-amber-300 via-orange-400 to-rose-400" aria-hidden="true" />
      <figcaption className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        First light on the ridge, shot on a 35mm lens at f/8.
      </figcaption>
    </figure>
  );
}

export default function ImageFigureCaptionPreview() {
  return <ImageFigureCaption />;
}
