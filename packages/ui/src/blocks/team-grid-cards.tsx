/**
 * Live preview for `team-grid-cards`.
 *
 * Mirrors the `typescript` code variant verbatim. Eight people so the stage
 * shows the grid reflowing; avatars are gradient initials, never the network.
 * Keep this in step with `src/data/components/team.ts`.
 */
interface TeamMember {
  name: string;
  role: string;
}

interface TeamGridCardsProps {
  title?: string;
  subtitle?: string;
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

export function TeamGridCards({ title = 'Meet the team', subtitle, members, className = '' }: TeamGridCardsProps) {
  return (
    <section className={['mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16', className].filter(Boolean).join(' ')}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
        {subtitle ? (
          <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">{subtitle}</p>
        ) : null}
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member, index) => {
          const gradient = GRADIENTS[index % GRADIENTS.length] ?? 'from-blue-500 to-indigo-600';
          return (
            <li key={member.name} className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
              <span aria-hidden="true" className={'inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ' + gradient + ' text-lg font-semibold text-white'}>
                {getInitials(member.name)}
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const SAMPLE_MEMBERS: TeamMember[] = [
  { name: 'Priya Raman', role: 'Co-founder, strategy' },
  { name: 'Tom Ashcroft', role: 'Head of engineering' },
  { name: 'Ines Okafor', role: 'Principal designer' },
  { name: 'Dan Whitlock', role: 'Platform lead' },
  { name: 'Maya Chen', role: 'Product lead' },
  { name: 'Leo Barnes', role: 'Data science' },
  { name: 'Sara Vogt', role: 'Customer success' },
  { name: 'Omar Farooq', role: 'Security' },
];

export default function TeamGridCardsPreview() {
  return <TeamGridCards title="Meet the team" subtitle="The people who ship the thing." members={SAMPLE_MEMBERS} />;
}

export const minHeight = 620;
