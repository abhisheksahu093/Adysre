/**
 * Live preview for `tag-with-icons`.
 *
 * Mirrors the `typescript` code variant verbatim. Static - chips with a leading
 * inline-SVG icon from a small fixed set. Keep this in step with
 * `src/data/components/tags.ts`.
 */
type TagIcon = 'star' | 'bolt' | 'check' | 'tag';

interface TagWithIconItem {
  label: string;
  icon: TagIcon;
}

interface TagWithIconsProps {
  items: TagWithIconItem[];
  className?: string;
}

const ICONS: Record<TagIcon, { className: string; path: string }> = {
  star: { className: 'text-amber-500', path: 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z' },
  bolt: { className: 'text-blue-500', path: 'M13 2 4.5 13H11l-1 9 8.5-11H12z' },
  check: { className: 'text-green-500', path: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z' },
  tag: { className: 'text-purple-500', path: 'M2 12 12 2h8v8L10 20z M15.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z' },
};

function TagWithIcons({ items, className = '' }: TagWithIconsProps) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => {
        const icon = ICONS[item.icon];
        return (
          <li key={item.label}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <svg viewBox="0 0 24 24" fill="currentColor" className={`h-3.5 w-3.5 ${icon.className}`} aria-hidden="true">
                <path d={icon.path} />
              </svg>
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function TagWithIconsPreview() {
  return (
    <TagWithIcons
      items={[
        { label: 'Featured', icon: 'star' },
        { label: 'Fast', icon: 'bolt' },
        { label: 'Verified', icon: 'check' },
        { label: 'Sale', icon: 'tag' },
      ]}
    />
  );
}
