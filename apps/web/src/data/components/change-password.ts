import type { ComponentEntry } from './types';

/**
 * Change-password category.
 *
 * Ten UI-only "change your password" forms - a basic three-field stack, a live
 * strength meter, a card, an inline settings row, a live requirements checklist,
 * a modal, a split explainer, a two-step 2FA confirm, a post-submit success
 * state, and a stripped minimal pair. The shared constraint is honesty about the
 * form itself: a real <label> per field (never a placeholder standing in for
 * one), `type="password"` with the correct `autocomplete` token so a manager
 * fills and saves the right value, a show/hide control, `aria-invalid` the
 * moment confirmation drifts from the new password, and any live feedback -
 * strength or a rules checklist - announced through `aria-live` so it reaches a
 * screen reader and not just the eye. None of these touch a credential: every
 * `onSubmit` defaults to a no-op.
 */
export const changePasswordComponents: ComponentEntry[] = [
  {
    slug: 'change-password-basic',
    category: 'change-password',
    tags: ['change-password', 'form', 'account', 'security', 'settings'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'onSubmit', type: '(values: { currentPassword: string; newPassword: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<form class="w-full max-w-sm space-y-4" novalidate>
  <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Change password</h2>

  <div>
    <label for="cp-current" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current password</label>
    <input id="cp-current" name="currentPassword" type="password" autocomplete="current-password"
      class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
  </div>

  <div>
    <label for="cp-new" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
    <input id="cp-new" name="newPassword" type="password" autocomplete="new-password"
      class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
  </div>

  <div>
    <label for="cp-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm new password</label>
    <!-- aria-invalid + a described error is the only cue a screen reader gets that the two fields disagree. -->
    <input id="cp-confirm" name="confirmPassword" type="password" autocomplete="new-password" aria-invalid="true" aria-describedby="cp-confirm-error"
      class="mt-1.5 block w-full rounded-lg border border-red-400 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-500 dark:bg-gray-900 dark:text-gray-100" />
    <p id="cp-confirm-error" role="alert" class="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">Passwords do not match.</p>
  </div>

  <div class="flex items-center gap-2">
    <input id="cp-show" type="checkbox"
      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-900" />
    <label for="cp-show" class="text-sm text-gray-600 dark:text-gray-400">Show passwords</label>
  </div>

  <button type="submit"
    class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Update password
  </button>
</form>`,
      react: `import { useId, useState } from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function ChangePasswordBasic({ onSubmit = () => {}, className = '' }) {
  const id = useId();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ currentPassword: current, newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const type = show ? 'text' : 'password';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-sm space-y-4', className)}>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Change password</h2>

      <div>
        <label htmlFor={id + '-current'} className={label}>Current password</label>
        <input id={id + '-current'} name="currentPassword" type={type} autoComplete="current-password"
          value={current} onChange={(e) => setCurrent(e.target.value)}
          className={cx(field, 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400')} />
      </div>

      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type={type} autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)}
          className={cx(field, 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400')} />
      </div>

      <div>
        <label htmlFor={id + '-confirm'} className={label}>Confirm new password</label>
        <input id={id + '-confirm'} name="confirmPassword" type={type} autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
          className={cx(
            field,
            mismatch
              ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500'
              : 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400',
          )} />
        {mismatch ? (
          <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            Passwords do not match.
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <input id={id + '-show'} type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-900" />
        <label htmlFor={id + '-show'} className="text-sm text-gray-600 dark:text-gray-400">Show passwords</label>
      </div>

      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Update password
      </button>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ChangePasswordBasicProps {
  /** No-op by default - this is a UI shell, it never touches a credential. */
  onSubmit?: (values: { currentPassword: string; newPassword: string }) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function ChangePasswordBasic({
  onSubmit = () => {},
  className = '',
}: ChangePasswordBasicProps): JSX.Element {
  const id = useId();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ currentPassword: current, newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const type = show ? 'text' : 'password';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-sm space-y-4', className)}>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Change password</h2>

      <div>
        <label htmlFor={id + '-current'} className={label}>Current password</label>
        <input id={id + '-current'} name="currentPassword" type={type} autoComplete="current-password"
          value={current} onChange={(e) => setCurrent(e.target.value)}
          className={cx(field, 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400')} />
      </div>

      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type={type} autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)}
          className={cx(field, 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400')} />
      </div>

      <div>
        <label htmlFor={id + '-confirm'} className={label}>Confirm new password</label>
        <input id={id + '-confirm'} name="confirmPassword" type={type} autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
          className={cx(
            field,
            mismatch
              ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500'
              : 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400',
          )} />
        {mismatch ? (
          <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            Passwords do not match.
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <input id={id + '-show'} type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-900" />
        <label htmlFor={id + '-show'} className="text-sm text-gray-600 dark:text-gray-400">Show passwords</label>
      </div>

      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Update password
      </button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'change-password-with-strength',
    category: 'change-password',
    tags: ['change-password', 'strength-meter', 'form', 'security', 'aria-live'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'onSubmit', type: '(values: { newPassword: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<form class="w-full max-w-sm space-y-4" novalidate>
  <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">New password</h2>

  <div>
    <label for="cp-new" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
    <input id="cp-new" name="newPassword" type="password" autocomplete="new-password" aria-describedby="cp-strength"
      class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    <!-- The meter is decorative; the aria-live line beneath it is what a screen reader hears. -->
    <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700" aria-hidden="true">
      <div class="h-full w-3/4 rounded-full bg-blue-500 transition-all motion-reduce:transition-none"></div>
    </div>
    <p id="cp-strength" aria-live="polite" class="mt-1.5 text-xs text-gray-600 dark:text-gray-400">
      Password strength: <span class="font-medium text-gray-900 dark:text-gray-100">Good</span>
    </p>
  </div>

  <div>
    <label for="cp-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm new password</label>
    <input id="cp-confirm" name="confirmPassword" type="password" autocomplete="new-password"
      class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
  </div>

  <button type="submit"
    class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Update password
  </button>
</form>`,
      react: `import { useId, useState } from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

function score(pw) {
  let n = 0;
  if (pw.length >= 8) n += 1;
  if (/[A-Z]/.test(pw)) n += 1;
  if (/[a-z]/.test(pw)) n += 1;
  if (/[0-9]/.test(pw)) n += 1;
  if (/[^A-Za-z0-9]/.test(pw)) n += 1;
  return n;
}

function meta(n) {
  if (n <= 1) return { label: 'Weak', width: 'w-1/4', bar: 'bg-red-500' };
  if (n === 2) return { label: 'Fair', width: 'w-2/4', bar: 'bg-amber-500' };
  if (n === 3) return { label: 'Good', width: 'w-3/4', bar: 'bg-blue-500' };
  return { label: 'Strong', width: 'w-full', bar: 'bg-green-500' };
}

export function ChangePasswordWithStrength({ onSubmit = () => {}, className = '' }) {
  const id = useId();
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const mismatch = confirm.length > 0 && next !== confirm;
  const strength = meta(score(next));
  const type = show ? 'text' : 'password';

  function handleSubmit(event) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-sm space-y-4', className)}>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">New password</h2>

      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type={type} autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)} aria-describedby={id + '-strength'}
          className={cx(field, 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400')} />
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700" aria-hidden="true">
          <div className={cx('h-full rounded-full transition-all motion-reduce:transition-none', next ? strength.width : 'w-0', strength.bar)} />
        </div>
        <p id={id + '-strength'} aria-live="polite" className="mt-1.5 text-xs text-gray-600 dark:text-gray-400">
          Password strength:{' '}
          <span className="font-medium text-gray-900 dark:text-gray-100">{next ? strength.label : '—'}</span>
        </p>
      </div>

      <div>
        <label htmlFor={id + '-confirm'} className={label}>Confirm new password</label>
        <input id={id + '-confirm'} name="confirmPassword" type={type} autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
          className={cx(
            field,
            mismatch
              ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500'
              : 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400',
          )} />
        {mismatch ? (
          <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            Passwords do not match.
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <input id={id + '-show'} type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-900" />
        <label htmlFor={id + '-show'} className="text-sm text-gray-600 dark:text-gray-400">Show passwords</label>
      </div>

      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Update password
      </button>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ChangePasswordWithStrengthProps {
  onSubmit?: (values: { newPassword: string }) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

// Five independent checks, so the meter cannot be gamed by repeating one class.
function score(pw: string): number {
  let n = 0;
  if (pw.length >= 8) n += 1;
  if (/[A-Z]/.test(pw)) n += 1;
  if (/[a-z]/.test(pw)) n += 1;
  if (/[0-9]/.test(pw)) n += 1;
  if (/[^A-Za-z0-9]/.test(pw)) n += 1;
  return n;
}

function meta(n: number): { label: string; width: string; bar: string } {
  if (n <= 1) return { label: 'Weak', width: 'w-1/4', bar: 'bg-red-500' };
  if (n === 2) return { label: 'Fair', width: 'w-2/4', bar: 'bg-amber-500' };
  if (n === 3) return { label: 'Good', width: 'w-3/4', bar: 'bg-blue-500' };
  return { label: 'Strong', width: 'w-full', bar: 'bg-green-500' };
}

export function ChangePasswordWithStrength({
  onSubmit = () => {},
  className = '',
}: ChangePasswordWithStrengthProps): JSX.Element {
  const id = useId();
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const mismatch = confirm.length > 0 && next !== confirm;
  const strength = meta(score(next));
  const type = show ? 'text' : 'password';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-sm space-y-4', className)}>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">New password</h2>

      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type={type} autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)} aria-describedby={id + '-strength'}
          className={cx(field, 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400')} />
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700" aria-hidden="true">
          <div className={cx('h-full rounded-full transition-all motion-reduce:transition-none', next ? strength.width : 'w-0', strength.bar)} />
        </div>
        <p id={id + '-strength'} aria-live="polite" className="mt-1.5 text-xs text-gray-600 dark:text-gray-400">
          Password strength:{' '}
          <span className="font-medium text-gray-900 dark:text-gray-100">{next ? strength.label : '—'}</span>
        </p>
      </div>

      <div>
        <label htmlFor={id + '-confirm'} className={label}>Confirm new password</label>
        <input id={id + '-confirm'} name="confirmPassword" type={type} autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
          className={cx(
            field,
            mismatch
              ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500'
              : 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400',
          )} />
        {mismatch ? (
          <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            Passwords do not match.
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <input id={id + '-show'} type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-900" />
        <label htmlFor={id + '-show'} className="text-sm text-gray-600 dark:text-gray-400">Show passwords</label>
      </div>

      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Update password
      </button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'change-password-card',
    category: 'change-password',
    tags: ['change-password', 'card', 'form', 'settings', 'account'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'onSubmit', type: '(values: { currentPassword: string; newPassword: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'onCancel', type: '() => void', descriptionKey: 'onCancel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<form class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950" novalidate>
  <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Use at least 8 characters with a mix of types.</p>

  <div class="mt-5 space-y-4">
    <div>
      <label for="cp-current" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current password</label>
      <input id="cp-current" name="currentPassword" type="password" autocomplete="current-password"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="cp-new" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
      <input id="cp-new" name="newPassword" type="password" autocomplete="new-password"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="cp-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm new password</label>
      <input id="cp-confirm" name="confirmPassword" type="password" autocomplete="new-password"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
  </div>

  <!-- Buttons stack at the narrowest width; two 130px buttons on a 320px phone are two bad targets. -->
  <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button"
      class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800">
      Cancel
    </button>
    <button type="submit"
      class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Update password
    </button>
  </div>
</form>`,
      react: `import { useId, useState } from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function ChangePasswordCard({ onSubmit = () => {}, onCancel = () => {}, className = '' }) {
  const id = useId();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ currentPassword: current, newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400';

  return (
    <form onSubmit={handleSubmit} noValidate
      className={cx('w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950', className)}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use at least 8 characters with a mix of types.</p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor={id + '-current'} className={label}>Current password</label>
          <input id={id + '-current'} name="currentPassword" type="password" autoComplete="current-password"
            value={current} onChange={(e) => setCurrent(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-new'} className={label}>New password</label>
          <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
            value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-confirm'} className={label}>Confirm new password</label>
          <input id={id + '-confirm'} name="confirmPassword" type="password" autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
            className={cx(field, mismatch ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500' : ok)} />
          {mismatch ? (
            <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              Passwords do not match.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800">
          Cancel
        </button>
        <button type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          Update password
        </button>
      </div>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ChangePasswordCardProps {
  onSubmit?: (values: { currentPassword: string; newPassword: string }) => void;
  onCancel?: () => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function ChangePasswordCard({
  onSubmit = () => {},
  onCancel = () => {},
  className = '',
}: ChangePasswordCardProps): JSX.Element {
  const id = useId();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ currentPassword: current, newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400';

  return (
    <form onSubmit={handleSubmit} noValidate
      className={cx('w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950', className)}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use at least 8 characters with a mix of types.</p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor={id + '-current'} className={label}>Current password</label>
          <input id={id + '-current'} name="currentPassword" type="password" autoComplete="current-password"
            value={current} onChange={(e) => setCurrent(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-new'} className={label}>New password</label>
          <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
            value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-confirm'} className={label}>Confirm new password</label>
          <input id={id + '-confirm'} name="confirmPassword" type="password" autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
            className={cx(field, mismatch ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500' : ok)} />
          {mismatch ? (
            <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              Passwords do not match.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800">
          Cancel
        </button>
        <button type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          Update password
        </button>
      </div>
    </form>
  );
}`,
    },
  },
  {
    slug: 'change-password-inline',
    category: 'change-password',
    tags: ['change-password', 'inline', 'settings-row', 'form', 'account'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'onSubmit', type: '(values: { newPassword: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- A settings row: description on the left, the form on the right, stacked below sm. -->
<div class="flex w-full max-w-2xl flex-col gap-4 border-b border-gray-200 py-5 sm:flex-row sm:items-start sm:justify-between dark:border-gray-800">
  <div class="sm:max-w-xs">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Password</h3>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Set a new password for your account.</p>
  </div>

  <form class="w-full space-y-3 sm:max-w-xs" novalidate>
    <div>
      <label for="cp-new" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
      <input id="cp-new" name="newPassword" type="password" autocomplete="new-password"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="cp-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
      <input id="cp-confirm" name="confirmPassword" type="password" autocomplete="new-password"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <button type="submit"
      class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 sm:w-auto">
      Save
    </button>
  </form>
</div>`,
      react: `import { useId, useState } from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function ChangePasswordInline({ onSubmit = () => {}, className = '' }) {
  const id = useId();
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400';

  return (
    <div className={cx('flex w-full max-w-2xl flex-col gap-4 border-b border-gray-200 py-5 sm:flex-row sm:items-start sm:justify-between dark:border-gray-800', className)}>
      <div className="sm:max-w-xs">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Password</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Set a new password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="w-full space-y-3 sm:max-w-xs">
        <div>
          <label htmlFor={id + '-new'} className={label}>New password</label>
          <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
            value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-confirm'} className={label}>Confirm password</label>
          <input id={id + '-confirm'} name="confirmPassword" type="password" autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
            className={cx(field, mismatch ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500' : ok)} />
          {mismatch ? (
            <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              Passwords do not match.
            </p>
          ) : null}
        </div>
        <button type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 sm:w-auto">
          Save
        </button>
      </form>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ChangePasswordInlineProps {
  onSubmit?: (values: { newPassword: string }) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function ChangePasswordInline({
  onSubmit = () => {},
  className = '',
}: ChangePasswordInlineProps): JSX.Element {
  const id = useId();
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400';

  return (
    <div className={cx('flex w-full max-w-2xl flex-col gap-4 border-b border-gray-200 py-5 sm:flex-row sm:items-start sm:justify-between dark:border-gray-800', className)}>
      <div className="sm:max-w-xs">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Password</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Set a new password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="w-full space-y-3 sm:max-w-xs">
        <div>
          <label htmlFor={id + '-new'} className={label}>New password</label>
          <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
            value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-confirm'} className={label}>Confirm password</label>
          <input id={id + '-confirm'} name="confirmPassword" type="password" autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
            className={cx(field, mismatch ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500' : ok)} />
          {mismatch ? (
            <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              Passwords do not match.
            </p>
          ) : null}
        </div>
        <button type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 sm:w-auto">
          Save
        </button>
      </form>
    </div>
  );
}`,
    },
  },
  {
    slug: 'change-password-with-requirements',
    category: 'change-password',
    tags: ['change-password', 'requirements', 'checklist', 'validation', 'aria-live'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'onSubmit', type: '(values: { newPassword: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<form class="w-full max-w-sm space-y-4" novalidate>
  <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Choose a new password</h2>

  <div>
    <label for="cp-new" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
    <input id="cp-new" name="newPassword" type="password" autocomplete="new-password" aria-describedby="cp-rules"
      class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
  </div>

  <!-- The list is the live region: as rules pass it re-announces politely, so the check state reaches a screen reader. -->
  <ul id="cp-rules" aria-live="polite" class="space-y-1.5">
    <li class="flex items-center gap-2 text-xs">
      <span aria-hidden="true" class="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white">✓</span>
      <span class="text-gray-700 dark:text-gray-300">At least 8 characters</span>
      <span class="sr-only">met</span>
    </li>
    <li class="flex items-center gap-2 text-xs">
      <span aria-hidden="true" class="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-transparent dark:bg-gray-700">✓</span>
      <span class="text-gray-500 dark:text-gray-400">One uppercase letter</span>
      <span class="sr-only">not met</span>
    </li>
    <li class="flex items-center gap-2 text-xs">
      <span aria-hidden="true" class="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-transparent dark:bg-gray-700">✓</span>
      <span class="text-gray-500 dark:text-gray-400">One number</span>
      <span class="sr-only">not met</span>
    </li>
    <li class="flex items-center gap-2 text-xs">
      <span aria-hidden="true" class="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-transparent dark:bg-gray-700">✓</span>
      <span class="text-gray-500 dark:text-gray-400">One symbol</span>
      <span class="sr-only">not met</span>
    </li>
  </ul>

  <button type="submit" disabled
    class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Update password
  </button>
</form>`,
      react: `import { useId, useState } from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function ChangePasswordWithRequirements({ onSubmit = () => {}, className = '' }) {
  const id = useId();
  const [next, setNext] = useState('');

  const rules = [
    { key: 'len', label: 'At least 8 characters', met: next.length >= 8 },
    { key: 'upper', label: 'One uppercase letter', met: /[A-Z]/.test(next) },
    { key: 'num', label: 'One number', met: /[0-9]/.test(next) },
    { key: 'sym', label: 'One symbol', met: /[^A-Za-z0-9]/.test(next) },
  ];
  const allMet = rules.every((rule) => rule.met);

  function handleSubmit(event) {
    event.preventDefault();
    if (!allMet) return;
    onSubmit({ newPassword: next });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-sm space-y-4', className)}>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Choose a new password</h2>

      <div>
        <label htmlFor={id + '-new'} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
        <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)} aria-describedby={id + '-rules'}
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>

      <ul id={id + '-rules'} aria-live="polite" className="space-y-1.5">
        {rules.map((rule) => (
          <li key={rule.key} className="flex items-center gap-2 text-xs">
            <span aria-hidden="true"
              className={cx('flex h-4 w-4 items-center justify-center rounded-full', rule.met ? 'bg-green-500 text-white' : 'bg-gray-200 text-transparent dark:bg-gray-700')}>
              ✓
            </span>
            <span className={rule.met ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}>{rule.label}</span>
            <span className="sr-only">{rule.met ? 'met' : 'not met'}</span>
          </li>
        ))}
      </ul>

      <button type="submit" disabled={!allMet}
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Update password
      </button>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ChangePasswordWithRequirementsProps {
  onSubmit?: (values: { newPassword: string }) => void;
  className?: string;
}

interface Rule {
  key: string;
  label: string;
  met: boolean;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function ChangePasswordWithRequirements({
  onSubmit = () => {},
  className = '',
}: ChangePasswordWithRequirementsProps): JSX.Element {
  const id = useId();
  const [next, setNext] = useState('');

  const rules: Rule[] = [
    { key: 'len', label: 'At least 8 characters', met: next.length >= 8 },
    { key: 'upper', label: 'One uppercase letter', met: /[A-Z]/.test(next) },
    { key: 'num', label: 'One number', met: /[0-9]/.test(next) },
    { key: 'sym', label: 'One symbol', met: /[^A-Za-z0-9]/.test(next) },
  ];
  const allMet = rules.every((rule) => rule.met);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!allMet) return;
    onSubmit({ newPassword: next });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-sm space-y-4', className)}>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Choose a new password</h2>

      <div>
        <label htmlFor={id + '-new'} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
        <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)} aria-describedby={id + '-rules'}
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>

      <ul id={id + '-rules'} aria-live="polite" className="space-y-1.5">
        {rules.map((rule) => (
          <li key={rule.key} className="flex items-center gap-2 text-xs">
            <span aria-hidden="true"
              className={cx('flex h-4 w-4 items-center justify-center rounded-full', rule.met ? 'bg-green-500 text-white' : 'bg-gray-200 text-transparent dark:bg-gray-700')}>
              ✓
            </span>
            <span className={rule.met ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}>{rule.label}</span>
            <span className="sr-only">{rule.met ? 'met' : 'not met'}</span>
          </li>
        ))}
      </ul>

      <button type="submit" disabled={!allMet}
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Update password
      </button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'change-password-modal',
    category: 'change-password',
    tags: ['change-password', 'modal', 'dialog', 'form', 'overlay'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'onSubmit', type: '(values: { currentPassword: string; newPassword: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'onClose', type: '() => void', descriptionKey: 'onClose' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="relative w-full max-w-md">
  <div class="absolute inset-0 rounded-2xl bg-black/40" aria-hidden="true"></div>
  <!-- role=dialog + aria-modal + aria-labelledby is the contract; wire focus-trap and Escape in JS. -->
  <div role="dialog" aria-modal="true" aria-labelledby="cp-title"
    class="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-950">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h2 id="cp-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter your current password to confirm.</p>
      </div>
      <button type="button" aria-label="Close"
        class="-m-1 rounded-lg p-1 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:text-gray-200">
        <svg viewBox="0 0 20 20" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m5 5 10 10M15 5 5 15" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <form class="mt-5 space-y-4" novalidate>
      <div>
        <label for="cp-current" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current password</label>
        <input id="cp-current" name="currentPassword" type="password" autocomplete="current-password"
          class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label for="cp-new" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
        <input id="cp-new" name="newPassword" type="password" autocomplete="new-password"
          class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>
      <div class="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <button type="button"
          class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800">
          Cancel
        </button>
        <button type="submit"
          class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          Update password
        </button>
      </div>
    </form>
  </div>
</div>`,
      react: `import { useId, useState } from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function ChangePasswordModal({ onSubmit = () => {}, onClose = () => {}, className = '' }) {
  const id = useId();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!next) return;
    onSubmit({ currentPassword: current, newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <div className={cx('relative w-full max-w-md', className)}>
      <div className="absolute inset-0 rounded-2xl bg-black/40" aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby={id + '-title'}
        className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={id + '-title'} className="text-lg font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter your current password to confirm.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="-m-1 rounded-lg p-1 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:text-gray-200">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div>
            <label htmlFor={id + '-current'} className={label}>Current password</label>
            <input id={id + '-current'} name="currentPassword" type="password" autoComplete="current-password"
              value={current} onChange={(e) => setCurrent(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor={id + '-new'} className={label}>New password</label>
            <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
              value={next} onChange={(e) => setNext(e.target.value)} className={field} />
          </div>
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800">
              Cancel
            </button>
            <button type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
              Update password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ChangePasswordModalProps {
  onSubmit?: (values: { currentPassword: string; newPassword: string }) => void;
  onClose?: () => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

// UI shell only. Wire a real focus-trap, Escape-to-close and body-scroll-lock at
// the call site - a dialog that keeps Tab inside itself is a hard requirement,
// not decoration, but it belongs to the host, not this markup.
export function ChangePasswordModal({
  onSubmit = () => {},
  onClose = () => {},
  className = '',
}: ChangePasswordModalProps): JSX.Element {
  const id = useId();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next) return;
    onSubmit({ currentPassword: current, newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <div className={cx('relative w-full max-w-md', className)}>
      <div className="absolute inset-0 rounded-2xl bg-black/40" aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby={id + '-title'}
        className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={id + '-title'} className="text-lg font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter your current password to confirm.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="-m-1 rounded-lg p-1 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:text-gray-200">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div>
            <label htmlFor={id + '-current'} className={label}>Current password</label>
            <input id={id + '-current'} name="currentPassword" type="password" autoComplete="current-password"
              value={current} onChange={(e) => setCurrent(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor={id + '-new'} className={label}>New password</label>
            <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
              value={next} onChange={(e) => setNext(e.target.value)} className={field} />
          </div>
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800">
              Cancel
            </button>
            <button type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
              Update password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'change-password-split',
    category: 'change-password',
    tags: ['change-password', 'split', 'two-column', 'form', 'responsive'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'onSubmit', type: '(values: { currentPassword: string; newPassword: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Two columns from md up; a single stack below it, explainer first in reading order. -->
<div class="grid w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
  <div class="border-b border-gray-200 bg-gray-50 p-6 md:border-b-0 md:border-r dark:border-gray-800 dark:bg-gray-900">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Password</h2>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Pick something long and unique. A passphrase of a few unrelated words beats a short jumble.</p>
    <ul class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
      <li class="flex gap-2"><span aria-hidden="true" class="text-green-500">✓</span> Never reused elsewhere</li>
      <li class="flex gap-2"><span aria-hidden="true" class="text-green-500">✓</span> Stored in your manager</li>
    </ul>
  </div>

  <form class="space-y-4 p-6" novalidate>
    <div>
      <label for="cp-current" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current password</label>
      <input id="cp-current" name="currentPassword" type="password" autocomplete="current-password"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="cp-new" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
      <input id="cp-new" name="newPassword" type="password" autocomplete="new-password"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="cp-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm new password</label>
      <input id="cp-confirm" name="confirmPassword" type="password" autocomplete="new-password"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <button type="submit"
      class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Update password
    </button>
  </form>
</div>`,
      react: `import { useId, useState } from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function ChangePasswordSplit({ onSubmit = () => {}, className = '' }) {
  const id = useId();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ currentPassword: current, newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400';

  return (
    <div className={cx('grid w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950', className)}>
      <div className="border-b border-gray-200 bg-gray-50 p-6 md:border-b-0 md:border-r dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Password</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Pick something long and unique. A passphrase of a few unrelated words beats a short jumble.</p>
        <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-2"><span aria-hidden="true" className="text-green-500">✓</span> Never reused elsewhere</li>
          <li className="flex gap-2"><span aria-hidden="true" className="text-green-500">✓</span> Stored in your manager</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 p-6">
        <div>
          <label htmlFor={id + '-current'} className={label}>Current password</label>
          <input id={id + '-current'} name="currentPassword" type="password" autoComplete="current-password"
            value={current} onChange={(e) => setCurrent(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-new'} className={label}>New password</label>
          <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
            value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-confirm'} className={label}>Confirm new password</label>
          <input id={id + '-confirm'} name="confirmPassword" type="password" autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
            className={cx(field, mismatch ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500' : ok)} />
          {mismatch ? (
            <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              Passwords do not match.
            </p>
          ) : null}
        </div>
        <button type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          Update password
        </button>
      </form>
    </div>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ChangePasswordSplitProps {
  onSubmit?: (values: { currentPassword: string; newPassword: string }) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function ChangePasswordSplit({
  onSubmit = () => {},
  className = '',
}: ChangePasswordSplitProps): JSX.Element {
  const id = useId();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ currentPassword: current, newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400';

  return (
    <div className={cx('grid w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950', className)}>
      <div className="border-b border-gray-200 bg-gray-50 p-6 md:border-b-0 md:border-r dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Password</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Pick something long and unique. A passphrase of a few unrelated words beats a short jumble.</p>
        <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-2"><span aria-hidden="true" className="text-green-500">✓</span> Never reused elsewhere</li>
          <li className="flex gap-2"><span aria-hidden="true" className="text-green-500">✓</span> Stored in your manager</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 p-6">
        <div>
          <label htmlFor={id + '-current'} className={label}>Current password</label>
          <input id={id + '-current'} name="currentPassword" type="password" autoComplete="current-password"
            value={current} onChange={(e) => setCurrent(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-new'} className={label}>New password</label>
          <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
            value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-confirm'} className={label}>Confirm new password</label>
          <input id={id + '-confirm'} name="confirmPassword" type="password" autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
            className={cx(field, mismatch ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500' : ok)} />
          {mismatch ? (
            <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              Passwords do not match.
            </p>
          ) : null}
        </div>
        <button type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          Update password
        </button>
      </form>
    </div>
  );
}`,
    },
  },
  {
    slug: 'change-password-2fa',
    category: 'change-password',
    tags: ['change-password', '2fa', 'verification-code', 'security', 'form'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'onSubmit', type: '(values: { newPassword: string; code: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<form class="w-full max-w-sm space-y-4" novalidate>
  <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
  <p class="text-sm text-gray-500 dark:text-gray-400">Confirm with the 6-digit code from your authenticator app.</p>

  <div>
    <label for="cp-new" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
    <input id="cp-new" name="newPassword" type="password" autocomplete="new-password"
      class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
  </div>

  <div>
    <label for="cp-code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification code</label>
    <!-- inputmode=numeric brings the digit pad; autocomplete=one-time-code lets the OS offer the SMS/app code. -->
    <input id="cp-code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456"
      class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-lg tracking-[0.4em] text-gray-900 shadow-sm placeholder:tracking-normal placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
  </div>

  <button type="submit"
    class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Confirm and update
  </button>
</form>`,
      react: `import { useId, useState } from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function ChangePassword2fa({ onSubmit = () => {}, className = '' }) {
  const id = useId();
  const [next, setNext] = useState('');
  const [code, setCode] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!next || code.length !== 6) return;
    onSubmit({ newPassword: next, code });
  }

  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-sm space-y-4', className)}>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">Confirm with the 6-digit code from your authenticator app.</p>

      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)}
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>

      <div>
        <label htmlFor={id + '-code'} className={label}>Verification code</label>
        <input id={id + '-code'} name="code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456"
          value={code} onChange={(e) => setCode(e.target.value.replace(/\\D/g, ''))}
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-lg tracking-[0.4em] text-gray-900 shadow-sm placeholder:tracking-normal placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>

      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Confirm and update
      </button>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ChangePassword2faProps {
  onSubmit?: (values: { newPassword: string; code: string }) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function ChangePassword2fa({
  onSubmit = () => {},
  className = '',
}: ChangePassword2faProps): JSX.Element {
  const id = useId();
  const [next, setNext] = useState('');
  const [code, setCode] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next || code.length !== 6) return;
    onSubmit({ newPassword: next, code });
  }

  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-sm space-y-4', className)}>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">Confirm with the 6-digit code from your authenticator app.</p>

      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)}
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>

      <div>
        <label htmlFor={id + '-code'} className={label}>Verification code</label>
        <input id={id + '-code'} name="code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456"
          value={code} onChange={(e) => setCode(e.target.value.replace(/\\D/g, ''))}
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-lg tracking-[0.4em] text-gray-900 shadow-sm placeholder:tracking-normal placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>

      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Confirm and update
      </button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'change-password-success-state',
    category: 'change-password',
    tags: ['change-password', 'success', 'confirmation', 'form', 'state'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'form', labelKey: 'form' },
      { id: 'success', labelKey: 'success' },
    ],
    props: [
      { name: 'onSubmit', type: '(values: { newPassword: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Success panel. In the form state the same card holds the two fields and a submit button. -->
<div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
    <svg viewBox="0 0 24 24" class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
      <path d="m5 13 4 4 10-10" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
  <!-- role=status so the success message is announced when it replaces the form. -->
  <div role="status">
    <h2 class="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Password updated</h2>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Your new password is now active on this account.</p>
  </div>
  <button type="button"
    class="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800">
    Back to settings
  </button>
</div>`,
      react: `import { useId, useState } from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function ChangePasswordSuccessState({ onSubmit = () => {}, className = '' }) {
  const id = useId();
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ newPassword: next });
    setDone(true);
  }

  const card = 'w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950';

  if (done) {
    return (
      <div className={cx(card, 'text-center', className)}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="m5 13 4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div role="status">
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Password updated</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your new password is now active on this account.</p>
        </div>
        <button type="button" onClick={() => setDone(false)}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800">
          Back to settings
        </button>
      </div>
    );
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx(card, 'space-y-4', className)}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
      </div>
      <div>
        <label htmlFor={id + '-confirm'} className={label}>Confirm new password</label>
        <input id={id + '-confirm'} name="confirmPassword" type="password" autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
          className={cx(field, mismatch ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500' : ok)} />
        {mismatch ? (
          <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            Passwords do not match.
          </p>
        ) : null}
      </div>
      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Update password
      </button>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ChangePasswordSuccessStateProps {
  onSubmit?: (values: { newPassword: string }) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function ChangePasswordSuccessState({
  onSubmit = () => {},
  className = '',
}: ChangePasswordSuccessStateProps): JSX.Element {
  const id = useId();
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ newPassword: next });
    setDone(true);
  }

  const card = 'w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950';

  if (done) {
    return (
      <div className={cx(card, 'text-center', className)}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="m5 13 4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div role="status">
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Password updated</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your new password is now active on this account.</p>
        </div>
        <button type="button" onClick={() => setDone(false)}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800">
          Back to settings
        </button>
      </div>
    );
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx(card, 'space-y-4', className)}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
      </div>
      <div>
        <label htmlFor={id + '-confirm'} className={label}>Confirm new password</label>
        <input id={id + '-confirm'} name="confirmPassword" type="password" autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
          className={cx(field, mismatch ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500' : ok)} />
        {mismatch ? (
          <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            Passwords do not match.
          </p>
        ) : null}
      </div>
      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Update password
      </button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'change-password-minimal',
    category: 'change-password',
    tags: ['change-password', 'minimal', 'compact', 'form', 'clean'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      { name: 'onSubmit', type: '(values: { newPassword: string }) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<form class="w-full max-w-xs space-y-3" novalidate>
  <div>
    <label for="cp-new" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
    <input id="cp-new" name="newPassword" type="password" autocomplete="new-password"
      class="mt-1 block w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm text-gray-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-0 dark:border-gray-700 dark:text-gray-100 dark:focus-visible:border-blue-400" />
  </div>
  <div>
    <label for="cp-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm</label>
    <input id="cp-confirm" name="confirmPassword" type="password" autocomplete="new-password"
      class="mt-1 block w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm text-gray-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-0 dark:border-gray-700 dark:text-gray-100 dark:focus-visible:border-blue-400" />
  </div>
  <button type="submit"
    class="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-950">
    Save
  </button>
</form>`,
      react: `import { useId, useState } from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function ChangePasswordMinimal({ onSubmit = () => {}, className = '' }) {
  const id = useId();
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ newPassword: next });
  }

  const field =
    'mt-1 block w-full border-0 border-b bg-transparent px-0 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-0 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:border-blue-600 dark:border-gray-700 dark:focus-visible:border-blue-400';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-xs space-y-3', className)}>
      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
      </div>
      <div>
        <label htmlFor={id + '-confirm'} className={label}>Confirm</label>
        <input id={id + '-confirm'} name="confirmPassword" type="password" autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
          className={cx(field, mismatch ? 'border-red-400 focus-visible:border-red-500 dark:border-red-500' : ok)} />
        {mismatch ? (
          <p id={id + '-confirm-error'} role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
            Passwords do not match.
          </p>
        ) : null}
      </div>
      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-950">
        Save
      </button>
    </form>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ChangePasswordMinimalProps {
  onSubmit?: (values: { newPassword: string }) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function ChangePasswordMinimal({
  onSubmit = () => {},
  className = '',
}: ChangePasswordMinimalProps): JSX.Element {
  const id = useId();
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ newPassword: next });
  }

  const field =
    'mt-1 block w-full border-0 border-b bg-transparent px-0 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-0 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:border-blue-600 dark:border-gray-700 dark:focus-visible:border-blue-400';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-xs space-y-3', className)}>
      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
      </div>
      <div>
        <label htmlFor={id + '-confirm'} className={label}>Confirm</label>
        <input id={id + '-confirm'} name="confirmPassword" type="password" autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
          className={cx(field, mismatch ? 'border-red-400 focus-visible:border-red-500 dark:border-red-500' : ok)} />
        {mismatch ? (
          <p id={id + '-confirm-error'} role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
            Passwords do not match.
          </p>
        ) : null}
      </div>
      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-950">
        Save
      </button>
    </form>
  );
}`,
    },
  },
];
