'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import {
  CADENCE_CONTACT_PAGE,
  CADENCE_COURSES,
} from '@/data/templates/cadence-academy-content';
import { Reveal } from './cadence-reveal';

/**
 * CADENCE - the enrolment page.
 *
 * Front-end only by design: it validates with the platform's own constraints
 * and confirms in place, leaving the visitor one obvious edit (point `onSubmit`
 * at a CRM or an inbox) rather than a dead button. The confirmation is
 * announced through `aria-live`, since nothing about it moves focus.
 *
 * There are deliberately no payment fields. A template that shipped a card form
 * would be a card form nobody wired to a processor, and the copy says out loud
 * that nothing is charged here.
 *
 * The course select is built from the catalogue rather than a second list, so
 * adding a course to `CADENCE_COURSES` adds it to this form too.
 */
export function CadenceEnrol({ content }: { content: TemplateContent }) {
  const { contact } = content;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const fieldClass =
    'mt-2 w-full rounded-[var(--cad-radius-sm)] bg-[var(--cad-cream)] px-5 py-3.5 text-[16px] text-[var(--cad-ink)] outline-none transition-shadow placeholder:text-[var(--cad-ink-faint)] focus:ring-2 focus:ring-[var(--cad-violet)]';

  const labelClass = 'text-[13px] font-bold text-[var(--cad-ink-soft)]';

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-16">
      <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <Reveal>
          <p className="cad-eyebrow">{CADENCE_CONTACT_PAGE.eyebrow}</p>
          <span className="cad-underline mt-4" aria-hidden />
          <h1 className="cad-display mt-7 text-balance">{contact.title}</h1>
          <p className="mt-7 max-w-md text-[17px] leading-[1.75] text-[var(--cad-ink-soft)]">
            {contact.subtitle}
          </p>

          <p className="cad-eyebrow mt-12">{CADENCE_CONTACT_PAGE.detailsEyebrow}</p>
          <dl className="mt-5 space-y-4">
            {contact.details.map((detail) => (
              <div
                key={detail.label}
                className="flex flex-wrap items-baseline justify-between gap-4 rounded-[var(--cad-radius-sm)] bg-[var(--cad-cream-warm)] px-6 py-4"
              >
                <dt className={labelClass}>{detail.label}</dt>
                <dd className="cad-figures text-[16px] font-semibold">{detail.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 space-y-5">
            {CADENCE_CONTACT_PAGE.officeHours.map((entry) => (
              <li key={entry.name} className="border-l-4 border-[var(--cad-lime)] pl-5">
                <h2 className="text-base font-bold">{entry.name}</h2>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--cad-ink-soft)]">
                  {entry.value}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="cad-panel p-8 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block" htmlFor="cadence-name">
                <span className={labelClass}>{contact.fields.name}</span>
                <input
                  id="cadence-name"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  className={fieldClass}
                />
              </label>

              <label className="block" htmlFor="cadence-email">
                <span className={labelClass}>{contact.fields.email}</span>
                <input
                  id="cadence-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className={fieldClass}
                />
              </label>

              <label className="block sm:col-span-2" htmlFor="cadence-course">
                <span className={labelClass}>{CADENCE_CONTACT_PAGE.courseLabel}</span>
                <select
                  id="cadence-course"
                  name="course"
                  required
                  defaultValue=""
                  aria-describedby="cadence-course-hint"
                  className={fieldClass}
                >
                  <option value="">{CADENCE_CONTACT_PAGE.courseUndecided}</option>
                  {CADENCE_COURSES.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <span
                  id="cadence-course-hint"
                  className="mt-2 block text-[13px] text-[var(--cad-ink-faint)]"
                >
                  {CADENCE_CONTACT_PAGE.courseHint}
                </span>
              </label>

              <label className="block sm:col-span-2" htmlFor="cadence-goal">
                <span className={labelClass}>{CADENCE_CONTACT_PAGE.goalLabel}</span>
                <textarea
                  id="cadence-goal"
                  name="goal"
                  required
                  rows={4}
                  className={`resize-y ${fieldClass}`}
                />
              </label>

              <label className="block sm:col-span-2" htmlFor="cadence-message">
                <span className={labelClass}>{contact.fields.message}</span>
                <textarea
                  id="cadence-message"
                  name="message"
                  rows={3}
                  className={`resize-y ${fieldClass}`}
                />
              </label>
            </div>

            <button
              type="submit"
              className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-[var(--cad-radius-pill)] bg-[var(--cad-violet)] px-9 py-4 text-base font-semibold text-[var(--cad-on-ink)] transition-colors hover:bg-[var(--cad-ink)]"
            >
              {sent ? CADENCE_CONTACT_PAGE.sentTitle : contact.submit}
              {sent ? (
                <Check className="h-5 w-5" aria-hidden />
              ) : (
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              )}
            </button>

            <p
              aria-live="polite"
              className="mt-4 min-h-12 text-center text-[14px] leading-relaxed text-[var(--cad-ink-soft)]"
            >
              {sent ? CADENCE_CONTACT_PAGE.sentBody : ''}
            </p>

            <p className="text-center text-[13px] leading-relaxed text-[var(--cad-ink-faint)]">
              {CADENCE_CONTACT_PAGE.note}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
