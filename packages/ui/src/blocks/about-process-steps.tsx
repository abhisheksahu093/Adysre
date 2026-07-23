/**
 * Live preview for `about-process-steps`.
 * Mirrors the `typescript` variant in `src/data/components/about.ts` verbatim.
 */
export const minHeight = 360;

interface ProcessStep {
  title: string;
  copy: string;
}

interface AboutProcessStepsProps {
  kicker?: string;
  title?: string;
  steps: ProcessStep[];
  className?: string;
}

export function AboutProcessSteps({ kicker, title, steps, className = '' }: AboutProcessStepsProps) {
  return (
    <section
      aria-labelledby="abt-process-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2
          id="abt-process-title"
          className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
      ) : null}

      <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step: ProcessStep, index: number) => (
          <li key={step.title}>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white dark:bg-blue-500"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function AboutProcessStepsPreview() {
  return (
    <AboutProcessSteps
      kicker="How we work"
      title="Four steps, every engagement"
      steps={[
        { title: 'Frame the question', copy: 'A week in the room, naming the decision everyone has been avoiding.' },
        { title: 'Prototype the answer', copy: 'Something real and clickable, fast enough to be wrong cheaply.' },
        { title: 'Build in the open', copy: 'Weekly drops your team can use, not a big reveal at the end.' },
        { title: 'Hand over the keys', copy: 'Documentation, walkthroughs and code your team can maintain alone.' },
      ]}
    />
  );
}
