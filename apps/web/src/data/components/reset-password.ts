import type { ComponentEntry } from './types';

/**
 * Reset-password category.
 *
 * Ten password-recovery UIs that differ in flow and state, not in colour: the
 * request-a-link form, the set-a-new-password form, a one-time-code step, a
 * branded card, the "link sent" confirmation, the "all done" success screen, a
 * form with a live strength meter, a two-column split, an expired-link error
 * with a resend, and a chrome-free minimal form.
 *
 * These are DISPLAY components. The `<form>` is real and the semantics are real
 * - a `<label>` per field, `type="email"`/`type="password"`, the right
 * `autocomplete` tokens (`email`, `new-password`, `one-time-code`), a genuine
 * `type="submit"` button - but nothing here sends a reset or posts anywhere.
 * `onSubmit`/`onResend` are caller-supplied callbacks with a no-op default; wire
 * them to your own backend on the way out. The shared constraint is the one
 * every credential form has: the label must be a real `<label>` (a placeholder
 * is not a name), and a password toggle must swap the input `type`, never expose
 * the value through a second plaintext field.
 */
export const resetPasswordComponents: ComponentEntry[] = [
  {
    slug: 'reset-password-request-email',
    category: 'reset-password',
    tags: ['reset-password', 'forgot-password', 'email', 'form', 'auth'],
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
      { name: 'title', type: 'string', default: "'Forgot your password?'", descriptionKey: 'title' },
      { name: 'subtitle', type: 'string', descriptionKey: 'subtitle' },
      { name: 'submitLabel', type: 'string', default: "'Send reset link'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(data: { email: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Step one of a reset: collect the email, mail a link. type="email" earns the
  right mobile keyboard and free validation; autocomplete="email" lets the
  browser fill it. The card is w-full max-w-sm so it fills a phone and settles at
  a readable width on desktop.
-->
<div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Forgot your password?</h1>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Enter your email and we'll send a reset link.</p>

  <form class="mt-6 space-y-4" action="#" method="post">
    <div>
      <label for="rp-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input
        id="rp-email"
        name="email"
        type="email"
        autocomplete="email"
        required
        placeholder="you@company.com"
        class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />
    </div>

    <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Send reset link
    </button>
  </form>

  <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
    <a href="#" class="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Back to sign in</a>
  </p>
</div>`,
      react: `import { useId, useState } from 'react';

export function ResetPasswordRequestEmail({
  title = 'Forgot your password?',
  subtitle = "Enter your email and we'll send a reset link.",
  submitLabel = 'Send reset link',
  onSubmit = () => {},
  className = '',
}) {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    // Display component: no network call. Hand the value to the caller.
    onSubmit({ email });
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

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          {submitLabel}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <a href="#" className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Back to sign in</a>
      </p>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ResetPasswordRequestEmailProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  /** No-op by default - this is a UI component, not an auth client. */
  onSubmit?: (data: { email: string }) => void;
  className?: string;
}

export function ResetPasswordRequestEmail({
  title = 'Forgot your password?',
  subtitle = "Enter your email and we'll send a reset link.",
  submitLabel = 'Send reset link',
  onSubmit = () => {},
  className = '',
}: ResetPasswordRequestEmailProps): JSX.Element {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({ email });
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

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          {submitLabel}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <a href="#" className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Back to sign in</a>
      </p>
    </div>
  );
}`,
    },
  },
  {
    slug: 'reset-password-new-password',
    category: 'reset-password',
    tags: ['reset-password', 'new-password', 'confirm', 'form', 'auth'],
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
      { name: 'title', type: 'string', default: "'Set a new password'", descriptionKey: 'title' },
      { name: 'subtitle', type: 'string', descriptionKey: 'subtitle' },
      { name: 'submitLabel', type: 'string', default: "'Update password'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(data: { password: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Step two: choose a new password, confirm it. Both fields carry
  autocomplete="new-password" so a password manager offers to generate and save,
  never to autofill the old one. The show toggle swaps the input type in JS.
-->
<div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Set a new password</h1>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Use at least 8 characters. Make it hard to guess.</p>

  <form class="mt-6 space-y-4" action="#" method="post">
    <div>
      <label for="rp-new" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
      <div class="relative mt-1.5">
        <input
          id="rp-new"
          name="password"
          type="password"
          autocomplete="new-password"
          required
          minlength="8"
          placeholder="At least 8 characters"
          class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 pr-16 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button type="button" class="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400">Show</button>
      </div>
    </div>

    <div>
      <label for="rp-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
      <input
        id="rp-confirm"
        name="confirm"
        type="password"
        autocomplete="new-password"
        required
        placeholder="Re-enter your password"
        class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />
    </div>

    <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Update password
    </button>
  </form>
</div>`,
      react: `import { useId, useState } from 'react';

export function ResetPasswordNewPassword({
  title = 'Set a new password',
  subtitle = 'Use at least 8 characters. Make it hard to guess.',
  submitLabel = 'Update password',
  onSubmit = () => {},
  className = '',
}) {
  const newId = useId();
  const confirmId = useId();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const mismatch = confirm.length > 0 && confirm !== password;

  function handleSubmit(event) {
    event.preventDefault();
    if (mismatch) return;
    onSubmit({ password });
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={newId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
          <div className="relative mt-1.5">
            <input
              id={newId}
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="At least 8 characters"
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

        <div>
          <label htmlFor={confirmId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
          <input
            id={confirmId}
            name="confirm"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            required
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            aria-invalid={mismatch}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[invalid=true]:border-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
          {mismatch ? <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">Passwords do not match.</p> : null}
        </div>

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          {submitLabel}
        </button>
      </form>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ResetPasswordNewPasswordProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  onSubmit?: (data: { password: string }) => void;
  className?: string;
}

export function ResetPasswordNewPassword({
  title = 'Set a new password',
  subtitle = 'Use at least 8 characters. Make it hard to guess.',
  submitLabel = 'Update password',
  onSubmit = () => {},
  className = '',
}: ResetPasswordNewPasswordProps): JSX.Element {
  const newId = useId();
  const confirmId = useId();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const mismatch = confirm.length > 0 && confirm !== password;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (mismatch) return;
    onSubmit({ password });
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={newId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
          <div className="relative mt-1.5">
            <input
              id={newId}
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="At least 8 characters"
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

        <div>
          <label htmlFor={confirmId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
          <input
            id={confirmId}
            name="confirm"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            required
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            aria-invalid={mismatch}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[invalid=true]:border-red-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
          {mismatch ? <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">Passwords do not match.</p> : null}
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
    slug: 'reset-password-otp-code',
    category: 'reset-password',
    tags: ['reset-password', 'otp', 'one-time-code', 'verification', 'auth'],
    difficulty: 'intermediate',
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
      { name: 'title', type: 'string', default: "'Enter the code'", descriptionKey: 'title' },
      { name: 'email', type: 'string', descriptionKey: 'email' },
      { name: 'length', type: 'number', default: '6', descriptionKey: 'length' },
      { name: 'submitLabel', type: 'string', default: "'Verify code'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(data: { code: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'onResend', type: '() => void', descriptionKey: 'onResend' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A single field for the code, not six boxes: one input with inputmode="numeric"
  and autocomplete="one-time-code" is what lets iOS and Android offer the SMS
  code from the keyboard, and it stays a real labelled field for a screen reader.
  The wide tracking just makes the digits read like separate cells.
-->
<div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Enter the code</h1>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">We sent a 6-digit code to your email.</p>

  <form class="mt-6 space-y-4" action="#" method="post">
    <div>
      <label for="rp-code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification code</label>
      <input
        id="rp-code"
        name="code"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        autocomplete="one-time-code"
        maxlength="6"
        required
        placeholder="------"
        class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-center text-lg font-semibold tracking-[0.5em] text-gray-900 placeholder:tracking-[0.5em] placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400"
      />
    </div>

    <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Verify code
    </button>
  </form>

  <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
    Didn't get it?
    <button type="button" class="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Resend</button>
  </p>
</div>`,
      react: `import { useId, useState } from 'react';

export function ResetPasswordOtpCode({
  title = 'Enter the code',
  email,
  length = 6,
  submitLabel = 'Verify code',
  onSubmit = () => {},
  onResend = () => {},
  className = '',
}) {
  const codeId = useId();
  const [code, setCode] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ code });
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        We sent a {length}-digit code to {email ?? 'your email'}.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={codeId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification code</label>
          <input
            id={codeId}
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={length}
            required
            placeholder="------"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\\D/g, ''))}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-center text-lg font-semibold tracking-[0.5em] text-gray-900 placeholder:tracking-[0.5em] placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400"
          />
        </div>

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          {submitLabel}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Didn't get it?{' '}
        <button type="button" onClick={onResend} className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Resend</button>
      </p>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ResetPasswordOtpCodeProps {
  title?: string;
  email?: string;
  length?: number;
  submitLabel?: string;
  onSubmit?: (data: { code: string }) => void;
  onResend?: () => void;
  className?: string;
}

export function ResetPasswordOtpCode({
  title = 'Enter the code',
  email,
  length = 6,
  submitLabel = 'Verify code',
  onSubmit = () => {},
  onResend = () => {},
  className = '',
}: ResetPasswordOtpCodeProps): JSX.Element {
  const codeId = useId();
  const [code, setCode] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({ code });
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        We sent a {length}-digit code to {email ?? 'your email'}.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={codeId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification code</label>
          <input
            id={codeId}
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={length}
            required
            placeholder="------"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\\D/g, ''))}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-center text-lg font-semibold tracking-[0.5em] text-gray-900 placeholder:tracking-[0.5em] placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400"
          />
        </div>

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          {submitLabel}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Didn't get it?{' '}
        <button type="button" onClick={onResend} className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Resend</button>
      </p>
    </div>
  );
}`,
    },
  },
  {
    slug: 'reset-password-card',
    category: 'reset-password',
    tags: ['reset-password', 'card', 'branded', 'lock', 'auth'],
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
      { name: 'title', type: 'string', default: "'Reset password'", descriptionKey: 'title' },
      { name: 'subtitle', type: 'string', descriptionKey: 'subtitle' },
      { name: 'submitLabel', type: 'string', default: "'Reset password'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(data: { password: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A branded reset card: a lock badge, a centred heading, one new-password field.
  The icon is aria-hidden - it decorates the heading, which already names the
  screen. w-full max-w-sm keeps it phone-first.
-->
<div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
  <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  </span>
  <h1 class="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Reset password</h1>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Choose a new password for your account.</p>

  <form class="mt-6 space-y-4 text-left" action="#" method="post">
    <div>
      <label for="rp-card-pw" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
      <input
        id="rp-card-pw"
        name="password"
        type="password"
        autocomplete="new-password"
        required
        minlength="8"
        placeholder="At least 8 characters"
        class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />
    </div>

    <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Reset password
    </button>
  </form>
</div>`,
      react: `import { useId, useState } from 'react';

export function ResetPasswordCard({
  title = 'Reset password',
  subtitle = 'Choose a new password for your account.',
  submitLabel = 'Reset password',
  onSubmit = () => {},
  className = '',
}) {
  const pwId = useId();
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ password });
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
        <div>
          <label htmlFor={pwId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
          <input
            id={pwId}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
        </div>

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          {submitLabel}
        </button>
      </form>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ResetPasswordCardProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  onSubmit?: (data: { password: string }) => void;
  className?: string;
}

export function ResetPasswordCard({
  title = 'Reset password',
  subtitle = 'Choose a new password for your account.',
  submitLabel = 'Reset password',
  onSubmit = () => {},
  className = '',
}: ResetPasswordCardProps): JSX.Element {
  const pwId = useId();
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({ password });
  }

  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
        <div>
          <label htmlFor={pwId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
          <input
            id={pwId}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
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
    slug: 'reset-password-link-sent',
    category: 'reset-password',
    tags: ['reset-password', 'confirmation', 'email-sent', 'state', 'auth'],
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
      { name: 'email', type: 'string', descriptionKey: 'email' },
      { name: 'resendLabel', type: 'string', default: "'Resend email'", descriptionKey: 'resendLabel' },
      { name: 'onResend', type: '() => void', descriptionKey: 'onResend' },
      { name: 'backHref', type: 'string', default: "'#'", descriptionKey: 'backHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The confirmation state after a reset request. No form field - the action is
  over. The mail icon is aria-hidden and the heading is the h1, so the screen
  reader announces the outcome, not the decoration.
-->
<div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
  <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  </span>
  <h1 class="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Check your email</h1>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
    We sent a password reset link to <span class="font-medium text-gray-900 dark:text-gray-100">you@company.com</span>. It expires in 30 minutes.
  </p>

  <button type="button" class="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Resend email
  </button>

  <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
    <a href="#" class="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Back to sign in</a>
  </p>
</div>`,
      react: `export function ResetPasswordLinkSent({
  email = 'your inbox',
  resendLabel = 'Resend email',
  onResend = () => {},
  backHref = '#',
  className = '',
}) {
  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Check your email</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        We sent a password reset link to <span className="font-medium text-gray-900 dark:text-gray-100">{email}</span>. It expires in 30 minutes.
      </p>

      <button type="button" onClick={onResend} className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {resendLabel}
      </button>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <a href={backHref} className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Back to sign in</a>
      </p>
    </div>
  );
}`,
      typescript: `export interface ResetPasswordLinkSentProps {
  email?: string;
  resendLabel?: string;
  onResend?: () => void;
  backHref?: string;
  className?: string;
}

export function ResetPasswordLinkSent({
  email = 'your inbox',
  resendLabel = 'Resend email',
  onResend = () => {},
  backHref = '#',
  className = '',
}: ResetPasswordLinkSentProps): JSX.Element {
  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Check your email</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        We sent a password reset link to <span className="font-medium text-gray-900 dark:text-gray-100">{email}</span>. It expires in 30 minutes.
      </p>

      <button type="button" onClick={onResend} className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {resendLabel}
      </button>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <a href={backHref} className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Back to sign in</a>
      </p>
    </div>
  );
}`,
    },
  },
  {
    slug: 'reset-password-success',
    category: 'reset-password',
    tags: ['reset-password', 'success', 'done', 'state', 'auth'],
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
      { name: 'title', type: 'string', default: "'Password updated'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'ctaLabel', type: 'string', default: "'Continue to sign in'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The all-done state. The green check is aria-hidden - colour and glyph are not
  the message, the heading is. The CTA is a link because it navigates onward to
  sign in, not a button that submits.
-->
<div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
  <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-6 w-6"><path d="m5 13 4 4L19 7" /></svg>
  </span>
  <h1 class="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Password updated</h1>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Your password has been changed. You can now sign in with your new password.</p>

  <a href="#" class="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Continue to sign in
  </a>
</div>`,
      react: `export function ResetPasswordSuccess({
  title = 'Password updated',
  message = 'Your password has been changed. You can now sign in with your new password.',
  ctaLabel = 'Continue to sign in',
  ctaHref = '#',
  className = '',
}) {
  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-6 w-6"><path d="m5 13 4 4L19 7" /></svg>
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {message ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p> : null}

      <a href={ctaHref} className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {ctaLabel}
      </a>
    </div>
  );
}`,
      typescript: `export interface ResetPasswordSuccessProps {
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function ResetPasswordSuccess({
  title = 'Password updated',
  message = 'Your password has been changed. You can now sign in with your new password.',
  ctaLabel = 'Continue to sign in',
  ctaHref = '#',
  className = '',
}: ResetPasswordSuccessProps): JSX.Element {
  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-6 w-6"><path d="m5 13 4 4L19 7" /></svg>
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {message ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p> : null}

      <a href={ctaHref} className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {ctaLabel}
      </a>
    </div>
  );
}`,
    },
  },
  {
    slug: 'reset-password-with-strength',
    category: 'reset-password',
    tags: ['reset-password', 'strength-meter', 'new-password', 'form', 'auth'],
    difficulty: 'intermediate',
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
      { name: 'title', type: 'string', default: "'Choose a new password'", descriptionKey: 'title' },
      { name: 'submitLabel', type: 'string', default: "'Save password'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(data: { password: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A new-password field with a live strength meter. The meter itself is decorative
  (aria-hidden); the strength is also stated in words in an aria-live region so a
  screen reader hears "Password strength: Strong", not four coloured bars.
  Interactivity is required, so the static markup shows the empty state only.
-->
<form class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950" action="#" method="post">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Choose a new password</h1>

  <div class="mt-6">
    <label for="rp-strength" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
    <input
      id="rp-strength"
      name="password"
      type="password"
      autocomplete="new-password"
      required
      minlength="8"
      aria-describedby="rp-strength-label"
      placeholder="At least 8 characters"
      class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
    />
    <div class="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
      <span class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-800"></span>
      <span class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-800"></span>
      <span class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-800"></span>
      <span class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-800"></span>
    </div>
    <p id="rp-strength-label" class="mt-1.5 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">Password strength: Enter a password</p>
  </div>

  <button type="submit" class="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Save password
  </button>
</form>`,
      react: `import { useId, useState } from 'react';

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const BARS = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-lime-500', 'bg-green-500'];

function scorePassword(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
}

export function ResetPasswordWithStrength({
  title = 'Choose a new password',
  submitLabel = 'Save password',
  onSubmit = () => {},
  className = '',
}) {
  const pwId = useId();
  const [password, setPassword] = useState('');
  const score = scorePassword(password);
  const label = LABELS[score] ?? 'Too weak';
  const activeBar = BARS[score] ?? 'bg-red-500';

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ password });
  }

  return (
    <form onSubmit={handleSubmit} className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6">
        <label htmlFor={pwId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
        <input
          id={pwId}
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby={\`\${pwId}-label\`}
          placeholder="At least 8 characters"
          className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={\`h-1.5 rounded-full \${i < score ? activeBar : 'bg-gray-200 dark:bg-gray-800'}\`} />
          ))}
        </div>
        <p id={\`\${pwId}-label\`} className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
          Password strength: {password ? label : 'Enter a password'}
        </p>
      </div>

      <button type="submit" className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {submitLabel}
      </button>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;
const BARS = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-lime-500', 'bg-green-500'] as const;

function scorePassword(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
}

export interface ResetPasswordWithStrengthProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (data: { password: string }) => void;
  className?: string;
}

export function ResetPasswordWithStrength({
  title = 'Choose a new password',
  submitLabel = 'Save password',
  onSubmit = () => {},
  className = '',
}: ResetPasswordWithStrengthProps): JSX.Element {
  const pwId = useId();
  const [password, setPassword] = useState('');
  const score = scorePassword(password);
  const label = LABELS[score] ?? 'Too weak';
  const activeBar = BARS[score] ?? 'bg-red-500';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({ password });
  }

  return (
    <form onSubmit={handleSubmit} className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6">
        <label htmlFor={pwId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
        <input
          id={pwId}
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby={\`\${pwId}-label\`}
          placeholder="At least 8 characters"
          className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={\`h-1.5 rounded-full \${i < score ? activeBar : 'bg-gray-200 dark:bg-gray-800'}\`} />
          ))}
        </div>
        <p id={\`\${pwId}-label\`} className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
          Password strength: {password ? label : 'Enter a password'}
        </p>
      </div>

      <button type="submit" className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {submitLabel}
      </button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'reset-password-split',
    category: 'reset-password',
    tags: ['reset-password', 'split', 'two-column', 'responsive', 'auth'],
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
      { name: 'title', type: 'string', default: "'Reset your password'", descriptionKey: 'title' },
      { name: 'submitLabel', type: 'string', default: "'Update password'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(data: { password: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Form on the left in the DOM, decorative panel on the right. On mobile the panel
  is hidden (hidden md:flex) - it is atmosphere, not content, so it must not push
  the form below the fold on a phone. The form column always fills the width.
-->
<div class="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
  <div class="p-6 sm:p-8">
    <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Reset your password</h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Pick something you haven't used before.</p>

    <form class="mt-6 space-y-4" action="#" method="post">
      <div>
        <label for="split-new" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
        <input id="split-new" name="password" type="password" autocomplete="new-password" required minlength="8" placeholder="At least 8 characters" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label for="split-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
        <input id="split-confirm" name="confirm" type="password" autocomplete="new-password" required placeholder="Re-enter your password" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>
      <button type="submit" class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Update password</button>
    </form>
  </div>

  <div class="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:flex md:flex-col md:justify-end" aria-hidden="true">
    <p class="text-lg font-semibold text-white">One strong password, and you're back in.</p>
    <p class="mt-2 text-sm text-blue-100">Your reset link keeps the account safe until you finish.</p>
  </div>
</div>`,
      react: `import { useId, useState } from 'react';

export function ResetPasswordSplit({
  title = 'Reset your password',
  submitLabel = 'Update password',
  onSubmit = () => {},
  className = '',
}) {
  const newId = useId();
  const confirmId = useId();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (confirm !== password) return;
    onSubmit({ password });
  }

  return (
    <div className={\`mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <div className="p-6 sm:p-8">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Pick something you haven't used before.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={newId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
            <input id={newId} name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <div>
            <label htmlFor={confirmId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
            <input id={confirmId} name="confirm" type="password" autoComplete="new-password" required placeholder="Re-enter your password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
        </form>
      </div>

      <div className="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:flex md:flex-col md:justify-end" aria-hidden="true">
        <p className="text-lg font-semibold text-white">One strong password, and you're back in.</p>
        <p className="mt-2 text-sm text-blue-100">Your reset link keeps the account safe until you finish.</p>
      </div>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ResetPasswordSplitProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (data: { password: string }) => void;
  className?: string;
}

export function ResetPasswordSplit({
  title = 'Reset your password',
  submitLabel = 'Update password',
  onSubmit = () => {},
  className = '',
}: ResetPasswordSplitProps): JSX.Element {
  const newId = useId();
  const confirmId = useId();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (confirm !== password) return;
    onSubmit({ password });
  }

  return (
    <div className={\`mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <div className="p-6 sm:p-8">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Pick something you haven't used before.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={newId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
            <input id={newId} name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <div>
            <label htmlFor={confirmId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
            <input id={confirmId} name="confirm" type="password" autoComplete="new-password" required placeholder="Re-enter your password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
        </form>
      </div>

      <div className="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:flex md:flex-col md:justify-end" aria-hidden="true">
        <p className="text-lg font-semibold text-white">One strong password, and you're back in.</p>
        <p className="mt-2 text-sm text-blue-100">Your reset link keeps the account safe until you finish.</p>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'reset-password-expired-link',
    category: 'reset-password',
    tags: ['reset-password', 'expired', 'error', 'resend', 'auth'],
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
      { name: 'title', type: 'string', default: "'This link has expired'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'resendLabel', type: 'string', default: "'Request a new link'", descriptionKey: 'resendLabel' },
      { name: 'onResend', type: '() => void', descriptionKey: 'onResend' },
      { name: 'backHref', type: 'string', default: "'#'", descriptionKey: 'backHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The error state for a stale or used reset link. The warning glyph is amber and
  aria-hidden; the heading carries the meaning. The primary action is Request a
  new link, so the flow never dead-ends here.
-->
<div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
  <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
  </span>
  <h1 class="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">This link has expired</h1>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Reset links are valid for 30 minutes. Request a fresh one and we'll email it right over.</p>

  <button type="button" class="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Request a new link
  </button>

  <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
    <a href="#" class="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Back to sign in</a>
  </p>
</div>`,
      react: `export function ResetPasswordExpiredLink({
  title = 'This link has expired',
  message = "Reset links are valid for 30 minutes. Request a fresh one and we'll email it right over.",
  resendLabel = 'Request a new link',
  onResend = () => {},
  backHref = '#',
  className = '',
}) {
  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {message ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p> : null}

      <button type="button" onClick={onResend} className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {resendLabel}
      </button>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <a href={backHref} className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Back to sign in</a>
      </p>
    </div>
  );
}`,
      typescript: `export interface ResetPasswordExpiredLinkProps {
  title?: string;
  message?: string;
  resendLabel?: string;
  onResend?: () => void;
  backHref?: string;
  className?: string;
}

export function ResetPasswordExpiredLink({
  title = 'This link has expired',
  message = "Reset links are valid for 30 minutes. Request a fresh one and we'll email it right over.",
  resendLabel = 'Request a new link',
  onResend = () => {},
  backHref = '#',
  className = '',
}: ResetPasswordExpiredLinkProps): JSX.Element {
  return (
    <div className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {message ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p> : null}

      <button type="button" onClick={onResend} className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {resendLabel}
      </button>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <a href={backHref} className="font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">Back to sign in</a>
      </p>
    </div>
  );
}`,
    },
  },
  {
    slug: 'reset-password-minimal',
    category: 'reset-password',
    tags: ['reset-password', 'minimal', 'bare', 'email', 'auth'],
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
      { name: 'title', type: 'string', default: "'Reset password'", descriptionKey: 'title' },
      { name: 'submitLabel', type: 'string', default: "'Send link'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(data: { email: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  No card, no border - the bare form for embedding in a page that already frames
  it. Still a real <label> and type="email"; stripping the chrome does not strip
  the semantics.
-->
<form class="mx-auto w-full max-w-sm" action="#" method="post">
  <h1 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">Reset password</h1>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">We'll email you a link to reset it.</p>

  <div class="mt-5">
    <label for="rp-min-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
    <input
      id="rp-min-email"
      name="email"
      type="email"
      autocomplete="email"
      required
      placeholder="you@company.com"
      class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
    />
  </div>

  <button type="submit" class="mt-4 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Send link
  </button>
</form>`,
      react: `import { useId, useState } from 'react';

export function ResetPasswordMinimal({
  title = 'Reset password',
  submitLabel = 'Send link',
  onSubmit = () => {},
  className = '',
}) {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ email });
  }

  return (
    <form onSubmit={handleSubmit} className={\`mx-auto w-full max-w-sm \${className}\`}>
      <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">We'll email you a link to reset it.</p>

      <div className="mt-5">
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

      <button type="submit" className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {submitLabel}
      </button>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ResetPasswordMinimalProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (data: { email: string }) => void;
  className?: string;
}

export function ResetPasswordMinimal({
  title = 'Reset password',
  submitLabel = 'Send link',
  onSubmit = () => {},
  className = '',
}: ResetPasswordMinimalProps): JSX.Element {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({ email });
  }

  return (
    <form onSubmit={handleSubmit} className={\`mx-auto w-full max-w-sm \${className}\`}>
      <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">We'll email you a link to reset it.</p>

      <div className="mt-5">
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

      <button type="submit" className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        {submitLabel}
      </button>
    </form>
  );
}`,
    },
  },
];
