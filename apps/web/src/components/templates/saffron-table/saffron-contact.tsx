'use client';

import { useState, type FormEvent } from 'react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './saffron-reveal';

/**
 * SAFFRON - reservations. Front-end only by design: it validates with the
 * platform's own constraints and confirms in place, leaving one obvious edit
 * (point `onSubmit` at a booking provider) rather than a dead button.
 */
export function SaffronContact({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const fieldClass =
    'w-full border-b border-[var(--saf-rule)] bg-transparent py-3 text-[16px] text-[var(--saf-ink)] outline-none transition-colors placeholder:text-[var(--saf-ink-faint)] focus:border-[var(--saf-accent)]';

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <p className="saf-eyebrow">{contact.eyebrow}</p>
          <span className="saf-rule mt-4" aria-hidden />
          <h2 className="mt-6 text-balance text-4xl leading-[1.15] tracking-[-0.01em] sm:text-5xl">
            {contact.title}
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-[1.85] text-[var(--saf-ink-soft)]">
            {contact.subtitle}
          </p>

          <dl className="mt-12 divide-y divide-[var(--saf-rule)] border-y border-[var(--saf-rule)]">
            {contact.details.map((detail) => (
              <div key={detail.label} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="text-[11px] uppercase tracking-[0.24em] text-[var(--saf-ink-faint)]">
                  {detail.label}
                </dt>
                <dd className="text-right text-[16px]">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.12}>
          <form onSubmit={onSubmit} className="saf-frame p-8 sm:p-10">
            <div className="grid gap-7">
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--saf-ink-faint)]">
                  {contact.fields.name}
                </span>
                <input type="text" name="name" required autoComplete="name" className={fieldClass} />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--saf-ink-faint)]">
                  {contact.fields.email}
                </span>
                <input type="email" name="email" required autoComplete="email" className={fieldClass} />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--saf-ink-faint)]">
                  {contact.fields.message}
                </span>
                <textarea name="message" required rows={4} className={`resize-y ${fieldClass}`} />
              </label>
            </div>

            <button
              type="submit"
              className="mt-9 w-full bg-[var(--saf-ink)] px-8 py-4 text-xs uppercase tracking-[0.22em] text-[var(--saf-paper)] transition-colors hover:bg-[var(--saf-accent)]"
            >
              {sent ? 'Request received' : contact.submit}
            </button>

            <p
              aria-live="polite"
              className="mt-4 min-h-5 text-center text-[13px] text-[var(--saf-ink-faint)]"
            >
              {sent ? 'Thank you. We will confirm your table within the day.' : ''}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
