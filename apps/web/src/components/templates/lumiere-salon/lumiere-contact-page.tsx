'use client';

import { useLumiereSettings } from './lumiere-settings';
import { useState, type FormEvent } from 'react';
import type { TemplateContent } from '@/data/templates/types';
import { LumiereHairline } from './lumiere-hairline';
import { LumiereMasthead } from './lumiere-masthead';
import { Reveal } from './lumiere-reveal';

/**
 * LUMIERE - visit and contact.
 *
 * The message form on the left, opening hours and travel notes on the right.
 * Hours are a definition list rather than a table: seven day/time pairs are a
 * list of terms, and a table would add row and column semantics that carry no
 * extra meaning.
 *
 * Like the booking form this is front-end only - `preventDefault`, then a live
 * confirmation. The three fields come from the shared `TemplateContent.contact`
 * block so every template's contact form has the same shape.
 */
export function LumiereContactPage({ content }: { content: TemplateContent }) {
  const { data } = useLumiereSettings();
  const { contact: copy, common } = data.salon;
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <>
      <LumiereMasthead copy={copy.masthead} />

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10 sm:py-20">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <form onSubmit={onSubmit} className="lumi-panel px-8 py-10 sm:px-12">
              <h2 className="lumi-subtitle">{copy.formTitle}</h2>

              <p className="mt-4 max-w-md text-[15px] leading-[1.8] text-[var(--lumi-ink-soft)]">
                {contact.subtitle}
              </p>

              <div className="mt-9 space-y-7">
                <div>
                  <label htmlFor="lumiere-contact-name" className="lumi-label">
                    {contact.fields.name}
                  </label>
                  <input
                    id="lumiere-contact-name"
                    name="lumiere-contact-name"
                    type="text"
                    autoComplete="name"
                    required
                    className="lumi-field mt-2"
                  />
                </div>

                <div>
                  <label htmlFor="lumiere-contact-email" className="lumi-label">
                    {contact.fields.email}
                  </label>
                  <input
                    id="lumiere-contact-email"
                    name="lumiere-contact-email"
                    type="email"
                    autoComplete="email"
                    required
                    className="lumi-field mt-2"
                  />
                </div>

                <div>
                  <label htmlFor="lumiere-contact-message" className="lumi-label">
                    {contact.fields.message}
                  </label>
                  <textarea
                    id="lumiere-contact-message"
                    name="lumiere-contact-message"
                    rows={5}
                    required
                    className="lumi-field mt-2"
                  />
                </div>
              </div>

              <button type="submit" className="lumi-btn lumi-btn--solid mt-9 w-full sm:w-auto">
                {contact.submit}
              </button>

              <p
                aria-live="polite"
                className="mt-6 min-h-[1.5rem] text-[15px] leading-[1.75] text-[var(--lumi-accent-deep)]"
              >
                {sent ? common.demoNotice : ''}
              </p>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-12">
              <div>
                <h2 className="lumi-subtitle">{copy.hoursTitle}</h2>
                <dl className="mt-7 space-y-3">
                  {copy.hours.map((entry) => (
                    <div
                      key={entry.day}
                      className="flex items-baseline justify-between gap-6 pb-3 shadow-[inset_0_-1px_0_var(--lumi-rule)]"
                    >
                      <dt className="text-[15px]">{entry.day}</dt>
                      <dd className="lumi-num text-[15px] text-[var(--lumi-ink-soft)]">
                        {entry.open}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <LumiereHairline className="w-full max-w-xs" />

              <div>
                <h2 className="lumi-subtitle">{contact.title}</h2>
                <dl className="mt-7 space-y-4">
                  {contact.details.map((detail) => (
                    <div key={detail.label} className="flex gap-4">
                      <dt className="lumi-label w-28 shrink-0 pt-0.5">{detail.label}</dt>
                      <dd className="text-[15px] leading-[1.7]">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <h2 className="lumi-subtitle">{copy.gettingHereTitle}</h2>
                <ul className="mt-7 space-y-4">
                  {copy.gettingHere.map((line) => (
                    <li key={line} className="flex gap-3 text-[15px] leading-[1.75]">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--lumi-accent)]"
                      />
                      <span className="text-[var(--lumi-ink-soft)]">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
