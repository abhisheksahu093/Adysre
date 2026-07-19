'use client';

/**
 * Live preview for `about-timeline`.
 *
 * Mirrors the `typescript` code variant verbatim. Four milestones, oldest
 * first, so the rail runs between the nodes - and visibly stops at the last one
 * rather than trailing into nothing.
 * Keep this in step with `src/data/components/about.ts`.
 */
interface Milestone {
  date: string;
  dateLabel: string;
  title: string;
  copy: string;
}

interface AboutTimelineProps {
  kicker?: string;
  title: string;
  milestones: Milestone[];
  className?: string;
}

function AboutTimeline({ kicker, title, milestones, className = '' }: AboutTimelineProps) {
  return (
    <section
      aria-labelledby="abt-time-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="abt-time-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <ol className="mt-10">
        {milestones.map((milestone: Milestone) => (
          <li
            key={milestone.date}
            className="relative pb-8 pl-7 before:absolute before:bottom-0 before:left-[0.3125rem] before:top-[1.125rem] before:w-0.5 before:bg-gray-200 after:absolute after:left-0 after:top-1.5 after:h-3 after:w-3 after:rounded-full after:bg-blue-600 last:pb-0 last:before:hidden dark:before:bg-gray-700 dark:after:bg-blue-400"
          >
            <time
              dateTime={milestone.date}
              className="block text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400"
            >
              {milestone.dateLabel}
            </time>
            <h3 className="mt-1.5 text-base font-semibold text-gray-900 dark:text-gray-100">{milestone.title}</h3>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">{milestone.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const SAMPLE_MILESTONES: Milestone[] = [
  {
    date: '2019-04',
    dateLabel: 'April 2019',
    title: 'Two people, one contract',
    copy: 'We took a kitchen table and a six-month engagement and called it a company.',
  },
  {
    date: '2021-09',
    dateLabel: 'September 2021',
    title: 'First platform team',
    copy: 'Five engineers, and the first year we turned work down rather than stretch.',
  },
  {
    date: '2023-02',
    dateLabel: 'February 2023',
    title: 'The Bristol studio',
    copy: 'A permanent home, and a research practice that stopped being a side project.',
  },
  {
    date: '2026-01',
    dateLabel: 'January 2026',
    title: 'Twelve people, nine countries',
    copy: 'Still no account managers. Still the same stubborn question.',
  },
];

export default function AboutTimelinePreview() {
  return <AboutTimeline kicker="History" title="How we got here" milestones={SAMPLE_MILESTONES} />;
}
