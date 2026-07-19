'use client';

import { useId, type FormEvent } from 'react';

/**
 * Live preview for `contact-with-details`.
 *
 * Mirrors the `typescript` code variant. Keep this in step with
 * `src/data/components/contact.ts`.
 */
interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

type DetailName = 'address' | 'phone' | 'email';

function DetailIcon({ name }: { name: DetailName }) {
  const cls = 'h-5 w-5';
  if (name === 'address') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  if (name === 'phone') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="m22 7-10 5L2 7" />
    </svg>
  );
}

interface ContactWithDetailsProps {
  title?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

function ContactWithDetails({
  title = 'Contact us',
  description = 'Prefer another channel? Reach us however suits you.',
  address = '24 Harbour Street, Lisbon',
  phone = '+351 21 000 0000',
  email = 'hello@example.com',
  onSubmit = () => {},
  className = '',
}: ContactWithDetailsProps) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const badge = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400';
  const cap = 'block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400';

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
        {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
        <ul className="mt-6 space-y-4">
          <li className="flex items-start gap-3">
            <span className={badge} aria-hidden="true"><DetailIcon name="address" /></span>
            <span><span className={cap}>Address</span><span className="text-sm text-gray-800 dark:text-gray-200">{address}</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className={badge} aria-hidden="true"><DetailIcon name="phone" /></span>
            <span><span className={cap}>Phone</span><a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="text-sm text-blue-700 hover:underline dark:text-blue-400">{phone}</a></span>
          </li>
          <li className="flex items-start gap-3">
            <span className={badge} aria-hidden="true"><DetailIcon name="email" /></span>
            <span><span className={cap}>Email</span><a href={`mailto:${email}`} className="text-sm text-blue-700 hover:underline dark:text-blue-400">{email}</a></span>
          </li>
        </ul>
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
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Send message</button>
      </form>
    </section>
  );
}

export const minHeight = 640;

export default function ContactWithDetailsPreview() {
  return <ContactWithDetails />;
}
