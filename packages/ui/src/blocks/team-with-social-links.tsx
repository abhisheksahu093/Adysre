/**
 * Live preview for `team-with-social-links`.
 *
 * Mirrors the `typescript` code variant verbatim. Inspect a social link and its
 * accessible name reads "Priya Raman on LinkedIn", not "LinkedIn" - the point
 * of the entry. Keep this in step with `src/data/components/team.ts`.
 */
type SocialPlatform = 'linkedin' | 'twitter' | 'github';

interface TeamSocial {
  platform: SocialPlatform;
  href: string;
}

interface TeamMember {
  name: string;
  role: string;
  socials?: TeamSocial[];
}

interface TeamWithSocialLinksProps {
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

const SOCIAL_LABELS: Record<SocialPlatform, string> = { linkedin: 'LinkedIn', twitter: 'X', github: 'GitHub' };

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const cls = 'h-[1.125rem] w-[1.125rem]';
  switch (platform) {
    case 'linkedin':
      return (<svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2.05 1.4-2.05 2.8V21h-4V9Z" /></svg>);
    case 'twitter':
      return (<svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>);
    case 'github':
      return (<svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>);
  }
}

function getInitials(name: string): string {
  return name.split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function TeamWithSocialLinks({ title = 'Meet the team', members, className = '' }: TeamWithSocialLinksProps) {
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

              {member.socials?.length ? (
                <ul className="mt-4 flex justify-center gap-1">
                  {member.socials.map((social) => (
                    <li key={social.platform}>
                      <a href={social.href} aria-label={member.name + ' on ' + SOCIAL_LABELS[social.platform]} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
                        <SocialIcon platform={social.platform} />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const SAMPLE_MEMBERS: TeamMember[] = [
  {
    name: 'Priya Raman',
    role: 'Co-founder, strategy',
    socials: [
      { platform: 'linkedin', href: '#' },
      { platform: 'github', href: '#' },
    ],
  },
  {
    name: 'Tom Ashcroft',
    role: 'Head of engineering',
    socials: [
      { platform: 'github', href: '#' },
      { platform: 'twitter', href: '#' },
    ],
  },
  {
    name: 'Ines Okafor',
    role: 'Principal designer',
    socials: [{ platform: 'linkedin', href: '#' }],
  },
  {
    name: 'Dan Whitlock',
    role: 'Platform lead',
    socials: [
      { platform: 'linkedin', href: '#' },
      { platform: 'github', href: '#' },
    ],
  },
];

export default function TeamWithSocialLinksPreview() {
  return <TeamWithSocialLinks title="Meet the team" members={SAMPLE_MEMBERS} />;
}

export const minHeight = 520;
