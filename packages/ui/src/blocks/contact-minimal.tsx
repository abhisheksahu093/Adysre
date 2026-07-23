'use client';

import { useId, type FormEvent } from 'react';

/**
 * Live preview for `contact-minimal`.
 *
 * Mirrors the `typescript` code variant. Keep this in step with
 * `src/data/components/contact.ts`.
 */
interface MinimalContactValues {
  email: string;
  message: string;
}

interface ContactMinimalProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (values: MinimalContactValues) => void;
  className?: string;
}

export function ContactMinimal({
  title = 'Drop us a line',
  submitLabel = 'Send',
  onSubmit = () => {},
  className = '',
}: ContactMinimalProps) {
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
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={`mx-auto w-full max-w-sm px-4 py-10 ${className}`}>
      <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label htmlFor={emailId} className={label}>Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
        </div>
        <div>
          <label htmlFor={messageId} className={label}>Message</label>
          <textarea id={messageId} name="message" rows={3} required className={`${field} resize-y`} />
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
      </form>
    </section>
  );
}

export const minHeight = 340;

export default function ContactMinimalPreview() {
  return <ContactMinimal />;
}
