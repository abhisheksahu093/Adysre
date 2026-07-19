'use client';


/**
 * Live preview for `accordion-native-details`.
 *
 * Mirrors the `typescript` code variant verbatim. Note there is no useState and
 * no handler: the browser owns the open state, and `name` makes the group
 * exclusive. 'use client' is here only because the preview registry loads every
 * preview from a client boundary - the snippet itself needs no client runtime.
 * Keep this in step with `src/data/components/faq.ts`.
 */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionNativeDetailsProps {
  items: FaqItem[];
  /** Scopes the exclusive group. Pass a unique value per accordion on a page. */
  name?: string;
  defaultOpenId?: string;
  className?: string;
}

function AccordionNativeDetails({
  items,
  name = 'faq-native',
  defaultOpenId,
  className = '',
}: AccordionNativeDetailsProps) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {items.map((item: FaqItem) => (
        <details
          key={item.id}
          name={name}
          open={item.id === defaultOpenId}
          className="group border-b border-gray-200 dark:border-gray-800"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-4 text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 [&::-webkit-details-marker]:hidden">
            {item.question}
            <svg
              className="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

const SAMPLE_ITEMS: FaqItem[] = [
  {
    id: 'privacy',
    question: 'Do you sell my data?',
    answer:
      'Never. We make money from subscriptions, and your content is yours - we do not sell or train on it.',
  },
  {
    id: 'gdpr',
    question: 'Are you GDPR compliant?',
    answer:
      'Yes, and we sign a DPA with every customer. Sub-processors are listed publicly on our trust page.',
  },
  {
    id: 'delete',
    question: 'How do I delete my account?',
    answer:
      'Settings → Account → Delete. Everything is erased from live systems immediately and from backups within 30 days.',
  },
];

export default function AccordionNativeDetailsPreview() {
  return (
    <AccordionNativeDetails
      items={SAMPLE_ITEMS}
      name="faq-native-preview"
      defaultOpenId="privacy"
      className="w-full"
    />
  );
}
