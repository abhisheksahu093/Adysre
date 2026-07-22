'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './aurora-reveal';

/**
 * AURORA - contact. The form is deliberately front-end only: it validates with
 * the platform's own constraints and confirms in place, leaving the visitor one
 * obvious edit (point `onSubmit` at their endpoint) rather than a dead action.
 *
 * The confirmation quotes the studio's first contact detail instead of a canned
 * sentence, because this component owns no copy - every user-facing string on
 * the page comes out of the content module.
 */
export function AuroraContact({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);
  const reply = contact.details[0];

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const fieldClass =
    'w-full border-2 border-[var(--aurora-line-strong)] bg-[var(--aurora-bg)] px-4 py-3.5 text-[15px] text-[var(--aurora-text)] outline-none transition-colors placeholder:text-[var(--aurora-faint)] focus:border-[var(--aurora-acid)]';

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="aurora-tag text-[10px] text-[var(--aurora-acid)]">{contact.eyebrow}</p>
          <h2 className="aurora-display mt-5 text-6xl sm:text-7xl">{contact.title}</h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--aurora-muted)]">
            {contact.subtitle}
          </p>

          <dl className="mt-10 border-t-2 border-[var(--aurora-line)]">
            {contact.details.map((detail) => (
              <div key={detail.label} className="border-b-2 border-[var(--aurora-line)] py-4">
                <dt className="aurora-tag text-[10px] text-[var(--aurora-faint)]">{detail.label}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="aurora-crate p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="aurora-tag text-[10px] text-[var(--aurora-faint)]">
                  {contact.fields.name}
                </span>
                <input type="text" name="name" required autoComplete="name" className={`mt-2.5 ${fieldClass}`} />
              </label>
              <label className="block">
                <span className="aurora-tag text-[10px] text-[var(--aurora-faint)]">
                  {contact.fields.email}
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className={`mt-2.5 ${fieldClass}`}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="aurora-tag text-[10px] text-[var(--aurora-faint)]">
                  {contact.fields.message}
                </span>
                <textarea name="message" required rows={5} className={`mt-2.5 resize-y ${fieldClass}`} />
              </label>
            </div>

            <button
              type="submit"
              className="aurora-tag group mt-7 inline-flex w-full items-center justify-center gap-2.5 bg-[var(--aurora-acid)] px-7 py-4 text-xs text-[var(--aurora-on-acid)] transition-colors hover:bg-[var(--aurora-text)]"
            >
              {contact.submit}
              {sent ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              )}
            </button>

            <p
              aria-live="polite"
              className="aurora-tag mt-4 min-h-4 text-center text-[10px] text-[var(--aurora-acid)]"
            >
              {sent && reply ? `${reply.label} — ${reply.value}` : ''}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
