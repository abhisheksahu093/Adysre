'use client';

/**
 * Live preview for `service-detail-features`.
 *
 * Mirrors the `typescript` code variant verbatim, with two groups - the
 * arrangement the entry is showing. Below `sm` the columns collapse to one and
 * each heading stays with its own list, which is what the shared wrapper buys.
 * Keep this in step with `src/data/components/services.ts`.
 */
interface FeatureGroup {
  heading: string;
  features: string[];
}

interface ServiceDetailFeaturesProps {
  kicker?: string;
  title: string;
  groups: FeatureGroup[];
  className?: string;
}

function TickIcon() {
  return (
    <svg
      className="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function ServiceDetailFeatures({ kicker, title, groups, className = '' }: ServiceDetailFeaturesProps) {
  return (
    <section
      aria-labelledby="svc-feat-title"
      className={['mx-auto w-full max-w-5xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="svc-feat-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-12">
        {groups.map((group: FeatureGroup) => (
          <div key={group.heading}>
            <h3 className="mb-4 border-b border-gray-200 pb-3 text-sm font-bold uppercase tracking-wide text-gray-900 dark:border-gray-800 dark:text-gray-100">
              {group.heading}
            </h3>
            <ul className="grid gap-3">
              {group.features.map((feature: string) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                >
                  <TickIcon />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

const SAMPLE_GROUPS: FeatureGroup[] = [
  {
    heading: 'Research',
    features: [
      'Ten user interviews, recorded and tagged',
      'A funnel audit of your existing analytics',
      'A read of the code you already have',
    ],
  },
  {
    heading: 'Deliverables',
    features: [
      'A clickable prototype of the core journey',
      "A costed backlog, sized by your team's velocity",
      'A written recommendation, including "do not build"',
    ],
  },
];

export default function ServiceDetailFeaturesPreview() {
  return <ServiceDetailFeatures kicker="What you get" title="Everything in the sprint" groups={SAMPLE_GROUPS} />;
}
