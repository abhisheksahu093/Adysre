'use client';

import { useState, type FormEvent } from 'react';
import {
  LUMEN_SHOP,
  lumenHref,
  type LumenAccountPageCopy,
} from '@/data/templates/lumen-store-content';
import { LumenField } from './lumen-field';
import { LumenSectionHeading } from './lumen-section-heading';

/**
 * LUMEN - the account form shared by sign in and create account.
 *
 * The two pages differ in exactly two ways - which fields they show and whether
 * the row under them is a "forgot password" link or a terms checkbox - so they
 * share one implementation with one `extra` switch rather than diverging into two
 * near-identical files that will drift (Rule 3).
 *
 * Like every form in this template it is `preventDefault` only: no endpoint, no
 * credential ever leaves the page, and the confirmation says so out loud.
 */
export function LumenAccountForm({
  copy,
  extra,
}: {
  copy: LumenAccountPageCopy;
  extra: 'forgot' | 'terms';
}) {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="mx-auto max-w-md px-6 py-20 sm:px-10 sm:py-28">
      <LumenSectionHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
        as="h1"
      />

      <form onSubmit={onSubmit} className="lum-panel mt-10 p-7 sm:p-8">
        <div className="grid gap-5">
          {copy.fields.map((field) => (
            <LumenField key={field.id} field={field} />
          ))}
        </div>

        {extra === 'forgot' ? (
          <p className="mt-5 text-right">
            <a
              href={copy.extraHref}
              className="text-[13px] text-[var(--lum-ink-faint)] underline underline-offset-4 transition-colors hover:text-[var(--lum-ink)]"
            >
              {copy.extraLabel}
            </a>
          </p>
        ) : (
          <div className="mt-6 flex items-start gap-3">
            <input
              id="lum-terms"
              name="terms"
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--lum-accent-deep)]"
            />
            <label htmlFor="lum-terms" className="text-[14px] leading-[1.6] text-[var(--lum-ink-soft)]">
              {copy.extraLabel}
            </label>
          </div>
        )}

        <button type="submit" className="lum-btn lum-btn--solid mt-8 w-full">
          {copy.submit}
        </button>

        <p aria-live="polite" className="mt-4 min-h-5 text-center text-[13px] text-[var(--lum-ink-faint)]">
          {submitted ? copy.submitted : ''}
        </p>
      </form>

      <p className="mt-8 text-center text-[14px] text-[var(--lum-ink-soft)]">
        {copy.altPrompt}{' '}
        <a
          href={copy.altHref}
          className="font-medium text-[var(--lum-ink)] underline underline-offset-4 transition-colors hover:text-[var(--lum-accent-deep)]"
        >
          {copy.altAction}
        </a>
      </p>

      <p className="mt-4 text-center">
        <a
          href={lumenHref('shop')}
          className="text-[13px] text-[var(--lum-ink-faint)] transition-colors hover:text-[var(--lum-ink)]"
        >
          {/* Sending someone back to the range is a friendlier dead end than a
              form with nowhere else to go. */}
          {LUMEN_SHOP.common.backToShop}
        </a>
      </p>
    </section>
  );
}
