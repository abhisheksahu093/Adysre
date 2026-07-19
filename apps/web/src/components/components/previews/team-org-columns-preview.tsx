/**
 * Live preview for `team-org-columns`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/team.ts`.
 */
interface TeamMember {
  name: string;
  role: string;
}

interface Department {
  name: string;
  members: TeamMember[];
}

interface TeamOrgColumnsProps {
  title?: string;
  departments: Department[];
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

function TeamOrgColumns({ title = 'By team', departments, className = '' }: TeamOrgColumnsProps) {
  return (
    <section className={['mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16', className].filter(Boolean).join(' ')}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <section key={department.name}>
            <h3 className="border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-widest text-blue-700 dark:border-gray-800 dark:text-blue-400">{department.name}</h3>
            <ul className="mt-4 space-y-4">
              {department.members.map((member, index) => {
                const gradient = GRADIENTS[index % GRADIENTS.length] ?? 'from-blue-500 to-indigo-600';
                return (
                  <li key={member.name} className="flex items-center gap-3">
                    <span aria-hidden="true" className={'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ' + gradient + ' text-xs font-semibold text-white'}>
                      {getInitials(member.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{member.name}</p>
                      <p className="truncate text-xs text-gray-600 dark:text-gray-400">{member.role}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

const SAMPLE_DEPARTMENTS: Department[] = [
  {
    name: 'Engineering',
    members: [
      { name: 'Tom Ashcroft', role: 'Head of engineering' },
      { name: 'Dan Whitlock', role: 'Platform lead' },
      { name: 'Kofi Mensah', role: 'Backend' },
    ],
  },
  {
    name: 'Design',
    members: [
      { name: 'Ines Okafor', role: 'Principal designer' },
      { name: 'Nina Roth', role: 'Brand' },
    ],
  },
  {
    name: 'Product',
    members: [
      { name: 'Maya Chen', role: 'Product lead' },
      { name: 'Ravi Patel', role: 'Product ops' },
    ],
  },
];

export default function TeamOrgColumnsPreview() {
  return <TeamOrgColumns title="By team" departments={SAMPLE_DEPARTMENTS} />;
}

export const minHeight = 520;
