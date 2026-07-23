'use client';

import { useId, type FormEvent } from 'react';

/**
 * Live preview for `contact-faq-combined`.
 *
 * Mirrors the `typescript` code variant. The FAQ is native <details>/<summary>.
 * Keep this in step with `src/data/components/contact.ts`.
 */
interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  { question: 'How soon will I hear back?', answer: 'Within one business day, usually much sooner.' },
  { question: 'Do you offer phone support?', answer: 'Yes, on Business and Enterprise plans.' },
];

interface ContactFaqCombinedProps {
  title?: string;
  faqTitle?: string;
  faqs?: FaqItem[];
  submitLabel?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

export function ContactFaqCombined({
  title = 'Get in touch',
  faqTitle = 'Before you ask',
  faqs = DEFAULT_FAQS,
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactFaqCombinedProps) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={`mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 sm:py-16 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={nameId} className={label}>Name</label>
            <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
          </div>
          <div>
            <label htmlFor={emailId} className={label}>Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor={messageId} className={label}>Message</label>
            <textarea id={messageId} name="message" rows={4} required className={`${field} resize-y`} />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
        </form>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{faqTitle}</h3>
        <div className="mt-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-gray-200 py-3 dark:border-gray-800">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden dark:text-gray-100">
                {faq.question}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export const minHeight = 620;

export default function ContactFaqCombinedPreview() {
  return <ContactFaqCombined />;
}
