'use client';

import { useId, type FormEvent } from 'react';

/**
 * Live preview for `contact-split-map`.
 *
 * Mirrors the `typescript` code variant. The map is inline SVG that recolours
 * for dark mode. Keep this in step with `src/data/components/contact.ts`.
 */
interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

interface ContactSplitMapProps {
  title?: string;
  description?: string;
  address?: string;
  submitLabel?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

function ContactSplitMap({
  title = 'Visit or message us',
  description = "We're at 24 Harbour Street. Send a note and we'll line up a time.",
  address = '24 Harbour Street',
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactSplitMapProps) {
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
    <section className={`mx-auto grid w-full max-w-5xl items-stretch gap-6 px-4 py-12 md:grid-cols-2 md:gap-10 sm:py-16 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
        {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
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
      <div className="relative min-h-[240px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" role="img" aria-label={`Map to ${address}`}>
          <rect width="400" height="320" className="fill-gray-100 dark:fill-gray-900" />
          <path d="M0 210 L400 150" fill="none" strokeWidth="26" className="stroke-blue-200 dark:stroke-blue-950" />
          <path d="M120 -10 L180 330" fill="none" strokeWidth="16" className="stroke-gray-200 dark:stroke-gray-800" />
          <path d="M-10 90 L410 40" fill="none" strokeWidth="10" className="stroke-gray-200 dark:stroke-gray-800" />
          <path d="M300 -10 L340 330" fill="none" strokeWidth="10" className="stroke-gray-200 dark:stroke-gray-800" />
          <circle cx="196" cy="150" r="46" className="fill-blue-500/10" />
          <path d="M196 98c-20 0-36 16-36 36 0 27 36 58 36 58s36-31 36-58c0-20-16-36-36-36z" className="fill-blue-600 dark:fill-blue-500" />
          <circle cx="196" cy="134" r="13" fill="#fff" />
        </svg>
        <p className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 backdrop-blur dark:bg-gray-900/90 dark:text-gray-200">{address}</p>
      </div>
    </section>
  );
}

export const minHeight = 720;

export default function ContactSplitMapPreview() {
  return <ContactSplitMap />;
}
