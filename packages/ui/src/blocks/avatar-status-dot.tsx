/**
 * Live preview for `avatar-status-dot`.
 *
 * Mirrors the `typescript` code variant verbatim. All three statuses render so
 * the grey/green/amber distinction - and the fact each carries sr-only words -
 * is visible in one glance. Keep this in step with
 * `src/data/components/avatars.ts`.
 */
type PresenceStatus = 'online' | 'away' | 'offline';

const STATUS: Record<PresenceStatus, { dot: string; label: string }> = {
  online: { dot: 'bg-emerald-500', label: 'Online' },
  away: { dot: 'bg-amber-400', label: 'Away' },
  offline: { dot: 'bg-gray-400 dark:bg-gray-500', label: 'Offline' },
};

interface AvatarStatusDotProps {
  name: string;
  status?: PresenceStatus;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function AvatarStatusDot({ name, status = 'offline', className = '' }: AvatarStatusDotProps) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <span
        role="img"
        aria-label={name}
        className="inline-flex h-10 w-10 select-none items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-semibold text-white"
      >
        <span aria-hidden="true">{initialsOf(name)}</span>
      </span>
      <span
        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-950 ${STATUS[status].dot}`}
      >
        <span className="sr-only">{STATUS[status].label}</span>
      </span>
    </span>
  );
}

export default function AvatarStatusDotPreview() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AvatarStatusDot name="Priya Patel" status="online" />
      <AvatarStatusDot name="Marcus Webb" status="away" />
      <AvatarStatusDot name="Noor Haddad" status="offline" />
    </div>
  );
}
