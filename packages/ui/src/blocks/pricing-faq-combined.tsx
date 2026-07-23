/**
 * Live preview for `pricing-faq-combined`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/pricing.ts`. The FAQ uses native <details>/<summary> so it
 * works with zero JavaScript and is keyboard-operable for free.
 */
interface Faq {
  id: string;
  question: string;
  answer: string;
}

interface PricingFaqCombinedProps {
  planName?: string;
  price?: string;
  period?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  faqs?: Faq[];
  className?: string;
}

const FEATURES = ['Unlimited projects', 'All integrations', 'Priority support'];

const FAQS: Faq[] = [
  { id: 'trial', question: 'Is there a free trial?', answer: 'Yes — 14 days, no card required. Cancel any time before it ends and you are not charged.' },
  { id: 'switch', question: 'Can I change plans later?', answer: 'Upgrade or downgrade whenever you like. Changes are prorated to the day.' },
  { id: 'refund', question: 'Do you offer refunds?', answer: 'We refund annual plans in full within 30 days of purchase, no questions asked.' },
];

export function PricingFaqCombined({
  planName = 'Pro',
  price = '$16',
  period = '/month',
  features = FEATURES,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  faqs = FAQS,
  className = '',
}: PricingFaqCombinedProps) {
  return (
    <section className={`mx-auto w-full max-w-4xl px-4 ${className}`} aria-labelledby="faq-combined-heading">
      <h2 className="sr-only" id="faq-combined-heading">
        Pricing and frequently asked questions
      </h2>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <article className="rounded-2xl border-2 border-blue-600 bg-white p-6 dark:border-blue-500 dark:bg-gray-900">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{planName}</h3>
          <p className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{price}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{period}</span>
          </p>
          <ul className="my-5 grid gap-2.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <svg className="mt-0.5 h-4 w-4 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <a
            href={ctaHref}
            className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </a>
        </article>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Frequently asked</h3>
          <ul className="mt-3 grid gap-2">
            {faqs.map((faq) => (
              <li key={faq.id}>
                <details className="group rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100">
                    {faq.question}
                    <svg
                      className="h-4 w-4 flex-none text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
                    </svg>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export const minHeight = 440;

export default function PricingFaqCombinedPreview() {
  return <PricingFaqCombined />;
}
