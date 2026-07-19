/**
 * Live preview for `team-leadership-featured`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/team.ts`.
 */
interface TeamLeader {
  name: string;
  role: string;
  bio?: string;
}

interface TeamMember {
  name: string;
  role: string;
}

interface TeamLeadershipFeaturedProps {
  title?: string;
  leader: TeamLeader;
  members: TeamMember[];
  className?: string;
}

const GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

function getInitials(name: string): string {
  return name.split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase();
}

function TeamLeadershipFeatured({ title = 'Leadership', leader, members, className = '' }: TeamLeadershipFeaturedProps) {
  return (
    <section className={['mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16', className].filter(Boolean).join(' ')}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>

      <article className="mt-8 flex flex-col items-center gap-6 rounded-3xl border border-gray-200 bg-white p-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:p-8 sm:text-left dark:border-gray-800 dark:bg-gray-900">
        <span aria-hidden="true" className="inline-flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white">
          {getInitials(leader.name)}
        </span>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{leader.name}</h3>
          <p className="mt-1 text-sm font-medium text-blue-700 dark:text-blue-400">{leader.role}</p>
          {leader.bio ? (
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-gray-600 dark:text-gray-400">{leader.bio}</p>
          ) : null}
        </div>
      </article>

      <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member, index) => {
          const gradient = GRADIENTS[index % GRADIENTS.length] ?? 'from-emerald-500 to-teal-600';
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

const SAMPLE_LEADER: TeamLeader = {
  name: 'Priya Raman',
  role: 'Co-founder & CEO',
  bio: 'Fifteen years turning vague briefs into things that can be built, shipped and measured.',
};

const SAMPLE_MEMBERS: TeamMember[] = [
  { name: 'Tom Ashcroft', role: 'Head of engineering' },
  { name: 'Ines Okafor', role: 'Principal designer' },
  { name: 'Dan Whitlock', role: 'Platform lead' },
  { name: 'Maya Chen', role: 'Product lead' },
];

export default function TeamLeadershipFeaturedPreview() {
  return <TeamLeadershipFeatured title="Leadership" leader={SAMPLE_LEADER} members={SAMPLE_MEMBERS} />;
}

export const minHeight = 620;
