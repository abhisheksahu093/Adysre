/**
 * Live preview for `tag-size-variants`.
 *
 * Mirrors the `typescript` code variant verbatim. Static - one chip at three
 * sizes. The stage renders all three side by side. Keep this in step with
 * `src/data/components/tags.ts`.
 */
type TagSize = 'sm' | 'md' | 'lg';

interface TagSizeVariantsProps {
  label: string;
  size?: TagSize;
  className?: string;
}

const SIZES: Record<TagSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

function TagSizeVariants({ label, size = 'md', className = '' }: TagSizeVariantsProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gray-100 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200 ${SIZES[size]} ${className}`}
    >
      {label}
    </span>
  );
}

export default function TagSizeVariantsPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <TagSizeVariants label="Small" size="sm" />
      <TagSizeVariants label="Medium" size="md" />
      <TagSizeVariants label="Large" size="lg" />
    </div>
  );
}
