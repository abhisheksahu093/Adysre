'use client';

import { useState, type FormEvent } from 'react';
import type { TemplateContent } from '@/data/templates/types';
import { MERIDIAN_LABELS } from '@/data/templates/meridian-law-content';
import { Reveal } from './meridian-reveal';

/**
 * MERIDIAN - the enquiry form on the contact page.
 *
 * Front-end only on purpose: it validates with the platform's own constraints
 * and confirms in place, leaving the owner one obvious edit (point `onSubmit`
 * at their endpoint) rather than a dead action. The confirmation is announced
 * through an `aria-live` region, so it is heard as well as seen.
 *
 * The disclaimer beside it is not decoration - a law firm's intake form has to
 * say that no attorney-client relationship has been created.
 */
export function MeridianContact({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const fieldClass = 'mer-field mt-2 w-full px-4 py-3 text-[15px] outline-none';
  const labelClass = 'text-[10px] uppercase tracking-[0.22em] text-[var(--mer-ink-faint)]';

  return (
    <section className="border-b border-[var(--mer-rule)] bg-[var(--mer-ivory-2)]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="mer-eyebrow">{contact.eyebrow}</p>
            <h2 className="mer-display mt-5 text-balance text-3xl sm:text-4xl">{contact.title}</h2>
            <span className="mer-hairline mt-6" aria-hidden />
            <p className="mt-6 text-[15px] leading-[1.9] text-[var(--mer-ink-soft)]">
              {contact.subtitle}
            </p>

            <dl className="mt-10 border-t border-[var(--mer-rule)]">
              {contact.details.map((detail) => (
                <div key={detail.label} className="border-b border-[var(--mer-rule)] py-5">
                  <dt className={labelClass}>{detail.label}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="mer-panel p-8 sm:p-10">
              <div className="grid gap-6">
                <label className="block">
                  <span className={labelClass}>{contact.fields.name}</span>
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    className={fieldClass}
                  />
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
                  <textarea name="message" required rows={5} className={`${fieldClass} resize-y`} />
                </label>
              </div>

              <button
                type="submit"
                className="mt-8 w-full border border-[var(--mer-gold)] bg-[var(--mer-gold)] px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-[var(--mer-navy)] transition-colors hover:bg-transparent hover:text-[var(--mer-ink)]"
              >
                {sent ? MERIDIAN_LABELS.formSent : contact.submit}
              </button>

              <p
                aria-live="polite"
                className="mt-4 min-h-5 text-center text-[13px] text-[var(--mer-gold-ink)]"
              >
                {sent ? MERIDIAN_LABELS.formSuccess : ''}
              </p>

              <p className="mt-4 border-t border-[var(--mer-rule)] pt-4 text-[12px] leading-[1.8] text-[var(--mer-ink-faint)]">
                {MERIDIAN_LABELS.formNotice}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
