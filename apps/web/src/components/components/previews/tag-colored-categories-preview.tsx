/**
 * Live preview for `tag-colored-categories`.
 *
 * Mirrors the `typescript` code variant verbatim. Static - a fixed, contrast-safe
 * colour palette keyed by name. Keep this in step with
 * `src/data/components/tags.ts`.
 */
type TagColor = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'purple';

interface TagCategory {
  label: string;
  color: TagColor;
}

interface TagColoredCategoriesProps {
  items: TagCategory[];
  className?: string;
}

const COLORS: Record<TagColor, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  green: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
};

function TagColoredCategories({ items, className = '' }: TagColoredCategoriesProps) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item.label}>
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${COLORS[item.color]}`}>
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function TagColoredCategoriesPreview() {
  return (
    <TagColoredCategories
      items={[
        { label: 'Engineering', color: 'blue' },
        { label: 'Design', color: 'green' },
        { label: 'Sales', color: 'amber' },
        { label: 'Urgent', color: 'red' },
        { label: 'Research', color: 'purple' },
        { label: 'Archived', color: 'gray' },
      ]}
    />
  );
}
