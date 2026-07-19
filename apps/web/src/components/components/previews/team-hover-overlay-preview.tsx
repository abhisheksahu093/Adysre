/**
 * Live preview for `team-hover-overlay`.
 *
 * Mirrors the `typescript` code variant verbatim. Hover a tile - or tab to it -
 * and the bio fades in over a scrim; the same reveal fires on keyboard focus.
 * Keep this in step with `src/data/components/team.ts`.
 */
interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  href?: string;
}

interface TeamHoverOverlayProps {
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

function TeamHoverOverlay({ title = 'Meet the team', members, className = '' }: TeamHoverOverlayProps) {
  return (
    <section className={['mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16', className].filter(Boolean).join(' ')}>
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>

      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((member, index) => {
          const gradient = GRADIENTS[index % GRADIENTS.length] ?? 'from-blue-500 to-indigo-600';
          return (
            <li key={member.name}>
              <a href={member.href ?? '#'} className={'group relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ' + gradient + ' p-5 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900'}>
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/90 transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none">
                  {getInitials(member.name)}
                </span>
                <div className="relative">
                  <h3 className="text-base font-semibold">{member.name}</h3>
                  <p className="text-sm text-white/80">{member.role}</p>
                </div>
                {member.bio ? (
                  <p className="absolute inset-0 flex items-center bg-black/60 p-5 text-sm leading-relaxed opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">{member.bio}</p>
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const SAMPLE_MEMBERS: TeamMember[] = [
  { name: 'Priya Raman', role: 'Co-founder, strategy', bio: 'Fifteen years turning vague briefs into things that can be built.', href: '#' },
  { name: 'Tom Ashcroft', role: 'Head of engineering', bio: 'Believes most architecture problems are unresolved arguments in disguise.', href: '#' },
  { name: 'Ines Okafor', role: 'Principal designer', bio: 'Runs the research practice and tests everything on real people first.', href: '#' },
  { name: 'Dan Whitlock', role: 'Platform lead', bio: 'Keeps the pipelines boring, which is the highest praise available.', href: '#' },
];

export default function TeamHoverOverlayPreview() {
  return <TeamHoverOverlay title="Meet the team" members={SAMPLE_MEMBERS} />;
}

export const minHeight = 640;
