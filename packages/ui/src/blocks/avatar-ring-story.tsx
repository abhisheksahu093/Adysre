/**
 * Live preview for `avatar-ring-story`.
 *
 * Mirrors the `typescript` code variant verbatim. Both states render: an unseen
 * story (gradient ring, "new story" in the label) and a seen one (grey ring).
 * Keep this in step with `src/data/components/avatars.ts`.
 */
interface AvatarRingStoryProps {
  name: string;
  seen?: boolean;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function AvatarRingStory({ name, seen = false, className = '' }: AvatarRingStoryProps) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full p-[2px] ${
        seen
          ? 'bg-gray-300 dark:bg-gray-700'
          : 'bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600'
      } ${className}`}
    >
      {/* The page-colour gap is what makes the ring read as a ring instead of
          a gradient border glued to the face. */}
      <span className="rounded-full bg-white p-[2px] dark:bg-gray-950">
        {/* Unseen-vs-seen is a colour difference only, so the state also rides
            the label in words - a grey ring and a gradient ring are the same
            ring to a screen reader otherwise. */}
        <span
          role="img"
          aria-label={seen ? name : `${name}, new story`}
          className="flex h-12 w-12 select-none items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-semibold text-white"
        >
          <span aria-hidden="true">{initialsOf(name)}</span>
        </span>
      </span>
    </span>
  );
}

export default function AvatarRingStoryPreview() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AvatarRingStory name="Noor Haddad" />
      <AvatarRingStory name="Ada Lovelace" seen />
    </div>
  );
}
