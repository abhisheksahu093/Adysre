/**
 * Live preview for `avatar-initials-basic`.
 *
 * Mirrors the `typescript` code variant verbatim. Several names render side by
 * side on purpose - the point of the component is that the colour is a
 * function of the name, and one avatar alone cannot show that. Keep this in
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

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
} as const;

interface AvatarInitialsProps {
  name: string;
  size?: keyof typeof SIZES;
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

export function AvatarInitials({ name, size = 'md', className = '' }: AvatarInitialsProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold ${SIZES[size]} ${fillFor(name)} ${className}`}
    >
      <span aria-hidden="true">{initialsOf(name)}</span>
    </span>
  );
}

export default function AvatarInitialsBasicPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AvatarInitials name="Ada Lovelace" />
      <AvatarInitials name="Grace Hopper" />
      <AvatarInitials name="Alan Turing" />
      <AvatarInitials name="Katherine Johnson" />
      <AvatarInitials name="Edsger Dijkstra" />
    </div>
  );
}
