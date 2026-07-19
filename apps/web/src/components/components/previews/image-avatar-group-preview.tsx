/**
 * Live preview for `image-avatar-group`.
 * Avatars are gradient discs rather than network images.
 * Keep in step with `src/data/components/images.ts`.
 */
const AVATARS = [
  'from-blue-400 to-indigo-500',
  'from-rose-400 to-orange-300',
  'from-emerald-400 to-teal-500',
  'from-violet-500 to-fuchsia-500',
];

function ImageAvatarGroup() {
  return (
    <div className="flex items-center gap-3">
      <ul className="flex -space-x-3" aria-label="7 people are attending">
        {AVATARS.map((gradient, i) => (
          <li key={i}>
            <span className={`block h-9 w-9 rounded-full bg-gradient-to-br ${gradient} ring-2 ring-white dark:ring-gray-950`} aria-hidden="true" />
          </li>
        ))}
        <li>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-950">
            +3
          </span>
        </li>
      </ul>
      <span className="text-sm text-gray-600 dark:text-gray-400">attending</span>
    </div>
  );
}

export default function ImageAvatarGroupPreview() {
  return <ImageAvatarGroup />;
}
