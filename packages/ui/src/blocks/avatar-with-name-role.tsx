/**
 * Live preview for `avatar-with-name-role`.
 *
 * Mirrors the `typescript` code variant verbatim. The avatar is aria-hidden
 * because the visible name beside it already carries the identity; min-w-0 lets
 * a long name truncate instead of pushing the row wide. Keep this in step with
 * `src/data/components/avatars.ts`.
 */
interface AvatarWithNameRoleProps {
  name: string;
  role?: string;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function AvatarWithNameRole({ name, role, className = '' }: AvatarWithNameRoleProps) {
  return (
    <div className={`flex w-full max-w-xs items-center gap-3 ${className}`}>
      {/* aria-hidden: the visible name beside it already carries the identity -
          labelling the picture too would announce the person twice. */}
      <span
        aria-hidden="true"
        className="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-sm font-semibold text-white"
      >
        {initialsOf(name)}
      </span>
      {/* min-w-0 is the whole trick: flex children refuse to shrink below
          their content without it, and truncate silently does nothing. */}
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {name}
        </span>
        {role ? (
          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{role}</span>
        ) : null}
      </span>
    </div>
  );
}

export default function AvatarWithNameRolePreview() {
  return <AvatarWithNameRole name="Sarah Chen-Nakamura" role="Principal Product Designer" />;
}
