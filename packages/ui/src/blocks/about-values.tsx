'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `about-values`.
 *
 * Mirrors the `typescript` code variant verbatim, with four values so the stage
 * shows a full row. Each card's heading IS the principle - skim the headings
 * and you have read the section, which is what the entry is arguing for.
 * Keep this in step with `src/data/components/about.ts`.
 */
interface AboutValue {
  name: string;
  copy: string;
  icon: ReactNode;
}

interface AboutValuesProps {
  kicker?: string;
  title: string;
  values: AboutValue[];
  className?: string;
}

export function AboutValues({ kicker, title, values, className = '' }: AboutValuesProps) {
  return (
    <section
      aria-labelledby="abt-vals-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="abt-vals-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value: AboutValue) => (
          <li key={value.name} className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {value.icon}
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{value.name}</h3>
            <p className="mt-2 text-sm leading-[1.65] text-gray-600 dark:text-gray-400">{value.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const ICON_CLASS = 'h-5 w-5';

const SAMPLE_VALUES: AboutValue[] = [
  {
    name: 'Say the hard thing early',
    copy: 'Bad news does not improve with age. If the plan is wrong we say so in week one, not at handover.',
    icon: (
      <svg
        className={ICON_CLASS}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.1 14a5 5 0 1 0-6.2 0" />
        <path d="M12 14v-3" />
      </svg>
    ),
  },
  {
    name: 'Leave it ownable',
    copy: 'Every line we write is one your team has to live with. If they cannot maintain it, we have not finished.',
    icon: (
      <svg
        className={ICON_CLASS}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  {
    name: 'Small teams, whole problems',
    copy: 'Four people who own the outcome beat twelve who own a slice of it. We have never once been wrong about this.',
    icon: (
      <svg
        className={ICON_CLASS}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
    ),
  },
  {
    name: 'Measure, then argue',
    copy: 'Opinions are cheap and we have plenty. Where a number can settle it, we go and get the number.',
    icon: (
      <svg
        className={ICON_CLASS}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M3 3v18h18" />
        <path d="M7 16V9" />
        <path d="M12 16V5" />
        <path d="M17 16v-4" />
      </svg>
    ),
  },
];

export default function AboutValuesPreview() {
  return <AboutValues kicker="What we hold to" title="Four things we will not trade" values={SAMPLE_VALUES} />;
}
