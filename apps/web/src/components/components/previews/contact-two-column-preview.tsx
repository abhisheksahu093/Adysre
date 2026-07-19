'use client';

import { useId, type FormEvent } from 'react';

/**
 * Live preview for `contact-two-column`.
 *
 * Mirrors the `typescript` code variant. Keep this in step with
 * `src/data/components/contact.ts`.
 */
interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

interface ContactTwoColumnProps {
  title?: string;
  description?: string;
  note?: string;
  submitLabel?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

function ContactTwoColumn({
  title = "Let's talk",
  description = "Whether it's a question, a project, or just feedback, drop us a line and a real person will get back to you.",
  note = 'Typically replies within a day',
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactTwoColumnProps) {
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
    <section className={`mx-auto grid w-full max-w-5xl items-start gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 sm:py-16 ${className}`}>
      <div className="md:pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
        {description ? <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">{description}</p> : null}
        {note ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />{note}
          </p>
        ) : null}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
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
    </section>
  );
}

export const minHeight = 620;

export default function ContactTwoColumnPreview() {
  return <ContactTwoColumn />;
}
