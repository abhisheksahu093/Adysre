/**
 * Live preview for `avatar-skeleton`.
 *
 * Mirrors the `typescript` code variant verbatim. Both states render: the
 * loading shimmer (role="status") and the loaded-but-anonymous SVG glyph - the
 * user who exists but never uploaded a face. Keep this in step with
 * `src/data/components/avatars.ts`.
 */
const SHIMMER_KEYFRAMES = `
  @keyframes avatar-shimmer {
    to { transform: translateX(100%); }
  }
`;

interface AvatarSkeletonProps {
  loading?: boolean;
  name?: string;
  className?: string;
}

function AvatarSkeleton({ loading = true, name = 'Unknown user', className = '' }: AvatarSkeletonProps) {
  if (loading) {
    return (
      // role="status" announces the wait; the shimmer is only its decoration -
      // which is why reduced motion can drop the sweep and lose nothing.
      <span
        role="status"
        className={`relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 ${className}`}
      >
        <style>{SHIMMER_KEYFRAMES}</style>
        {/* Animating transform keeps the sweep on the compositor; animating
            background-position would repaint every frame. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full animate-[avatar-shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent motion-reduce:animate-none dark:via-white/10"
        />
        <span className="sr-only">Loading user</span>
      </span>
    );
  }

  // Loaded but anonymous - the user who exists but never uploaded a face.
  return (
    <span
      role="img"
      aria-label={name}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400 ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.9 0-7 2.2-7 5v1h14v-1c0-2.8-3.1-5-7-5Z" />
      </svg>
    </span>
  );
}

export default function AvatarSkeletonPreview() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AvatarSkeleton loading />
      <AvatarSkeleton loading={false} name="Unknown user" />
    </div>
  );
}
