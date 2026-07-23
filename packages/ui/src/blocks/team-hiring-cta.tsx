/**
 * Live preview for `team-hiring-cta`.
 *
 * Mirrors the `typescript` code variant verbatim. The final dashed tile is the
 * "join us" CTA, sharing the grid so it reads as one of the team. Keep this in
 * step with `src/data/components/team.ts`.
 */
interface TeamMember {
  name: string;
  role: string;
}

interface TeamHiringCtaProps {
  title?: string;
  members: TeamMember[];
  hiringLabel?: string;
  hiringHref?: string;
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

export function TeamHiringCta({ title = 'Meet the team', members, hiringLabel = 'Join us', hiringHref = '#', className = '' }: TeamHiringCtaProps) {
  return (
    <section className={['mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16', className].filter(Boolean).join(' ')}>
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>

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

        <li>
          <a href={hiringHref} className="flex h-full min-h-[11rem] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 p-6 text-center text-gray-600 transition-colors hover:border-blue-500 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
            <span aria-hidden="true" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-current text-2xl leading-none">+</span>
            <span className="text-sm font-semibold">{hiringLabel}</span>
          </a>
        </li>
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
  { name: 'Leo Barnes', role: 'Data scientist' },
  { name: 'Sara Vogt', role: 'Customer success' },
];

export default function TeamHiringCtaPreview() {
  return <TeamHiringCta title="Meet the team" members={SAMPLE_MEMBERS} hiringLabel="Join us" hiringHref="#" />;
}

export const minHeight = 620;
