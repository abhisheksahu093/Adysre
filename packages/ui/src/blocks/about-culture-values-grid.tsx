/**
 * Live preview for `about-culture-values-grid`.
 * Mirrors the `typescript` variant in `src/data/components/about.ts` verbatim.
 */
export const minHeight = 380;

interface CultureValue {
  title: string;
  copy: string;
}

interface AboutCultureValuesGridProps {
  kicker?: string;
  title?: string;
  values: CultureValue[];
  className?: string;
}

export function AboutCultureValuesGrid({ kicker, title, values, className = '' }: AboutCultureValuesGridProps) {
  return (
    <section
      aria-labelledby="abt-culture-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2
          id="abt-culture-title"
          className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
      ) : null}

      <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((value: CultureValue) => (
          <li key={value.title} className="flex gap-3">
            <span
              className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                focusable="false"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{value.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{value.copy}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AboutCultureValuesGridPreview() {
  return (
    <AboutCultureValuesGrid
      kicker="How we work"
      title="The culture behind the work"
      values={[
        { title: 'Default to writing', copy: 'A decision that is not written down did not happen. We argue in documents, not meetings.' },
        { title: 'Trust by default', copy: 'No one asks permission to do their job well. We hire adults and treat them like it.' },
        { title: 'Small on purpose', copy: 'We would rather stay a studio than become a headcount. Scale is not the goal.' },
        { title: 'Ship to learn', copy: 'The fastest way to be wrong cheaply is to put something real in front of someone.' },
        { title: 'Leave it ownable', copy: 'If your team cannot maintain what we built, we have not actually finished.' },
        { title: 'Rest is work', copy: 'Tired people make expensive mistakes. We protect the evenings and the weekends.' },
      ]}
    />
  );
}
