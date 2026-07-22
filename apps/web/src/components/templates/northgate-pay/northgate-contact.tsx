'use client';

import { useState, type FormEvent } from 'react';
import type { TemplateContent } from '@/data/templates/types';
import { NORTHGATE_LABELS } from '@/data/templates/northgate-pay-content';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the sales enquiry form.
 *
 * Front-end only on purpose: it validates with the platform's own constraints
 * and confirms in place, leaving the owner one obvious edit (point `onSubmit`
 * at their endpoint) rather than a dead action. The confirmation is announced
 * through an `aria-live` region, so it is heard as well as seen.
 *
 * SAFETY, and non-negotiable for a payments brand: three fields only - name,
 * work email, free text. Nothing here asks for a card number, an account
 * number or a sort code, no field carries a `cc-*` autocomplete token, and the
 * notice beneath says in plain words that the form is not for those details.
 * A payments company's own site is exactly where a phishing page would be
 * imitated, so the template must not model one.
 */
export function NorthgateContact({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const fieldClass = 'ngp-field ngp-mono mt-2.5 w-full px-5 py-3.5 text-[15px] outline-none';
  const labelClass = 'text-[12.5px] text-[var(--ngp-ink-faint)]';

  return (
    <section className="border-b border-[var(--ngp-rule)] bg-[var(--ngp-bg-2)]">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="ngp-eyebrow">{contact.eyebrow}</p>
          <h2 className="ngp-display ngp-display-lg mt-6">{contact.title}</h2>
          <p className="mt-6 max-w-lg text-pretty text-[15.5px] leading-[1.8] text-[var(--ngp-ink-soft)]">
            {contact.subtitle}
          </p>

          <dl className="mt-12 border-t border-[var(--ngp-rule)]">
            {contact.details.map((detail) => (
              <div key={detail.label} className="border-b border-[var(--ngp-rule)] py-5">
                <dt className={labelClass}>{detail.label}</dt>
                <dd className="ngp-mono mt-2 text-[14.5px] leading-relaxed">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="ngp-card ngp-card-lg p-8 sm:p-10">
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

            <button
              type="submit"
              className="mt-9 w-full rounded-full bg-[var(--ngp-ink)] px-6 py-3.5 text-[14px] text-[var(--ngp-bg)] transition-opacity hover:opacity-85"
            >
              {sent ? NORTHGATE_LABELS.formSent : contact.submit}
            </button>

            <p
              aria-live="polite"
              className="mt-4 min-h-5 text-center text-[13px] text-[var(--ngp-indigo-deep)]"
            >
              {sent ? NORTHGATE_LABELS.formSuccess : ''}
            </p>

            <p className="mt-5 border-t border-[var(--ngp-rule)] pt-5 text-[12.5px] leading-[1.8] text-[var(--ngp-ink-faint)]">
              {NORTHGATE_LABELS.formNotice}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
