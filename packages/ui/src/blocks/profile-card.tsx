'use client';

/**
 * Live preview for `profile-card`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant is the
 * same component, minus the exported types). The avatar points at a local SVG
 * so the preview never touches the network - the snippet ships a plain
 * `/your-image.jpg` placeholder instead.
 * Keep this in step with `src/data/components/cards.ts`.
 */
type SocialId = 'x' | 'linkedin' | 'github';

interface ProfileSocial {
  id: SocialId;
  label: string;
  href: string;
}

interface ProfileCardProps {
  name: string;
  role: string;
  bio: string;
  avatarSrc: string;
  socials?: ProfileSocial[];
  className?: string;
}

const SOCIAL_PATHS: Record<SocialId, string> = {
  x: 'M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2.2l7.6-8.7L1.7 2h6.8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.4L17.8 20Z',
  linkedin:
    'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.6 8.75 22 11.1 22 14.2V21h-4v-6c0-1.4-.03-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4V9Z',
  github:
    'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.51-4.94.01-1.09.4-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z',
};

export function ProfileCard({ name, role, bio, avatarSrc, socials = [], className = '' }: ProfileCardProps) {
  return (
    <article
      className={`w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <img
        className="mx-auto block h-20 w-20 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
        src={avatarSrc}
        alt=""
        width={80}
        height={80}
      />

      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
      <p className="mt-0.5 text-sm font-medium text-blue-700 dark:text-blue-400">{role}</p>
      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{bio}</p>

      {socials.length > 0 ? (
        <ul className="mt-5 flex justify-center gap-2">
          {socials.map((social: ProfileSocial) => (
            <li key={social.id}>
              <a
                href={social.href}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={SOCIAL_PATHS[social.id]} />
                </svg>
                <span className="sr-only">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export default function ProfileCardPreview() {
  return (
    <ProfileCard
      name="Amara Okafor"
      role="Principal Designer"
      bio="Twelve years spent turning sprawling product surfaces into design systems teams actually keep using."
      avatarSrc="/promo/all-access.svg"
      socials={[
        { id: 'x', label: 'Amara on X', href: '#' },
        { id: 'linkedin', label: 'Amara on LinkedIn', href: '#' },
        { id: 'github', label: 'Amara on GitHub', href: '#' },
      ]}
    />
  );
}
