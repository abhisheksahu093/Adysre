'use client';

import { useState, type FormEvent } from 'react';
import { LUMEN_SHOP } from '@/data/templates/lumen-store-content';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './lumen-reveal';
import { LumenSectionHeading } from './lumen-section-heading';

/**
 * LUMEN - visit the workshop.
 *
 * Front-end only, like every form in this template: `preventDefault` and an
 * `aria-live` confirmation, leaving one obvious edit (point `onSubmit` at a real
 * endpoint) rather than a button that appears to work and does not.
 */
export function LumenContact({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-[var(--lum-rule)] bg-[var(--lum-paper-2)]"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 sm:px-10 sm:py-28 lg:grid-cols-2 lg:gap-20">
        <div>
          <LumenSectionHeading
            eyebrow={contact.eyebrow}
            title={contact.title}
            subtitle={contact.subtitle}
          />

          <Reveal delay={0.1}>
            <dl className="mt-12 divide-y divide-[var(--lum-rule)] border-y border-[var(--lum-rule)]">
              {contact.details.map((detail) => (
                <div key={detail.label} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="lum-label">{detail.label}</dt>
                  <dd className="text-right text-[15px]">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.14}>
          <form onSubmit={onSubmit} className="lum-panel p-7 sm:p-9">
            <div className="grid gap-6">
              <div>
                <label htmlFor="lum-contact-name" className="lum-label">
                  {contact.fields.name}
                </label>
                <input
                  id="lum-contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="lum-field mt-2"
                />
              </div>

              <div>
                <label htmlFor="lum-contact-email" className="lum-label">
                  {contact.fields.email}
                </label>
                <input
                  id="lum-contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="lum-field mt-2"
                />
              </div>

              <div>
                <label htmlFor="lum-contact-message" className="lum-label">
                  {contact.fields.message}
                </label>
                <textarea
                  id="lum-contact-message"
                  name="message"
                  required
                  rows={4}
                  className="lum-field mt-2 resize-y"
                />
              </div>
            </div>

            <button type="submit" className="lum-btn lum-btn--solid mt-8 w-full">
              {contact.submit}
            </button>

            <p
              aria-live="polite"
              className="mt-4 min-h-5 text-center text-[13px] text-[var(--lum-ink-faint)]"
            >
              {sent ? LUMEN_SHOP.common.contactSent : ''}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
