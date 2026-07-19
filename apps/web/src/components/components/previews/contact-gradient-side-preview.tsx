'use client';

import { useId, type FormEvent } from 'react';

/**
 * Live preview for `contact-gradient-side`.
 *
 * Mirrors the `typescript` code variant. Keep this in step with
 * `src/data/components/contact.ts`.
 */
interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

interface ContactGradientSideProps {
  panelTitle?: string;
  panelText?: string;
  submitLabel?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

function ContactGradientSide({
  panelTitle = "Let's build something",
  panelText = "Tell us about your project. We'll come back with next steps, not a sales script.",
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactGradientSideProps) {
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
    <section className={`mx-auto w-full max-w-4xl px-4 py-12 sm:py-16 ${className}`}>
      <div className="grid overflow-hidden rounded-2xl border border-gray-200 md:grid-cols-2 dark:border-gray-800">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">{panelTitle}</h2>
          {panelText ? <p className="mt-3 text-sm leading-relaxed text-blue-50">{panelText}</p> : null}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 sm:p-8 dark:bg-gray-950">
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
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
        </form>
      </div>
    </section>
  );
}

export const minHeight = 660;

export default function ContactGradientSidePreview() {
  return <ContactGradientSide />;
}
