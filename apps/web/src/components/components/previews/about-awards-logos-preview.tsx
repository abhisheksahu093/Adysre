import type { ReactNode } from 'react';

/**
 * Live preview for `about-awards-logos`.
 * Mirrors the `typescript` variant in `src/data/components/about.ts` verbatim.
 */
export const minHeight = 420;

interface Award {
  label: string;
  detail?: string;
}

interface PressLogo {
  name: string;
  icon: ReactNode;
}

interface AboutAwardsLogosProps {
  kicker?: string;
  title?: string;
  awards: Award[];
  logos?: PressLogo[];
  className?: string;
}

function AboutAwardsLogos({ kicker, title, awards, logos = [], className = '' }: AboutAwardsLogosProps) {
  return (
    <section
      aria-labelledby="abt-awards-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2
          id="abt-awards-title"
          className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
      ) : null}

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((award: Award) => (
          <li
            key={award.label}
            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50"
          >
            <svg
              className="h-9 w-9 flex-none text-blue-600 dark:text-blue-400"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 2a6 6 0 0 0-3 11.2V15a3 3 0 0 0 6 0v-1.8A6 6 0 0 0 12 2Zm-2 15v1a2 2 0 0 0 4 0v-1a5.98 5.98 0 0 1-4 0Z" />
            </svg>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{award.label}</p>
              {award.detail ? <p className="text-xs text-gray-500 dark:text-gray-400">{award.detail}</p> : null}
            </div>
          </li>
        ))}
      </ul>

      {logos.length ? (
        <>
          <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">As seen in</p>
          <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
            {logos.map((logo: PressLogo) => (
              <li key={logo.name} className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                {logo.icon}
                <span className="text-base font-bold tracking-tight text-gray-500 dark:text-gray-400">{logo.name}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

const circleMark = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const squareMark = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <rect x="3" y="3" width="18" height="18" rx="4" />
  </svg>
);

const triangleMark = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M12 3 22 20H2L12 3Z" />
  </svg>
);

export default function AboutAwardsLogosPreview() {
  return (
    <AboutAwardsLogos
      kicker="Recognition"
      title="Kind words, in writing"
      awards={[
        { label: 'Studio of the Year', detail: 'Design Week · 2025' },
        { label: 'Best Product Team', detail: 'Fastforward Awards · 2024' },
        { label: 'Top 50 Workplaces', detail: 'Craft & Code · 2024' },
      ]}
      logos={[
        { name: 'Northwind', icon: circleMark },
        { name: 'Meridian', icon: squareMark },
        { name: 'Apex', icon: triangleMark },
      ]}
    />
  );
}
