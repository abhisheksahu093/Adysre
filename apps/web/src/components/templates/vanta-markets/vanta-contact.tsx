'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { VANTA_CONTACT_PAGE } from '@/data/templates/vanta-markets-content';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - the contact section.
 *
 * Front-end only by design: it validates with the platform's own constraints
 * and confirms in place, leaving the visitor one obvious edit (point `onSubmit`
 * at a CRM or an inbox) rather than a dead button. The confirmation is
 * announced through `aria-live`, since nothing about it moves focus, and it
 * says outright that nothing was sent - a fake "we have your message" on a page
 * dressed as a broker would be the one genuinely harmful string here.
 */
export function VantaContact({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const fieldClass =
    'mt-3 w-full rounded-[var(--vanta-radius-xs)] border border-[var(--vanta-line-strong)] bg-[var(--vanta-ink)] px-4 py-3.5 text-[15px] text-[var(--vanta-text)] outline-none transition-colors placeholder:text-[var(--vanta-faint)] focus:border-[var(--vanta-brand)]';

  return (
    <section className="border-b border-[var(--vanta-line)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="vanta-eyebrow">{contact.eyebrow}</p>
            <span className="vanta-rule mt-5" aria-hidden />
            <h2 className="vanta-display-sm mt-7 text-balance">{contact.title}</h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.9] text-[var(--vanta-muted)]">
              {contact.subtitle}
            </p>

            <dl className="mt-10 divide-y divide-[var(--vanta-line)] border-y border-[var(--vanta-line)]">
              {contact.details.map((detail) => (
                <div key={detail.label} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="vanta-label">{detail.label}</dt>
                  <dd className="vanta-mono text-right text-[15px]">{detail.value}</dd>
                </div>
              ))}
            </dl>

            <p className="vanta-eyebrow mt-14">{VANTA_CONTACT_PAGE.officesEyebrow}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {VANTA_CONTACT_PAGE.offices.map((office) => (
                <div key={office.name} className="border-l border-[var(--vanta-brand)] pl-5">
                  <h3 className="text-base font-semibold">{office.name}</h3>
                  <address className="mt-2 text-[15px] not-italic leading-relaxed text-[var(--vanta-muted)]">
                    {office.address}
                  </address>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--vanta-faint)]">
                    {office.hours}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="vanta-card vanta-card-lg p-8 sm:p-10">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="vanta-label">{contact.fields.name}</span>
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className="vanta-label">{contact.fields.email}</span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className={fieldClass}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="vanta-label">{contact.fields.message}</span>
                  <textarea name="message" required rows={6} className={`resize-y ${fieldClass}`} />
                </label>
              </div>

              <button
                type="submit"
                className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--vanta-brand)] px-7 py-4 text-sm font-semibold text-[var(--vanta-ink)] transition-transform hover:-translate-y-0.5"
              >
                {sent ? VANTA_CONTACT_PAGE.sentTitle : contact.submit}
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
                className="mt-5 min-h-12 text-center text-[13px] leading-relaxed text-[var(--vanta-faint)]"
              >
                {sent ? VANTA_CONTACT_PAGE.sentBody : ''}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
