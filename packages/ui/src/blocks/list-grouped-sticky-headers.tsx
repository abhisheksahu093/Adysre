/**
 * Live preview for `list-grouped-sticky-headers`.
 *
 * Mirrors the `typescript` code variant verbatim. The stage is shorter than the
 * content, which is the point - scroll the list and the section headers pin.
 * Keep this in step with `src/data/components/lists.ts`.
 */
interface GroupRow {
  id: string;
  primary: string;
}

interface ListGroup {
  label: string;
  items: GroupRow[];
}

interface ListGroupedStickyHeadersProps {
  groups: ListGroup[];
  ariaLabel?: string;
}

export function ListGroupedStickyHeaders({
  groups,
  ariaLabel = 'Grouped list',
}: ListGroupedStickyHeadersProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      {groups.map((group) => (
        <section key={group.label}>
          <h3 className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 dark:text-gray-400">
            {group.label}
          </h3>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {group.items.map((item) => (
              <li
                key={item.id}
                className="truncate px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100"
              >
                {item.primary}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const GROUPS: ListGroup[] = [
  {
    label: 'A',
    items: [
      { id: 'a1', primary: 'Amara Okafor' },
      { id: 'a2', primary: 'Anders Bakke' },
      { id: 'a3', primary: 'Aisha Rahman' },
    ],
  },
  {
    label: 'B',
    items: [
      { id: 'b1', primary: 'Bhavesh Ramachandran' },
      { id: 'b2', primary: 'Bianca Rossi' },
    ],
  },
  {
    label: 'C',
    items: [
      { id: 'c1', primary: 'Chen Wei' },
      { id: 'c2', primary: 'Camila Duarte' },
      { id: 'c3', primary: 'Cyrus Farsi' },
    ],
  },
];

export const minHeight = 300;

export default function ListGroupedStickyHeadersPreview() {
  return (
    <div className="w-full max-w-sm">
      <ListGroupedStickyHeaders groups={GROUPS} ariaLabel="Directory" />
    </div>
  );
}
