/**
 * Live preview for `social-profile-header`. Mirrors the `typescript` variant.
 * Keep in step with `src/data/components/social.ts`.
 */
interface ProfileStat {
  label: string;
  value: string;
}

interface SocialProfileHeaderProps {
  name: string;
  handle: string;
  bio?: string;
  verified?: boolean;
  stats?: ProfileStat[];
  className?: string;
}

export function SocialProfileHeader({
  name,
  handle,
  bio,
  verified = false,
  stats = [],
  className = '',
}: SocialProfileHeaderProps) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
  return (
    <div
      className={`mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="h-24 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500" aria-hidden="true" />
      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between gap-3">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-lg font-bold text-white ring-4 ring-white dark:ring-gray-900"
            aria-hidden="true"
          >
            {initials}
          </span>
          <button
            type="button"
            className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            Follow
          </button>
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{name}</h2>
            {verified ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-blue-500"
                fill="currentColor"
                role="img"
                aria-label="Verified account"
              >
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
              </svg>
            ) : null}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">@{handle}</p>
          {bio ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{bio}</p> : null}
        </div>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-bold text-gray-900 dark:text-gray-100">{s.value}</dd>
              <span className="text-gray-500 dark:text-gray-400">{s.label}</span>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function SocialProfileHeaderPreview() {
  return (
    <SocialProfileHeader
      name="Ada Ross"
      handle="adaross"
      bio="Design engineer. Writing about interfaces, type and the web."
      verified
      stats={[
        { label: 'Posts', value: '348' },
        { label: 'Followers', value: '12.4K' },
        { label: 'Following', value: '286' },
      ]}
    />
  );
}

export const minHeight = 380;
