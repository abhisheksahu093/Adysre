'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, CircleCheck } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './pulse-reveal';

/**
 * PULSE - booking request. Front-end only by design: it validates with the
 * platform's own constraints and confirms in place, leaving the practice one
 * obvious edit (point `onSubmit` at a booking provider) rather than a dead
 * button.
 *
 * The confirmation replaces the form inside an `aria-live` region and is built
 * from the same content strings, so a visitor using a screen reader hears the
 * practice's phone number at exactly the moment sighted visitors see it.
 */
export function PulseContact({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const labelClass = 'text-[13px] font-medium text-[var(--pulse-ink-faint)]';
  const fieldClass = 'pulse-field mt-2 px-5 py-3.5 text-[15px]';

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <Reveal>
          <p className="pulse-eyebrow">{contact.eyebrow}</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.2] tracking-[-0.02em] sm:text-4xl">
            {contact.title}
          </h2>
          <p className="mt-5 text-[16px] leading-[1.8] text-[var(--pulse-ink-soft)]">{contact.subtitle}</p>

          <dl className="mt-10 grid gap-3">
            {contact.details.map((detail) => (
              <div
                key={detail.label}
                className="flex flex-wrap items-baseline justify-between gap-3 rounded-2xl bg-[var(--pulse-surface)] px-5 py-4"
              >
                <dt className="text-[13px] font-medium text-[var(--pulse-ink-faint)]">{detail.label}</dt>
                <dd className="text-[15px] font-medium">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <div aria-live="polite">
            {sent ? (
              <div className="pulse-card p-8 text-center sm:p-10">
                <span className="pulse-tile pulse-tile-mint mx-auto grid h-14 w-14 place-items-center">
                  <CircleCheck className="h-7 w-7" aria-hidden />
                </span>
                <p className="mt-6 text-xl font-semibold tracking-[-0.01em]">{contact.title}</p>
                <p className="mt-4 text-[15px] leading-[1.8] text-[var(--pulse-ink-soft)]">
                  {contact.subtitle}
                </p>
                <dl className="mt-8 grid gap-2 text-left">
                  {contact.details.slice(0, 2).map((detail) => (
                    <div
                      key={detail.label}
                      className="flex flex-wrap items-baseline justify-between gap-3 rounded-2xl bg-[var(--pulse-surface)] px-5 py-4"
                    >
                      <dt className="text-[13px] font-medium text-[var(--pulse-ink-faint)]">
                        {detail.label}
                      </dt>
                      <dd className="text-[15px] font-medium">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="pulse-card p-7 sm:p-9">
                <div className="grid gap-5">
                  <label className="block">
                    <span className={labelClass}>{contact.fields.name}</span>
                    <input type="text" name="name" required autoComplete="name" className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className={labelClass}>{contact.fields.email}</span>
                    <input type="email" name="email" required autoComplete="email" className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className={labelClass}>{contact.fields.message}</span>
                    <textarea name="message" required rows={5} className={`resize-y ${fieldClass}`} />
                  </label>
                </div>

                <button
                  type="submit"
                  className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--pulse-accent)] px-7 py-4 text-[15px] font-semibold text-[var(--pulse-on-accent)] shadow-[var(--pulse-shadow-lift)] transition-transform hover:-translate-y-0.5"
                >
                  {contact.submit}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
