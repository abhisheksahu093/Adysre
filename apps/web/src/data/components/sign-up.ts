import type { ComponentEntry } from './types';

/**
 * Sign-up category.
 *
 * Ten registration-form UIs, structurally distinct rather than recoloured: a
 * plain centred card, a split with a benefits panel, social-first, a multi-step
 * shell, a live password-strength meter, a terms-consent gate, an email-only
 * capture, a gradient side panel, an invite-code gate and a boxed-logo card.
 *
 * These are DISPLAY components: every form is UI-only. `onSubmit` defaults to a
 * no-op - nothing is registered, nothing is posted - so they are safe to drop
 * into a page before the auth backend exists. The shared, load-bearing details
 * are the form semantics: a real `<label htmlFor>` per field (never a
 * placeholder standing in for one), the right `autocomplete`/`type`, a real
 * `type="submit"` button, and - for the strength meter - an `aria-live` region
 * so the score is announced as it changes rather than silently repainting.
 */
export const signUpComponents: ComponentEntry[] = [
  {
    slug: 'signup-centered-card',
    category: 'sign-up',
    tags: ['sign-up', 'register', 'card', 'form', 'auth'],
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
      { name: 'title', type: 'string', default: "'Create your account'", descriptionKey: 'title' },
      { name: 'subtitle', type: 'string', descriptionKey: 'subtitle' },
      { name: 'submitLabel', type: 'string', default: "'Create account'", descriptionKey: 'submitLabel' },
      { name: 'signInHref', type: 'string', default: "'#'", descriptionKey: 'signInHref' },
      { name: 'onSubmit', type: '(event: FormEvent<HTMLFormElement>) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A real <label for> per field, not a placeholder pretending to be one: a
  placeholder vanishes on the first keystroke and is not reliably announced.
  autocomplete + type earn the right mobile keyboard and browser autofill.
-->
<form class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950" action="#" method="post">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create your account</h1>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Start your 14-day free trial. No card required.</p>

  <div class="mt-6 space-y-4">
    <div>
      <label for="scc-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
      <input id="scc-name" name="name" type="text" autocomplete="name" required placeholder="Ada Lovelace"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    </div>
    <div>
      <label for="scc-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
      <input id="scc-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    </div>
    <div>
      <label for="scc-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
      <input id="scc-password" name="password" type="password" autocomplete="new-password" required placeholder="At least 8 characters"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    </div>
  </div>

  <button type="submit"
    class="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Create account
  </button>

  <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
    Already have an account?
    <a href="#" class="font-semibold text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:underline dark:text-blue-400">Sign in</a>
  </p>
</form>`,
      react: `export function SignupCenteredCard({
  title = 'Create your account',
  subtitle = 'Start your 14-day free trial. No card required.',
  submitLabel = 'Create account',
  signInHref = '#',
  onSubmit = () => {},
  className = '',
}) {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="scc-name" className={label}>Full name</label>
          <input id="scc-name" name="name" type="text" autoComplete="name" required placeholder="Ada Lovelace" className={field} />
        </div>
        <div>
          <label htmlFor="scc-email" className={label}>Email address</label>
          <input id="scc-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
        </div>
        <div>
          <label htmlFor="scc-password" className={label}>Password</label>
          <input id="scc-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <a href={signInHref} className="font-semibold text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:underline dark:text-blue-400">Sign in</a>
      </p>
    </form>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

export interface SignupCenteredCardProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  signInHref?: string;
  /** UI-only: defaults to a no-op. Wire your registration handler here. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function SignupCenteredCard({
  title = 'Create your account',
  subtitle = 'Start your 14-day free trial. No card required.',
  submitLabel = 'Create account',
  signInHref = '#',
  onSubmit = () => {},
  className = '',
}: SignupCenteredCardProps): JSX.Element {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className={\`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 \${className}\`}
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="scc-name" className={label}>Full name</label>
          <input id="scc-name" name="name" type="text" autoComplete="name" required placeholder="Ada Lovelace" className={field} />
        </div>
        <div>
          <label htmlFor="scc-email" className={label}>Email address</label>
          <input id="scc-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
        </div>
        <div>
          <label htmlFor="scc-password" className={label}>Password</label>
          <input id="scc-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <a href={signInHref} className="font-semibold text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:underline dark:text-blue-400">Sign in</a>
      </p>
    </form>
  );
}`,
    },
  },
  {
    slug: 'signup-split-benefits',
    category: 'sign-up',
    tags: ['sign-up', 'split', 'benefits', 'two-column', 'form'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'reversed', labelKey: 'reversed' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Create your account'", descriptionKey: 'title' },
      { name: 'benefits', type: 'string[]', descriptionKey: 'benefits' },
      { name: 'benefitsTitle', type: 'string', default: "'Everything you need to ship'", descriptionKey: 'benefitsTitle' },
      { name: 'submitLabel', type: 'string', default: "'Create account'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(event: FormEvent<HTMLFormElement>) => void', descriptionKey: 'onSubmit' },
    ],
    code: {
      tailwind: `<!--
  Split shell: form + benefits panel. The panel is aria-hidden decoration on
  mobile? No - it carries real content, so it stacks BELOW the form in source
  order and reflows to a single column below md. The form is what the visitor
  came for, so it leads the DOM.
-->
<div class="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
  <form class="order-1 p-6 sm:p-8" action="#" method="post">
    <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create your account</h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Free forever for solo projects.</p>

    <div class="mt-6 space-y-4">
      <div>
        <label for="ssb-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Work email</label>
        <input id="ssb-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"
          class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
      </div>
      <div>
        <label for="ssb-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input id="ssb-password" name="password" type="password" autocomplete="new-password" required placeholder="At least 8 characters"
          class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
      </div>
    </div>

    <button type="submit"
      class="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Create account
    </button>
  </form>

  <aside class="order-2 border-t border-gray-200 bg-gray-50 p-6 sm:p-8 md:border-l md:border-t-0 dark:border-gray-800 dark:bg-gray-900">
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Everything you need to ship</h2>
    <ul class="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
      <li class="flex gap-2.5">
        <svg viewBox="0 0 20 20" fill="currentColor" class="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd" /></svg>
        Unlimited projects and members
      </li>
      <li class="flex gap-2.5">
        <svg viewBox="0 0 20 20" fill="currentColor" class="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd" /></svg>
        SOC 2 Type II and SSO ready
      </li>
      <li class="flex gap-2.5">
        <svg viewBox="0 0 20 20" fill="currentColor" class="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd" /></svg>
        Cancel any time, no lock-in
      </li>
    </ul>
  </aside>
</div>`,
      react: `const CHECK =
  'M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z';

export function SignupSplitBenefits({
  title = 'Create your account',
  benefitsTitle = 'Everything you need to ship',
  benefits = [
    'Unlimited projects and members',
    'SOC 2 Type II and SSO ready',
    'Cancel any time, no lock-in',
  ],
  submitLabel = 'Create account',
  onSubmit = () => {},
}) {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
        className="order-1 p-6 sm:p-8"
      >
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Free forever for solo projects.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="ssb-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work email</label>
            <input id="ssb-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
          </div>
          <div>
            <label htmlFor="ssb-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id="ssb-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </form>

      <aside className="order-2 border-t border-gray-200 bg-gray-50 p-6 sm:p-8 md:border-l md:border-t-0 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{benefitsTitle}</h2>
        <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true">
                <path fillRule="evenodd" d={CHECK} clipRule="evenodd" />
              </svg>
              {benefit}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

const CHECK =
  'M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z';

export interface SignupSplitBenefitsProps {
  title?: string;
  benefitsTitle?: string;
  benefits?: string[];
  submitLabel?: string;
  /** UI-only: defaults to a no-op. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupSplitBenefits({
  title = 'Create your account',
  benefitsTitle = 'Everything you need to ship',
  benefits = [
    'Unlimited projects and members',
    'SOC 2 Type II and SSO ready',
    'Cancel any time, no lock-in',
  ],
  submitLabel = 'Create account',
  onSubmit = () => {},
}: SignupSplitBenefitsProps): JSX.Element {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
        className="order-1 p-6 sm:p-8"
      >
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Free forever for solo projects.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="ssb-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work email</label>
            <input id="ssb-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
          </div>
          <div>
            <label htmlFor="ssb-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id="ssb-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </form>

      <aside className="order-2 border-t border-gray-200 bg-gray-50 p-6 sm:p-8 md:border-l md:border-t-0 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{benefitsTitle}</h2>
        <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true">
                <path fillRule="evenodd" d={CHECK} clipRule="evenodd" />
              </svg>
              {benefit}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}`,
    },
  },
  {
    slug: 'signup-social-first',
    category: 'sign-up',
    tags: ['sign-up', 'social', 'oauth', 'divider', 'card'],
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
      { name: 'title', type: 'string', default: "'Create your account'", descriptionKey: 'title' },
      { name: 'submitLabel', type: 'string', default: "'Continue with email'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(event: FormEvent<HTMLFormElement>) => void', descriptionKey: 'onSubmit' },
      { name: 'onSocial', type: '(provider: string) => void', descriptionKey: 'onSocial' },
    ],
    code: {
      tailwind: `<!--
  Social buttons are type="button" - they are not the form's submit, and leaving
  them as the default "submit" would fire the email form on click. The divider's
  "or" is a real text node between two rules, not a background image, so it
  survives translation and high-contrast modes.
-->
<div class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
  <h1 class="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create your account</h1>

  <div class="mt-6 space-y-3">
    <button type="button"
      class="inline-flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1Z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-5 6.7-5Z"/></svg>
      Continue with Google
    </button>
    <button type="button"
      class="inline-flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <svg viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7 0-.7 0-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 5 18 5.3 18 5.3c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.8 1 .8 2.1v3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"/></svg>
      Continue with GitHub
    </button>
  </div>

  <div class="my-6 flex items-center gap-3" aria-hidden="true">
    <span class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
    <span class="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">or</span>
    <span class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
  </div>

  <form action="#" method="post">
    <label for="ssf-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
    <input id="ssf-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"
      class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    <button type="submit"
      class="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Continue with email
    </button>
  </form>
</div>`,
      react: `export function SignupSocialFirst({
  title = 'Create your account',
  submitLabel = 'Continue with email',
  onSubmit = () => {},
  onSocial = () => {},
}) {
  const social =
    'inline-flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
      <h1 className="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6 space-y-3">
        <button type="button" onClick={() => onSocial('google')} className={social}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1Z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-5 6.7-5Z"/></svg>
          Continue with Google
        </button>
        <button type="button" onClick={() => onSocial('github')} className={social}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7 0-.7 0-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 5 18 5.3 18 5.3c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.8 1 .8 2.1v3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"/></svg>
          Continue with GitHub
        </button>
      </div>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
      >
        <label htmlFor="ssf-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
        <input
          id="ssf-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        />
        <button
          type="submit"
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

export interface SignupSocialFirstProps {
  title?: string;
  submitLabel?: string;
  /** UI-only: defaults to a no-op. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  /** Fired with the provider id ('google' | 'github'). No-op by default. */
  onSocial?: (provider: string) => void;
}

export function SignupSocialFirst({
  title = 'Create your account',
  submitLabel = 'Continue with email',
  onSubmit = () => {},
  onSocial = () => {},
}: SignupSocialFirstProps): JSX.Element {
  const social =
    'inline-flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
      <h1 className="text-center text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6 space-y-3">
        <button type="button" onClick={() => onSocial('google')} className={social}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1Z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-5 6.7-5Z"/></svg>
          Continue with Google
        </button>
        <button type="button" onClick={() => onSocial('github')} className={social}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7 0-.7 0-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 5 18 5.3 18 5.3c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.8 1 .8 2.1v3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z"/></svg>
          Continue with GitHub
        </button>
      </div>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
      >
        <label htmlFor="ssf-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
        <input
          id="ssf-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        />
        <button
          type="submit"
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}`,
    },
  },
  {
    slug: 'signup-multi-step',
    category: 'sign-up',
    tags: ['sign-up', 'multi-step', 'progress', 'stepper', 'wizard'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'step-1', labelKey: 'default' },
      { id: 'step-2', labelKey: 'compact' },
    ],
    props: [
      { name: 'currentStep', type: 'number', default: '1', descriptionKey: 'currentStep' },
      { name: 'totalSteps', type: 'number', default: '3', descriptionKey: 'totalSteps' },
      { name: 'submitLabel', type: 'string', default: "'Continue'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(event: FormEvent<HTMLFormElement>) => void', descriptionKey: 'onSubmit' },
    ],
    code: {
      tailwind: `<!--
  Step shell: a labelled progress bar plus step 1 of 3. The bar is a real
  progressbar with aria-valuenow/min/max so it announces "step 1 of 3", not just
  a coloured div. Continue is type="submit"; in a real wizard it validates this
  step before advancing.
-->
<form class="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950" action="#" method="post">
  <div class="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
    <span>Step 1 of 3</span>
    <span>Account details</span>
  </div>
  <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800" role="progressbar" aria-valuenow="1" aria-valuemin="1" aria-valuemax="3" aria-label="Sign-up progress">
    <div class="h-full rounded-full bg-blue-600 dark:bg-blue-500" style="width: 33.33%"></div>
  </div>

  <h1 class="mt-6 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Tell us about you</h1>

  <div class="mt-5 space-y-4">
    <div>
      <label for="sms-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
      <input id="sms-name" name="name" type="text" autocomplete="name" required placeholder="Ada Lovelace"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    </div>
    <div>
      <label for="sms-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Work email</label>
      <input id="sms-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    </div>
  </div>

  <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
    <button type="button" disabled
      class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-400 dark:border-gray-700 dark:text-gray-600">
      Back
    </button>
    <button type="submit"
      class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Continue
    </button>
  </div>
</form>`,
      react: `export function SignupMultiStep({
  currentStep = 1,
  totalSteps = 3,
  submitLabel = 'Continue',
  onSubmit = () => {},
}) {
  const percent = Math.round((currentStep / totalSteps) * 100);
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>Account details</span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label="Sign-up progress"
      >
        <div className="h-full rounded-full bg-blue-600 transition-all dark:bg-blue-500" style={{ width: \`\${percent}%\` }} />
      </div>

      <h1 className="mt-6 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Tell us about you</h1>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="sms-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
          <input id="sms-name" name="name" type="text" autoComplete="name" required placeholder="Ada Lovelace" className={field} />
        </div>
        <div>
          <label htmlFor="sms-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work email</label>
          <input id="sms-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          disabled={currentStep <= 1}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:disabled:text-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

export interface SignupMultiStepProps {
  currentStep?: number;
  totalSteps?: number;
  submitLabel?: string;
  /** UI-only: defaults to a no-op. Advance the step in a real wizard. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupMultiStep({
  currentStep = 1,
  totalSteps = 3,
  submitLabel = 'Continue',
  onSubmit = () => {},
}: SignupMultiStepProps): JSX.Element {
  const percent = Math.round((currentStep / totalSteps) * 100);
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>Account details</span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label="Sign-up progress"
      >
        <div className="h-full rounded-full bg-blue-600 transition-all dark:bg-blue-500" style={{ width: \`\${percent}%\` }} />
      </div>

      <h1 className="mt-6 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Tell us about you</h1>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="sms-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
          <input id="sms-name" name="name" type="text" autoComplete="name" required placeholder="Ada Lovelace" className={field} />
        </div>
        <div>
          <label htmlFor="sms-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work email</label>
          <input id="sms-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          disabled={currentStep <= 1}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:disabled:text-gray-600 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}`,
    },
  },
  {
    slug: 'signup-password-strength',
    category: 'sign-up',
    tags: ['sign-up', 'password', 'strength', 'validation', 'aria-live'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'empty', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Create your account'", descriptionKey: 'title' },
      { name: 'submitLabel', type: 'string', default: "'Create account'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(event: FormEvent<HTMLFormElement>) => void', descriptionKey: 'onSubmit' },
    ],
    code: {
      tailwind: `<!--
  The meter is decorative markup here; the React tabs compute the score live.
  The status line is aria-live="polite" so a screen reader hears the rating
  change as the field is typed, instead of a bar that only sighted users see.
-->
<form class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950" action="#" method="post">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create your account</h1>

  <div class="mt-6 space-y-4">
    <div>
      <label for="sps-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
      <input id="sps-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    </div>
    <div>
      <label for="sps-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
      <input id="sps-password" name="password" type="password" autocomplete="new-password" required aria-describedby="sps-strength" placeholder="At least 8 characters"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
      <div class="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
        <span class="h-1.5 rounded-full bg-amber-500"></span>
        <span class="h-1.5 rounded-full bg-amber-500"></span>
        <span class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-800"></span>
        <span class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-800"></span>
      </div>
      <p id="sps-strength" class="mt-1.5 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">Password strength: Fair</p>
    </div>
  </div>

  <button type="submit"
    class="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Create account
  </button>
</form>`,
      react: `import { useState } from 'react';

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

export function SignupPasswordStrength({
  title = 'Create your account',
  submitLabel = 'Create account',
  onSubmit = () => {},
}) {
  const [password, setPassword] = useState('');
  const score = scorePassword(password);
  const label = LABELS[score] ?? 'Too weak';
  const activeBar = BARS[score] ?? 'bg-red-500';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="sps-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
          <input
            id="sps-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
        <div>
          <label htmlFor="sps-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            id="sps-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-describedby="sps-strength"
            placeholder="At least 8 characters"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
          <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={\`h-1.5 rounded-full \${i < score ? activeBar : 'bg-gray-200 dark:bg-gray-800'}\`} />
            ))}
          </div>
          <p id="sps-strength" className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
            Password strength: {password ? label : 'Enter a password'}
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>
    </form>
  );
}`,
      typescript: `import { useState } from 'react';
import type { FormEvent } from 'react';

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

export interface SignupPasswordStrengthProps {
  title?: string;
  submitLabel?: string;
  /** UI-only: defaults to a no-op. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupPasswordStrength({
  title = 'Create your account',
  submitLabel = 'Create account',
  onSubmit = () => {},
}: SignupPasswordStrengthProps): JSX.Element {
  const [password, setPassword] = useState('');
  const score = scorePassword(password);
  const label = LABELS[score] ?? 'Too weak';
  const activeBar = BARS[score] ?? 'bg-red-500';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="sps-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
          <input
            id="sps-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
        <div>
          <label htmlFor="sps-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            id="sps-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-describedby="sps-strength"
            placeholder="At least 8 characters"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
          <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={\`h-1.5 rounded-full \${i < score ? activeBar : 'bg-gray-200 dark:bg-gray-800'}\`} />
            ))}
          </div>
          <p id="sps-strength" className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
            Password strength: {password ? label : 'Enter a password'}
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'signup-with-terms-consent',
    category: 'sign-up',
    tags: ['sign-up', 'terms', 'consent', 'checkbox', 'form'],
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
      { name: 'title', type: 'string', default: "'Create your account'", descriptionKey: 'title' },
      { name: 'termsHref', type: 'string', default: "'#'", descriptionKey: 'termsHref' },
      { name: 'privacyHref', type: 'string', default: "'#'", descriptionKey: 'privacyHref' },
      { name: 'submitLabel', type: 'string', default: "'Create account'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(event: FormEvent<HTMLFormElement>) => void', descriptionKey: 'onSubmit' },
    ],
    code: {
      tailwind: `<!--
  The consent checkbox is required and wired to its label via for/id, so the
  whole sentence (including the two links) is the clickable target. The links
  open policy pages, so the label wraps <a> elements rather than swallowing them.
-->
<form class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950" action="#" method="post">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create your account</h1>

  <div class="mt-6 space-y-4">
    <div>
      <label for="stc-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
      <input id="stc-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    </div>
    <div>
      <label for="stc-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
      <input id="stc-password" name="password" type="password" autocomplete="new-password" required placeholder="At least 8 characters"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    </div>
  </div>

  <div class="mt-5 flex items-start gap-3">
    <input id="stc-consent" name="consent" type="checkbox" required
      class="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    <label for="stc-consent" class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      I agree to the
      <a href="#" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms of Service</a>
      and
      <a href="#" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</a>.
    </label>
  </div>

  <button type="submit"
    class="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Create account
  </button>
</form>`,
      react: `export function SignupWithTermsConsent({
  title = 'Create your account',
  termsHref = '#',
  privacyHref = '#',
  submitLabel = 'Create account',
  onSubmit = () => {},
}) {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="stc-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
          <input id="stc-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
        </div>
        <div>
          <label htmlFor="stc-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input id="stc-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          id="stc-consent"
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        />
        <label htmlFor="stc-consent" className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          I agree to the{' '}
          <a href={termsHref} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms of Service</a>
          {' '}and{' '}
          <a href={privacyHref} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</a>.
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>
    </form>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

export interface SignupWithTermsConsentProps {
  title?: string;
  termsHref?: string;
  privacyHref?: string;
  submitLabel?: string;
  /** UI-only: defaults to a no-op. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupWithTermsConsent({
  title = 'Create your account',
  termsHref = '#',
  privacyHref = '#',
  submitLabel = 'Create account',
  onSubmit = () => {},
}: SignupWithTermsConsentProps): JSX.Element {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="stc-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
          <input id="stc-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
        </div>
        <div>
          <label htmlFor="stc-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input id="stc-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          id="stc-consent"
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        />
        <label htmlFor="stc-consent" className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          I agree to the{' '}
          <a href={termsHref} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms of Service</a>
          {' '}and{' '}
          <a href={privacyHref} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</a>.
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>
    </form>
  );
}`,
    },
  },
  {
    slug: 'signup-minimal-email-only',
    category: 'sign-up',
    tags: ['sign-up', 'minimal', 'email', 'waitlist', 'magic-link'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'inline', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Get started free'", descriptionKey: 'title' },
      { name: 'subtitle', type: 'string', descriptionKey: 'subtitle' },
      { name: 'submitLabel', type: 'string', default: "'Sign up'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(event: FormEvent<HTMLFormElement>) => void', descriptionKey: 'onSubmit' },
    ],
    code: {
      tailwind: `<!--
  One field, no password: a magic-link / passwordless start. The row goes
  vertical below sm because a 90px email box beside a button is not a form.
-->
<form class="mx-auto w-full max-w-sm text-center" action="#" method="post">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Get started free</h1>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Enter your email - we'll send a magic link.</p>

  <label for="sme-email" class="sr-only">Email address</label>
  <div class="mt-5 flex flex-col gap-2 sm:flex-row">
    <input id="sme-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"
      class="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    <button type="submit"
      class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Sign up
    </button>
  </div>
  <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">No password required. Unsubscribe any time.</p>
</form>`,
      react: `export function SignupMinimalEmailOnly({
  title = 'Get started free',
  subtitle = "Enter your email - we'll send a magic link.",
  submitLabel = 'Sign up',
  onSubmit = () => {},
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-sm text-center"
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <label htmlFor="sme-email" className="sr-only">Email address</label>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          id="sme-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">No password required. Unsubscribe any time.</p>
    </form>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

export interface SignupMinimalEmailOnlyProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  /** UI-only: defaults to a no-op. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupMinimalEmailOnly({
  title = 'Get started free',
  subtitle = "Enter your email - we'll send a magic link.",
  submitLabel = 'Sign up',
  onSubmit = () => {},
}: SignupMinimalEmailOnlyProps): JSX.Element {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-sm text-center"
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <label htmlFor="sme-email" className="sr-only">Email address</label>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          id="sme-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">No password required. Unsubscribe any time.</p>
    </form>
  );
}`,
    },
  },
  {
    slug: 'signup-gradient-side',
    category: 'sign-up',
    tags: ['sign-up', 'gradient', 'split', 'two-column', 'form'],
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
      { name: 'title', type: 'string', default: "'Create your account'", descriptionKey: 'title' },
      { name: 'panelHeading', type: 'string', default: "'Join 40,000+ teams'", descriptionKey: 'panelHeading' },
      { name: 'panelText', type: 'string', descriptionKey: 'panelText' },
      { name: 'submitLabel', type: 'string', default: "'Create account'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(event: FormEvent<HTMLFormElement>) => void', descriptionKey: 'onSubmit' },
    ],
    code: {
      tailwind: `<!--
  The gradient panel paints its own dark surface, so its white text needs no
  dark: variants - it looks identical on a light or dark page. It carries real
  copy (a heading + pull-quote), so it is a section, not aria-hidden decoration,
  and it stacks ABOVE the form only on desktop; on mobile it drops below so the
  form leads.
-->
<div class="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
  <form class="order-1 p-6 sm:p-8 md:order-1" action="#" method="post">
    <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create your account</h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">It takes less than a minute.</p>

    <div class="mt-6 space-y-4">
      <div>
        <label for="sgs-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
        <input id="sgs-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"
          class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
      </div>
      <div>
        <label for="sgs-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input id="sgs-password" name="password" type="password" autocomplete="new-password" required placeholder="At least 8 characters"
          class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
      </div>
    </div>

    <button type="submit"
      class="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Create account
    </button>
  </form>

  <section class="order-2 flex flex-col justify-center gap-3 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white sm:p-8 md:order-2">
    <h2 class="text-lg font-semibold">Join 40,000+ teams</h2>
    <p class="text-sm leading-relaxed text-blue-50">
      "We shipped our first release the same afternoon we signed up. The setup we
      dreaded took ten minutes."
    </p>
    <p class="text-xs font-medium text-blue-100">- Priya N., Head of Engineering</p>
  </section>
</div>`,
      react: `export function SignupGradientSide({
  title = 'Create your account',
  panelHeading = 'Join 40,000+ teams',
  panelText = '"We shipped our first release the same afternoon we signed up. The setup we dreaded took ten minutes."',
  submitLabel = 'Create account',
  onSubmit = () => {},
}) {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
        className="order-1 p-6 sm:p-8"
      >
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">It takes less than a minute.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="sgs-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input id="sgs-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
          </div>
          <div>
            <label htmlFor="sgs-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id="sgs-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </form>

      <section className="order-2 flex flex-col justify-center gap-3 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white sm:p-8">
        <h2 className="text-lg font-semibold">{panelHeading}</h2>
        <p className="text-sm leading-relaxed text-blue-50">{panelText}</p>
        <p className="text-xs font-medium text-blue-100">- Priya N., Head of Engineering</p>
      </section>
    </div>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

export interface SignupGradientSideProps {
  title?: string;
  panelHeading?: string;
  panelText?: string;
  submitLabel?: string;
  /** UI-only: defaults to a no-op. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupGradientSide({
  title = 'Create your account',
  panelHeading = 'Join 40,000+ teams',
  panelText = '"We shipped our first release the same afternoon we signed up. The setup we dreaded took ten minutes."',
  submitLabel = 'Create account',
  onSubmit = () => {},
}: SignupGradientSideProps): JSX.Element {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
        className="order-1 p-6 sm:p-8"
      >
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">It takes less than a minute.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="sgs-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input id="sgs-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
          </div>
          <div>
            <label htmlFor="sgs-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id="sgs-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </form>

      <section className="order-2 flex flex-col justify-center gap-3 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white sm:p-8">
        <h2 className="text-lg font-semibold">{panelHeading}</h2>
        <p className="text-sm leading-relaxed text-blue-50">{panelText}</p>
        <p className="text-xs font-medium text-blue-100">- Priya N., Head of Engineering</p>
      </section>
    </div>
  );
}`,
    },
  },
  {
    slug: 'signup-invite-code',
    category: 'sign-up',
    tags: ['sign-up', 'invite', 'code', 'private-beta', 'form'],
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
      { name: 'title', type: 'string', default: "'Join the private beta'", descriptionKey: 'title' },
      { name: 'submitLabel', type: 'string', default: "'Redeem invite'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(event: FormEvent<HTMLFormElement>) => void', descriptionKey: 'onSubmit' },
    ],
    code: {
      tailwind: `<!--
  The invite field uses autocomplete="off" and spellcheck="false" - a random
  code is not a word the browser should dictionary-correct or offer to fill. Its
  monospace font makes O/0 and I/l distinguishable while typing.
-->
<form class="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950" action="#" method="post">
  <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Join the private beta</h1>
  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Access is invite-only for now.</p>

  <div class="mt-6 space-y-4">
    <div>
      <label for="sic-code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Invite code</label>
      <input id="sic-code" name="inviteCode" type="text" inputmode="text" autocomplete="off" spellcheck="false" required placeholder="XXXX-XXXX-XXXX"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm uppercase tracking-widest text-gray-900 shadow-sm placeholder:text-gray-400 placeholder:tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    </div>
    <div>
      <label for="sic-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
      <input id="sic-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"
        class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
    </div>
  </div>

  <button type="submit"
    class="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    Redeem invite
  </button>

  <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
    No code?
    <a href="#" class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">Join the waitlist</a>
  </p>
</form>`,
      react: `export function SignupInviteCode({
  title = 'Join the private beta',
  submitLabel = 'Redeem invite',
  onSubmit = () => {},
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Access is invite-only for now.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="sic-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Invite code</label>
          <input
            id="sic-code"
            name="inviteCode"
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            required
            placeholder="XXXX-XXXX-XXXX"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm uppercase tracking-widest text-gray-900 shadow-sm placeholder:text-gray-400 placeholder:tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
        <div>
          <label htmlFor="sic-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
          <input
            id="sic-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        No code?{' '}
        <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">Join the waitlist</a>
      </p>
    </form>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

export interface SignupInviteCodeProps {
  title?: string;
  submitLabel?: string;
  /** UI-only: defaults to a no-op. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupInviteCode({
  title = 'Join the private beta',
  submitLabel = 'Redeem invite',
  onSubmit = () => {},
}: SignupInviteCodeProps): JSX.Element {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Access is invite-only for now.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="sic-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Invite code</label>
          <input
            id="sic-code"
            name="inviteCode"
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            required
            placeholder="XXXX-XXXX-XXXX"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm uppercase tracking-widest text-gray-900 shadow-sm placeholder:text-gray-400 placeholder:tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
        <div>
          <label htmlFor="sic-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
          <input
            id="sic-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        No code?{' '}
        <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">Join the waitlist</a>
      </p>
    </form>
  );
}`,
    },
  },
  {
    slug: 'signup-boxed-logo',
    category: 'sign-up',
    tags: ['sign-up', 'logo', 'card', 'branded', 'form'],
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
      { name: 'brand', type: 'string', default: "'Acme'", descriptionKey: 'brand' },
      { name: 'title', type: 'string', default: "'Create your account'", descriptionKey: 'title' },
      { name: 'submitLabel', type: 'string', default: "'Create account'", descriptionKey: 'submitLabel' },
      { name: 'signInHref', type: 'string', default: "'#'", descriptionKey: 'signInHref' },
      { name: 'onSubmit', type: '(event: FormEvent<HTMLFormElement>) => void', descriptionKey: 'onSubmit' },
    ],
    code: {
      tailwind: `<!--
  The logo is a boxed CSS mark, not an <img>: no external asset to preload or let
  rot. It is aria-hidden and the brand name sits beside it as real text, so a
  screen reader hears the name once, not "image" plus the name.
-->
<div class="mx-auto w-full max-w-sm">
  <div class="mb-6 flex flex-col items-center">
    <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-sm" aria-hidden="true">A</span>
    <span class="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Acme</span>
  </div>

  <form class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950" action="#" method="post">
    <h1 class="text-center text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">Create your account</h1>

    <div class="mt-6 space-y-4">
      <div>
        <label for="sbl-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
        <input id="sbl-email" name="email" type="email" autocomplete="email" required placeholder="you@company.com"
          class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
      </div>
      <div>
        <label for="sbl-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input id="sbl-password" name="password" type="password" autocomplete="new-password" required placeholder="At least 8 characters"
          class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" />
      </div>
    </div>

    <button type="submit"
      class="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Create account
    </button>

    <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
      Already have an account?
      <a href="#" class="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">Sign in</a>
    </p>
  </form>
</div>`,
      react: `export function SignupBoxedLogo({
  brand = 'Acme',
  title = 'Create your account',
  submitLabel = 'Create account',
  signInHref = '#',
  onSubmit = () => {},
}) {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-sm" aria-hidden="true">
          {brand.charAt(0)}
        </span>
        <span className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{brand}</span>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
      >
        <h1 className="text-center text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="sbl-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input id="sbl-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
          </div>
          <div>
            <label htmlFor="sbl-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id="sbl-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href={signInHref} className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">Sign in</a>
        </p>
      </form>
    </div>
  );
}`,
      typescript: `import type { FormEvent } from 'react';

export interface SignupBoxedLogoProps {
  brand?: string;
  title?: string;
  submitLabel?: string;
  signInHref?: string;
  /** UI-only: defaults to a no-op. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupBoxedLogo({
  brand = 'Acme',
  title = 'Create your account',
  submitLabel = 'Create account',
  signInHref = '#',
  onSubmit = () => {},
}: SignupBoxedLogoProps): JSX.Element {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-sm" aria-hidden="true">
          {brand.charAt(0)}
        </span>
        <span className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{brand}</span>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
      >
        <h1 className="text-center text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="sbl-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input id="sbl-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
          </div>
          <div>
            <label htmlFor="sbl-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id="sbl-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href={signInHref} className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">Sign in</a>
        </p>
      </form>
    </div>
  );
}`,
    },
  },
];
