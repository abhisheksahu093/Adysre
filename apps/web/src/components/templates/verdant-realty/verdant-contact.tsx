'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { VERDANT_CONTACT_PAGE } from '@/data/templates/verdant-realty-content';
import { Reveal } from './verdant-reveal';

/**
 * VERDANT - the contact page.
 *
 * Front-end only by design: it validates with the platform's own constraints
 * and confirms in place, leaving the visitor one obvious edit (point `onSubmit`
 * at a CRM or an inbox) rather than a dead button. The confirmation is
 * announced through `aria-live`, since nothing about it moves focus.
 */
export function VerdantContact({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const fieldClass =
    'mt-2 w-full rounded-[var(--verdant-radius-sm)] border border-[var(--verdant-rule-strong)] bg-[var(--verdant-sand)] px-4 py-3 text-[15px] text-[var(--verdant-ink)] outline-none transition-colors placeholder:text-[var(--verdant-ink-faint)] focus:border-[var(--verdant-brass)]';

  const labelClass = 'text-[11px] uppercase tracking-[0.2em] text-[var(--verdant-ink-faint)]';

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal>
          <p className="verdant-eyebrow">{contact.eyebrow}</p>
          <span className="verdant-rule mt-4" aria-hidden />
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
            {contact.title}
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-[1.8] text-[var(--verdant-ink-soft)]">
            {contact.subtitle}
          </p>

          <dl className="mt-10 divide-y divide-[var(--verdant-rule)] border-y border-[var(--verdant-rule)]">
            {contact.details.map((detail) => (
              <div key={detail.label} className="flex items-baseline justify-between gap-6 py-4">
                <dt className={labelClass}>{detail.label}</dt>
                <dd className="verdant-figures text-right text-[15px]">{detail.value}</dd>
              </div>
            ))}
          </dl>

          <p className="verdant-eyebrow mt-12">{VERDANT_CONTACT_PAGE.officesEyebrow}</p>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {VERDANT_CONTACT_PAGE.offices.map((office) => (
              <li key={office.name} className="border-l-2 border-[var(--verdant-brass)] pl-5">
                <h2 className="text-base font-semibold">{office.name}</h2>
                <address className="mt-2 text-[15px] not-italic leading-relaxed text-[var(--verdant-ink-soft)]">
                  {office.address}
                </address>
                <p className="mt-2 text-sm leading-relaxed text-[var(--verdant-ink-faint)]">
                  {office.hours}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="verdant-card p-7 sm:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>{contact.fields.name}</span>
                <input type="text" name="name" required autoComplete="name" className={fieldClass} />
              </label>
              <label className="block">
                <span className={labelClass}>{contact.fields.email}</span>
                <input type="email" name="email" required autoComplete="email" className={fieldClass} />
              </label>
              <label className="block sm:col-span-2">
                <span className={labelClass}>{contact.fields.message}</span>
                <textarea name="message" required rows={5} className={`resize-y ${fieldClass}`} />
              </label>
            </div>

            <button
              type="submit"
              className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--verdant-forest)] px-7 py-3.5 text-sm font-semibold text-[var(--verdant-on-forest)] transition-colors hover:bg-[var(--verdant-brass)] hover:text-[var(--verdant-forest-deep)]"
            >
              {sent ? VERDANT_CONTACT_PAGE.sentTitle : contact.submit}
              {sent ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              )}
            </button>

            <p
              aria-live="polite"
              className="mt-4 min-h-10 text-center text-[13px] leading-relaxed text-[var(--verdant-ink-faint)]"
            >
              {sent ? VERDANT_CONTACT_PAGE.sentBody : ''}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
