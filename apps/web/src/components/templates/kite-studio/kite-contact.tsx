'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { KITE_CONTACT_PAGE } from '@/data/templates/kite-studio-content';
import { Reveal } from './kite-reveal';

/**
 * KITE - the enquiry form and the two studios.
 *
 * Front-end only by design: it validates with the platform's own constraints and
 * confirms in place, leaving the visitor one obvious edit (point `onSubmit` at a
 * CRM or an inbox) rather than a dead button. The confirmation is announced
 * through `aria-live`, because nothing about it moves focus.
 *
 * The budget select is here rather than in the shared `contact` block: a
 * studio that publishes prices should ask the question on the form, and it is
 * this template's field, not every template's.
 */
export function KiteContact({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const fieldClass =
    'mt-3 w-full rounded-2xl border border-[var(--kite-line-strong)] bg-[var(--kite-void)] px-5 py-3.5 text-[15px] text-[var(--kite-paper)] outline-none transition-colors placeholder:text-[var(--kite-paper-faint)] focus:border-[var(--kite-acid)]';

  const labelClass = 'text-[11px] uppercase tracking-[0.2em] text-[var(--kite-paper-faint)]';

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="kite-eyebrow">{contact.eyebrow}</p>
          <h2 className="kite-display-sm mt-6">{contact.title}</h2>
          <p className="mt-7 max-w-md text-[15px] leading-[1.8] text-[var(--kite-paper-soft)]">
            {contact.subtitle}
          </p>

          <dl className="mt-12 divide-y divide-[var(--kite-line)] border-y border-[var(--kite-line)]">
            {contact.details.map((detail) => (
              <div key={detail.label} className="flex items-baseline justify-between gap-6 py-5">
                <dt className={labelClass}>{detail.label}</dt>
                <dd className="kite-figures text-right text-[15px]">{detail.value}</dd>
              </div>
            ))}
          </dl>

          <p className="kite-eyebrow mt-14">{KITE_CONTACT_PAGE.studiosEyebrow}</p>
          <ul className="mt-7 grid gap-8 sm:grid-cols-2">
            {KITE_CONTACT_PAGE.studios.map((studio) => (
              <li key={studio.name} className="border-l-2 border-[var(--kite-magenta)] pl-6">
                <h3 className="text-lg font-bold tracking-[-0.02em]">{studio.name}</h3>
                <address className="mt-3 text-[15px] not-italic leading-relaxed text-[var(--kite-paper-soft)]">
                  {studio.address}
                </address>
                <p className="mt-3 text-sm leading-relaxed text-[var(--kite-paper-faint)]">
                  {studio.hours}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="kite-panel-lg px-7 py-9 sm:px-11 sm:py-12">
            <div className="grid gap-6 sm:grid-cols-2">
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
              <label className="block sm:col-span-2">
                <span className={labelClass}>{KITE_CONTACT_PAGE.budgetLabel}</span>
                <select name="budget" required defaultValue="" className={fieldClass}>
                  {/* An empty, disabled first option keeps `required` meaningful. */}
                  <option value="" disabled>
                    {KITE_CONTACT_PAGE.budgetLabel}
                  </option>
                  {KITE_CONTACT_PAGE.budgetOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className={labelClass}>{contact.fields.message}</span>
                <textarea name="message" required rows={6} className={`resize-y ${fieldClass}`} />
              </label>
            </div>

            <button
              type="submit"
              className="kite-pill-hot mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold"
            >
              {sent ? KITE_CONTACT_PAGE.sentTitle : contact.submit}
              {sent ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              )}
            </button>

            <p
              aria-live="polite"
              className="mt-5 min-h-10 text-center text-[13px] leading-relaxed text-[var(--kite-paper-faint)]"
            >
              {sent ? KITE_CONTACT_PAGE.sentBody : ''}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
