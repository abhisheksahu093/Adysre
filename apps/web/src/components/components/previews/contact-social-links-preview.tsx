'use client';

import { useId, type FormEvent } from 'react';

/**
 * Live preview for `contact-social-links`.
 *
 * Mirrors the `typescript` code variant. Keep this in step with
 * `src/data/components/contact.ts`.
 */
interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

type SocialName = 'x' | 'github' | 'linkedin';

interface SocialLink {
  name: SocialName;
  label: string;
  href: string;
}

function SocialGlyph({ name }: { name: SocialName }) {
  const cls = 'h-4 w-4';
  if (name === 'x') {
    return <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true"><path d="M18.9 1.2h3.7l-8 9.1 9.4 12.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.5h2L6.5 3.3H4.4l13.2 17.4Z" /></svg>;
  }
  if (name === 'github') {
    return <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.24 8.2H4.7V24H.24V8.2Zm7.4 0h4.27v2.16h.06c.6-1.13 2.06-2.32 4.24-2.32 4.54 0 5.38 2.99 5.38 6.87V24h-4.46v-7.24c0-1.73-.03-3.95-2.4-3.95-2.4 0-2.77 1.88-2.77 3.82V24H7.64V8.2Z" /></svg>;
}

const DEFAULT_SOCIALS: SocialLink[] = [
  { name: 'x', label: 'Follow us on X', href: '#' },
  { name: 'github', label: 'Follow us on GitHub', href: '#' },
  { name: 'linkedin', label: 'Follow us on LinkedIn', href: '#' },
];

interface ContactSocialLinksProps {
  title?: string;
  description?: string;
  socials?: SocialLink[];
  submitLabel?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

function ContactSocialLinks({
  title = 'Say hello',
  description = 'Fill in the form, or reach us on your platform of choice.',
  socials = DEFAULT_SOCIALS,
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactSocialLinksProps) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const iconLink =
    'flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100';

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
    <section className={`mx-auto w-full max-w-lg px-4 py-12 sm:py-16 ${className}`}>
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
      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Or find us</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mt-4 flex gap-2">
        {socials.map((social) => (
          <a key={social.label} href={social.href} aria-label={social.label} className={iconLink}>
            <SocialGlyph name={social.name} />
          </a>
        ))}
      </div>
    </section>
  );
}

export const minHeight = 620;

export default function ContactSocialLinksPreview() {
  return <ContactSocialLinks />;
}
