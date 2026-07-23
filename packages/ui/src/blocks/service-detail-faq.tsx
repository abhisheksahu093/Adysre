'use client';

/**
 * Live preview for `service-detail-faq`.
 *
 * Mirrors the `typescript` code variant verbatim. Fully interactive with no
 * state of its own - the disclosure, the exclusive group and the keyboard
 * handling are all the browser's, which is the entry's whole argument. Opening
 * one answer closes the others because they share a `name`.
 * Keep this in step with `src/data/components/services.ts`.
 */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface ServiceDetailFaqProps {
  title: string;
  items: FaqItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  groupName?: string;
  className?: string;
}

function ChevronIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ServiceDetailFaq({
  title,
  items,
  defaultOpenId,
  allowMultiple = false,
  groupName = 'service-faq',
  className = '',
}: ServiceDetailFaqProps) {
  return (
    <section
      aria-labelledby="svc-faq-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <h2
        id="svc-faq-title"
        className="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <div>
        {items.map((item: FaqItem) => (
          <details
            key={item.id}
            className="group border-b border-gray-200 dark:border-gray-800"
            name={allowMultiple ? undefined : groupName}
            open={item.id === defaultOpenId}
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-[1.125rem] text-[0.9375rem] font-semibold text-gray-900 marker:content-none hover:text-blue-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden dark:text-gray-100 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
              {item.question}
              <ChevronIcon />
            </summary>
            <p className="max-w-2xl pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

const SAMPLE_ITEMS: FaqItem[] = [
  {
    id: 'no-build',
    question: 'What happens if you tell us not to build it?',
    answer:
      'You still get the research, the prototype and the reasoning. Roughly one sprint in six ends that way, and it is the cheapest outcome on offer.',
  },
  {
    id: 'availability',
    question: 'Who needs to be available from our side?',
    answer:
      'One decision-maker for two hours a week, and whoever knows the current system best for a single afternoon.',
  },
  {
    id: 'delivery',
    question: 'Can the sprint roll straight into delivery?',
    answer:
      'Yes, and about half do. The backlog is sized for your team, so it is equally usable if you take it in-house.',
  },
];

export default function ServiceDetailFaqPreview() {
  return (
    <ServiceDetailFaq
      title="Questions about the sprint"
      items={SAMPLE_ITEMS}
      defaultOpenId="no-build"
      groupName="service-faq-preview"
    />
  );
}
