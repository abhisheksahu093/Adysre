import type { ComponentEntry } from './types';

/**
 * Team / people category.
 *
 * Ten structurally different ways to introduce the people behind a product:
 * card grids, row lists, a featured leader, a hover-to-reveal bio, department
 * columns, a scroll strip and a "we're hiring" tile. Two constraints are shared
 * across all of them and are the reason the batch reads consistently:
 *
 *  1. Avatars are initials on a gradient, never a network image. Every tile
 *     derives its initials from the name and picks a gradient by index, so a
 *     roster renders instantly, never ships a broken <img>, and needs no assets.
 *     The avatar is `aria-hidden` because the name sits right beside it - a
 *     screen reader announcing "PR" before "Priya Raman" is noise.
 *  2. Social links carry a *per-person* accessible name - "Priya Raman on
 *     LinkedIn", not "LinkedIn" - so a screen-reader user tabbing the row hears
 *     whose profile each icon opens. The icon SVG itself is `aria-hidden`.
 */
export const teamComponents: ComponentEntry[] = [
  {
    slug: 'team-grid-cards',
    category: 'team',
    tags: ['team', 'grid', 'cards', 'people', 'avatars'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    props: [
      { name: 'title', type: 'string', default: "'Meet the team'", descriptionKey: 'title' },
      { name: 'subtitle', type: 'string', descriptionKey: 'subtitle' },
      { name: 'members', type: 'TeamMember[]', required: true, descriptionKey: 'members' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
  <div class="mx-auto max-w-2xl text-center">
    <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Meet the team</h2>
    <p class="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">The people who ship the thing.</p>
  </div>

  <!-- Reflows 1 -> 2 -> 3 -> 4 so four names never crush into one unreadable row. -->
  <ul class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <li class="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
      <span aria-hidden="true" class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-semibold text-white">PR</span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Priya Raman</h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Co-founder, strategy</p>
    </li>
    <li class="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
      <span aria-hidden="true" class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-semibold text-white">TA</span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Tom Ashcroft</h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Head of engineering</p>
    </li>
    <li class="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
      <span aria-hidden="true" class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-lg font-semibold text-white">IO</span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Ines Okafor</h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Principal designer</p>
    </li>
    <li class="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
      <span aria-hidden="true" class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-lg font-semibold text-white">DW</span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Dan Whitlock</h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Platform lead</p>
    </li>
  </ul>
</section>`,
      react: `const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

// Two letters from the name; the avatar is decorative so the initials are only
// ever seen, never announced.
function getInitials(name) {
  return name.split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function TeamGridCards({ title = 'Meet the team', subtitle, members, className = '' }) {
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
}`,
      typescript: `export interface TeamMember {
  name: string;
  role: string;
}

export interface TeamGridCardsProps {
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

export function TeamGridCards({ title = 'Meet the team', subtitle, members, className = '' }: TeamGridCardsProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'team-with-social-links',
    category: 'team',
    tags: ['team', 'social', 'links', 'cards', 'contact'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', default: "'Meet the team'", descriptionKey: 'title' },
      { name: 'members', type: 'TeamMember[]', required: true, descriptionKey: 'members' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
  <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Meet the team</h2>

  <ul class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <li class="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
      <span aria-hidden="true" class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-semibold text-white">PR</span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Priya Raman</h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Co-founder, strategy</p>
      <ul class="mt-4 flex justify-center gap-1">
        <li>
          <!-- The accessible name is per-person, not just "LinkedIn". -->
          <a href="#" aria-label="Priya Raman on LinkedIn" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
            <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2.05 1.4-2.05 2.8V21h-4V9Z" /></svg>
          </a>
        </li>
        <li>
          <a href="#" aria-label="Priya Raman on GitHub" class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
            <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
          </a>
        </li>
      </ul>
    </li>
  </ul>
</section>`,
      react: `const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

const SOCIAL_LABELS = { linkedin: 'LinkedIn', twitter: 'X', github: 'GitHub' };

function SocialIcon({ platform }) {
  const cls = 'h-[1.125rem] w-[1.125rem]';
  if (platform === 'linkedin') {
    return (<svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2.05 1.4-2.05 2.8V21h-4V9Z" /></svg>);
  }
  if (platform === 'twitter') {
    return (<svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>);
  }
  return (<svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>);
}

function getInitials(name) {
  return name.split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function TeamWithSocialLinks({ title = 'Meet the team', members, className = '' }) {
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
}`,
      typescript: `type SocialPlatform = 'linkedin' | 'twitter' | 'github';

interface TeamSocial {
  platform: SocialPlatform;
  href: string;
}

export interface TeamMember {
  name: string;
  role: string;
  socials?: TeamSocial[];
}

export interface TeamWithSocialLinksProps {
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

function SocialIcon({ platform }: { platform: SocialPlatform }): JSX.Element {
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

export function TeamWithSocialLinks({ title = 'Meet the team', members, className = '' }: TeamWithSocialLinksProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'team-list-rows',
    category: 'team',
    tags: ['team', 'list', 'rows', 'roster', 'directory'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', default: "'The team'", descriptionKey: 'title' },
      { name: 'members', type: 'TeamMember[]', required: true, descriptionKey: 'members' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">The team</h2>

  <ul class="mt-8 divide-y divide-gray-200 dark:divide-gray-800">
    <li class="flex items-center gap-4 py-4">
      <span aria-hidden="true" class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">PR</span>
      <div class="min-w-0">
        <h3 class="truncate text-base font-semibold text-gray-900 dark:text-gray-100">Priya Raman</h3>
        <p class="truncate text-sm text-gray-600 dark:text-gray-400">Co-founder, strategy</p>
      </div>
      <span class="ml-auto hidden shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 sm:inline dark:bg-gray-800 dark:text-gray-300">Leadership</span>
    </li>
    <li class="flex items-center gap-4 py-4">
      <span aria-hidden="true" class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-semibold text-white">TA</span>
      <div class="min-w-0">
        <h3 class="truncate text-base font-semibold text-gray-900 dark:text-gray-100">Tom Ashcroft</h3>
        <p class="truncate text-sm text-gray-600 dark:text-gray-400">Head of engineering</p>
      </div>
      <span class="ml-auto hidden shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 sm:inline dark:bg-gray-800 dark:text-gray-300">Engineering</span>
    </li>
  </ul>
</section>`,
      react: `const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

function getInitials(name) {
  return name.split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function TeamListRows({ title = 'The team', members, className = '' }) {
  return (
    <section className={['mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16', className].filter(Boolean).join(' ')}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>

      <ul className="mt-8 divide-y divide-gray-200 dark:divide-gray-800">
        {members.map((member, index) => {
          const gradient = GRADIENTS[index % GRADIENTS.length] ?? 'from-blue-500 to-indigo-600';
          return (
            <li key={member.name} className="flex items-center gap-4 py-4">
              <span aria-hidden="true" className={'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ' + gradient + ' text-sm font-semibold text-white'}>
                {getInitials(member.name)}
              </span>
              {/* min-w-0 lets the labels truncate instead of shoving the tag off-screen at 320px. */}
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
                <p className="truncate text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
              {member.department ? (
                <span className="ml-auto hidden shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 sm:inline dark:bg-gray-800 dark:text-gray-300">{member.department}</span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}`,
      typescript: `export interface TeamMember {
  name: string;
  role: string;
  department?: string;
}

export interface TeamListRowsProps {
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

export function TeamListRows({ title = 'The team', members, className = '' }: TeamListRowsProps): JSX.Element {
  return (
    <section className={['mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16', className].filter(Boolean).join(' ')}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>

      <ul className="mt-8 divide-y divide-gray-200 dark:divide-gray-800">
        {members.map((member, index) => {
          const gradient = GRADIENTS[index % GRADIENTS.length] ?? 'from-blue-500 to-indigo-600';
          return (
            <li key={member.name} className="flex items-center gap-4 py-4">
              <span aria-hidden="true" className={'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ' + gradient + ' text-sm font-semibold text-white'}>
                {getInitials(member.name)}
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
                <p className="truncate text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
              {member.department ? (
                <span className="ml-auto hidden shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 sm:inline dark:bg-gray-800 dark:text-gray-300">{member.department}</span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'team-leadership-featured',
    category: 'team',
    tags: ['team', 'leadership', 'featured', 'founder', 'cards'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', default: "'Leadership'", descriptionKey: 'title' },
      { name: 'leader', type: 'TeamLeader', required: true, descriptionKey: 'leader' },
      { name: 'members', type: 'TeamMember[]', required: true, descriptionKey: 'members' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Leadership</h2>

  <article class="mt-8 flex flex-col items-center gap-6 rounded-3xl border border-gray-200 bg-white p-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:p-8 sm:text-left dark:border-gray-800 dark:bg-gray-900">
    <span aria-hidden="true" class="inline-flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white">PR</span>
    <div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">Priya Raman</h3>
      <p class="mt-1 text-sm font-medium text-blue-700 dark:text-blue-400">Co-founder & CEO</p>
      <p class="mt-3 max-w-prose text-sm leading-relaxed text-gray-600 dark:text-gray-400">Fifteen years turning vague briefs into things that can be built, shipped and measured.</p>
    </div>
  </article>

  <ul class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <li class="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
      <span aria-hidden="true" class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-semibold text-white">TA</span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Tom Ashcroft</h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Head of engineering</p>
    </li>
  </ul>
</section>`,
      react: `const GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

function getInitials(name) {
  return name.split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function TeamLeadershipFeatured({ title = 'Leadership', leader, members, className = '' }) {
  return (
    <section className={['mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16', className].filter(Boolean).join(' ')}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>

      {/* The featured card stacks avatar-over-text on phones, side-by-side from sm up. */}
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
}`,
      typescript: `export interface TeamLeader {
  name: string;
  role: string;
  bio?: string;
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface TeamLeadershipFeaturedProps {
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

export function TeamLeadershipFeatured({ title = 'Leadership', leader, members, className = '' }: TeamLeadershipFeaturedProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'team-hover-overlay',
    category: 'team',
    tags: ['team', 'hover', 'overlay', 'bio', 'interactive'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', default: "'Meet the team'", descriptionKey: 'title' },
      { name: 'members', type: 'TeamMember[]', required: true, descriptionKey: 'members' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
  <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Meet the team</h2>

  <ul class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <li>
      <!--
        The bio reveal is tied to :hover AND :focus-visible on the same link, so
        keyboard users get the same information mouse users do. The scrim behind
        the bio is what keeps it at 4.5:1 over the gradient.
      -->
      <a href="#" class="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <span aria-hidden="true" class="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/90 transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none">PR</span>
        <div class="relative">
          <h3 class="text-base font-semibold">Priya Raman</h3>
          <p class="text-sm text-white/80">Co-founder, strategy</p>
        </div>
        <p class="absolute inset-0 flex items-center bg-black/60 p-5 text-sm leading-relaxed opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">Fifteen years turning vague briefs into things that can be built.</p>
      </a>
    </li>
  </ul>
</section>`,
      react: `const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

function getInitials(name) {
  return name.split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function TeamHoverOverlay({ title = 'Meet the team', members, className = '' }) {
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
}`,
      typescript: `export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  href?: string;
}

export interface TeamHoverOverlayProps {
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

export function TeamHoverOverlay({ title = 'Meet the team', members, className = '' }: TeamHoverOverlayProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'team-circular-avatars',
    category: 'team',
    tags: ['team', 'avatars', 'circular', 'compact', 'grid'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', default: "'The whole crew'", descriptionKey: 'title' },
      { name: 'members', type: 'TeamMember[]', required: true, descriptionKey: 'members' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
  <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">The whole crew</h2>

  <!-- Compact avatars pack denser than cards: 2 -> 3 -> 4 -> 6 columns. -->
  <ul class="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    <li class="flex flex-col items-center text-center">
      <span aria-hidden="true" class="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-semibold text-white ring-2 ring-white dark:ring-gray-900">PR</span>
      <h3 class="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Priya Raman</h3>
      <p class="text-xs text-gray-600 dark:text-gray-400">Strategy</p>
    </li>
    <li class="flex flex-col items-center text-center">
      <span aria-hidden="true" class="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-semibold text-white ring-2 ring-white dark:ring-gray-900">TA</span>
      <h3 class="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Tom Ashcroft</h3>
      <p class="text-xs text-gray-600 dark:text-gray-400">Engineering</p>
    </li>
  </ul>
</section>`,
      react: `const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

function getInitials(name) {
  return name.split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function TeamCircularAvatars({ title = 'The whole crew', members, className = '' }) {
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
}`,
      typescript: `export interface TeamMember {
  name: string;
  role: string;
}

export interface TeamCircularAvatarsProps {
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

export function TeamCircularAvatars({ title = 'The whole crew', members, className = '' }: TeamCircularAvatarsProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'team-org-columns',
    category: 'team',
    tags: ['team', 'org', 'departments', 'columns', 'directory'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', default: "'By team'", descriptionKey: 'title' },
      { name: 'departments', type: 'Department[]', required: true, descriptionKey: 'departments' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">By team</h2>

  <div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
    <section>
      <h3 class="border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-widest text-blue-700 dark:border-gray-800 dark:text-blue-400">Engineering</h3>
      <ul class="mt-4 space-y-4">
        <li class="flex items-center gap-3">
          <span aria-hidden="true" class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-semibold text-white">TA</span>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Tom Ashcroft</p>
            <p class="truncate text-xs text-gray-600 dark:text-gray-400">Head of engineering</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</section>`,
      react: `const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

function getInitials(name) {
  return name.split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function TeamOrgColumns({ title = 'By team', departments, className = '' }) {
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
}`,
      typescript: `export interface TeamMember {
  name: string;
  role: string;
}

export interface Department {
  name: string;
  members: TeamMember[];
}

export interface TeamOrgColumnsProps {
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

export function TeamOrgColumns({ title = 'By team', departments, className = '' }: TeamOrgColumnsProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'team-minimal-names',
    category: 'team',
    tags: ['team', 'minimal', 'names', 'typographic', 'list'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', default: "'The team'", descriptionKey: 'title' },
      { name: 'members', type: 'TeamMember[]', required: true, descriptionKey: 'members' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">The team</h2>

  <!-- No avatars on purpose: names carry the weight. Reflows 1 -> 2 -> 3. -->
  <ul class="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
    <li class="border-t border-gray-200 pt-4 dark:border-gray-800">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Priya Raman</h3>
      <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-400">Co-founder, strategy</p>
    </li>
    <li class="border-t border-gray-200 pt-4 dark:border-gray-800">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Tom Ashcroft</h3>
      <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-400">Head of engineering</p>
    </li>
  </ul>
</section>`,
      react: `export function TeamMinimalNames({ title = 'The team', members, className = '' }) {
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
}`,
      typescript: `export interface TeamMember {
  name: string;
  role: string;
}

export interface TeamMinimalNamesProps {
  title?: string;
  members: TeamMember[];
  className?: string;
}

export function TeamMinimalNames({ title = 'The team', members, className = '' }: TeamMinimalNamesProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'team-carousel-strip',
    category: 'team',
    tags: ['team', 'carousel', 'scroll', 'strip', 'snap'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', default: "'Meet the team'", descriptionKey: 'title' },
      { name: 'members', type: 'TeamMember[]', required: true, descriptionKey: 'members' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Meet the team</h2>

  <!--
    A native scroll-snap strip: no JS. tabindex="0" + a region label make the
    overflow keyboard-focusable and announced, which a bare scroll box is not.
  -->
  <div role="region" aria-label="Team members" tabindex="0" class="mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:mx-0 sm:px-0 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <article class="w-56 shrink-0 snap-start rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
      <span aria-hidden="true" class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-semibold text-white">PR</span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Priya Raman</h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Co-founder, strategy</p>
    </article>
    <article class="w-56 shrink-0 snap-start rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
      <span aria-hidden="true" class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-semibold text-white">TA</span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Tom Ashcroft</h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Head of engineering</p>
    </article>
  </div>
</section>`,
      react: `const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

function getInitials(name) {
  return name.split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function TeamCarouselStrip({ title = 'Meet the team', members, className = '' }) {
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
}`,
      typescript: `export interface TeamMember {
  name: string;
  role: string;
}

export interface TeamCarouselStripProps {
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

export function TeamCarouselStrip({ title = 'Meet the team', members, className = '' }: TeamCarouselStripProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'team-hiring-cta',
    category: 'team',
    tags: ['team', 'hiring', 'cta', 'careers', 'grid'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', default: "'Meet the team'", descriptionKey: 'title' },
      { name: 'members', type: 'TeamMember[]', required: true, descriptionKey: 'members' },
      { name: 'hiringLabel', type: 'string', default: "'Join us'", descriptionKey: 'hiringLabel' },
      { name: 'hiringHref', type: 'string', default: "'#'", descriptionKey: 'hiringHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
  <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Meet the team</h2>

  <ul class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <li class="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
      <span aria-hidden="true" class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-semibold text-white">PR</span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Priya Raman</h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Co-founder, strategy</p>
    </li>

    <!-- The hiring tile shares the grid cell so "join us" reads as one of the team. -->
    <li>
      <a href="#" class="flex h-full min-h-[11rem] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 p-6 text-center text-gray-600 transition-colors hover:border-blue-500 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <span aria-hidden="true" class="inline-flex h-12 w-12 items-center justify-center rounded-full border border-current text-2xl leading-none">+</span>
        <span class="text-sm font-semibold">Join us</span>
      </a>
    </li>
  </ul>
</section>`,
      react: `const GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

function getInitials(name) {
  return name.split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase();
}

export function TeamHiringCta({ title = 'Meet the team', members, hiringLabel = 'Join us', hiringHref = '#', className = '' }) {
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
}`,
      typescript: `export interface TeamMember {
  name: string;
  role: string;
}

export interface TeamHiringCtaProps {
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

export function TeamHiringCta({ title = 'Meet the team', members, hiringLabel = 'Join us', hiringHref = '#', className = '' }: TeamHiringCtaProps): JSX.Element {
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
}`,
    },
  },
];
