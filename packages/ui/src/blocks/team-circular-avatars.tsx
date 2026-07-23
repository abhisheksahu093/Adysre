/**
 * Live preview for `team-circular-avatars`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/team.ts`.
 */
interface TeamMember {
  name: string;
  role: string;
}

interface TeamCircularAvatarsProps {
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

export function TeamCircularAvatars({ title = 'The whole crew', members, className = '' }: TeamCircularAvatarsProps) {
  return (
    <section className={['mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16', className].filter(Boolean).join(' ')}>
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>

      <ul className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {members.map((member, index) => {
          const gradient = GRADIENTS[index % GRADIENTS.length] ?? 'from-blue-500 to-indigo-600';
          return (
            <li key={member.name} className="flex flex-col items-center text-center">
              <span aria-hidden="true" className={'inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ' + gradient + ' text-xl font-semibold text-white ring-2 ring-white dark:ring-gray-900'}>
                {getInitials(member.name)}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{member.role}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const SAMPLE_MEMBERS: TeamMember[] = [
  { name: 'Priya Raman', role: 'Strategy' },
  { name: 'Tom Ashcroft', role: 'Engineering' },
  { name: 'Ines Okafor', role: 'Design' },
  { name: 'Dan Whitlock', role: 'Platform' },
  { name: 'Maya Chen', role: 'Product' },
  { name: 'Leo Barnes', role: 'Data' },
  { name: 'Sara Vogt', role: 'Success' },
  { name: 'Omar Farooq', role: 'Security' },
  { name: 'Nina Roth', role: 'Marketing' },
  { name: 'Ravi Patel', role: 'Sales' },
  { name: 'Elsa Lund', role: 'Finance' },
  { name: 'Kofi Mensah', role: 'Support' },
];

export default function TeamCircularAvatarsPreview() {
  return <TeamCircularAvatars title="The whole crew" members={SAMPLE_MEMBERS} />;
}

export const minHeight = 480;
