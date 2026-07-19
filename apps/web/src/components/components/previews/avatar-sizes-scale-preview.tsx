/**
 * Live preview for `avatar-sizes-scale`.
 *
 * Mirrors the `typescript` code variant verbatim. The row is `items-end` and
 * wraps below ~360px so the whole scale survives a 320px stage without
 * horizontal overflow. Keep this in step with `src/data/components/avatars.ts`.
 */
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SIZES: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-14 w-14 text-lg',
  '2xl': 'h-16 w-16 text-xl',
};

interface AvatarSizedProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

function AvatarSized({ name, size = 'md', className = '' }: AvatarSizedProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full bg-blue-600 font-semibold text-white ${SIZES[size]} ${className}`}
    >
      <span aria-hidden="true">{initialsOf(name)}</span>
    </span>
  );
}

const SCALE: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export default function AvatarSizesScalePreview() {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {SCALE.map((size) => (
        <AvatarSized key={size} name="Ada Lovelace" size={size} />
      ))}
    </div>
  );
}
