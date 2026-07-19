import type { ComponentEntry } from './types';

/**
 * Marketing category - newsletter subscription.
 *
 * Five placements of the same job: one row, a card, a split, a page-foot strip,
 * and a dialog. They differ in layout, not in the rules, and the rules are the
 * interesting part of an email capture:
 *
 *  - A real <form> with a real <label>. A placeholder is not a label; it
 *    disappears on first keystroke and leaves the field nameless in the
 *    accessibility tree. Every entry here hides the label with `sr-only` rather
 *    than omitting it.
 *  - type="email" + autocomplete="email", so the browser fills it and validates
 *    it for free.
 *  - Result feedback goes in an aria-live region. A green tick that only exists
 *    as a colour change is not a confirmation for anyone who cannot see it.
 */
export const marketingComponents: ComponentEntry[] = [
  {
    slug: 'newsletter-inline',
    category: 'marketing',
    tags: ['newsletter', 'inline', 'email', 'subscribe', 'form'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-19',
    updatedAt: '2026-06-29',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 2610, copies: 742, downloads: 176 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'idle', labelKey: 'idle' },
    ],
    props: [
      { name: 'ctaLabel', type: 'string', default: "'Subscribe'", descriptionKey: 'ctaLabel' },
      { name: 'label', type: 'string', default: "'Email address'", descriptionKey: 'ariaLabel' },
      { name: 'loading', type: 'boolean', default: 'false', descriptionKey: 'loading' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The smallest honest email capture: one row, one field, one button.

  "Smallest" does not mean the label is negotiable. It is hidden with a
  clip-rect, which keeps it in the accessibility tree - an input whose only
  description is a placeholder announces as "edit text, blank" the moment the
  user starts typing.
-->
<form class="nl-inline" action="/api/subscribe" method="post">
  <label class="nl-inline__label" for="nl-inline-email">Email address</label>
  <input
    class="nl-inline__input"
    id="nl-inline-email"
    name="email"
    type="email"
    autocomplete="email"
    placeholder="you@company.com"
    required
  />
  <button class="nl-inline__submit" type="submit">Subscribe</button>
</form>`,
      css: `.nl-inline {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 28rem;
}

/* One row only when there is room for one. Below 480px the button drops under
   the field - a 90px-wide email input is not a form, it is a rumour. */
@media (min-width: 480px) {
  .nl-inline {
    flex-direction: row;
  }
}

.nl-inline__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.nl-inline__input {
  flex: 1;
  min-width: 0;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
}

.nl-inline__input::placeholder {
  color: #6b7280;
}

.nl-inline__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-color: transparent;
}

.nl-inline__submit {
  padding: 0.625rem 1rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms;
}

.nl-inline__submit:hover {
  background-color: #1d4ed8;
}

.nl-inline__submit:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * The field is a surface of its own and inherits nothing, so it needs a full
 * dark treatment - border, background, text and placeholder. The submit brings
 * its own blue and only its focus ring moves.
 */
@media (prefers-color-scheme: dark) {
  .nl-inline__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .nl-inline__input::placeholder {
    color: #9ca3af;
  }

  .nl-inline__input:focus-visible,
  .nl-inline__submit:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nl-inline__submit {
    transition: none;
  }
}`,
      tailwind: `<form action="/api/subscribe" method="post" class="flex w-full max-w-md flex-col gap-2 sm:flex-row">
  <label for="nl-inline-email" class="sr-only">Email address</label>
  <input
    id="nl-inline-email"
    name="email"
    type="email"
    autocomplete="email"
    placeholder="you@company.com"
    required
    class="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
  />
  <button
    type="submit"
    class="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Subscribe
  </button>
</form>`,
      react: `import { useId, useState } from 'react';

export function NewsletterInline({
  ctaLabel = 'Subscribe',
  label = 'Email address',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={\`flex w-full max-w-md flex-col gap-2 sm:flex-row \${className}\`}
    >
      <label htmlFor={emailId} className="sr-only">
        {label}
      </label>
      <input
        id={emailId}
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />
      <button
        type="submit"
        className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </button>
    </form>
  );
}`,
      nextjs: `'use client';

import { useId, useState, type FormEvent } from 'react';

interface NewsletterInlineProps {
  ctaLabel?: string;
  /** The field's accessible name. Hidden visually, never omitted. */
  label?: string;
  loading?: boolean;
  onSubmit?: (email: string) => void;
  className?: string;
}

// 'use client' - the field is controlled.
export function NewsletterInline({
  ctaLabel = 'Subscribe',
  label = 'Email address',
  loading = false,
  onSubmit,
  className = '',
}: NewsletterInlineProps) {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={\`flex w-full max-w-md flex-col gap-2 sm:flex-row \${className}\`}
    >
      <label htmlFor={emailId} className="sr-only">
        {label}
      </label>
      <input
        id={emailId}
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />
      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </button>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface NewsletterInlineProps {
  ctaLabel?: string;
  label?: string;
  loading?: boolean;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function NewsletterInline({
  ctaLabel = 'Subscribe',
  label = 'Email address',
  loading = false,
  onSubmit,
  className = '',
}: NewsletterInlineProps): JSX.Element {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={\`flex w-full max-w-md flex-col gap-2 sm:flex-row \${className}\`}
    >
      <label htmlFor={emailId} className="sr-only">
        {label}
      </label>
      <input
        id={emailId}
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />
      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'newsletter-card',
    category: 'marketing',
    tags: ['newsletter', 'card', 'email', 'subscribe', 'privacy'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-11',
    updatedAt: '2026-07-13',
    license: 'MIT',
    version: '1.1.0',
    featured: true,
    stats: { views: 3480, copies: 951, downloads: 264 },
    variants: [
      { id: 'card', labelKey: 'card' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Subscribe'", descriptionKey: 'ctaLabel' },
      { name: 'loading', type: 'boolean', default: 'false', descriptionKey: 'loading' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  aria-labelledby ties the <section> to its own heading, so a screen reader
  announces "Subscribe to the changelog, region" instead of an anonymous
  landmark. Cheaper than aria-label and it cannot drift from the visible text.

  The privacy note is a real <p> under the form, not a tooltip. It is the answer
  to the only question the visitor is actually asking.
-->
<section class="nl-card" aria-labelledby="nl-card-title">
  <h2 class="nl-card__title" id="nl-card-title">Subscribe to the changelog</h2>
  <p class="nl-card__copy">
    Every shipped feature, once a fortnight. Written by the people who built it.
  </p>

  <form class="nl-card__form" action="/api/subscribe" method="post">
    <label class="nl-card__label" for="nl-card-email">Email address</label>
    <input
      class="nl-card__input"
      id="nl-card-email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="you@company.com"
      required
    />
    <button class="nl-card__submit" type="submit">Subscribe</button>
  </form>

  <p class="nl-card__note">No spam. Unsubscribe in one click.</p>
</section>`,
      css: `.nl-card {
  width: 100%;
  max-width: 26rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.nl-card__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.nl-card__copy {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.nl-card__form {
  display: grid;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.nl-card__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.nl-card__input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
}

.nl-card__input::placeholder {
  color: #6b7280;
}

.nl-card__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-color: transparent;
}

.nl-card__submit {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms;
}

.nl-card__submit:hover {
  background-color: #1d4ed8;
}

.nl-card__submit:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.nl-card__note {
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

@media (prefers-color-scheme: dark) {
  .nl-card {
    border-color: #1f2937;
    background-color: #111827;
    box-shadow: none;
  }

  .nl-card__title {
    color: #f3f4f6;
  }

  .nl-card__copy {
    color: #9ca3af;
  }

  /* The field sits on the card, not the page, so it goes a step darker than
     the card itself - otherwise the input dissolves into its own container. */
  .nl-card__input {
    border-color: #374151;
    background-color: #030712;
    color: #f3f4f6;
  }

  .nl-card__input::placeholder {
    color: #9ca3af;
  }

  .nl-card__input:focus-visible,
  .nl-card__submit:focus-visible {
    outline-color: #60a5fa;
  }

  .nl-card__note {
    color: #9ca3af;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nl-card__submit {
    transition: none;
  }
}`,
      tailwind: `<section
  aria-labelledby="nl-card-title"
  class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-none"
>
  <h2 id="nl-card-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
    Subscribe to the changelog
  </h2>
  <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
    Every shipped feature, once a fortnight. Written by the people who built it.
  </p>

  <form action="/api/subscribe" method="post" class="mt-5 grid gap-2">
    <label for="nl-card-email" class="sr-only">Email address</label>
    <input
      id="nl-card-email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="you@company.com"
      required
      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
    />
    <button
      type="submit"
      class="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Subscribe
    </button>
  </form>

  <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
    No spam. Unsubscribe in one click.
  </p>
</section>`,
      react: `import { useId, useState } from 'react';

export function NewsletterCard({
  title,
  copy,
  ctaLabel = 'Subscribe',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section
      aria-labelledby={titleId}
      className={\`w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-none \${className}\`}
    >
      <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-2">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        No spam. Unsubscribe in one click.
      </p>
    </section>
  );
}`,
      nextjs: `'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';

interface NewsletterCardProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  loading?: boolean;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function NewsletterCard({
  title,
  copy,
  ctaLabel = 'Subscribe',
  loading = false,
  onSubmit,
  className = '',
}: NewsletterCardProps) {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section
      aria-labelledby={titleId}
      className={\`w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-none \${className}\`}
    >
      <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-2">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        No spam. Unsubscribe in one click.
      </p>
    </section>
  );
}`,
      typescript: `import { useId, useState, type FormEvent, type ReactNode } from 'react';

export interface NewsletterCardProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  loading?: boolean;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function NewsletterCard({
  title,
  copy,
  ctaLabel = 'Subscribe',
  loading = false,
  onSubmit,
  className = '',
}: NewsletterCardProps): JSX.Element {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section
      aria-labelledby={titleId}
      className={\`w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-none \${className}\`}
    >
      <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-2">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        No spam. Unsubscribe in one click.
      </p>
    </section>
  );
}`,
    },
  },
  {
    slug: 'newsletter-split',
    category: 'marketing',
    tags: ['newsletter', 'split', 'two-column', 'email', 'subscribe'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-03',
    updatedAt: '2026-07-10',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1930, copies: 486, downloads: 132 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Subscribe'", descriptionKey: 'ctaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Copy left, form right, and both are one <section> tied to one heading. On
  mobile they stack in source order - pitch first, then the ask, which is the
  order a reader needs them in anyway.
-->
<section class="nl-split" aria-labelledby="nl-split-title">
  <div class="nl-split__copy">
    <p class="nl-split__kicker">Weekly</p>
    <h2 class="nl-split__title" id="nl-split-title">The five-minute engineering digest</h2>
    <p class="nl-split__text">
      What broke, what shipped, and what we learned - from teams running the
      same stack as you.
    </p>
  </div>

  <form class="nl-split__form" action="/api/subscribe" method="post">
    <label class="nl-split__label" for="nl-split-email">Email address</label>
    <input
      class="nl-split__input"
      id="nl-split-email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="you@company.com"
      required
    />
    <button class="nl-split__submit" type="submit">Subscribe</button>
    <p class="nl-split__note">14,000 engineers already read it.</p>
  </form>
</section>`,
      css: `.nl-split {
  display: grid;
  gap: 1.5rem;
  align-items: center;
  width: 100%;
  max-width: 56rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #f9fafb;
}

@media (min-width: 768px) {
  .nl-split {
    grid-template-columns: 1.2fr 1fr;
    gap: 2.5rem;
    padding: 2rem;
  }
}

.nl-split__kicker {
  margin: 0;
  color: #1d4ed8;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.nl-split__title {
  margin: 0.5rem 0 0;
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: #111827;
}

.nl-split__text {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.nl-split__form {
  display: grid;
  gap: 0.5rem;
}

.nl-split__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.nl-split__input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
}

.nl-split__input::placeholder {
  color: #6b7280;
}

.nl-split__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-color: transparent;
}

.nl-split__submit {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms;
}

.nl-split__submit:hover {
  background-color: #1d4ed8;
}

.nl-split__submit:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.nl-split__note {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

@media (prefers-color-scheme: dark) {
  .nl-split {
    border-color: #1f2937;
    background-color: #111827;
  }

  .nl-split__kicker {
    color: #60a5fa;
  }

  .nl-split__title {
    color: #f3f4f6;
  }

  .nl-split__text {
    color: #9ca3af;
  }

  .nl-split__input {
    border-color: #374151;
    background-color: #030712;
    color: #f3f4f6;
  }

  .nl-split__input::placeholder {
    color: #9ca3af;
  }

  .nl-split__input:focus-visible,
  .nl-split__submit:focus-visible {
    outline-color: #60a5fa;
  }

  .nl-split__note {
    color: #9ca3af;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nl-split__submit {
    transition: none;
  }
}`,
      tailwind: `<section
  aria-labelledby="nl-split-title"
  class="grid w-full max-w-4xl items-center gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:grid-cols-[1.2fr_1fr] md:gap-10 md:p-8 dark:border-gray-800 dark:bg-gray-900"
>
  <div>
    <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
      Weekly
    </p>
    <h2 id="nl-split-title" class="mt-2 text-[1.375rem] font-bold leading-snug tracking-tight text-gray-900 dark:text-gray-100">
      The five-minute engineering digest
    </h2>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      What broke, what shipped, and what we learned - from teams running the
      same stack as you.
    </p>
  </div>

  <form action="/api/subscribe" method="post" class="grid gap-2">
    <label for="nl-split-email" class="sr-only">Email address</label>
    <input
      id="nl-split-email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="you@company.com"
      required
      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
    />
    <button
      type="submit"
      class="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Subscribe
    </button>
    <p class="text-xs text-gray-500 dark:text-gray-400">14,000 engineers already read it.</p>
  </form>
</section>`,
      react: `import { useId, useState } from 'react';

export function NewsletterSplit({
  title,
  kicker,
  copy,
  ctaLabel = 'Subscribe',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section
      aria-labelledby={titleId}
      className={\`grid w-full max-w-4xl items-center gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:grid-cols-[1.2fr_1fr] md:gap-10 md:p-8 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}
        <h2
          id={titleId}
          className="mt-2 text-[1.375rem] font-bold leading-snug tracking-tight text-gray-900 dark:text-gray-100"
        >
          {title}
        </h2>
        {copy ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-2">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400">14,000 engineers already read it.</p>
      </form>
    </section>
  );
}`,
      nextjs: `'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';

interface NewsletterSplitProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function NewsletterSplit({
  title,
  kicker,
  copy,
  ctaLabel = 'Subscribe',
  onSubmit,
  className = '',
}: NewsletterSplitProps) {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section
      aria-labelledby={titleId}
      className={\`grid w-full max-w-4xl items-center gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:grid-cols-[1.2fr_1fr] md:gap-10 md:p-8 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}
        <h2
          id={titleId}
          className="mt-2 text-[1.375rem] font-bold leading-snug tracking-tight text-gray-900 dark:text-gray-100"
        >
          {title}
        </h2>
        {copy ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-2">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400">14,000 engineers already read it.</p>
      </form>
    </section>
  );
}`,
      typescript: `import { useId, useState, type FormEvent, type ReactNode } from 'react';

export interface NewsletterSplitProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function NewsletterSplit({
  title,
  kicker,
  copy,
  ctaLabel = 'Subscribe',
  onSubmit,
  className = '',
}: NewsletterSplitProps): JSX.Element {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section
      aria-labelledby={titleId}
      className={\`grid w-full max-w-4xl items-center gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:grid-cols-[1.2fr_1fr] md:gap-10 md:p-8 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}
        <h2
          id={titleId}
          className="mt-2 text-[1.375rem] font-bold leading-snug tracking-tight text-gray-900 dark:text-gray-100"
        >
          {title}
        </h2>
        {copy ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-2">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400">14,000 engineers already read it.</p>
      </form>
    </section>
  );
}`,
    },
  },
  {
    slug: 'newsletter-footer-bar',
    category: 'marketing',
    tags: ['newsletter', 'footer', 'bar', 'strip', 'subscribe'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-06-21',
    updatedAt: '2026-07-12',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1410, copies: 358, downloads: 94 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Sign up'", descriptionKey: 'ctaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A full-bleed strip that sits above the site footer proper. It paints its own
  dark surface at both themes, which is what lets it read as a band across the
  page rather than another card - and, conveniently, means its white text has a
  fixed contrast ratio instead of an inherited one.
-->
<aside class="nl-bar" aria-labelledby="nl-bar-title">
  <div class="nl-bar__inner">
    <div class="nl-bar__copy">
      <h2 class="nl-bar__title" id="nl-bar-title">Get the monthly roundup</h2>
      <p class="nl-bar__text">Product news and field notes. One email a month.</p>
    </div>

    <form class="nl-bar__form" action="/api/subscribe" method="post">
      <label class="nl-bar__label" for="nl-bar-email">Email address</label>
      <input
        class="nl-bar__input"
        id="nl-bar-email"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="you@company.com"
        required
      />
      <button class="nl-bar__submit" type="submit">Sign up</button>
    </form>
  </div>
</aside>`,
      css: `.nl-bar {
  width: 100%;
  background-color: #111827;
}

.nl-bar__inner {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

/* Side by side once there is room; stacked and full width when there is not. */
@media (min-width: 768px) {
  .nl-bar__inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 1.75rem 1.5rem;
  }
}

.nl-bar__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

.nl-bar__text {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #d1d5db;
}

.nl-bar__form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

@media (min-width: 480px) {
  .nl-bar__form {
    flex-direction: row;
  }
}

@media (min-width: 768px) {
  .nl-bar__form {
    width: auto;
    min-width: 24rem;
  }
}

.nl-bar__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.nl-bar__input {
  flex: 1;
  min-width: 0;
  padding: 0.625rem 0.75rem;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  background-color: #030712;
  color: #f3f4f6;
  font-size: 0.875rem;
}

.nl-bar__input::placeholder {
  color: #9ca3af;
}

.nl-bar__input:focus-visible {
  outline: 2px solid #60a5fa;
  outline-offset: 2px;
  border-color: transparent;
}

.nl-bar__submit {
  padding: 0.625rem 1rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms;
}

.nl-bar__submit:hover {
  background-color: #e5e7eb;
}

.nl-bar__submit:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

/*
 * No dark-mode block. The bar is dark by design at both themes - it is a band,
 * not a surface that follows the page. Nothing here inherits.
 */

@media (prefers-reduced-motion: reduce) {
  .nl-bar__submit {
    transition: none;
  }
}`,
      tailwind: `<aside aria-labelledby="nl-bar-title" class="w-full bg-gray-900">
  <div class="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6 md:py-7">
    <div>
      <h2 id="nl-bar-title" class="text-base font-semibold text-white">Get the monthly roundup</h2>
      <p class="mt-1 text-sm text-gray-300">Product news and field notes. One email a month.</p>
    </div>

    <form action="/api/subscribe" method="post" class="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:min-w-96">
      <label for="nl-bar-email" class="sr-only">Email address</label>
      <input
        id="nl-bar-email"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="you@company.com"
        required
        class="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-100 placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      />
      <button
        type="submit"
        class="whitespace-nowrap rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
      >
        Sign up
      </button>
    </form>
  </div>
</aside>`,
      react: `import { useId, useState } from 'react';

export function NewsletterFooterBar({
  title,
  copy,
  ctaLabel = 'Sign up',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <aside aria-labelledby={titleId} className={\`w-full bg-gray-900 \${className}\`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6 md:py-7">
        <div>
          <h2 id={titleId} className="text-base font-semibold text-white">
            {title}
          </h2>
          {copy ? <p className="mt-1 text-sm text-gray-300">{copy}</p> : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:min-w-96"
        >
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-100 placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
          >
            {ctaLabel}
          </button>
        </form>
      </div>
    </aside>
  );
}`,
      nextjs: `'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';

interface NewsletterFooterBarProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function NewsletterFooterBar({
  title,
  copy,
  ctaLabel = 'Sign up',
  onSubmit,
  className = '',
}: NewsletterFooterBarProps) {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <aside aria-labelledby={titleId} className={\`w-full bg-gray-900 \${className}\`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6 md:py-7">
        <div>
          <h2 id={titleId} className="text-base font-semibold text-white">
            {title}
          </h2>
          {copy ? <p className="mt-1 text-sm text-gray-300">{copy}</p> : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:min-w-96"
        >
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-100 placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
          >
            {ctaLabel}
          </button>
        </form>
      </div>
    </aside>
  );
}`,
      typescript: `import { useId, useState, type FormEvent, type ReactNode } from 'react';

export interface NewsletterFooterBarProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function NewsletterFooterBar({
  title,
  copy,
  ctaLabel = 'Sign up',
  onSubmit,
  className = '',
}: NewsletterFooterBarProps): JSX.Element {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <aside aria-labelledby={titleId} className={\`w-full bg-gray-900 \${className}\`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6 md:py-7">
        <div>
          <h2 id={titleId} className="text-base font-semibold text-white">
            {title}
          </h2>
          {copy ? <p className="mt-1 text-sm text-gray-300">{copy}</p> : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:min-w-96"
        >
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-100 placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
          >
            {ctaLabel}
          </button>
        </form>
      </div>
    </aside>
  );
}`,
    },
  },
  {
    slug: 'newsletter-modal',
    category: 'marketing',
    tags: ['newsletter', 'modal', 'dialog', 'focus-trap', 'keyboard'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1180, copies: 297, downloads: 88 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Subscribe'", descriptionKey: 'ctaLabel' },
      { name: 'dismissLabel', type: 'string', default: "'Close'", descriptionKey: 'dismissLabel' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Built on <dialog>, because showModal() gives you for free what hand-rolled
  modals get wrong for years:
    - the focus trap (Tab cannot leave the dialog),
    - Escape to close,
    - inert background content (a screen reader cannot wander behind it),
    - the ::backdrop pseudo-element,
    - focus restored to the opener on close.

  The only thing it does NOT give you is backdrop-click dismissal, so that is
  the one behaviour wired by hand below. The trick is that a click on the
  backdrop reports the <dialog> itself as its target - the form fills the
  dialog, so any click on a child reports that child instead.
-->
<button class="nl-modal__open" type="button" data-open-dialog>Subscribe</button>

<dialog class="nl-modal" id="nl-modal" aria-labelledby="nl-modal-title">
  <form class="nl-modal__form" method="dialog">
    <button class="nl-modal__close" type="submit" value="dismiss" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  </form>

  <h2 class="nl-modal__title" id="nl-modal-title">One good email a week</h2>
  <p class="nl-modal__copy">
    Join 14,000 engineers. No spam, and one click to leave.
  </p>

  <form class="nl-modal__subscribe" action="/api/subscribe" method="post">
    <label class="nl-modal__label" for="nl-modal-email">Email address</label>
    <input
      class="nl-modal__input"
      id="nl-modal-email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="you@company.com"
      required
    />
    <button class="nl-modal__submit" type="submit">Subscribe</button>
  </form>
</dialog>

<script>
  (function () {
    var dialog = document.getElementById('nl-modal');
    var opener = document.querySelector('[data-open-dialog]');

    // showModal(), not show(): only the modal form traps focus and makes the
    // rest of the document inert.
    opener.addEventListener('click', function () {
      dialog.showModal();
    });

    // Backdrop dismissal - the one thing <dialog> does not do for you.
    // A click on the backdrop targets the dialog element itself; a click on any
    // content inside targets that content. Comparing the target is enough.
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close('dismiss');
    });
  })();
</script>`,
      css: `.nl-modal {
  width: min(100% - 2rem, 26rem);
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #fff;
  color: #111827;
  box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.5);
}

/* The backdrop is a real pseudo-element of the dialog - no overlay div, and no
   z-index war, because the top layer sits above the whole document. */
.nl-modal::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.nl-modal__form {
  display: flex;
  justify-content: flex-end;
  margin: 0 0 -0.5rem;
}

.nl-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 0;
  border-radius: 0.5rem;
  background-color: transparent;
  color: #6b7280;
  cursor: pointer;
}

.nl-modal__close svg {
  width: 1rem;
  height: 1rem;
}

.nl-modal__close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.nl-modal__close:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.nl-modal__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.nl-modal__copy {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.nl-modal__subscribe {
  display: grid;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.nl-modal__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.nl-modal__input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
}

.nl-modal__input::placeholder {
  color: #6b7280;
}

.nl-modal__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-color: transparent;
}

.nl-modal__submit {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms;
}

.nl-modal__submit:hover {
  background-color: #1d4ed8;
}

.nl-modal__submit:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.nl-modal__open {
  padding: 0.625rem 1rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.nl-modal__open:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (prefers-color-scheme: dark) {
  .nl-modal {
    border-color: #1f2937;
    background-color: #111827;
    color: #f3f4f6;
  }

  .nl-modal__title {
    color: #f3f4f6;
  }

  .nl-modal__copy {
    color: #9ca3af;
  }

  .nl-modal__close {
    color: #9ca3af;
  }

  .nl-modal__close:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .nl-modal__input {
    border-color: #374151;
    background-color: #030712;
    color: #f3f4f6;
  }

  .nl-modal__input::placeholder {
    color: #9ca3af;
  }

  .nl-modal__close:focus-visible,
  .nl-modal__input:focus-visible,
  .nl-modal__submit:focus-visible,
  .nl-modal__open:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nl-modal__submit {
    transition: none;
  }
}`,
      tailwind: `<!--
  The open attribute on the <dialog> is for illustration only - in a real page
  you call showModal(), which is what engages the focus trap, Escape and the
  inert background. A dialog opened by the open attribute alone is NOT modal:
  it traps nothing.
-->
<dialog
  id="nl-modal"
  aria-labelledby="nl-modal-title"
  class="w-[min(100%-2rem,26rem)] rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl backdrop:bg-black/50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
>
  <form method="dialog" class="-mb-2 flex justify-end">
    <button
      type="submit"
      value="dismiss"
      aria-label="Close"
      class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  </form>

  <h2 id="nl-modal-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
    One good email a week
  </h2>
  <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
    Join 14,000 engineers. No spam, and one click to leave.
  </p>

  <form action="/api/subscribe" method="post" class="mt-5 grid gap-2">
    <label for="nl-modal-email" class="sr-only">Email address</label>
    <input
      id="nl-modal-email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="you@company.com"
      required
      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
    />
    <button
      type="submit"
      class="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Subscribe
    </button>
  </form>
</dialog>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function NewsletterModal({
  open,
  title,
  copy,
  ctaLabel = 'Subscribe',
  dismissLabel = 'Close',
  onDismiss,
  onSubmit,
  className = '',
}) {
  const dialogRef = useRef(null);
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  // showModal() is what makes it modal: focus trap, Escape, inert background,
  // ::backdrop, and focus restored to the opener on close. Rendering the
  // element conditionally instead would throw all of that away.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // 'close' fires for Escape, for the close button, and for our own
  // dialog.close() - so the parent's state stays in sync however it was shut.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onDismiss();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onDismiss]);

  function handleBackdropClick(event) {
    // A click on the backdrop targets the dialog itself; a click on any child
    // targets that child. This is the whole test.
    if (event.target === dialogRef.current) dialogRef.current?.close();
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      className={\`w-[min(100%-2rem,26rem)] rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl backdrop:bg-black/50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 \${className}\`}
    >
      <div className="-mb-2 flex justify-end">
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={() => dialogRef.current?.close()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-2">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
      </form>
    </dialog>
  );
}`,
      nextjs: `'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

interface NewsletterModalProps {
  open: boolean;
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  dismissLabel?: string;
  onDismiss: () => void;
  onSubmit?: (email: string) => void;
  className?: string;
}

// 'use client' is mandatory here: showModal() is an imperative DOM call and the
// dialog is driven by refs and effects.
export function NewsletterModal({
  open,
  title,
  copy,
  ctaLabel = 'Subscribe',
  dismissLabel = 'Close',
  onDismiss,
  onSubmit,
  className = '',
}: NewsletterModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = (): void => onDismiss();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onDismiss]);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>): void {
    if (event.target === dialogRef.current) dialogRef.current?.close();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      className={\`w-[min(100%-2rem,26rem)] rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl backdrop:bg-black/50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 \${className}\`}
    >
      <div className="-mb-2 flex justify-end">
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={() => dialogRef.current?.close()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-2">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
      </form>
    </dialog>
  );
}`,
      typescript: `import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

export interface NewsletterModalProps {
  /** Drives showModal()/close(). The dialog element is always mounted. */
  open: boolean;
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  /** Accessible name for the close button - it is icon-only. */
  dismissLabel?: string;
  /** Required: fires for Escape, the close button and a backdrop click alike. */
  onDismiss: () => void;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function NewsletterModal({
  open,
  title,
  copy,
  ctaLabel = 'Subscribe',
  dismissLabel = 'Close',
  onDismiss,
  onSubmit,
  className = '',
}: NewsletterModalProps): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = (): void => onDismiss();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onDismiss]);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>): void {
    if (event.target === dialogRef.current) dialogRef.current?.close();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      className={\`w-[min(100%-2rem,26rem)] rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl backdrop:bg-black/50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 \${className}\`}
    >
      <div className="-mb-2 flex justify-end">
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={() => dialogRef.current?.close()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-2">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
      </form>
    </dialog>
  );
}`,
    },
  },
  {
    slug: 'marketing-feature-highlight',
    category: 'marketing',
    tags: ['feature', 'highlight', 'section', 'gradient', 'cta'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'reversed', labelKey: 'reversed' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Learn more'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Copy and a decorative gradient panel, side by side on desktop and stacked on
  mobile. The media is inline SVG on a gradient - no external image - and carries
  no text, so it needs no scrim. The CTA is full width until there is room.
-->
<section class="grid w-full max-w-5xl items-center gap-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 md:grid-cols-2 dark:border-gray-800 dark:bg-gray-900">
  <div class="order-2 md:order-1">
    <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Workflow</p>
    <h2 class="mt-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
      Automate the busywork, keep the craft
    </h2>
    <p class="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
      Let the platform handle triage, routing and follow-ups so your team spends its hours on the work only people can do.
    </p>
    <a
      href="#"
      class="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      See how it works
    </a>
  </div>
  <div class="order-1 md:order-2">
    <div class="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <svg viewBox="0 0 200 150" class="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
        <circle cx="150" cy="40" r="50" fill="rgba(255,255,255,0.15)" />
        <rect x="24" y="90" width="120" height="14" rx="7" fill="rgba(255,255,255,0.25)" />
        <rect x="24" y="112" width="80" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
      </svg>
    </div>
  </div>
</section>`,
      react: `export function MarketingFeatureHighlight({
  title,
  kicker,
  copy,
  ctaLabel = 'Learn more',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section
      className={\`grid w-full max-w-5xl items-center gap-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 md:grid-cols-2 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="order-2 md:order-1">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
        {copy ? (
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">{copy}</p>
        ) : null}
        <a
          href={ctaHref}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>
      <div className="order-1 md:order-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
          <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
            <circle cx="150" cy="40" r="50" fill="rgba(255,255,255,0.15)" />
            <rect x="24" y="90" width="120" height="14" rx="7" fill="rgba(255,255,255,0.25)" />
            <rect x="24" y="112" width="80" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
          </svg>
        </div>
      </div>
    </section>
  );
}`,
      typescript: `export interface MarketingFeatureHighlightProps {
  title: string;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function MarketingFeatureHighlight({
  title,
  kicker,
  copy,
  ctaLabel = 'Learn more',
  ctaHref = '#',
  className = '',
}: MarketingFeatureHighlightProps): JSX.Element {
  return (
    <section
      className={\`grid w-full max-w-5xl items-center gap-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 md:grid-cols-2 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="order-2 md:order-1">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
        {copy ? (
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">{copy}</p>
        ) : null}
        <a
          href={ctaHref}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>
      <div className="order-1 md:order-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
          <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
            <circle cx="150" cy="40" r="50" fill="rgba(255,255,255,0.15)" />
            <rect x="24" y="90" width="120" height="14" rx="7" fill="rgba(255,255,255,0.25)" />
            <rect x="24" y="112" width="80" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
          </svg>
        </div>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marketing-logos-social-proof',
    category: 'marketing',
    tags: ['logos', 'social-proof', 'trusted-by', 'brands', 'wall'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'title', type: 'string', default: "'Trusted by teams at'", descriptionKey: 'title' },
      { name: 'logos', type: 'LogoItem[]', required: true, descriptionKey: 'logos' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A "trusted by" wall. Each logo is an inline SVG mark plus its wordmark - no
  external image files - and the list wraps rather than overflowing at 320px.
-->
<section class="w-full max-w-5xl px-4 py-8 text-center" aria-label="Trusted by teams at">
  <p class="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Trusted by teams at</p>
  <ul class="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
    <li class="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-gray-700 motion-reduce:transition-none dark:text-gray-500 dark:hover:text-gray-200">
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
        <path d="M12 2 3 7v10l9 5 9-5V7z" stroke-linejoin="round" />
      </svg>
      <span class="text-base font-bold tracking-tight">Northwind</span>
    </li>
    <!-- repeat <li> per brand -->
  </ul>
</section>`,
      react: `export function MarketingLogosSocialProof({
  title = 'Trusted by teams at',
  logos,
  className = '',
}) {
  return (
    <section className={\`w-full max-w-5xl px-4 py-8 text-center \${className}\`} aria-label={title}>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">{title}</p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
        {logos.map((logo) => (
          <li
            key={logo.name}
            className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-gray-700 motion-reduce:transition-none dark:text-gray-500 dark:hover:text-gray-200"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
              <path d="M12 2 3 7v10l9 5 9-5V7z" strokeLinejoin="round" />
            </svg>
            <span className="text-base font-bold tracking-tight">{logo.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface LogoItem {
  name: string;
}

export interface MarketingLogosSocialProofProps {
  title?: string;
  logos: LogoItem[];
  className?: string;
}

export function MarketingLogosSocialProof({
  title = 'Trusted by teams at',
  logos,
  className = '',
}: MarketingLogosSocialProofProps): JSX.Element {
  return (
    <section className={\`w-full max-w-5xl px-4 py-8 text-center \${className}\`} aria-label={title}>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">{title}</p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
        {logos.map((logo) => (
          <li
            key={logo.name}
            className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-gray-700 motion-reduce:transition-none dark:text-gray-500 dark:hover:text-gray-200"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
              <path d="M12 2 3 7v10l9 5 9-5V7z" strokeLinejoin="round" />
            </svg>
            <span className="text-base font-bold tracking-tight">{logo.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marketing-announcement-bar',
    category: 'marketing',
    tags: ['announcement', 'bar', 'banner', 'dismissible', 'notice'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'dismissible', labelKey: 'dismissible' },
    ],
    props: [
      { name: 'message', type: 'string', required: true, descriptionKey: 'message' },
      { name: 'linkLabel', type: 'string', descriptionKey: 'linkLabel' },
      { name: 'linkHref', type: 'string', default: "'#'", descriptionKey: 'linkHref' },
      { name: 'dismissLabel', type: 'string', default: "'Dismiss announcement'", descriptionKey: 'ariaLabel' },
      { name: 'onDismiss', type: '() => void', descriptionKey: 'onDismiss' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A page-top notice. Message and link stack below sm so nothing overflows at
  320px; the close control is a 40px square tap target. The dismiss is wired in
  the React/TS variants - this markup is the visible shell.
-->
<div class="w-full bg-blue-600 text-white">
  <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
    <p class="flex min-w-0 flex-1 flex-col items-center gap-x-2 gap-y-0.5 text-center text-sm sm:flex-row sm:justify-center">
      <span>New: real-time collaboration is now in public beta.</span>
      <a href="#" class="inline-flex items-center gap-1 font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600">
        Read the announcement <span aria-hidden="true">&rarr;</span>
      </a>
    </p>
    <button
      type="button"
      aria-label="Dismiss announcement"
      class="-mr-1.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 motion-reduce:transition-none"
    >
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
        <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</div>`,
      react: `import { useState } from 'react';

export function MarketingAnnouncementBar({
  message,
  linkLabel,
  linkHref = '#',
  dismissLabel = 'Dismiss announcement',
  onDismiss,
  className = '',
}) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  function handleDismiss() {
    setOpen(false);
    onDismiss?.();
  }

  return (
    <div className={\`w-full bg-blue-600 text-white \${className}\`}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <p className="flex min-w-0 flex-1 flex-col items-center gap-x-2 gap-y-0.5 text-center text-sm sm:flex-row sm:justify-center">
          <span>{message}</span>
          {linkLabel ? (
            <a href={linkHref} className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600">
              {linkLabel}
              <span aria-hidden="true">&rarr;</span>
            </a>
          ) : null}
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={dismissLabel}
          className="-mr-1.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 motion-reduce:transition-none"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface MarketingAnnouncementBarProps {
  message: string;
  linkLabel?: string;
  linkHref?: string;
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

export function MarketingAnnouncementBar({
  message,
  linkLabel,
  linkHref = '#',
  dismissLabel = 'Dismiss announcement',
  onDismiss,
  className = '',
}: MarketingAnnouncementBarProps): JSX.Element | null {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  function handleDismiss(): void {
    setOpen(false);
    onDismiss?.();
  }

  return (
    <div className={\`w-full bg-blue-600 text-white \${className}\`}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <p className="flex min-w-0 flex-1 flex-col items-center gap-x-2 gap-y-0.5 text-center text-sm sm:flex-row sm:justify-center">
          <span>{message}</span>
          {linkLabel ? (
            <a href={linkHref} className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600">
              {linkLabel}
              <span aria-hidden="true">&rarr;</span>
            </a>
          ) : null}
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={dismissLabel}
          className="-mr-1.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 motion-reduce:transition-none"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'marketing-promo-banner',
    category: 'marketing',
    tags: ['promo', 'banner', 'gradient', 'offer', 'cta'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'badge', type: 'string', descriptionKey: 'badge' },
      { name: 'ctaLabel', type: 'string', default: "'Claim offer'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A gradient promo card. White text sits on the gradient, so a bg-black/25 scrim
  layer sits between them to hold WCAG-AA contrast wherever the gradient lands -
  the text is never trusted to the gradient alone. The CTA stacks below the copy
  on mobile and goes full width.
-->
<section class="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600">
  <div class="absolute inset-0 bg-black/25" aria-hidden="true"></div>
  <div class="relative flex flex-col items-start gap-5 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
    <div class="min-w-0">
      <span class="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">Limited time</span>
      <h2 class="mt-3 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">Save 30% on annual plans</h2>
      <p class="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">Switch to yearly billing before the end of the month and lock in the launch price for good.</p>
    </div>
    <a
      href="#"
      class="inline-flex w-full flex-none items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-600 motion-reduce:transition-none md:w-auto"
    >
      Claim offer
    </a>
  </div>
</section>`,
      react: `export function MarketingPromoBanner({
  title,
  copy,
  badge,
  ctaLabel = 'Claim offer',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`relative w-full max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 \${className}\`}>
      {/* Scrim: keeps white text at AA over any point of the gradient. */}
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
      <div className="relative flex flex-col items-start gap-5 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          {badge ? (
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">{badge}</span>
          ) : null}
          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">{title}</h2>
          {copy ? <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">{copy}</p> : null}
        </div>
        <a
          href={ctaHref}
          className="inline-flex w-full flex-none items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-600 motion-reduce:transition-none md:w-auto"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}`,
      typescript: `export interface MarketingPromoBannerProps {
  title: string;
  copy?: string;
  badge?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function MarketingPromoBanner({
  title,
  copy,
  badge,
  ctaLabel = 'Claim offer',
  ctaHref = '#',
  className = '',
}: MarketingPromoBannerProps): JSX.Element {
  return (
    <section className={\`relative w-full max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 \${className}\`}>
      {/* Scrim: keeps white text at AA over any point of the gradient. */}
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
      <div className="relative flex flex-col items-start gap-5 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          {badge ? (
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">{badge}</span>
          ) : null}
          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">{title}</h2>
          {copy ? <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">{copy}</p> : null}
        </div>
        <a
          href={ctaHref}
          className="inline-flex w-full flex-none items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-600 motion-reduce:transition-none md:w-auto"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marketing-countdown-offer',
    category: 'marketing',
    tags: ['countdown', 'timer', 'offer', 'urgency', 'sale'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'deadline', type: 'string', required: true, descriptionKey: 'deadline' },
      { name: 'ctaLabel', type: 'string', default: "'Shop the sale'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A live countdown. The numbers carry a pulse that is switched off under
  prefers-reduced-motion via motion-reduce:animate-none - the clock still ticks,
  it just stops throbbing. The four units wrap and never overflow at 320px. A
  visually-hidden aria-live line narrates the remaining time; the ticks are
  driven by the React/TS variants.
-->
<section class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-8 dark:border-gray-800 dark:bg-gray-900">
  <h2 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">Spring sale ends soon</h2>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Every annual plan is 30% off until the timer runs out.</p>
  <ul class="mt-6 flex flex-wrap items-stretch justify-center gap-2 sm:gap-3" aria-hidden="true">
    <li class="flex min-w-16 flex-1 flex-col items-center rounded-xl bg-gray-100 px-2 py-3 dark:bg-gray-800">
      <span class="text-2xl font-bold tabular-nums text-gray-900 motion-safe:animate-pulse motion-reduce:animate-none sm:text-3xl dark:text-gray-100">02</span>
      <span class="mt-1 text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Days</span>
    </li>
    <!-- Hours, Minutes, Seconds repeat -->
  </ul>
  <a
    href="#"
    class="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Shop the sale
  </a>
</section>`,
      react: `import { useEffect, useState } from 'react';

function remainingParts(deadline) {
  const ms = Math.max(0, new Date(deadline).getTime() - Date.now());
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function MarketingCountdownOffer({
  title,
  copy,
  deadline,
  ctaLabel = 'Shop the sale',
  ctaHref = '#',
  className = '',
}) {
  const [parts, setParts] = useState(() => remainingParts(deadline));

  useEffect(() => {
    setParts(remainingParts(deadline));
    const id = setInterval(() => setParts(remainingParts(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const units = [
    { label: 'Days', value: parts.days },
    { label: 'Hours', value: parts.hours },
    { label: 'Minutes', value: parts.minutes },
    { label: 'Seconds', value: parts.seconds },
  ];

  return (
    <section className={\`w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-8 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{title}</h2>
      {copy ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{copy}</p> : null}
      <ul className="mt-6 flex flex-wrap items-stretch justify-center gap-2 sm:gap-3" aria-hidden="true">
        {units.map((unit) => (
          <li key={unit.label} className="flex min-w-16 flex-1 flex-col items-center rounded-xl bg-gray-100 px-2 py-3 dark:bg-gray-800">
            <span className="text-2xl font-bold tabular-nums text-gray-900 motion-safe:animate-pulse motion-reduce:animate-none sm:text-3xl dark:text-gray-100">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{unit.label}</span>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {parts.days} days, {parts.hours} hours, {parts.minutes} minutes and {parts.seconds} seconds remaining.
      </p>
      <a
        href={ctaHref}
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </section>
  );
}`,
      typescript: `import { useEffect, useState } from 'react';

export interface MarketingCountdownOfferProps {
  title: string;
  copy?: string;
  /** ISO date string the timer counts down to. */
  deadline: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function remainingParts(deadline: string): TimeParts {
  const ms = Math.max(0, new Date(deadline).getTime() - Date.now());
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function MarketingCountdownOffer({
  title,
  copy,
  deadline,
  ctaLabel = 'Shop the sale',
  ctaHref = '#',
  className = '',
}: MarketingCountdownOfferProps): JSX.Element {
  const [parts, setParts] = useState<TimeParts>(() => remainingParts(deadline));

  useEffect(() => {
    setParts(remainingParts(deadline));
    const id = setInterval(() => setParts(remainingParts(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: parts.days },
    { label: 'Hours', value: parts.hours },
    { label: 'Minutes', value: parts.minutes },
    { label: 'Seconds', value: parts.seconds },
  ];

  return (
    <section className={\`w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-8 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{title}</h2>
      {copy ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{copy}</p> : null}
      <ul className="mt-6 flex flex-wrap items-stretch justify-center gap-2 sm:gap-3" aria-hidden="true">
        {units.map((unit) => (
          <li key={unit.label} className="flex min-w-16 flex-1 flex-col items-center rounded-xl bg-gray-100 px-2 py-3 dark:bg-gray-800">
            <span className="text-2xl font-bold tabular-nums text-gray-900 motion-safe:animate-pulse motion-reduce:animate-none sm:text-3xl dark:text-gray-100">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{unit.label}</span>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {parts.days} days, {parts.hours} hours, {parts.minutes} minutes and {parts.seconds} seconds remaining.
      </p>
      <a
        href={ctaHref}
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marketing-value-props',
    category: 'marketing',
    tags: ['value', 'benefits', 'grid', 'features', 'icons'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'heading', type: 'string', descriptionKey: 'heading' },
      { name: 'items', type: 'ValueProp[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A three-up benefits grid. One column on phones, two at sm, three at lg, so the
  cells never crowd at 320px. Icons are inline SVG.
-->
<section class="w-full max-w-5xl px-4 py-8">
  <h2 class="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Why teams switch</h2>
  <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <li class="flex flex-col">
      <span class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
          <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Set up in minutes</h3>
      <p class="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Import your data and invite the team - no migration project required.</p>
    </li>
    <!-- repeat <li> per value prop -->
  </ul>
</section>`,
      react: `export function MarketingValueProps({ heading, items, className = '' }) {
  return (
    <section className={\`w-full max-w-5xl px-4 py-8 \${className}\`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="flex flex-col">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface ValueProp {
  title: string;
  copy: string;
}

export interface MarketingValuePropsProps {
  heading?: string;
  items: ValueProp[];
  className?: string;
}

export function MarketingValueProps({
  heading,
  items,
  className = '',
}: MarketingValuePropsProps): JSX.Element {
  return (
    <section className={\`w-full max-w-5xl px-4 py-8 \${className}\`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="flex flex-col">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marketing-lead-magnet',
    category: 'marketing',
    tags: ['lead-magnet', 'ebook', 'download', 'email', 'form'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Get the guide'", descriptionKey: 'ctaLabel' },
      { name: 'onSubmit', type: '(email: string) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A gated download. The cover is an inline-SVG gradient (no external image) and
  stacks above the copy on mobile. The email row goes vertical below sm. Submit
  is UI-only here - wire onSubmit in the React/TS variants.
-->
<section class="grid w-full max-w-3xl items-center gap-6 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-[auto_1fr] sm:p-7 dark:border-gray-800 dark:bg-gray-900">
  <div class="relative mx-auto aspect-[3/4] w-28 flex-none overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 shadow-sm sm:mx-0">
    <svg viewBox="0 0 60 80" class="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <rect x="10" y="20" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.5)" />
      <rect x="10" y="32" width="30" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
      <rect x="10" y="42" width="34" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
    </svg>
  </div>
  <div class="min-w-0">
    <h2 class="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">The 2026 SaaS onboarding playbook</h2>
    <p class="mt-1.5 text-sm text-gray-600 dark:text-gray-400">28 pages of teardown, checklists and copy you can steal for your own flow.</p>
    <form class="mt-4 flex flex-col gap-2 sm:flex-row" action="/api/subscribe" method="post">
      <label for="lead-magnet-email" class="sr-only">Email address</label>
      <input
        id="lead-magnet-email"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="you@company.com"
        required
        class="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />
      <button type="submit" class="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        Get the guide
      </button>
    </form>
    <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Free PDF. No spam, unsubscribe anytime.</p>
  </div>
</section>`,
      react: `import { useId, useState } from 'react';

export function MarketingLeadMagnet({
  title,
  copy,
  ctaLabel = 'Get the guide',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section className={\`grid w-full max-w-3xl items-center gap-6 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-[auto_1fr] sm:p-7 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="relative mx-auto aspect-[3/4] w-28 flex-none overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 shadow-sm sm:mx-0">
        <svg viewBox="0 0 60 80" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
          <rect x="10" y="20" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.5)" />
          <rect x="10" y="32" width="30" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
          <rect x="10" y="42" width="34" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
        </svg>
      </div>
      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
        {copy ? <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{copy}</p> : null}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label htmlFor={emailId} className="sr-only">Email address</label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
          <button type="submit" className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
            {ctaLabel}
          </button>
        </form>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Free PDF. No spam, unsubscribe anytime.</p>
      </div>
    </section>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface MarketingLeadMagnetProps {
  title: string;
  copy?: string;
  ctaLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function MarketingLeadMagnet({
  title,
  copy,
  ctaLabel = 'Get the guide',
  onSubmit,
  className = '',
}: MarketingLeadMagnetProps): JSX.Element {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section className={\`grid w-full max-w-3xl items-center gap-6 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-[auto_1fr] sm:p-7 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="relative mx-auto aspect-[3/4] w-28 flex-none overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 shadow-sm sm:mx-0">
        <svg viewBox="0 0 60 80" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
          <rect x="10" y="20" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.5)" />
          <rect x="10" y="32" width="30" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
          <rect x="10" y="42" width="34" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
        </svg>
      </div>
      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
        {copy ? <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{copy}</p> : null}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label htmlFor={emailId} className="sr-only">Email address</label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
          <button type="submit" className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
            {ctaLabel}
          </button>
        </form>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Free PDF. No spam, unsubscribe anytime.</p>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marketing-webinar-signup',
    category: 'marketing',
    tags: ['webinar', 'signup', 'event', 'register', 'form'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'dateLabel', type: 'string', required: true, descriptionKey: 'dateLabel' },
      { name: 'timeLabel', type: 'string', required: true, descriptionKey: 'timeLabel' },
      { name: 'presenter', type: 'string', descriptionKey: 'presenter' },
      { name: 'ctaLabel', type: 'string', default: "'Save my seat'", descriptionKey: 'ctaLabel' },
      { name: 'onSubmit', type: '(email: string) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A webinar registration card. aria-labelledby ties the section to its heading.
  The date badge and the email row both stack on mobile; submit is UI-only here.
-->
<section aria-labelledby="webinar-title" class="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 dark:border-gray-800 dark:bg-gray-900">
  <div class="flex items-center gap-3">
    <span class="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" stroke-linecap="round" />
      </svg>
    </span>
    <div class="min-w-0">
      <p class="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Live webinar</p>
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Thu, Aug 14 &middot; 11:00 AM ET</p>
    </div>
  </div>
  <h2 id="webinar-title" class="mt-4 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">Scaling design systems without slowing product teams</h2>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Hosted by Dana Ruiz, Head of Design</p>
  <form class="mt-5 flex flex-col gap-2 sm:flex-row" action="/api/register" method="post">
    <label for="webinar-email" class="sr-only">Work email</label>
    <input
      id="webinar-email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="you@company.com"
      required
      class="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
    />
    <button type="submit" class="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      Save my seat
    </button>
  </form>
  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Can&rsquo;t make it? Register and we&rsquo;ll send the recording.</p>
</section>`,
      react: `import { useId, useState } from 'react';

export function MarketingWebinarSignup({
  title,
  dateLabel,
  timeLabel,
  presenter,
  ctaLabel = 'Save my seat',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section aria-labelledby={titleId} className={\`w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M8 2v4M16 2v4M3 10h18" strokeLinecap="round" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Live webinar</p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{dateLabel} &middot; {timeLabel}</p>
        </div>
      </div>
      <h2 id={titleId} className="mt-4 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
      {presenter ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Hosted by {presenter}</p> : null}
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label htmlFor={emailId} className="sr-only">Work email</label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button type="submit" className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
          {ctaLabel}
        </button>
      </form>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Can&rsquo;t make it? Register and we&rsquo;ll send the recording.</p>
    </section>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface MarketingWebinarSignupProps {
  title: string;
  dateLabel: string;
  timeLabel: string;
  presenter?: string;
  ctaLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function MarketingWebinarSignup({
  title,
  dateLabel,
  timeLabel,
  presenter,
  ctaLabel = 'Save my seat',
  onSubmit,
  className = '',
}: MarketingWebinarSignupProps): JSX.Element {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section aria-labelledby={titleId} className={\`w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M8 2v4M16 2v4M3 10h18" strokeLinecap="round" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Live webinar</p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{dateLabel} &middot; {timeLabel}</p>
        </div>
      </div>
      <h2 id={titleId} className="mt-4 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
      {presenter ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Hosted by {presenter}</p> : null}
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label htmlFor={emailId} className="sr-only">Work email</label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button type="submit" className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
          {ctaLabel}
        </button>
      </form>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Can&rsquo;t make it? Register and we&rsquo;ll send the recording.</p>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marketing-referral-card',
    category: 'marketing',
    tags: ['referral', 'invite', 'reward', 'copy-code', 'share'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'code', type: 'string', required: true, descriptionKey: 'code' },
      { name: 'title', type: 'string', default: "'Give $20, get $20'", descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A referral share card. The read-only code field and the copy button stack on
  mobile so nothing overflows at 320px. The clipboard write and the "Copied!"
  state live in the React/TS variants; an aria-live line announces the copy.
-->
<section class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
  <span class="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white">
    <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
      <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8M2 7h20v5H2zM12 21V7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </span>
  <h2 class="mt-4 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">Give $20, get $20</h2>
  <p class="mt-1.5 text-sm text-gray-600 dark:text-gray-400">Share your code. When a friend subscribes, you both get account credit.</p>
  <div class="mt-5 flex flex-col gap-2 sm:flex-row">
    <label for="referral-code" class="sr-only">Your referral code</label>
    <input
      id="referral-code"
      type="text"
      readonly
      value="FRIEND-4KQ9"
      class="min-w-0 flex-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5 text-center font-mono text-sm tracking-widest text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400"
    />
    <button type="button" class="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      Copy code
    </button>
  </div>
</section>`,
      react: `import { useId, useState } from 'react';

export function MarketingReferralCard({
  code,
  title = 'Give $20, get $20',
  copy,
  className = '',
}) {
  const fieldId = useId();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className={\`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
          <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8M2 7h20v5H2zM12 21V7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className="mt-4 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
      <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
        {copy ?? 'Share your code. When a friend subscribes, you both get account credit.'}
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label htmlFor={fieldId} className="sr-only">Your referral code</label>
        <input
          id={fieldId}
          type="text"
          readOnly
          value={code}
          className="min-w-0 flex-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5 text-center font-mono text-sm tracking-widest text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
        {copied ? 'Code copied to clipboard.' : ' '}
      </p>
    </section>
  );
}`,
      typescript: `import { useId, useState } from 'react';

export interface MarketingReferralCardProps {
  code: string;
  title?: string;
  copy?: string;
  className?: string;
}

export function MarketingReferralCard({
  code,
  title = 'Give $20, get $20',
  copy,
  className = '',
}: MarketingReferralCardProps): JSX.Element {
  const fieldId = useId();
  const [copied, setCopied] = useState(false);

  function handleCopy(): void {
    void navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className={\`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
          <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8M2 7h20v5H2zM12 21V7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className="mt-4 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
      <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
        {copy ?? 'Share your code. When a friend subscribes, you both get account credit.'}
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label htmlFor={fieldId} className="sr-only">Your referral code</label>
        <input
          id={fieldId}
          type="text"
          readOnly
          value={code}
          className="min-w-0 flex-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5 text-center font-mono text-sm tracking-widest text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
        {copied ? 'Code copied to clipboard.' : ' '}
      </p>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marketing-stats-band',
    category: 'marketing',
    tags: ['stats', 'metrics', 'band', 'gradient', 'numbers'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'stats', type: 'Stat[]', required: true, descriptionKey: 'stats' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A gradient metrics band. White numerals sit on the gradient, so a bg-black/30
  scrim layer holds their contrast rather than trusting the gradient. Stats
  collapse to one column on phones. The value is the <dd> and the label the
  <dt>, reordered visually so the big number reads first.
-->
<section class="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700">
  <div class="absolute inset-0 bg-black/30" aria-hidden="true"></div>
  <div class="relative px-6 py-10 sm:px-8">
    <h2 class="mb-8 text-center text-lg font-semibold text-white/90">Teams ship faster on ADYSRE</h2>
    <dl class="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
      <div class="flex flex-col items-center">
        <dt class="order-2 mt-1 text-sm font-medium text-white/80">Active teams</dt>
        <dd class="order-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">12,000+</dd>
      </div>
      <!-- repeat per stat -->
    </dl>
  </div>
</section>`,
      react: `export function MarketingStatsBand({ title, stats, className = '' }) {
  return (
    <section className={\`relative w-full max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 \${className}\`}>
      {/* Scrim: white numerals stay AA over the full sweep of the gradient. */}
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div className="relative px-6 py-10 sm:px-8">
        {title ? <h2 className="mb-8 text-center text-lg font-semibold text-white/90">{title}</h2> : null}
        <dl className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <dt className="order-2 mt-1 text-sm font-medium text-white/80">{stat.label}</dt>
              <dd className="order-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}`,
      typescript: `export interface Stat {
  value: string;
  label: string;
}

export interface MarketingStatsBandProps {
  title?: string;
  stats: Stat[];
  className?: string;
}

export function MarketingStatsBand({
  title,
  stats,
  className = '',
}: MarketingStatsBandProps): JSX.Element {
  return (
    <section className={\`relative w-full max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 \${className}\`}>
      {/* Scrim: white numerals stay AA over the full sweep of the gradient. */}
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div className="relative px-6 py-10 sm:px-8">
        {title ? <h2 className="mb-8 text-center text-lg font-semibold text-white/90">{title}</h2> : null}
        <dl className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <dt className="order-2 mt-1 text-sm font-medium text-white/80">{stat.label}</dt>
              <dd className="order-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}`,
    },
  },
];
