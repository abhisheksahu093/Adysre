'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `about-team-grid`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant differs
 * only in swapping the <img> for next/image). Four people so the stage shows a
 * full row; avatars are a local SVG, never the network. Inspect a social link
 * and its accessible name reads "Priya Raman on LinkedIn", not "LinkedIn" -
 * which is the entry's point.
 * Keep this in step with `src/data/components/about.ts`.
 */
interface TeamSocial {
  label: string;
  href: string;
  icon: ReactNode;
}

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatarSrc: string;
  socials?: TeamSocial[];
}

interface AboutTeamGridProps {
  kicker?: string;
  title: string;
  members: TeamMember[];
  className?: string;
}

export function AboutTeamGrid({ kicker, title, members, className = '' }: AboutTeamGridProps) {
  return (
    <section
      aria-labelledby="abt-team-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="abt-team-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member: TeamMember) => (
          <li
            key={member.name}
            className="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900"
          >
            { }
            <img
              src={member.avatarSrc}
              alt=""
              width={96}
              height={96}
              className="mx-auto block h-24 w-24 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
            />

            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
            <p className="mt-1 text-sm font-medium text-blue-700 dark:text-blue-400">{member.role}</p>

            {member.bio ? (
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{member.bio}</p>
            ) : null}

            {member.socials?.length ? (
              <ul className="mt-4 flex justify-center gap-1">
                {member.socials.map((social: TeamSocial) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={`${member.name} on ${social.label}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

const ICON_CLASS = 'h-[1.125rem] w-[1.125rem]';

function LinkedInIcon() {
  return (
    <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2.05 1.4-2.05 2.8V21h-4V9Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

const SAMPLE_MEMBERS: TeamMember[] = [
  {
    name: 'Priya Raman',
    role: 'Co-founder, strategy',
    bio: 'Fifteen years turning vague briefs into things that can be built.',
    avatarSrc: '/promo/all-access.svg',
    socials: [
      { label: 'LinkedIn', href: '#', icon: <LinkedInIcon /> },
      { label: 'GitHub', href: '#', icon: <GitHubIcon /> },
    ],
  },
  {
    name: 'Tom Ashcroft',
    role: 'Co-founder, engineering',
    bio: 'Believes most architecture problems are unresolved arguments in disguise.',
    avatarSrc: '/promo/all-access.svg',
    socials: [{ label: 'GitHub', href: '#', icon: <GitHubIcon /> }],
  },
  {
    name: 'Ines Okafor',
    role: 'Principal designer',
    bio: 'Runs the research practice, and the only person here who tests on real people.',
    avatarSrc: '/promo/all-access.svg',
    socials: [{ label: 'LinkedIn', href: '#', icon: <LinkedInIcon /> }],
  },
  {
    name: 'Dan Whitlock',
    role: 'Platform lead',
    bio: 'Keeps the pipelines boring, which is the highest praise available.',
    avatarSrc: '/promo/all-access.svg',
    socials: [
      { label: 'LinkedIn', href: '#', icon: <LinkedInIcon /> },
      { label: 'GitHub', href: '#', icon: <GitHubIcon /> },
    ],
  },
];

export default function AboutTeamGridPreview() {
  return <AboutTeamGrid kicker="The team" title="Twelve people, no account managers" members={SAMPLE_MEMBERS} />;
}
