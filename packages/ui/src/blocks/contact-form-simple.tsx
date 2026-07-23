'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `contact-form-simple`.
 *
 * Mirrors the `typescript` code variant. Submit with an empty or bad field to
 * see the inline `role="alert"` errors wired by aria-invalid/aria-describedby.
 * Keep this in step with `src/data/components/contact.ts`.
 */
interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

interface ContactFormSimpleProps {
  title?: string;
  description?: string;
  submitLabel?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

export function ContactFormSimple({
  title = 'Get in touch',
  description = "Tell us what you need and we'll reply within one business day.",
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactFormSimpleProps) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values: ContactFormValues = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };
    const next: Partial<Record<keyof ContactFormValues, string>> = {};
    if (!values.name) next.name = 'Please enter your name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) next.email = 'Enter a valid email address.';
    if (values.message.length < 10) next.message = 'Your message needs at least 10 characters.';
    setErrors(next);
    if (Object.keys(next).length === 0) {
      onSubmit(values);
      form.reset();
    }
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400';

  return (
    <section className={`mx-auto w-full max-w-lg px-4 py-12 sm:py-16 ${className}`}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
      {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={nameId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input id={nameId} name="name" type="text" autoComplete="name" placeholder="Jane Doe"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className={`${field} ${errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}`} />
          {errors.name ? <p id={`${nameId}-error`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" placeholder="you@company.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            className={`${field} ${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}`} />
          {errors.email ? <p id={`${emailId}-error`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email}</p> : null}
        </div>
        <div>
          <label htmlFor={messageId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
          <textarea id={messageId} name="message" rows={4} placeholder="How can we help?"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? `${messageId}-error` : undefined}
            className={`${field} resize-y ${errors.message ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}`} />
          {errors.message ? <p id={`${messageId}-error`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.message}</p> : null}
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
          {submitLabel}
        </button>
      </form>
    </section>
  );
}

export const minHeight = 460;

export default function ContactFormSimplePreview() {
  return <ContactFormSimple />;
}
