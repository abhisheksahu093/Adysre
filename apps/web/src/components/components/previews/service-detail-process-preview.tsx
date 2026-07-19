'use client';

/**
 * Live preview for `service-detail-process`.
 *
 * Mirrors the `typescript` code variant verbatim. Four steps, so the connector
 * rail is visible between markers - and so the last one visibly does not trail
 * a rule into nothing.
 * Keep this in step with `src/data/components/services.ts`.
 */
interface ProcessStep {
  title: string;
  copy: string;
}

interface ServiceDetailProcessProps {
  kicker?: string;
  title: string;
  steps: ProcessStep[];
  className?: string;
}

function ServiceDetailProcess({ kicker, title, steps, className = '' }: ServiceDetailProcessProps) {
  return (
    <section
      aria-labelledby="svc-proc-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="svc-proc-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <ol className="mt-10">
        {steps.map((step: ProcessStep, index: number) => (
          <li
            key={step.title}
            className="relative flex gap-4 pb-8 before:absolute before:bottom-2 before:left-5 before:top-10 before:-ml-px before:w-0.5 before:bg-gray-200 last:pb-0 last:before:hidden dark:before:bg-gray-700"
          >
            <span
              className="relative z-10 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-600 text-sm font-bold tabular-nums text-white"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

const SAMPLE_STEPS: ProcessStep[] = [
  {
    title: 'Kickoff',
    copy: 'Half a day with your team to agree the question we are answering.',
  },
  {
    title: 'Research',
    copy: 'Interviews, analytics and a read of the code you already have.',
  },
  {
    title: 'Prototype',
    copy: 'A clickable core journey, tested with five people outside your building.',
  },
  {
    title: 'Handover',
    copy: 'A costed backlog and a recommendation you can act on the same week.',
  },
];

export default function ServiceDetailProcessPreview() {
  return <ServiceDetailProcess kicker="How it runs" title="Four steps, three weeks" steps={SAMPLE_STEPS} />;
}
