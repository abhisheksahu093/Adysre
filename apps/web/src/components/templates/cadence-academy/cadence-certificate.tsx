'use client';

import { CADENCE_COURSE_PAGE } from '@/data/templates/cadence-academy-content';
import { Reveal } from './cadence-reveal';

/**
 * CADENCE - the completion badge, closing the course page.
 *
 * The seal is drawn entirely in CSS (a repeating conic rosette with a ribbon
 * pseudo-element, see `cadence.css`), so the template still downloads with no
 * binary assets. It is decorative: the wrapper is `aria-hidden` and every word
 * on it is repeated as real text in the column beside it.
 */
export function CadenceCertificate() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <div className="cad-panel grid items-center gap-12 px-8 py-14 sm:px-14 sm:py-16 lg:grid-cols-[0.8fr_1.2fr]">
          {/*
           * `relative` is a Tailwind utility so the ribbon pseudo-element has a
           * containing block; the scoped `.cad-seal` rule sets no position.
           */}
          <div className="relative mx-auto h-52 w-52" aria-hidden>
            <span className="cad-seal absolute inset-0" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-28 w-28 place-items-center rounded-[var(--cad-radius-pill)] text-center">
                <span className="cad-figures block text-xs font-bold uppercase tracking-[0.16em] text-[var(--cad-lime-ink)]">
                  {CADENCE_COURSE_PAGE.certificateMark}
                </span>
                <span className="mt-1 block text-[13px] font-bold leading-tight text-[var(--cad-ink)]">
                  {CADENCE_COURSE_PAGE.certificateCourse}
                </span>
                <span className="cad-figures mt-1 block text-xs font-semibold text-[var(--cad-ink-faint)]">
                  {CADENCE_COURSE_PAGE.certificateYear}
                </span>
              </span>
            </span>
          </div>

          <div>
            <p className="cad-eyebrow">{CADENCE_COURSE_PAGE.certificateEyebrow}</p>
            <span className="cad-underline mt-4" aria-hidden />
            <h2 className="cad-display-sm mt-7 text-balance">
              {CADENCE_COURSE_PAGE.certificateTitle}
            </h2>
            <p className="mt-6 text-[17px] leading-[1.75] text-[var(--cad-ink-soft)]">
              {CADENCE_COURSE_PAGE.certificateBody}
            </p>
            <p className="cad-figures mt-6 text-sm font-semibold text-[var(--cad-lime-ink)]">
              {CADENCE_COURSE_PAGE.certificateMark} · {CADENCE_COURSE_PAGE.certificateCourse} ·{' '}
              {CADENCE_COURSE_PAGE.certificateYear}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
