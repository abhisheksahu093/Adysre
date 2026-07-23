'use client';

/**
 * Live preview for `table-with-avatars-status`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/tables.ts`.
 */
type MemberStatus = 'active' | 'invited' | 'inactive';

interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  status: MemberStatus;
}

interface TableWithAvatarsStatusProps {
  people: Person[];
  className?: string;
}

const STATUS_STYLES: Record<MemberStatus, { dot: string; badge: string; label: string }> = {
  active: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', label: 'Active' },
  invited: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', label: 'Invited' },
  inactive: { dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', label: 'Inactive' },
};

const GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-sky-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
] as const;

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TableWithAvatarsStatus({ people, className = '' }: TableWithAvatarsStatusProps) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th scope="col" className="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Member</th>
            <th scope="col" className="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Role</th>
            <th scope="col" className="px-3 py-2.5 font-medium text-gray-700 dark:text-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person, i) => {
            const s = STATUS_STYLES[person.status];
            const gradient = GRADIENTS[i % GRADIENTS.length] ?? GRADIENTS[0];
            return (
              <tr key={person.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br ${gradient} text-xs font-semibold text-white`}
                    >
                      {initials(person.name)}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-gray-900 dark:text-gray-100">{person.name}</div>
                      <div className="truncate text-xs text-gray-500 dark:text-gray-400">{person.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">{person.role}</td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${s.badge}`}>
                    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const PEOPLE: Person[] = [
  { id: 'p1', name: 'Dana Lee', email: 'dana@acme.co', role: 'Admin', status: 'active' },
  { id: 'p2', name: 'Sam Ford', email: 'sam@acme.co', role: 'Editor', status: 'invited' },
  { id: 'p3', name: 'Priya Nair', email: 'priya@acme.co', role: 'Viewer', status: 'inactive' },
];

export const minHeight = 220;

export default function TableWithAvatarsStatusPreview() {
  return <TableWithAvatarsStatus people={PEOPLE} className="max-w-2xl" />;
}
