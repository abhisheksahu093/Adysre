/**
 * Live preview for `team-carousel-strip`.
 *
 * Mirrors the `typescript` code variant verbatim. A native scroll-snap strip:
 * the region is focusable so keyboard users can arrow through it. Keep this in
 * step with `src/data/components/team.ts`.
 */
interface TeamMember {
  name: string;
  role: string;
}

interface TeamCarouselStripProps {
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

export function TeamCarouselStrip({ title = 'Meet the team', members, className = '' }: TeamCarouselStripProps) {
  return (
    <section className={['mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16', className].filter(Boolean).join(' ')}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>

      <div role="region" aria-label="Team members" tabIndex={0} className="mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:mx-0 sm:px-0 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {members.map((member, index) => {
          const gradient = GRADIENTS[index % GRADIENTS.length] ?? 'from-blue-500 to-indigo-600';
          return (
            <article key={member.name} className="w-56 shrink-0 snap-start rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
              <span aria-hidden="true" className={'inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ' + gradient + ' text-lg font-semibold text-white'}>
                {getInitials(member.name)}
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

const SAMPLE_MEMBERS: TeamMember[] = [
  { name: 'Priya Raman', role: 'Co-founder, strategy' },
  { name: 'Tom Ashcroft', role: 'Head of engineering' },
  { name: 'Ines Okafor', role: 'Principal designer' },
  { name: 'Dan Whitlock', role: 'Platform lead' },
  { name: 'Maya Chen', role: 'Product lead' },
  { name: 'Leo Barnes', role: 'Data scientist' },
  { name: 'Sara Vogt', role: 'Customer success' },
];

export default function TeamCarouselStripPreview() {
  return <TeamCarouselStrip title="Meet the team" members={SAMPLE_MEMBERS} />;
}

export const minHeight = 340;
