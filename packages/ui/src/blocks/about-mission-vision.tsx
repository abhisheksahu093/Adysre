import type { ReactNode } from 'react';

/**
 * Live preview for `about-mission-vision`.
 * Mirrors the `typescript` variant in `src/data/components/about.ts` verbatim.
 */
export const minHeight = 360;

interface MissionVisionItem {
  label: string;
  heading: string;
  copy: string;
  icon?: ReactNode;
}

interface AboutMissionVisionProps {
  kicker?: string;
  title?: string;
  items: MissionVisionItem[];
  className?: string;
}

export function AboutMissionVision({ kicker, title, items, className = '' }: AboutMissionVisionProps) {
  return (
    <section
      aria-labelledby="abt-mv-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2
          id="abt-mv-title"
          className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
      ) : null}

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map((item: MissionVisionItem) => (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8 dark:border-gray-800 dark:bg-gray-800/50"
          >
            {item.icon ? (
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                aria-hidden="true"
              >
                {item.icon}
              </span>
            ) : null}
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{item.label}</p>
            <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{item.heading}</h3>
            <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">{item.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const targetIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" focusable="false">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);

const eyeIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" focusable="false">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function AboutMissionVisionPreview() {
  return (
    <AboutMissionVision
      kicker="Our purpose"
      title="Why we exist and where we are headed"
      items={[
        {
          label: 'Mission',
          heading: 'Make good decisions cheap to make',
          copy: 'We help teams turn slow, expensive judgement calls into fast, repeatable habits - and let the software fall out of that.',
          icon: targetIcon,
        },
        {
          label: 'Vision',
          heading: 'A world with less shelfware',
          copy: 'Software that ships, gets used and gets owned - not another platform that arrives late and pleases nobody.',
          icon: eyeIcon,
        },
      ]}
    />
  );
}
