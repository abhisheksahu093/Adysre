'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './nova-reveal';

/**
 * NOVA - contact. The form is deliberately front-end only: it validates with
 * the platform's own constraints and confirms in place, leaving the visitor one
 * obvious edit (point `onSubmit` at their endpoint) rather than a dead action.
 */
export function NovaContact({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const fieldClass =
    'w-full rounded-[var(--nova-radius-sm)] border border-[var(--nova-line-strong)] bg-[var(--nova-bg)] px-4 py-3 text-[15px] text-[var(--nova-text)] outline-none transition-colors placeholder:text-[var(--nova-faint)] focus:border-[var(--nova-accent)]';

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="nova-mono text-[10px] text-[var(--nova-accent-2)]">{contact.eyebrow}</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            {contact.title}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--nova-muted)]">{contact.subtitle}</p>

          <dl className="mt-10 space-y-5">
            {contact.details.map((detail) => (
              <div key={detail.label}>
                <dt className="nova-mono text-[10px] text-[var(--nova-faint)]">{detail.label}</dt>
                <dd className="mt-1.5 text-[15px]">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="nova-card p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-1">
                <span className="nova-mono text-[10px] text-[var(--nova-faint)]">{contact.fields.name}</span>
                <input type="text" name="name" required autoComplete="name" className={`mt-2 ${fieldClass}`} />
              </label>
              <label className="block sm:col-span-1">
                <span className="nova-mono text-[10px] text-[var(--nova-faint)]">{contact.fields.email}</span>
                <input type="email" name="email" required autoComplete="email" className={`mt-2 ${fieldClass}`} />
              </label>
              <label className="block sm:col-span-2">
                <span className="nova-mono text-[10px] text-[var(--nova-faint)]">
                  {contact.fields.message}
                </span>
                <textarea name="message" required rows={4} className={`mt-2 resize-y ${fieldClass}`} />
              </label>
            </div>

            <button
              type="submit"
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--nova-accent)] to-[#5b8cff] px-6 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            >
              {sent ? 'Message sent' : contact.submit}
              {sent ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              )}
            </button>

            <p aria-live="polite" className="mt-3 min-h-5 text-center text-[13px] text-[var(--nova-faint)]">
              {sent ? 'Thanks - we reply within one business day.' : ''}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
