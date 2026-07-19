/**
 * Live preview for `avatar-squared`.
 *
 * Mirrors the `typescript` code variant verbatim. Both shapes render side by
 * side - the component's argument is the *contrast* between "thing" (rounded
 * square) and "person" (circle). Keep this in step with
 * `src/data/components/avatars.ts`.
 */
const SHAPES = {
  squared: 'rounded-xl',
  circle: 'rounded-full',
} as const;

interface AvatarSquaredProps {
  name: string;
  shape?: keyof typeof SHAPES;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

function AvatarSquared({ name, shape = 'squared', className = '' }: AvatarSquaredProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={`inline-flex h-10 w-10 shrink-0 select-none items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white ${SHAPES[shape]} ${className}`}
    >
      <span aria-hidden="true">{initialsOf(name)}</span>
    </span>
  );
}

export default function AvatarSquaredPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AvatarSquared name="Design Systems" />
      <AvatarSquared name="Platform Team" />
      <AvatarSquared name="Ada Lovelace" shape="circle" />
    </div>
  );
}
