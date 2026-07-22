'use client';

import { useState, type FormEvent } from 'react';
import type { TemplateContent } from '@/data/templates/types';
import { PINNACLE_LABELS } from '@/data/templates/pinnacle-advisory-content';
import { Reveal } from './pinnacle-reveal';

/**
 * PINNACLE - the enquiry form.
 *
 * Front-end only on purpose: it validates with the platform's own constraints
 * and confirms in place, leaving the owner one obvious edit (point `onSubmit` at
 * their endpoint) rather than a dead action. The confirmation is announced
 * through an `aria-live` region, so it is heard as well as seen, and the live
 * region is present from first render - injecting one at the moment it changes
 * is the classic way to make an announcement not happen.
 */
export function PinnacleContact({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const fieldClass = 'pin-field mt-2.5 px-5 py-3.5';
  const labelClass = 'text-[0.8125rem] font-[550] text-[var(--pin-text-soft)]';

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-[80rem] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="pin-eyebrow">{contact.eyebrow}</p>
          <h2 className="pin-h2 mt-6">{contact.title}</h2>
          <p className="pin-body mt-6 text-[var(--pin-text-muted)]">{contact.subtitle}</p>

          <dl className="mt-10 border-t border-[var(--pin-line)]">
            {contact.details.map((detail) => (
              <div key={detail.label} className="border-b border-[var(--pin-line)] py-5">
                <dt className="pin-eyebrow">{detail.label}</dt>
                <dd className="mt-2.5 text-[0.9375rem] leading-[1.55]">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={onSubmit}
            className="rounded-[var(--pin-r-lg)] border border-[var(--pin-line)] bg-[var(--pin-sand-2)] p-8 sm:p-10"
          >
            <div className="grid gap-6">
              <label className="block">
                <span className={labelClass}>{contact.fields.name}</span>
                <input type="text" name="name" required autoComplete="name" className={fieldClass} />
              </label>

              <label className="block">
                <span className={labelClass}>{contact.fields.email}</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <span className={labelClass}>{contact.fields.message}</span>
                <textarea name="message" required rows={6} className={`${fieldClass} resize-y`} />
              </label>
            </div>

            <button type="submit" className="pin-btn pin-btn-primary mt-8 inline-flex w-full">
              {sent ? PINNACLE_LABELS.formSent : contact.submit}
            </button>

            <p
              aria-live="polite"
              className="mt-4 min-h-5 text-center text-[0.875rem] text-[var(--pin-brand-ink)]"
            >
              {sent ? PINNACLE_LABELS.formSuccess : ''}
            </p>

            <p className="mt-5 border-t border-[var(--pin-line)] pt-5 text-[0.8125rem] leading-[1.6] text-[var(--pin-text-faint)]">
              {PINNACLE_LABELS.formNotice}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
