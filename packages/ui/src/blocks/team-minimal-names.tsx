/**
 * Live preview for `team-minimal-names`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/team.ts`.
 */
interface TeamMember {
  name: string;
  role: string;
}

interface TeamMinimalNamesProps {
  title?: string;
  members: TeamMember[];
  className?: string;
}

export function TeamMinimalNames({ title = 'The team', members, className = '' }: TeamMinimalNamesProps) {
  return (
    <section className={['mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16', className].filter(Boolean).join(' ')}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>

      <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <li key={member.name} className="border-t border-gray-200 pt-4 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
          </li>
        ))}
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
  { name: 'Omar Farooq', role: 'Security engineer' },
  { name: 'Nina Roth', role: 'Brand designer' },
];

export default function TeamMinimalNamesPreview() {
  return <TeamMinimalNames title="The team" members={SAMPLE_MEMBERS} />;
}

export const minHeight = 440;
