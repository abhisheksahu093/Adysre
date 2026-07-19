'use client';

import { useId, type FormEvent } from 'react';

/**
 * Live preview for `contact-support-options`.
 *
 * Mirrors the `typescript` code variant. The topic picker is a keyboard-driven
 * radio group styled as cards. Keep this in step with
 * `src/data/components/contact.ts`.
 */
interface SupportTopic {
  value: string;
  label: string;
  description?: string;
}

interface SupportFormValues {
  topic: string;
  email: string;
  message: string;
}

const DEFAULT_TOPICS: SupportTopic[] = [
  { value: 'sales', label: 'Sales', description: 'Plans and pricing' },
  { value: 'support', label: 'Support', description: 'Help with an issue' },
  { value: 'billing', label: 'Billing', description: 'Invoices and payments' },
];

interface ContactSupportOptionsProps {
  title?: string;
  description?: string;
  topics?: SupportTopic[];
  submitLabel?: string;
  onSubmit?: (values: SupportFormValues) => void;
  className?: string;
}

function ContactSupportOptions({
  title = 'How can we help?',
  description = 'Pick a topic so your message reaches the right team.',
  topics = DEFAULT_TOPICS,
  submitLabel = 'Submit request',
  onSubmit = () => {},
  className = '',
}: ContactSupportOptionsProps) {
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const card =
    'flex cursor-pointer flex-col rounded-lg border border-gray-300 p-3 text-sm has-[:checked]:border-blue-600 has-[:checked]:ring-2 has-[:checked]:ring-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600 dark:border-gray-700';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      topic: String(data.get('topic') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={`mx-auto w-full max-w-lg px-4 py-12 sm:py-16 ${className}`}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
      {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <fieldset>
          <legend className={label}>Choose a topic</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {topics.map((topic, index) => (
              <label key={topic.value} className={card}>
                <input type="radio" name="topic" value={topic.value} defaultChecked={index === 0} className="sr-only" />
                <span className="font-medium text-gray-900 dark:text-gray-100">{topic.label}</span>
                {topic.description ? <span className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{topic.description}</span> : null}
              </label>
            ))}
          </div>
        </fieldset>
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
    </section>
  );
}

export const minHeight = 640;

export default function ContactSupportOptionsPreview() {
  return <ContactSupportOptions />;
}
