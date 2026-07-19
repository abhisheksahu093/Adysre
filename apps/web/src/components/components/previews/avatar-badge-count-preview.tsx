/**
 * Live preview for `avatar-badge-count`.
 *
 * Mirrors the `typescript` code variant verbatim. Two counts render: one under
 * the cap (a circle) and one over it (the "9+" pill) - the min-w-instead-of-
 * fixed-width behaviour is the visible point. Keep this in step with
 * `src/data/components/avatars.ts`.
 */
interface AvatarBadgeCountProps {
  name: string;
  count?: number;
  max?: number;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

function AvatarBadgeCount({ name, count = 0, max = 9, className = '' }: AvatarBadgeCountProps) {
  const shown = count > max ? `${max}+` : String(count);

  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <span
        role="img"
        aria-label={name}
        className="inline-flex h-10 w-10 select-none items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-sm font-semibold text-white"
      >
        <span aria-hidden="true">{initialsOf(name)}</span>
      </span>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-950">
          <span aria-hidden="true">{shown}</span>
          <span className="sr-only">{count} unread notifications</span>
        </span>
      ) : null}
    </span>
  );
}

export default function AvatarBadgeCountPreview() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AvatarBadgeCount name="Marcus Webb" count={3} />
      <AvatarBadgeCount name="Priya Patel" count={12} />
    </div>
  );
}
