'use client';

import { useState, type FormEvent } from 'react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './atelier-reveal';

/**
 * ATELIER NORD - enquiries.
 *
 * Front-end only by design: the form validates with the platform's own
 * constraints and confirms in place, leaving the visitor one obvious edit
 * (point `onSubmit` at their endpoint) rather than a dead button.
 *
 * The confirmation sentence is the studio's stated reply time, read off the
 * last contact detail rather than written into the component - a template
 * whose copy lives in one file cannot also keep a sentence here.
 */
export function AtelierContact({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const acknowledgement = contact.details[contact.details.length - 1]?.value ?? '';

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const fieldClass =
    'w-full border-b border-[var(--atelier-rule)] bg-transparent pb-3 pt-2 text-[16px] font-light text-[var(--atelier-ink)] outline-none transition-colors duration-300 focus:border-[var(--atelier-ink)]';

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:px-10 sm:py-40">
      <div className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-16">
        <Reveal>
          <p className="atelier-label">{contact.eyebrow}</p>
          <span className="atelier-draw mt-6 max-w-24" aria-hidden />
        </Reveal>

        <div>
          <Reveal delay={0.08}>
            <h2 className="atelier-heading text-balance text-3xl sm:text-5xl">{contact.title}</h2>
            <p className="mt-8 max-w-xl text-[15px] font-light leading-[1.9] text-[var(--atelier-ink-soft)]">
              {contact.subtitle}
            </p>
          </Reveal>

          <div className="mt-20 grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <Reveal delay={0.14}>
              <form onSubmit={onSubmit}>
                <div className="grid gap-10">
                  <label className="block">
                    <span className="atelier-label">{contact.fields.name}</span>
                    <input type="text" name="name" required autoComplete="name" className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className="atelier-label">{contact.fields.email}</span>
                    <input type="email" name="email" required autoComplete="email" className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className="atelier-label">{contact.fields.message}</span>
                    <textarea name="message" required rows={4} className={`resize-y ${fieldClass}`} />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={sent}
                  className="atelier-label mt-12 w-fit border-b border-[var(--atelier-ink)] pb-2 text-[var(--atelier-ink)] transition-opacity duration-300 hover:opacity-55 disabled:opacity-40"
                >
                  {contact.submit}
                </button>

                <p
                  aria-live="polite"
                  className="mt-6 min-h-6 text-[13px] font-light leading-relaxed text-[var(--atelier-ink-soft)]"
                >
                  {sent ? acknowledgement : ''}
                </p>
              </form>
            </Reveal>

            <Reveal delay={0.2}>
              <dl className="border-t border-[var(--atelier-rule)]">
                {contact.details.map((detail) => (
                  <div key={detail.label} className="border-b border-[var(--atelier-rule)] py-5">
                    <dt className="atelier-label">{detail.label}</dt>
                    <dd className="mt-3 text-[15px] font-light leading-relaxed">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
