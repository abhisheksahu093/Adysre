/**
 * Live preview for `team-list-rows`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/team.ts`.
 */
interface TeamMember {
  name: string;
  role: string;
  department?: string;
}

interface TeamListRowsProps {
  title?: string;
  members: TeamMember[];
  className?: string;
}

const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

function getInitials(name: string): string {
  return name.split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase();
}

function TeamListRows({ title = 'The team', members, className = '' }: TeamListRowsProps) {
  return (
    <section className={['mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16', className].filter(Boolean).join(' ')}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>

      <ul className="mt-8 divide-y divide-gray-200 dark:divide-gray-800">
        {members.map((member, index) => {
          const gradient = GRADIENTS[index % GRADIENTS.length] ?? 'from-blue-500 to-indigo-600';
          return (
            <li key={member.name} className="flex items-center gap-4 py-4">
              <span aria-hidden="true" className={'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ' + gradient + ' text-sm font-semibold text-white'}>
                {getInitials(member.name)}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
                <p className="truncate text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
              {member.department ? (
                <span className="ml-auto hidden shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 sm:inline dark:bg-gray-800 dark:text-gray-300">{member.department}</span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const SAMPLE_MEMBERS: TeamMember[] = [
  { name: 'Priya Raman', role: 'Co-founder, strategy', department: 'Leadership' },
  { name: 'Tom Ashcroft', role: 'Head of engineering', department: 'Engineering' },
  { name: 'Ines Okafor', role: 'Principal designer', department: 'Design' },
  { name: 'Dan Whitlock', role: 'Platform lead', department: 'Engineering' },
  { name: 'Maya Chen', role: 'Product lead', department: 'Product' },
  { name: 'Leo Barnes', role: 'Data scientist', department: 'Data' },
];

export default function TeamListRowsPreview() {
  return <TeamListRows title="The team" members={SAMPLE_MEMBERS} />;
}

export const minHeight = 460;
