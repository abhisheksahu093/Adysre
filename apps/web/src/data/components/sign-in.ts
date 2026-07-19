import type { ComponentEntry } from './types';

/**
 * Sign-in category.
 *
 * Ten login form UIs that differ in layout and flow, not in colour: a centred
 * card, a two-column split, a social-first stack, a passwordless magic link, a
 * one-time-code step, a bare minimal form, a gradient side panel, a boxed-logo
 * card, an inline-error state, and a remember/forgot row.
 *
 * These are DISPLAY components. The `<form>` is real and the semantics are real
 * - a `<label>` per field, `type="email"`/`type="password"`, the right
 * `autocomplete` tokens, a genuine `type="submit"` button - but nothing here
 * authenticates or posts anywhere. `onSubmit` is a caller-supplied callback with
 * a no-op default; wire it to your own auth on the way out. The shared
 * constraint is the one every credential form has: the label must be a real
 * `<label>` (a placeholder is not a name), and the password toggle must swap the
 * input `type`, never reveal via a second plaintext field.
 */
export const signInComponents: ComponentEntry[] = [
  {
    slug: 'signin-centered-card',
    category: 'sign-in',
    tags: ['sign-in', 'login', 'card', 'form', 'auth'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Sign in'", descriptionKey: 'title' },
      { name: 'subtitle', type: 'string', descriptionKey: 'subtitle' },
      { name: 'submitLabel', type: 'string', default: "'Sign in'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(data: { email: string; password: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A self-contained login card. The card is w-full max-w-sm so it fills a phone
  and settles at a readable width on desktop. Every input has its own <label> -
  the placeholder is a hint, never the name.
-->
<div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in</h1>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Welcome back. Enter your details.</p>

  <form class="mt-6 space-y-4" action="#" method="post">
    <div>
      <label for="signin-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input
        id="signin-email"
        name="email"
        type="email"
        autocomplete="email"
        required
        placeholder="you@company.com"
        class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />
    </div>

    <div>
      <label for="signin-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
      <div class="relative mt-1.5">
        <input
          id="signin-password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          placeholder="••••••••"
          class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-16 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <!-- Toggle swaps the input type in JS; inert in this static markup. -->
        <button type="button" class="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400">Show</button>
      </div>
    </div>

    <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Sign in
    </button>
  </form>
</div>`,
      react: `import { useId, useState } from 'react';

export function SignInCenteredCard({
  title = 'Sign in',
  subtitle = 'Welcome back. Enter your details.',
  submitLabel = 'Sign in',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    // Display component: no network call. Hand the values to the caller.
    onSubmit?.({ email, password });
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative mt-1.5">
            <input
              id={passwordId}
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-16 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-pressed={show}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          {submitLabel}
        </button>
      </form>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface SignInCenteredCardProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  /** No-op by default - this is a UI component, not an auth client. */
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

export function SignInCenteredCard({
  title = 'Sign in',
  subtitle = 'Welcome back. Enter your details.',
  submitLabel = 'Sign in',
  onSubmit,
  className = '',
}: SignInCenteredCardProps): JSX.Element {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative mt-1.5">
            <input
              id={passwordId}
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-16 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-pressed={show}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          {submitLabel}
        </button>
      </form>
    </div>
  );
}`,
    },
  },
  {
    slug: 'signin-split-image',
    category: 'sign-in',
    tags: ['sign-in', 'login', 'split', 'two-column', 'responsive'],
    difficulty: 'intermediate',
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
      { name: 'title', type: 'string', default: "'Welcome back'", descriptionKey: 'title' },
      { name: 'submitLabel', type: 'string', default: "'Sign in'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(data: { email: string; password: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Form on the left in the DOM, decorative panel on the right. On mobile the panel
  is hidden (hidden md:block) - it is atmosphere, not content, so it should not
  push the form below the fold on a phone. The form column always fills the width.
-->
<div class="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
  <div class="p-6 sm:p-8">
    <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Welcome back</h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Sign in to continue to your workspace.</p>

    <form class="mt-6 space-y-4" action="#" method="post">
      <div>
        <label for="split-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id="split-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label for="split-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input id="split-password" name="password" type="password" autocomplete="current-password" required placeholder="••••••••" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>
      <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
    </form>
  </div>

  <!-- Decorative side panel: a CSS gradient, no external image to go stale. -->
  <div class="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:flex md:flex-col md:justify-end" aria-hidden="true">
    <p class="text-lg font-semibold text-white">Everything your team ships, in one place.</p>
    <p class="mt-2 text-sm text-blue-100">Trusted by product teams shipping every day.</p>
  </div>
</div>`,
      react: `import { useId, useState } from 'react';

export function SignInSplitImage({
  title = 'Welcome back',
  submitLabel = 'Sign in',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={\`mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <div className="p-6 sm:p-8">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Sign in to continue to your workspace.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <div>
            <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
        </form>
      </div>

      <div className="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:flex md:flex-col md:justify-end" aria-hidden="true">
        <p className="text-lg font-semibold text-white">Everything your team ships, in one place.</p>
        <p className="mt-2 text-sm text-blue-100">Trusted by product teams shipping every day.</p>
      </div>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface SignInSplitImageProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

export function SignInSplitImage({
  title = 'Welcome back',
  submitLabel = 'Sign in',
  onSubmit,
  className = '',
}: SignInSplitImageProps): JSX.Element {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={\`mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <div className="p-6 sm:p-8">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Sign in to continue to your workspace.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <div>
            <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
        </form>
      </div>

      <div className="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:flex md:flex-col md:justify-end" aria-hidden="true">
        <p className="text-lg font-semibold text-white">Everything your team ships, in one place.</p>
        <p className="mt-2 text-sm text-blue-100">Trusted by product teams shipping every day.</p>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'signin-social-buttons',
    category: 'sign-in',
    tags: ['sign-in', 'login', 'social', 'oauth', 'divider'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'social-only', labelKey: 'socialOnly' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Sign in'", descriptionKey: 'title' },
      { name: 'onSocial', type: '(provider: string) => void', descriptionKey: 'onSocial' },
      { name: 'onSubmit', type: '(data: { email: string; password: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Social buttons first, then a labelled divider, then the email/password form.
  The divider is <span> text inside a flex row of <hr>-like rules - the word
  "or" must be real text, not a background image, so it survives translation.
-->
<div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
  <h1 class="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in</h1>

  <div class="mt-6 space-y-3">
    <button type="button" class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
      <span aria-hidden="true" class="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-red-500 to-yellow-500 text-[0.65rem] font-bold text-white">G</span>
      Continue with Google
    </button>
    <button type="button" class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
      <span aria-hidden="true" class="grid h-5 w-5 place-items-center rounded-full bg-gray-900 text-[0.65rem] font-bold text-white dark:bg-gray-100 dark:text-gray-900">GH</span>
      Continue with GitHub
    </button>
  </div>

  <div class="my-5 flex items-center gap-3">
    <span class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">or</span>
    <span class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
  </div>

  <form class="space-y-4" action="#" method="post">
    <div>
      <label for="social-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input id="social-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="social-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
      <input id="social-password" name="password" type="password" autocomplete="current-password" required placeholder="••••••••" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
    </div>
    <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
  </form>
</div>`,
      react: `import { useId, useState } from 'react';

export function SignInSocialButtons({
  title = 'Sign in',
  onSocial,
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6 space-y-3">
        <button type="button" onClick={() => onSocial?.('google')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
          <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-red-500 to-yellow-500 text-[0.65rem] font-bold text-white">G</span>
          Continue with Google
        </button>
        <button type="button" onClick={() => onSocial?.('github')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
          <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full bg-gray-900 text-[0.65rem] font-bold text-white dark:bg-gray-100 dark:text-gray-900">GH</span>
          Continue with GitHub
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
      </form>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface SignInSocialButtonsProps {
  title?: string;
  onSocial?: (provider: string) => void;
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

export function SignInSocialButtons({
  title = 'Sign in',
  onSocial,
  onSubmit,
  className = '',
}: SignInSocialButtonsProps): JSX.Element {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6 space-y-3">
        <button type="button" onClick={() => onSocial?.('google')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
          <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-red-500 to-yellow-500 text-[0.65rem] font-bold text-white">G</span>
          Continue with Google
        </button>
        <button type="button" onClick={() => onSocial?.('github')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
          <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full bg-gray-900 text-[0.65rem] font-bold text-white dark:bg-gray-100 dark:text-gray-900">GH</span>
          Continue with GitHub
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
      </form>
    </div>
  );
}`,
    },
  },
  {
    slug: 'signin-magic-link',
    category: 'sign-in',
    tags: ['sign-in', 'login', 'magic-link', 'passwordless', 'email'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'sent', labelKey: 'sent' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Sign in with a link'", descriptionKey: 'title' },
      { name: 'submitLabel', type: 'string', default: "'Email me a link'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(email: string) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Passwordless: one email field, no password. There is no password toggle to
  build and no autocomplete="current-password" to get right - the whole point is
  that the field is the only credential surface. After submit the caller swaps in
  a "check your inbox" confirmation.
-->
<div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in with a link</h1>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">No password. We email you a one-time link.</p>

  <form class="mt-6 space-y-4" action="#" method="post">
    <div>
      <label for="magic-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input id="magic-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
    </div>
    <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Email me a link</button>
  </form>

  <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">By continuing you agree to the terms of service.</p>
</div>`,
      react: `import { useId, useState } from 'react';

export function SignInMagicLink({
  title = 'Sign in with a link',
  submitLabel = 'Email me a link',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSent(true); // UI-only confirmation; no link is actually sent.
    onSubmit?.(email);
  }

  if (sent) {
    return (
      <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Check your inbox</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">We sent a sign-in link to {email || 'your email'}.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400">Use a different email</button>
      </div>
    );
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">No password. We email you a one-time link.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
      </form>

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">By continuing you agree to the terms of service.</p>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface SignInMagicLinkProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function SignInMagicLink({
  title = 'Sign in with a link',
  submitLabel = 'Email me a link',
  onSubmit,
  className = '',
}: SignInMagicLinkProps): JSX.Element {
  const emailId = useId();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSent(true);
    onSubmit?.(email);
  }

  if (sent) {
    return (
      <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Check your inbox</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">We sent a sign-in link to {email || 'your email'}.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400">Use a different email</button>
      </div>
    );
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">No password. We email you a one-time link.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
      </form>

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">By continuing you agree to the terms of service.</p>
    </div>
  );
}`,
    },
  },
  {
    slug: 'signin-with-2fa-code',
    category: 'sign-in',
    tags: ['sign-in', 'login', '2fa', 'otp', 'verification'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'error', labelKey: 'error' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Two-factor authentication'", descriptionKey: 'title' },
      { name: 'length', type: 'number', default: '6', descriptionKey: 'length' },
      { name: 'onSubmit', type: '(code: string) => void', descriptionKey: 'onSubmit' },
      { name: 'onResend', type: '() => void', descriptionKey: 'onResend' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A single numeric input, not six separate boxes. inputMode="numeric" gets the
  digit keypad on mobile, and autocomplete="one-time-code" lets iOS/Android
  offer the SMS code straight from the keyboard bar - the one attribute that
  actually makes 2FA fast. tracking + text-center fakes the segmented look
  without the focus-management cost of six inputs.
-->
<div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Two-factor authentication</h1>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Enter the 6-digit code from your authenticator app.</p>

  <form class="mt-6 space-y-4" action="#" method="post">
    <div class="text-left">
      <label for="otp-code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification code</label>
      <input
        id="otp-code"
        name="code"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        pattern="[0-9]*"
        maxlength="6"
        required
        placeholder="000000"
        class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-center text-lg font-semibold tracking-[0.5em] text-gray-900 placeholder:tracking-[0.5em] placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus-visible:ring-blue-400"
      />
    </div>
    <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Verify</button>
  </form>

  <button type="button" class="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400">Resend code</button>
</div>`,
      react: `import { useId, useState } from 'react';

export function SignInWith2faCode({
  title = 'Two-factor authentication',
  length = 6,
  onSubmit,
  onResend,
  className = '',
}) {
  const codeId = useId();
  const [code, setCode] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(code);
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Enter the {length}-digit code from your authenticator app.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="text-left">
          <label htmlFor={codeId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification code</label>
          <input
            id={codeId}
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={length}
            required
            placeholder="000000"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\\D/g, '').slice(0, length))}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-center text-lg font-semibold tracking-[0.5em] text-gray-900 placeholder:tracking-[0.5em] placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus-visible:ring-blue-400"
          />
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Verify</button>
      </form>

      <button type="button" onClick={() => onResend?.()} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400">Resend code</button>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface SignInWith2faCodeProps {
  title?: string;
  length?: number;
  onSubmit?: (code: string) => void;
  onResend?: () => void;
  className?: string;
}

export function SignInWith2faCode({
  title = 'Two-factor authentication',
  length = 6,
  onSubmit,
  onResend,
  className = '',
}: SignInWith2faCodeProps): JSX.Element {
  const codeId = useId();
  const [code, setCode] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(code);
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Enter the {length}-digit code from your authenticator app.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="text-left">
          <label htmlFor={codeId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification code</label>
          <input
            id={codeId}
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={length}
            required
            placeholder="000000"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\\D/g, '').slice(0, length))}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-center text-lg font-semibold tracking-[0.5em] text-gray-900 placeholder:tracking-[0.5em] placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus-visible:ring-blue-400"
          />
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Verify</button>
      </form>

      <button type="button" onClick={() => onResend?.()} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400">Resend code</button>
    </div>
  );
}`,
    },
  },
  {
    slug: 'signin-minimal',
    category: 'sign-in',
    tags: ['sign-in', 'login', 'minimal', 'bare', 'form'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'submitLabel', type: 'string', default: "'Continue'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(data: { email: string; password: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  No card, no border, no shadow - just the form on the page background. Useful
  when the sign-in already sits inside a framed container. Labels are still real
  <label> elements; minimal is a visual choice, not a semantic discount.
-->
<form class="mx-auto w-full max-w-xs space-y-4" action="#" method="post">
  <div>
    <label for="min-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
    <input id="min-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
  </div>
  <div>
    <label for="min-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
    <input id="min-password" name="password" type="password" autocomplete="current-password" required placeholder="••••••••" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
  </div>
  <button type="submit" class="w-full rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950">Continue</button>
</form>`,
      react: `import { useId, useState } from 'react';

export function SignInMinimal({
  submitLabel = 'Continue',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className={\`mx-auto w-full max-w-xs space-y-4 \${className}\`}>
      <div>
        <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>
      <button type="submit" className="w-full rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface SignInMinimalProps {
  submitLabel?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

export function SignInMinimal({
  submitLabel = 'Continue',
  onSubmit,
  className = '',
}: SignInMinimalProps): JSX.Element {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className={\`mx-auto w-full max-w-xs space-y-4 \${className}\`}>
      <div>
        <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>
      <button type="submit" className="w-full rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white dark:focus-visible:ring-gray-100 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'signin-gradient-side',
    category: 'sign-in',
    tags: ['sign-in', 'login', 'gradient', 'panel', 'split'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'left', labelKey: 'left' },
    ],
    props: [
      { name: 'brand', type: 'string', default: "'Adysre'", descriptionKey: 'brand' },
      { name: 'tagline', type: 'string', descriptionKey: 'tagline' },
      { name: 'onSubmit', type: '(data: { email: string; password: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A gradient brand panel and a form panel. Below md the gradient panel becomes a
  short header strip above the form (order-first) rather than vanishing - it
  carries the brand, so it stays, just reduced. Text on the gradient is solid
  white/blue-100 for reliable contrast on the coloured surface.
-->
<div class="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 shadow-sm md:grid-cols-2 dark:border-gray-800">
  <div class="flex flex-col justify-center gap-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:p-10">
    <p class="text-lg font-bold text-white">Adysre</p>
    <p class="text-sm text-blue-100">One login for every tool your team runs on.</p>
  </div>

  <div class="bg-white p-6 sm:p-8 dark:bg-gray-950">
    <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in</h1>
    <form class="mt-6 space-y-4" action="#" method="post">
      <div>
        <label for="grad-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id="grad-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label for="grad-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input id="grad-password" name="password" type="password" autocomplete="current-password" required placeholder="••••••••" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>
      <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
    </form>
  </div>
</div>`,
      react: `import { useId, useState } from 'react';

export function SignInGradientSide({
  brand = 'Adysre',
  tagline = 'One login for every tool your team runs on.',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={\`mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 shadow-sm md:grid-cols-2 dark:border-gray-800 \${className}\`}>
      <div className="flex flex-col justify-center gap-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:p-10">
        <p className="text-lg font-bold text-white">{brand}</p>
        <p className="text-sm text-blue-100">{tagline}</p>
      </div>

      <div className="bg-white p-6 sm:p-8 dark:bg-gray-950">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <div>
            <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
        </form>
      </div>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface SignInGradientSideProps {
  brand?: string;
  tagline?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

export function SignInGradientSide({
  brand = 'Adysre',
  tagline = 'One login for every tool your team runs on.',
  onSubmit,
  className = '',
}: SignInGradientSideProps): JSX.Element {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={\`mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 shadow-sm md:grid-cols-2 dark:border-gray-800 \${className}\`}>
      <div className="flex flex-col justify-center gap-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:p-10">
        <p className="text-lg font-bold text-white">{brand}</p>
        <p className="text-sm text-blue-100">{tagline}</p>
      </div>

      <div className="bg-white p-6 sm:p-8 dark:bg-gray-950">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <div>
            <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
        </form>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'signin-boxed-logo',
    category: 'sign-in',
    tags: ['sign-in', 'login', 'logo', 'brand', 'card'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'brand', type: 'string', default: "'Adysre'", descriptionKey: 'brand' },
      { name: 'onSubmit', type: '(data: { email: string; password: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A boxed logo badge sits above the card and centres over it. The logo is a
  gradient square with the brand initial - no external asset - and it is
  aria-hidden because the brand name is written out just beneath it, so a screen
  reader is not made to read the same brand twice.
-->
<div class="mx-auto w-full max-w-sm">
  <div class="flex flex-col items-center">
    <span aria-hidden="true" class="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-sm">A</span>
    <h1 class="mt-3 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in to Adysre</h1>
  </div>

  <form class="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950" action="#" method="post">
    <div>
      <label for="boxed-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input id="boxed-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="boxed-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
      <input id="boxed-password" name="password" type="password" autocomplete="current-password" required placeholder="••••••••" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
    </div>
    <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
  </form>
</div>`,
      react: `import { useId, useState } from 'react';

export function SignInBoxedLogo({
  brand = 'Adysre',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const initial = brand.trim().charAt(0).toUpperCase() || 'A';

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={\`mx-auto w-full max-w-sm \${className}\`}>
      <div className="flex flex-col items-center">
        <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-sm">{initial}</span>
        <h1 className="mt-3 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in to {brand}</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
      </form>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface SignInBoxedLogoProps {
  brand?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

export function SignInBoxedLogo({
  brand = 'Adysre',
  onSubmit,
  className = '',
}: SignInBoxedLogoProps): JSX.Element {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const initial = brand.trim().charAt(0).toUpperCase() || 'A';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={\`mx-auto w-full max-w-sm \${className}\`}>
      <div className="flex flex-col items-center">
        <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-sm">{initial}</span>
        <h1 className="mt-3 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in to {brand}</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
      </form>
    </div>
  );
}`,
    },
  },
  {
    slug: 'signin-inline-error',
    category: 'sign-in',
    tags: ['sign-in', 'login', 'error', 'validation', 'aria'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'error', labelKey: 'error' },
    ],
    props: [
      { name: 'error', type: 'string', descriptionKey: 'error' },
      { name: 'onSubmit', type: '(data: { email: string; password: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The error state, done properly. The alert is role="alert" so it is announced
  the moment it appears; the password field carries aria-invalid="true" and
  aria-describedby pointing at the message, so a screen reader ties the two
  together. Colour is a redundant cue, never the only one - the text says what is
  wrong.
-->
<form class="mx-auto w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950" action="#" method="post">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in</h1>

  <div role="alert" class="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
    <span aria-hidden="true" class="mt-px font-bold">!</span>
    <span>That email and password don't match. Try again.</span>
  </div>

  <div>
    <label for="err-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
    <input id="err-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
  </div>

  <div>
    <label for="err-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
    <input id="err-password" name="password" type="password" autocomplete="current-password" required aria-invalid="true" aria-describedby="err-password-msg" placeholder="••••••••" class="mt-1.5 w-full rounded-lg border border-red-400 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-500 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-red-400" />
    <p id="err-password-msg" class="mt-1.5 text-xs text-red-600 dark:text-red-400">Check your password and try again.</p>
  </div>

  <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
</form>`,
      react: `import { useId, useState } from 'react';

export function SignInInlineError({
  error = "That email and password don't match. Try again.",
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className={\`mx-auto w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in</h1>

      {error ? (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <span aria-hidden="true" className="mt-px font-bold">!</span>
          <span>{error}</span>
        </div>
      ) : null}

      <div>
        <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>

      <div>
        <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input id={passwordId} name="password" type="password" autoComplete="current-password" required aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className={\`mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 \${error ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500 dark:focus-visible:ring-red-400' : 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400'}\`} />
        {error ? <p id={errorId} className="mt-1.5 text-xs text-red-600 dark:text-red-400">Check your password and try again.</p> : null}
      </div>

      <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface SignInInlineErrorProps {
  /** Show the error state when set; omit for the clean state. */
  error?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

export function SignInInlineError({
  error = "That email and password don't match. Try again.",
  onSubmit,
  className = '',
}: SignInInlineErrorProps): JSX.Element {
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className={\`mx-auto w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in</h1>

      {error ? (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <span aria-hidden="true" className="mt-px font-bold">!</span>
          <span>{error}</span>
        </div>
      ) : null}

      <div>
        <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>

      <div>
        <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={\`mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 \${error ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500 dark:focus-visible:ring-red-400' : 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400'}\`}
        />
        {error ? <p id={errorId} className="mt-1.5 text-xs text-red-600 dark:text-red-400">Check your password and try again.</p> : null}
      </div>

      <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'signin-remember-forgot',
    category: 'sign-in',
    tags: ['sign-in', 'login', 'remember-me', 'forgot-password', 'checkbox'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'forgotHref', type: 'string', default: "'#'", descriptionKey: 'forgotHref' },
      { name: 'onSubmit', type: '(data: { email: string; password: string; remember: boolean }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The remember/forgot row is the detail people get wrong. "Remember me" is a real
  checkbox with a real <label> (click the words, not just the 16px box), and
  "Forgot password?" is an <a>, not a <button> styled like a link - it navigates.
  The row wraps at 320px instead of forcing a horizontal scroll.
-->
<form class="mx-auto w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950" action="#" method="post">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in</h1>

  <div>
    <label for="rf-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
    <input id="rf-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
  </div>

  <div>
    <label for="rf-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
    <input id="rf-password" name="password" type="password" autocomplete="current-password" required placeholder="••••••••" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
  </div>

  <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
    <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
      <input type="checkbox" name="remember" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:focus-visible:ring-blue-400" />
      Remember me
    </label>
    <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400">Forgot password?</a>
  </div>

  <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
</form>`,
      react: `import { useId, useState } from 'react';

export function SignInRememberForgot({
  forgotHref = '#',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.({ email, password, remember });
  }

  return (
    <form onSubmit={handleSubmit} className={\`mx-auto w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in</h1>

      <div>
        <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>

      <div>
        <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" name="remember" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:focus-visible:ring-blue-400" />
          Remember me
        </label>
        <a href={forgotHref} className="text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400">Forgot password?</a>
      </div>

      <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface SignInRememberForgotProps {
  forgotHref?: string;
  onSubmit?: (data: { email: string; password: string; remember: boolean }) => void;
  className?: string;
}

export function SignInRememberForgot({
  forgotHref = '#',
  onSubmit,
  className = '',
}: SignInRememberForgotProps): JSX.Element {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ email, password, remember });
  }

  return (
    <form onSubmit={handleSubmit} className={\`mx-auto w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in</h1>

      <div>
        <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id={emailId} name="email" type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>

      <div>
        <label htmlFor={passwordId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input id={passwordId} name="password" type="password" autoComplete="current-password" required placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" name="remember" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:focus-visible:ring-blue-400" />
          Remember me
        </label>
        <a href={forgotHref} className="text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400">Forgot password?</a>
      </div>

      <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Sign in</button>
    </form>
  );
}`,
    },
  },
];
