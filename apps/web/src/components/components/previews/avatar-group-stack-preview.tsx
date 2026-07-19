/**
 * Live preview for `avatar-group-stack`.
 *
 * Mirrors the `typescript` code variant verbatim. Six names against max=4 so
 * the +2 overflow chip actually renders. Four 40px faces at -space-x-2 plus
 * the chip is ~168px wide - comfortably inside a 320px stage. Keep this in
 * step with `src/data/components/avatars.ts`.
 */
const FILLS = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-violet-600 text-white',
  'bg-rose-600 text-white',
  'bg-amber-500 text-gray-900',
  'bg-cyan-600 text-white',
] as const;

interface AvatarGroupStackProps {
  names: string[];
  max?: number;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

function fillFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) % 9973;
  return FILLS[hash % FILLS.length] ?? FILLS[0];
}

function AvatarGroupStack({ names, max = 4, className = '' }: AvatarGroupStackProps) {
  const visible = names.slice(0, max);
  const extra = names.length - visible.length;

  return (
    <div
      role="group"
      aria-label={`${names.length} people`}
      className={`flex items-center -space-x-2 ${className}`}
    >
      {visible.map((name) => (
        <span
          key={name}
          role="img"
          aria-label={name}
          className={`inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full text-sm font-semibold ring-2 ring-white dark:ring-gray-950 ${fillFor(name)}`}
        >
          <span aria-hidden="true">{initialsOf(name)}</span>
        </span>
      ))}
      {extra > 0 ? (
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-950">
          <span aria-hidden="true">+{extra}</span>
          <span className="sr-only">{extra} more people</span>
        </span>
      ) : null}
    </div>
  );
}

export default function AvatarGroupStackPreview() {
  return (
    <AvatarGroupStack
      names={[
        'Ada Lovelace',
        'Grace Hopper',
        'Alan Turing',
        'Katherine Johnson',
        'Edsger Dijkstra',
        'Margaret Hamilton',
      ]}
      max={4}
    />
  );
}
