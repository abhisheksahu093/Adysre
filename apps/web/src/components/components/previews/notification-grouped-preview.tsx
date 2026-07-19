/**
 * Live preview for `notification-grouped`.
 *
 * Mirrors the `typescript` code variant. The avatar stack is initials only - no
 * network images - and each avatar carries the full name. Keep this in step with
 * `src/data/components/notifications.ts`.
 */
interface GroupedActor {
  name: string;
  initials?: string;
}

interface NotificationGroupedProps {
  actors: GroupedActor[];
  action: string;
  target?: string;
  timestamp?: string;
  className?: string;
}

const TINTS = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
  'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200',
] as const;

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function NotificationGrouped({
  actors,
  action,
  target,
  timestamp,
  className = '',
}: NotificationGroupedProps) {
  const shown = actors.slice(0, 2);
  const overflow = actors.length - shown.length;
  const names = actors.map((a) => a.name);
  const lead =
    names.length <= 2
      ? names.join(' and ')
      : `${names[0]}, ${names[1]} and ${names.length - 2} others`;

  return (
    <article
      className={`flex w-full max-w-md gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex flex-none -space-x-2">
        {shown.map((actor, i) => (
          <span
            key={actor.name}
            title={actor.name}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ring-2 ring-white dark:ring-gray-900 ${TINTS[i % TINTS.length]}`}
          >
            {actor.initials ?? initialsOf(actor.name)}
          </span>
        ))}
        {overflow > 0 ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-900">
            +{overflow}
          </span>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          <span className="font-semibold">{lead}</span> {action}
          {target !== undefined ? (
            <>
              {' '}
              <span className="font-semibold">{target}</span>
            </>
          ) : null}
        </p>
        {timestamp !== undefined ? (
          <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{timestamp}</p>
        ) : null}
      </div>
    </article>
  );
}

const ACTORS: GroupedActor[] = [
  { name: 'Dana Okoro' },
  { name: 'Mateo Ruiz' },
  { name: 'Priya Shah' },
  { name: 'Lena Fischer' },
  { name: 'Sam Cole' },
];

export default function NotificationGroupedPreview() {
  return (
    <div className="w-full max-w-md">
      <NotificationGrouped
        actors={ACTORS}
        action="commented on"
        target="Roadmap Q3"
        timestamp="12m ago"
      />
    </div>
  );
}
