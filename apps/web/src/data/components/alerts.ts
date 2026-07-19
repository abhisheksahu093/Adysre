import type { ComponentEntry } from './types';

/**
 * Alerts category.
 *
 * An alert is STATIC and IN-FLOW. It describes the state of the thing next to
 * it - this form failed, this plan is over quota - and it stays there for as
 * long as that state is true. Nothing here has a timer, a queue, or an overlay
 * layer; every entry is markup you render because of what is *currently* true,
 * not because of an event that just fired. (That's the notifications category.)
 *
 * ─── Roles ──────────────────────────────────────────────────────────────────
 * `role="alert"` is assertive: it interrupts a screen-reader user mid-sentence
 * and jumps the queue. Only an error earns it. Everything else - info, success,
 * a warning the user can finish reading their paragraph before acting on - is
 * `role="status"` (polite) or has no live semantics at all, which is the right
 * answer for an alert that is part of the page on load. A region that already
 * holds its text when it mounts is not announced anyway; the role only earns
 * its keep when the alert appears in response to something.
 *
 * ─── Colour ─────────────────────────────────────────────────────────────────
 * Status colour is the classic AA trap: text-{c}-500 on white lands around
 * 2-3:1. Every entry uses text-{c}-800 on bg-{c}-50 (6.8-8.0:1) and
 * text-{c}-200 on bg-{c}-950 (10.3-12.3:1) for tinted surfaces, or
 * text-{c}-700/dark:text-{c}-300 (5.0-12.6:1) on plain white/gray-900. Every
 * severity also carries a distinct icon shape - colour is never the only
 * carrier of the signal.
 */
export const alertsComponents: ComponentEntry[] = [
  {
    slug: 'alert-inline',
    category: 'alerts',
    tags: ['alert', 'inline', 'status', 'severity', 'validation'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-14',
    updatedAt: '2026-06-30',
    license: 'MIT',
    version: '1.1.0',
    featured: true,
    stats: { views: 2380, copies: 690, downloads: 188 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'severity', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", descriptionKey: 'severity' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Four severities, four icon SHAPES - circle-i, check, triangle, cross. Someone
  who can't separate red from green still reads the alert correctly, because the
  colour was never doing the work alone.

  The role tracks severity, and only the error gets the assertive one:

    error                    -> role="alert"   (interrupts; the user must know now)
    info | success | warning -> role="status"  (polite; waits its turn)

  Slapping role="alert" on all four is the most common mistake in this
  component. "Saved" does not get to cut a screen-reader user off mid-sentence.
-->
<div class="alert alert--error" role="alert">
  <svg class="alert__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z" />
  </svg>
  <div class="alert__body">
    <p class="alert__title">Payment declined</p>
    <p class="alert__text">Your card was declined by the issuer. Try another card.</p>
  </div>
</div>

<div class="alert alert--success" role="status">
  <svg class="alert__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
  </svg>
  <div class="alert__body">
    <p class="alert__text">Domain verified.</p>
  </div>
</div>`,
      css: `.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  border: 1px solid;
  border-radius: 0.625rem;
}

.alert__icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.0625rem;
}

.alert__body {
  min-width: 0;
  flex: 1;
}

.alert__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.alert__text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.45;
}

.alert__title + .alert__text {
  margin-top: 0.125rem;
}

/*
 * Every pair below was measured, not guessed. On the -50 tints:
 *   blue-800/blue-50    8.01:1
 *   green-800/green-50  6.81:1
 *   amber-800/amber-50  6.84:1
 *   red-800/red-50      7.60:1
 * The tempting -500 shades land near 2-3:1 on white and fail AA outright.
 */
.alert--info {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: #1e40af;
}

.alert--success {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #166534;
}

.alert--warning {
  border-color: #fde68a;
  background: #fffbeb;
  color: #92400e;
}

.alert--error {
  border-color: #fecaca;
  background: #fef2f2;
  color: #991b1b;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * On the -950 tints: blue-200 10.34:1, green-200 12.30:1, amber-200 12.03:1,
 * red-200 11.16:1.
 */
@media (prefers-color-scheme: dark) {
  .alert--info {
    border-color: #1e3a8a;
    background: #172554;
    color: #bfdbfe;
  }

  .alert--success {
    border-color: #14532d;
    background: #052e16;
    color: #bbf7d0;
  }

  .alert--warning {
    border-color: #78350f;
    background: #451a03;
    color: #fde68a;
  }

  .alert--error {
    border-color: #7f1d1d;
    background: #450a0a;
    color: #fecaca;
  }
}`,
      tailwind: `<!--
  Only the error is role="alert" (assertive). info/success/warning are
  role="status" (polite) - an assertive "Saved" cuts a screen-reader user off
  mid-sentence.
  Icon shape differs per severity, so the meaning survives without colour.
  text-{c}-800 on bg-{c}-50 measures 6.8-8.0:1; text-{c}-200 on bg-{c}-950
  measures 10.3-12.3:1. The -500 shades everyone reaches for first are ~2-3:1 on
  white and fail AA.
-->
<div class="flex items-start gap-2.5 rounded-[0.625rem] border border-red-200 bg-red-50 px-3.5 py-3 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200" role="alert">
  <svg class="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z" />
  </svg>
  <div class="min-w-0 flex-1">
    <p class="text-sm font-semibold">Payment declined</p>
    <p class="mt-0.5 text-sm leading-normal">Your card was declined by the issuer. Try another card.</p>
  </div>
</div>

<div class="mt-3 flex items-start gap-2.5 rounded-[0.625rem] border border-green-200 bg-green-50 px-3.5 py-3 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200" role="status">
  <svg class="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
  </svg>
  <div class="min-w-0 flex-1">
    <p class="text-sm leading-normal">Domain verified.</p>
  </div>
</div>`,
      react: `const SEVERITY_STYLES = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
  success:
    'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  warning:
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
};

// Four distinct shapes, not four colours of the same circle - the icon has to
// survive being seen in greyscale.
const SEVERITY_PATHS = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertInline({ title, children, severity = 'info', className = '' }) {
  // Assertive only for errors. Everything else waits its turn.
  const role = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={\`flex items-start gap-2.5 rounded-[0.625rem] border px-3.5 py-3 \${SEVERITY_STYLES[severity]} \${className}\`}
    >
      <svg
        className="mt-px h-[1.125rem] w-[1.125rem] flex-none"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={SEVERITY_PATHS[severity]} />
      </svg>

      <div className="min-w-0 flex-1">
        {title ? <p className="text-sm font-semibold">{title}</p> : null}
        <p className={\`text-sm leading-normal \${title ? 'mt-0.5' : ''}\`}>{children}</p>
      </div>
    </div>
  );
}`,
      nextjs: `// No state, no handlers - a Server Component. That is the point of an alert:
// it is a rendering of what is currently true, so the server can decide it.
import type { ReactNode } from 'react';

type Severity = 'info' | 'success' | 'warning' | 'error';

const SEVERITY_STYLES: Record<Severity, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
  success:
    'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  warning:
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
};

const SEVERITY_PATHS: Record<Severity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

interface AlertInlineProps {
  title?: string;
  children: ReactNode;
  severity?: Severity;
  className?: string;
}

export function AlertInline({ title, children, severity = 'info', className = '' }: AlertInlineProps) {
  const role = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={\`flex items-start gap-2.5 rounded-[0.625rem] border px-3.5 py-3 \${SEVERITY_STYLES[severity]} \${className}\`}
    >
      <svg
        className="mt-px h-[1.125rem] w-[1.125rem] flex-none"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={SEVERITY_PATHS[severity]} />
      </svg>

      <div className="min-w-0 flex-1">
        {title ? <p className="text-sm font-semibold">{title}</p> : null}
        <p className={\`text-sm leading-normal \${title ? 'mt-0.5' : ''}\`}>{children}</p>
      </div>
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AlertInlineProps {
  title?: string;
  children: ReactNode;
  severity?: AlertSeverity;
  className?: string;
}

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
  success:
    'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  warning:
    'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
};

const SEVERITY_PATHS: Record<AlertSeverity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertInline({
  title,
  children,
  severity = 'info',
  className = '',
}: AlertInlineProps): JSX.Element {
  const role: 'alert' | 'status' = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={\`flex items-start gap-2.5 rounded-[0.625rem] border px-3.5 py-3 \${SEVERITY_STYLES[severity]} \${className}\`}
    >
      <svg
        className="mt-px h-[1.125rem] w-[1.125rem] flex-none"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={SEVERITY_PATHS[severity]} />
      </svg>

      <div className="min-w-0 flex-1">
        {title !== undefined ? <p className="text-sm font-semibold">{title}</p> : null}
        <p className={\`text-sm leading-normal \${title !== undefined ? 'mt-0.5' : ''}\`}>{children}</p>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'alert-with-actions',
    category: 'alerts',
    tags: ['alert', 'actions', 'buttons', 'warning', 'quota'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-27',
    updatedAt: '2026-07-05',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1160, copies: 302, downloads: 88 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'ctaLabel', type: 'string', required: true, descriptionKey: 'ctaLabel' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  An alert that asks for something back. The additions over a plain inline alert
  are all about the buttons:

  - aria-labelledby/aria-describedby wire the region to its own title and body,
    so the alert is announced as one unit rather than as three loose strings
    followed by two buttons with no context.
  - The buttons live INSIDE the labelled region. Hoisting them out is the usual
    mistake: "Upgrade plan" alone tells a screen-reader user nothing about why.
  - role="status", not "alert" - a quota warning is not an interruption; the
    user gets to finish the sentence they're reading.
-->
<div class="alert-actions" role="status" aria-labelledby="quota-title" aria-describedby="quota-body">
  <svg class="alert-actions__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
  </svg>

  <div class="alert-actions__body">
    <p class="alert-actions__title" id="quota-title">You're near your API limit</p>
    <p class="alert-actions__text" id="quota-body">
      You've used 94% of this month's 50,000 requests. Further calls will be rejected once you hit the cap.
    </p>

    <div class="alert-actions__row">
      <button class="alert-actions__cta" type="button">Upgrade plan</button>
      <button class="alert-actions__ghost" type="button">View usage</button>
    </div>
  </div>
</div>`,
      css: `/* amber-800 on amber-50 is 6.84:1; the triangle carries the same signal for
   anyone the colour doesn't reach. */
.alert-actions {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: 1px solid #fde68a;
  border-radius: 0.75rem;
  background: #fffbeb;
  color: #92400e;
}

.alert-actions__icon {
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.0625rem;
}

.alert-actions__body {
  min-width: 0;
  flex: 1;
}

.alert-actions__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.alert-actions__text {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  line-height: 1.45;
}

.alert-actions__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

/* White on amber-800 is 6.84:1. A tinted alert's own -50 background is far too
   light to carry a solid button, so the button inverts instead. */
.alert-actions__cta {
  padding: 0.375rem 0.75rem;
  border: 0;
  border-radius: 0.375rem;
  background: #92400e;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
}

.alert-actions__cta:hover {
  background: #78350f;
}

.alert-actions__ghost {
  padding: 0.375rem 0.75rem;
  border: 1px solid #fcd34d;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #92400e;
  cursor: pointer;
}

.alert-actions__ghost:hover {
  background: #fef3c7;
}

.alert-actions__cta:focus-visible,
.alert-actions__ghost:focus-visible {
  outline: 2px solid #92400e;
  outline-offset: 2px;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * amber-200 on amber-950 is 12.03:1; the CTA inverts to dark-on-amber.
 */
@media (prefers-color-scheme: dark) {
  .alert-actions {
    border-color: #78350f;
    background: #451a03;
    color: #fde68a;
  }

  .alert-actions__cta {
    background: #fcd34d;
    color: #451a03;
  }

  .alert-actions__cta:hover {
    background: #fde68a;
  }

  .alert-actions__ghost {
    border-color: #92400e;
    color: #fde68a;
  }

  .alert-actions__ghost:hover {
    background: #78350f;
  }

  .alert-actions__cta:focus-visible,
  .alert-actions__ghost:focus-visible {
    outline-color: #fde68a;
  }
}`,
      tailwind: `<!--
  aria-labelledby + aria-describedby make the title, body and buttons announce
  as one unit - "Upgrade plan" on its own says nothing about what it fixes.
  role="status": a quota warning is not worth interrupting someone mid-sentence.
  amber-800/amber-50 is 6.84:1, amber-200/amber-950 is 12.03:1, and the solid
  CTA inverts because a -50 tint can't carry a filled button.
-->
<div class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200" role="status" aria-labelledby="quota-title" aria-describedby="quota-body">
  <svg class="mt-px h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
  </svg>

  <div class="min-w-0 flex-1">
    <p class="text-sm font-semibold" id="quota-title">You're near your API limit</p>
    <p class="mt-1 text-sm leading-normal" id="quota-body">
      You've used 94% of this month's 50,000 requests. Further calls will be rejected once you hit the cap.
    </p>

    <div class="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded-md bg-amber-800 px-3 py-1.5 text-[0.8125rem] font-semibold text-white transition hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 motion-reduce:transition-none dark:bg-amber-300 dark:text-amber-950 dark:hover:bg-amber-200 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-amber-950"
      >
        Upgrade plan
      </button>
      <button
        type="button"
        class="rounded-md border border-amber-300 px-3 py-1.5 text-[0.8125rem] font-semibold transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 motion-reduce:transition-none dark:border-amber-800 dark:hover:bg-amber-900 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-amber-950"
      >
        View usage
      </button>
    </div>
  </div>
</div>`,
      react: `import { useId } from 'react';

export function AlertWithActions({ title, children, ctaLabel, onClick, className = '' }) {
  // Two ids from one useId - stable across SSR/hydration, unique per instance,
  // which matters the moment two of these land on the same page.
  const id = useId();
  const titleId = \`\${id}-title\`;
  const bodyId = \`\${id}-body\`;

  return (
    <div
      role="status"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className={\`flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200 \${className}\`}
    >
      <svg className="mt-px h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>

      <div className="min-w-0 flex-1">
        <p id={titleId} className="text-sm font-semibold">
          {title}
        </p>
        <p id={bodyId} className="mt-1 text-sm leading-normal">
          {children}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onClick}
            className="rounded-md bg-amber-800 px-3 py-1.5 text-[0.8125rem] font-semibold text-white transition hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 motion-reduce:transition-none dark:bg-amber-300 dark:text-amber-950 dark:hover:bg-amber-200 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-amber-950"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
      nextjs: `'use client';

// 'use client' only because of onClick. Drop the handler - link the CTA to a
// route instead - and this happily becomes a Server Component.
import { useId, type ReactNode } from 'react';

interface AlertWithActionsProps {
  title: string;
  children: ReactNode;
  ctaLabel: string;
  onClick?: () => void;
  className?: string;
}

export function AlertWithActions({
  title,
  children,
  ctaLabel,
  onClick,
  className = '',
}: AlertWithActionsProps) {
  const id = useId();
  const titleId = \`\${id}-title\`;
  const bodyId = \`\${id}-body\`;

  return (
    <div
      role="status"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className={\`flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200 \${className}\`}
    >
      <svg className="mt-px h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>

      <div className="min-w-0 flex-1">
        <p id={titleId} className="text-sm font-semibold">
          {title}
        </p>
        <p id={bodyId} className="mt-1 text-sm leading-normal">
          {children}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onClick}
            className="rounded-md bg-amber-800 px-3 py-1.5 text-[0.8125rem] font-semibold text-white transition hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 motion-reduce:transition-none dark:bg-amber-300 dark:text-amber-950 dark:hover:bg-amber-200 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-amber-950"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `import { useId, type ReactNode } from 'react';

export interface AlertWithActionsProps {
  title: string;
  children: ReactNode;
  ctaLabel: string;
  onClick?: () => void;
  className?: string;
}

export function AlertWithActions({
  title,
  children,
  ctaLabel,
  onClick,
  className = '',
}: AlertWithActionsProps): JSX.Element {
  const id: string = useId();
  const titleId = \`\${id}-title\`;
  const bodyId = \`\${id}-body\`;

  return (
    <div
      role="status"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      className={\`flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200 \${className}\`}
    >
      <svg className="mt-px h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>

      <div className="min-w-0 flex-1">
        <p id={titleId} className="text-sm font-semibold">
          {title}
        </p>
        <p id={bodyId} className="mt-1 text-sm leading-normal">
          {children}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onClick}
            className="rounded-md bg-amber-800 px-3 py-1.5 text-[0.8125rem] font-semibold text-white transition hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 motion-reduce:transition-none dark:bg-amber-300 dark:text-amber-950 dark:hover:bg-amber-200 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-amber-950"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'alert-dismissible',
    category: 'alerts',
    tags: ['alert', 'dismissible', 'close', 'focus', 'info'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-02',
    updatedAt: '2026-07-11',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1420, copies: 361, downloads: 97 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'dismissLabel', type: 'string', default: "'Dismiss'", descriptionKey: 'dismissLabel' },
      { name: 'onDismiss', type: '() => void', descriptionKey: 'onDismiss' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Dismissal is a focus problem before it is a styling problem.

  When the close button removes its own alert, the focused element leaves the
  DOM. The browser's fallback is to drop focus onto <body> - which strands
  keyboard users at the very top of the page, having lost their place entirely.
  Move focus somewhere sensible FIRST, then remove.

  The other half: the accessible name has to say what it closes. Twelve buttons
  all called "Dismiss" are indistinguishable in a screen reader's list.
-->
<div class="alert-x" role="status">
  <svg class="alert-x__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
  </svg>

  <div class="alert-x__body">
    <p class="alert-x__title">Scheduled maintenance</p>
    <p class="alert-x__text">We'll be read-only on Sunday 03:00-04:00 UTC.</p>
  </div>

  <button class="alert-x__close" type="button" aria-label="Dismiss: Scheduled maintenance">
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
    </svg>
  </button>
</div>

<script>
  document.querySelector('.alert-x__close').addEventListener('click', (event) => {
    const alert = event.currentTarget.closest('.alert-x');
    // Hand focus to a stable neighbour before the button stops existing.
    const next = alert.nextElementSibling ?? alert.parentElement;
    if (next instanceof HTMLElement) {
      next.setAttribute('tabindex', '-1');
      next.focus();
    }
    alert.remove();
  });
</script>`,
      css: `/* blue-800 on blue-50 is 8.01:1; the circle-i keeps the meaning without it. */
.alert-x {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  border: 1px solid #bfdbfe;
  border-radius: 0.625rem;
  background: #eff6ff;
  color: #1e40af;
}

.alert-x__icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.0625rem;
}

.alert-x__body {
  min-width: 0;
  flex: 1;
}

.alert-x__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.alert-x__text {
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  line-height: 1.45;
}

.alert-x__close {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  margin: -0.125rem -0.25rem 0 0;
  padding: 0;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.alert-x__close svg {
  width: 0.875rem;
  height: 0.875rem;
}

.alert-x__close:hover {
  background: #dbeafe;
}

.alert-x__close:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * blue-200 on blue-950 is 10.34:1.
 */
@media (prefers-color-scheme: dark) {
  .alert-x {
    border-color: #1e3a8a;
    background: #172554;
    color: #bfdbfe;
  }

  .alert-x__close:hover {
    background: #1e3a8a;
  }

  .alert-x__close:focus-visible {
    outline-color: #93c5fd;
  }
}`,
      tailwind: `<!--
  The close button's name says what it closes - twelve buttons named "Dismiss"
  are indistinguishable in a screen reader's element list.
  Whatever removes this alert must move focus first; see the React tab. Killing
  the focused element without a plan drops focus to <body> and strands keyboard
  users at the top of the page.
-->
<div class="flex items-start gap-2.5 rounded-[0.625rem] border border-blue-200 bg-blue-50 px-3.5 py-3 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200" role="status">
  <svg class="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
  </svg>

  <div class="min-w-0 flex-1">
    <p class="text-sm font-semibold">Scheduled maintenance</p>
    <p class="mt-0.5 text-sm leading-normal">We'll be read-only on Sunday 03:00-04:00 UTC.</p>
  </div>

  <button
    type="button"
    aria-label="Dismiss: Scheduled maintenance"
    class="-mr-1 -mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 motion-reduce:transition-none dark:hover:bg-blue-900 dark:focus-visible:ring-blue-300"
  >
    <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
    </svg>
  </button>
</div>`,
      react: `import { useRef, useState } from 'react';

export function AlertDismissible({
  title,
  children,
  dismissLabel = 'Dismiss',
  onDismiss,
  className = '',
}) {
  const [visible, setVisible] = useState(true);
  // The anchor outlives the alert, so there is always somewhere for focus to go.
  const anchorRef = useRef(null);

  const handleDismiss = () => {
    // Focus the anchor BEFORE unmounting. Unmount first and the browser drops
    // focus to <body>, sending keyboard users back to the top of the page.
    anchorRef.current?.focus();
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div ref={anchorRef} tabIndex={-1} className="outline-none">
      {visible ? (
        <div
          role="status"
          className={\`flex items-start gap-2.5 rounded-[0.625rem] border border-blue-200 bg-blue-50 px-3.5 py-3 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200 \${className}\`}
        >
          <svg
            className="mt-px h-[1.125rem] w-[1.125rem] flex-none"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
          </svg>

          <div className="min-w-0 flex-1">
            {title ? <p className="text-sm font-semibold">{title}</p> : null}
            <p className={\`text-sm leading-normal \${title ? 'mt-0.5' : ''}\`}>{children}</p>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label={title ? \`\${dismissLabel}: \${title}\` : dismissLabel}
            className="-mr-1 -mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 motion-reduce:transition-none dark:hover:bg-blue-900 dark:focus-visible:ring-blue-300"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}`,
      nextjs: `'use client';

// Dismissal is state, so this is a Client Component. Persist the dismissal
// server-side (or in a cookie) if the alert must stay gone across navigations -
// local state alone means it reappears on the next page load.
import { useRef, useState, type ReactNode } from 'react';

interface AlertDismissibleProps {
  title?: string;
  children: ReactNode;
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

export function AlertDismissible({
  title,
  children,
  dismissLabel = 'Dismiss',
  onDismiss,
  className = '',
}: AlertDismissibleProps) {
  const [visible, setVisible] = useState(true);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleDismiss = () => {
    anchorRef.current?.focus();
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div ref={anchorRef} tabIndex={-1} className="outline-none">
      {visible ? (
        <div
          role="status"
          className={\`flex items-start gap-2.5 rounded-[0.625rem] border border-blue-200 bg-blue-50 px-3.5 py-3 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200 \${className}\`}
        >
          <svg
            className="mt-px h-[1.125rem] w-[1.125rem] flex-none"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
          </svg>

          <div className="min-w-0 flex-1">
            {title ? <p className="text-sm font-semibold">{title}</p> : null}
            <p className={\`text-sm leading-normal \${title ? 'mt-0.5' : ''}\`}>{children}</p>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label={title ? \`\${dismissLabel}: \${title}\` : dismissLabel}
            className="-mr-1 -mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 motion-reduce:transition-none dark:hover:bg-blue-900 dark:focus-visible:ring-blue-300"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useRef, useState, type ReactNode } from 'react';

export interface AlertDismissibleProps {
  title?: string;
  children: ReactNode;
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

export function AlertDismissible({
  title,
  children,
  dismissLabel = 'Dismiss',
  onDismiss,
  className = '',
}: AlertDismissibleProps): JSX.Element {
  const [visible, setVisible] = useState<boolean>(true);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleDismiss = (): void => {
    anchorRef.current?.focus();
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div ref={anchorRef} tabIndex={-1} className="outline-none">
      {visible ? (
        <div
          role="status"
          className={\`flex items-start gap-2.5 rounded-[0.625rem] border border-blue-200 bg-blue-50 px-3.5 py-3 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200 \${className}\`}
        >
          <svg
            className="mt-px h-[1.125rem] w-[1.125rem] flex-none"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
          </svg>

          <div className="min-w-0 flex-1">
            {title !== undefined ? <p className="text-sm font-semibold">{title}</p> : null}
            <p className={\`text-sm leading-normal \${title !== undefined ? 'mt-0.5' : ''}\`}>
              {children}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label={title !== undefined ? \`\${dismissLabel}: \${title}\` : dismissLabel}
            className="-mr-1 -mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 motion-reduce:transition-none dark:hover:bg-blue-900 dark:focus-visible:ring-blue-300"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'alert-callout',
    category: 'alerts',
    tags: ['callout', 'docs', 'note', 'prose', 'aside'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-08',
    updatedAt: '2026-06-22',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 890, copies: 214, downloads: 57 },
    variants: [
      { id: 'text', labelKey: 'text' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Note'", descriptionKey: 'calloutLabel', example: 'Tip' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The documentation callout - the "Note:" / "Tip:" block in a page of prose. It
  is an alert only in family resemblance; what makes it its own thing is the
  ARIA it deliberately does NOT have:

  - No role="alert", no role="status", no live region of any kind. This is body
    copy. It was on the page before the reader arrived and will be there after
    they leave; there is no event to announce.
  - <aside>, so it is exposed as a complementary landmark - a screen-reader user
    can skip it, or jump straight to it, exactly like a sighted reader skims
    past a sidebar.
  - The "Note" label is real text, not a ::before. It is the first thing read
    aloud, and it's what makes the block make sense out of context.

  The left accent bar is decoration on top of that, never the signal.
-->
<aside class="callout">
  <p class="callout__label">
    <svg class="callout__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
    </svg>
    Note
  </p>
  <p class="callout__text">
    Rotating a key invalidates every token signed with it. Deploy the new key to
    all consumers before you revoke the old one.
  </p>
</aside>`,
      css: `/*
 * The accent bar is a border, not a pseudo-element, so it survives being
 * printed and being read with author styles partly off.
 */
.callout {
  padding: 0.875rem 1rem;
  border-left: 3px solid #1d4ed8;
  border-radius: 0 0.5rem 0.5rem 0;
  background: #f9fafb;
}

/* blue-800 on gray-50 measures 7.7:1. */
.callout__label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #1e40af;
}

.callout__icon {
  width: 0.875rem;
  height: 0.875rem;
}

/* gray-700 on gray-50 is 9.7:1 - prose, so it gets prose contrast. */
.callout__text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 */
@media (prefers-color-scheme: dark) {
  .callout {
    border-left-color: #60a5fa;
    background: #111827;
  }

  .callout__label {
    color: #93c5fd; /* 9.84:1 on gray-900 */
  }

  .callout__text {
    color: #d1d5db; /* 11.4:1 on gray-900 */
  }
}`,
      tailwind: `<!--
  Deliberately has no live region: this is prose that was always on the page,
  not an event. <aside> exposes it as a complementary landmark so it can be
  skipped or jumped to. The "Note" label is real text - the accent bar and icon
  are decoration layered on top of a signal that already reads without them.
-->
<aside class="rounded-r-lg border-l-[3px] border-blue-700 bg-gray-50 px-4 py-3.5 dark:border-blue-400 dark:bg-gray-900">
  <p class="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
    <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
    </svg>
    Note
  </p>
  <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
    Rotating a key invalidates every token signed with it. Deploy the new key to all consumers before you revoke the old one.
  </p>
</aside>`,
      react: `// No role, no aria-live - see the HTML tab. A callout is prose, and prose is
// not an announcement.
export function AlertCallout({ label = 'Note', children, className = '' }) {
  return (
    <aside
      className={\`rounded-r-lg border-l-[3px] border-blue-700 bg-gray-50 px-4 py-3.5 dark:border-blue-400 dark:bg-gray-900 \${className}\`}
    >
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
        </svg>
        {label}
      </p>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>
    </aside>
  );
}`,
      nextjs: `// A Server Component, and the one in this category that could never be
// anything else - it is markup around prose, with nothing to hydrate.
import type { ReactNode } from 'react';

interface AlertCalloutProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

export function AlertCallout({ label = 'Note', children, className = '' }: AlertCalloutProps) {
  return (
    <aside
      className={\`rounded-r-lg border-l-[3px] border-blue-700 bg-gray-50 px-4 py-3.5 dark:border-blue-400 dark:bg-gray-900 \${className}\`}
    >
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
        </svg>
        {label}
      </p>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>
    </aside>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface AlertCalloutProps {
  /** Read aloud first - it is what makes the block make sense out of context. */
  label?: string;
  children: ReactNode;
  className?: string;
}

export function AlertCallout({
  label = 'Note',
  children,
  className = '',
}: AlertCalloutProps): JSX.Element {
  return (
    <aside
      className={\`rounded-r-lg border-l-[3px] border-blue-700 bg-gray-50 px-4 py-3.5 dark:border-blue-400 dark:bg-gray-900 \${className}\`}
    >
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
        </svg>
        {label}
      </p>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>
    </aside>
  );
}`,
    },
  },
  {
    slug: 'alert-banner-top',
    category: 'alerts',
    tags: ['banner', 'top', 'full-width', 'sticky', 'announcement'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-18',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1050, copies: 268, downloads: 71 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'highlighted', labelKey: 'highlighted' },
    ],
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'ctaLabel', type: 'string', descriptionKey: 'ctaLabel' },
      { name: 'href', type: 'string', descriptionKey: 'href' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The page-wide status bar: degraded service, trial expiring, region outage. It
  is an alert, not a notification - it reflects a condition that is true right
  now and stays until it isn't.

  Two rules it must not break:

  1. It goes FIRST in the DOM, above the header, and it is a real block in the
     flow. Never position: fixed. A fixed bar overlaps the top of the page at
     200% zoom, where the viewport is a few hundred CSS pixels tall and the bar
     is eating a third of it. In flow, the page just starts lower.
  2. It is <section> with a label, not <header> or a bare div - a second banner
     role on the page confuses landmark navigation.

  role="status" and not "alert": it is present on load, where an assertive
  region has nothing to announce anyway (it never changed), and where
  interrupting the user's first sentence would be gratuitous.
-->
<section class="topbar" role="status" aria-label="Service status">
  <div class="topbar__inner">
    <svg class="topbar__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
    <p class="topbar__text">
      Degraded performance in eu-west-1. Writes may be delayed.
    </p>
    <a class="topbar__link" href="https://status.example.com">Status page</a>
  </div>
</section>`,
      css: `/*
 * Full-bleed background, constrained content. Note the absence of
 * position: fixed - see the HTML tab for why that matters at 200% zoom.
 */
.topbar {
  width: 100%;
  border-bottom: 1px solid #fde68a;
  background: #fffbeb;
  color: #92400e; /* 6.84:1 on amber-50 */
}

.topbar__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-width: 72rem;
  margin: 0 auto;
  padding: 0.5rem 1rem;
}

.topbar__icon {
  flex: none;
  width: 1rem;
  height: 1rem;
}

.topbar__text {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  text-align: center;
}

/* Underlined, not colour-only: this link sits on a coloured bar where a
   colour-shift alone is invisible to plenty of readers. */
.topbar__link {
  font-size: 0.8125rem;
  font-weight: 600;
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.topbar__link:hover {
  text-decoration-thickness: 2px;
}

.topbar__link:focus-visible {
  outline: 2px solid #92400e;
  outline-offset: 2px;
  border-radius: 0.125rem;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * amber-200 on amber-950 is 12.03:1.
 */
@media (prefers-color-scheme: dark) {
  .topbar {
    border-bottom-color: #78350f;
    background: #451a03;
    color: #fde68a;
  }

  .topbar__link:focus-visible {
    outline-color: #fde68a;
  }
}`,
      tailwind: `<!--
  First element in <body>, above the header, in normal flow - never fixed. A
  fixed bar swallows the top of the page at 200% zoom, where the viewport is a
  few hundred CSS pixels tall.
  <section aria-label> rather than <header>: a second banner landmark breaks
  landmark navigation.
  amber-800/amber-200 clear AA on their tints (6.84:1 / 12.03:1) and the link is
  underlined, because a colour shift on a coloured bar is not a link affordance.
-->
<section class="w-full border-b border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200" role="status" aria-label="Service status">
  <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2">
    <svg class="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>

    <p class="text-center text-[0.8125rem] font-medium">Degraded performance in eu-west-1. Writes may be delayed.</p>

    <a
      href="https://status.example.com"
      class="rounded-sm text-[0.8125rem] font-semibold underline underline-offset-2 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-amber-950"
    >
      Status page
    </a>
  </div>
</section>`,
      react: `// Render this as the first child of your layout, above the header. Not fixed -
// see the HTML tab.
export function AlertBannerTop({ children, ctaLabel, href, className = '' }) {
  return (
    <section
      role="status"
      aria-label="Service status"
      className={\`w-full border-b border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200 \${className}\`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2">
        <svg className="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        </svg>

        <p className="text-center text-[0.8125rem] font-medium">{children}</p>

        {ctaLabel && href ? (
          <a
            href={href}
            className="rounded-sm text-[0.8125rem] font-semibold underline underline-offset-2 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-amber-950"
          >
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}`,
      nextjs: `// A Server Component in app/layout.tsx, rendered above <header>. Fetch the
// status on the server and this bar costs the client nothing.
import type { ReactNode } from 'react';

interface AlertBannerTopProps {
  children: ReactNode;
  ctaLabel?: string;
  href?: string;
  className?: string;
}

export function AlertBannerTop({ children, ctaLabel, href, className = '' }: AlertBannerTopProps) {
  return (
    <section
      role="status"
      aria-label="Service status"
      className={\`w-full border-b border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200 \${className}\`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2">
        <svg className="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        </svg>

        <p className="text-center text-[0.8125rem] font-medium">{children}</p>

        {ctaLabel && href ? (
          <a
            href={href}
            className="rounded-sm text-[0.8125rem] font-semibold underline underline-offset-2 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-amber-950"
          >
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface AlertBannerTopProps {
  children: ReactNode;
  ctaLabel?: string;
  href?: string;
  className?: string;
}

export function AlertBannerTop({
  children,
  ctaLabel,
  href,
  className = '',
}: AlertBannerTopProps): JSX.Element {
  return (
    <section
      role="status"
      aria-label="Service status"
      className={\`w-full border-b border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200 \${className}\`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2">
        <svg className="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        </svg>

        <p className="text-center text-[0.8125rem] font-medium">{children}</p>

        {ctaLabel !== undefined && href !== undefined ? (
          <a
            href={href}
            className="rounded-sm text-[0.8125rem] font-semibold underline underline-offset-2 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-amber-950"
          >
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'alert-success-solid',
    category: 'alerts',
    tags: ['alert', 'solid', 'filled', 'success', 'confirmation'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'severity', type: "'info' | 'success' | 'warning' | 'error'", default: "'success'", descriptionKey: 'severity' },
      { name: 'dismissLabel', type: 'string', default: "'Dismiss'", descriptionKey: 'dismissLabel' },
      { name: 'onDismiss', type: '() => void', descriptionKey: 'onDismiss' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A solid, filled alert - the loud variant for a confirmation you want seen. The
  contrast trap here is the fill itself: white on green-500/600 lands ~2-3:1 and
  fails AA, so the solids are -700/-800 (white on green-700 4.9:1, amber-800
  6.8:1). The check shape carries the "success" meaning without the colour, and
  the dismiss button is a real <button> whose label says what it closes.
-->
<div class="flex items-start gap-3 rounded-xl bg-green-700 px-4 py-3.5 text-white" role="status">
  <svg class="mt-px h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
  </svg>
  <div class="min-w-0 flex-1">
    <p class="text-sm font-semibold">Payment received</p>
    <p class="mt-0.5 text-sm leading-normal text-white/90">Your invoice is settled - a receipt is on its way to your inbox.</p>
  </div>
  <button
    type="button"
    aria-label="Dismiss: Payment received"
    class="-mr-1 -mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 motion-reduce:transition-none"
  >
    <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
    </svg>
  </button>
</div>`,
      react: `import { useState } from 'react';

// Solid fills that clear AA against white text: the -700/-800 shades, never the
// -500/-600 everyone reaches for first.
const SOLID_STYLES = {
  info: 'bg-blue-700',
  success: 'bg-green-700',
  warning: 'bg-amber-800',
  error: 'bg-red-700',
};

const SEVERITY_PATHS = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertSuccessSolid({
  title,
  children,
  severity = 'success',
  dismissLabel = 'Dismiss',
  onDismiss,
  className = '',
}) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const role = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={\`flex items-start gap-3 rounded-xl px-4 py-3.5 text-white \${SOLID_STYLES[severity]} \${className}\`}
    >
      <svg className="mt-px h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d={SEVERITY_PATHS[severity]} />
      </svg>

      <div className="min-w-0 flex-1">
        {title ? <p className="text-sm font-semibold">{title}</p> : null}
        <p className={\`text-sm leading-normal text-white/90 \${title ? 'mt-0.5' : ''}\`}>{children}</p>
      </div>

      <button
        type="button"
        onClick={() => {
          setVisible(false);
          onDismiss?.();
        }}
        aria-label={title ? \`\${dismissLabel}: \${title}\` : dismissLabel}
        className="-mr-1 -mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 motion-reduce:transition-none"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>
  );
}`,
      typescript: `import { useState, type ReactNode } from 'react';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AlertSuccessSolidProps {
  title?: string;
  children: ReactNode;
  severity?: AlertSeverity;
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

const SOLID_STYLES: Record<AlertSeverity, string> = {
  info: 'bg-blue-700',
  success: 'bg-green-700',
  warning: 'bg-amber-800',
  error: 'bg-red-700',
};

const SEVERITY_PATHS: Record<AlertSeverity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertSuccessSolid({
  title,
  children,
  severity = 'success',
  dismissLabel = 'Dismiss',
  onDismiss,
  className = '',
}: AlertSuccessSolidProps): JSX.Element | null {
  const [visible, setVisible] = useState<boolean>(true);
  if (!visible) return null;

  const role: 'alert' | 'status' = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={\`flex items-start gap-3 rounded-xl px-4 py-3.5 text-white \${SOLID_STYLES[severity]} \${className}\`}
    >
      <svg className="mt-px h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d={SEVERITY_PATHS[severity]} />
      </svg>

      <div className="min-w-0 flex-1">
        {title !== undefined ? <p className="text-sm font-semibold">{title}</p> : null}
        <p className={\`text-sm leading-normal text-white/90 \${title !== undefined ? 'mt-0.5' : ''}\`}>
          {children}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setVisible(false);
          onDismiss?.();
        }}
        aria-label={title !== undefined ? \`\${dismissLabel}: \${title}\` : dismissLabel}
        className="-mr-1 -mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md text-white/90 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 motion-reduce:transition-none"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>
  );
}`,
    },
  },
  {
    slug: 'alert-outline',
    category: 'alerts',
    tags: ['alert', 'outline', 'bordered', 'severity', 'minimal'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'severity', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", descriptionKey: 'severity' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The quiet variant: no fill, just a coloured border and coloured text on the
  page's own background. It leans on -700 text (light) / -300 text (dark), which
  clear AA on white and gray-900 respectively, plus the per-severity icon shape -
  a border colour alone is the weakest possible signal, so it never works alone.
-->
<div class="flex items-start gap-2.5 rounded-lg border border-blue-300 bg-transparent px-3.5 py-3 text-blue-700 dark:border-blue-700 dark:text-blue-300" role="status">
  <svg class="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
  </svg>
  <div class="min-w-0 flex-1">
    <p class="text-sm font-semibold">Heads up</p>
    <p class="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-300">This workspace is in read-only mode while the export runs.</p>
  </div>
</div>`,
      react: `const OUTLINE_STYLES = {
  info: 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300',
  success: 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-300',
  warning: 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300',
  error: 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-300',
};

const SEVERITY_PATHS = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertOutline({ title, children, severity = 'info', className = '' }) {
  const role = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={\`flex items-start gap-2.5 rounded-lg border bg-transparent px-3.5 py-3 \${OUTLINE_STYLES[severity]} \${className}\`}
    >
      <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d={SEVERITY_PATHS[severity]} />
      </svg>
      <div className="min-w-0 flex-1">
        {title ? <p className="text-sm font-semibold">{title}</p> : null}
        <p className={\`text-sm leading-normal text-gray-600 dark:text-gray-300 \${title ? 'mt-0.5' : ''}\`}>
          {children}
        </p>
      </div>
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AlertOutlineProps {
  title?: string;
  children: ReactNode;
  severity?: AlertSeverity;
  className?: string;
}

const OUTLINE_STYLES: Record<AlertSeverity, string> = {
  info: 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300',
  success: 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-300',
  warning: 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300',
  error: 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-300',
};

const SEVERITY_PATHS: Record<AlertSeverity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertOutline({
  title,
  children,
  severity = 'info',
  className = '',
}: AlertOutlineProps): JSX.Element {
  const role: 'alert' | 'status' = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={\`flex items-start gap-2.5 rounded-lg border bg-transparent px-3.5 py-3 \${OUTLINE_STYLES[severity]} \${className}\`}
    >
      <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d={SEVERITY_PATHS[severity]} />
      </svg>
      <div className="min-w-0 flex-1">
        {title !== undefined ? <p className="text-sm font-semibold">{title}</p> : null}
        <p className={\`text-sm leading-normal text-gray-600 dark:text-gray-300 \${title !== undefined ? 'mt-0.5' : ''}\`}>
          {children}
        </p>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'alert-soft-tint',
    category: 'alerts',
    tags: ['alert', 'soft', 'tint', 'severity', 'chip'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'severity', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", descriptionKey: 'severity' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A softer take on the tinted alert: the icon sits in its own tinted chip so the
  severity reads as a shape-in-a-swatch even before the text. Body copy uses the
  neutral gray ramp (gray-700 / gray-300) for calm long-form contrast, while the
  chip carries the -700/-200 colour that clears AA on the -100/-900 swatch.
-->
<div class="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-3.5 py-3 dark:border-blue-900/60 dark:bg-blue-950/40" role="status">
  <span class="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" aria-hidden="true">
    <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
    </svg>
  </span>
  <div class="min-w-0 flex-1">
    <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Sync in progress</p>
    <p class="mt-0.5 text-sm leading-normal text-gray-700 dark:text-gray-300">We're importing your contacts. This usually takes under a minute.</p>
  </div>
</div>`,
      react: `const TINT_STYLES = {
  info: 'border-blue-100 bg-blue-50/70 dark:border-blue-900/60 dark:bg-blue-950/40',
  success: 'border-green-100 bg-green-50/70 dark:border-green-900/60 dark:bg-green-950/40',
  warning: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/40',
  error: 'border-red-100 bg-red-50/70 dark:border-red-900/60 dark:bg-red-950/40',
};

const CHIP_STYLES = {
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
};

const SEVERITY_PATHS = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertSoftTint({ title, children, severity = 'info', className = '' }) {
  const role = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={\`flex items-start gap-3 rounded-xl border px-3.5 py-3 \${TINT_STYLES[severity]} \${className}\`}
    >
      <span
        aria-hidden="true"
        className={\`flex h-8 w-8 flex-none items-center justify-center rounded-lg \${CHIP_STYLES[severity]}\`}
      >
        <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="currentColor">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        {title ? <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p> : null}
        <p className={\`text-sm leading-normal text-gray-700 dark:text-gray-300 \${title ? 'mt-0.5' : ''}\`}>
          {children}
        </p>
      </div>
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AlertSoftTintProps {
  title?: string;
  children: ReactNode;
  severity?: AlertSeverity;
  className?: string;
}

const TINT_STYLES: Record<AlertSeverity, string> = {
  info: 'border-blue-100 bg-blue-50/70 dark:border-blue-900/60 dark:bg-blue-950/40',
  success: 'border-green-100 bg-green-50/70 dark:border-green-900/60 dark:bg-green-950/40',
  warning: 'border-amber-100 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/40',
  error: 'border-red-100 bg-red-50/70 dark:border-red-900/60 dark:bg-red-950/40',
};

const CHIP_STYLES: Record<AlertSeverity, string> = {
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
  success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
};

const SEVERITY_PATHS: Record<AlertSeverity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertSoftTint({
  title,
  children,
  severity = 'info',
  className = '',
}: AlertSoftTintProps): JSX.Element {
  const role: 'alert' | 'status' = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={\`flex items-start gap-3 rounded-xl border px-3.5 py-3 \${TINT_STYLES[severity]} \${className}\`}
    >
      <span
        aria-hidden="true"
        className={\`flex h-8 w-8 flex-none items-center justify-center rounded-lg \${CHIP_STYLES[severity]}\`}
      >
        <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="currentColor">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        {title !== undefined ? (
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        ) : null}
        <p className={\`text-sm leading-normal text-gray-700 dark:text-gray-300 \${title !== undefined ? 'mt-0.5' : ''}\`}>
          {children}
        </p>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'alert-with-icon-list',
    category: 'alerts',
    tags: ['alert', 'list', 'validation', 'errors', 'checklist'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'items', type: 'string[]', required: true, descriptionKey: 'items' },
      { name: 'severity', type: "'info' | 'success' | 'warning' | 'error'", default: "'error'", descriptionKey: 'severity' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The "fix these first" summary: a title plus a real <ul> of specifics. The list
  is semantic, so a screen reader announces "list, 3 items" and lets the user
  step through them. Each row is items-start with a flex-none marker and a
  min-w-0 text cell, so a long line wraps under itself instead of shoving the
  marker off-screen at 320px. role="alert" because this is an error blocking the
  user right now.
-->
<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3.5 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200" role="alert">
  <div class="flex items-start gap-2.5">
    <svg class="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z" />
    </svg>
    <p class="min-w-0 flex-1 text-sm font-semibold">Fix 3 issues before publishing</p>
  </div>
  <ul class="mt-2 space-y-1.5 pl-[1.625rem] text-sm">
    <li class="flex items-start gap-2">
      <span class="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-current" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 leading-normal">The billing address is missing a postal code.</span>
    </li>
    <li class="flex items-start gap-2">
      <span class="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-current" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 leading-normal">Two line items reference a product that was archived.</span>
    </li>
    <li class="flex items-start gap-2">
      <span class="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-current" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 leading-normal">The purchase-order number is longer than the 20 characters your ERP accepts.</span>
    </li>
  </ul>
</div>`,
      react: `const LIST_STYLES = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
};

const SEVERITY_PATHS = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertWithIconList({ title, items, severity = 'error', className = '' }) {
  const role = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={\`rounded-lg border px-4 py-3.5 \${LIST_STYLES[severity]} \${className}\`}
    >
      <div className="flex items-start gap-2.5">
        <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
        <p className="min-w-0 flex-1 text-sm font-semibold">{title}</p>
      </div>
      <ul className="mt-2 space-y-1.5 pl-[1.625rem] text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-current" aria-hidden="true" />
            <span className="min-w-0 flex-1 leading-normal">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      typescript: `export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AlertWithIconListProps {
  title: string;
  items: string[];
  severity?: AlertSeverity;
  className?: string;
}

const LIST_STYLES: Record<AlertSeverity, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
};

const SEVERITY_PATHS: Record<AlertSeverity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertWithIconList({
  title,
  items,
  severity = 'error',
  className = '',
}: AlertWithIconListProps): JSX.Element {
  const role: 'alert' | 'status' = severity === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={\`rounded-lg border px-4 py-3.5 \${LIST_STYLES[severity]} \${className}\`}
    >
      <div className="flex items-start gap-2.5">
        <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
        <p className="min-w-0 flex-1 text-sm font-semibold">{title}</p>
      </div>
      <ul className="mt-2 space-y-1.5 pl-[1.625rem] text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-current" aria-hidden="true" />
            <span className="min-w-0 flex-1 leading-normal">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    },
  },
  {
    slug: 'alert-progress-timed',
    category: 'alerts',
    tags: ['alert', 'timed', 'auto-dismiss', 'progress', 'motion-reduce'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'duration', type: 'number', default: '5000', descriptionKey: 'duration' },
      { name: 'onDismiss', type: '() => void', descriptionKey: 'onDismiss' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Auto-dismiss with a visible countdown bar, so nothing vanishes without warning.
  Two accessibility rules drive the markup:
  - The bar is decorative (aria-hidden). The remaining time is not announced
    tick-by-tick - that would flood a screen reader - so role="status" announces
    the message once and the timer is silent.
  - motion-reduce:hidden drops the shrinking bar for users who ask for less
    motion; the auto-dismiss timer still fires, it just isn't animated. Never
    auto-dismiss the ONLY copy of critical text - this pattern is for
    acknowledgements the user can also reach elsewhere.
  See the React/TypeScript tabs for the timer; CSS alone can't unmount.
-->
<div class="relative overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900" role="status">
  <div class="flex items-start gap-2.5">
    <svg class="mt-px h-[1.125rem] w-[1.125rem] flex-none text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
    </svg>
    <p class="min-w-0 flex-1 text-sm leading-normal text-gray-700 dark:text-gray-300">Changes saved. This notice will clear itself shortly.</p>
  </div>
  <div class="absolute inset-x-0 bottom-0 h-1 bg-gray-100 dark:bg-gray-800 motion-reduce:hidden" aria-hidden="true">
    <div class="h-full w-0 bg-green-600 transition-[width] duration-[5000ms] ease-linear dark:bg-green-400"></div>
  </div>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function AlertProgressTimed({ children, duration = 5000, onDismiss, className = '' }) {
  const [visible, setVisible] = useState(true);
  // Drives the bar from full to empty via a width transition - no keyframes, so
  // it drops cleanly under motion-reduce.
  const [elapsed, setElapsed] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    // Two frames so the browser paints width:100% before transitioning to 0%.
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setElapsed(true)));
    const timer = window.setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [duration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className={\`relative overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex items-start gap-2.5">
        <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
        </svg>
        <p className="min-w-0 flex-1 text-sm leading-normal text-gray-700 dark:text-gray-300">{children}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-100 dark:bg-gray-800 motion-reduce:hidden" aria-hidden="true">
        <div
          ref={barRef}
          className="h-full bg-green-600 ease-linear dark:bg-green-400 motion-safe:transition-[width]"
          style={{ width: elapsed ? '0%' : '100%', transitionDuration: \`\${duration}ms\` }}
        />
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface AlertProgressTimedProps {
  children: ReactNode;
  duration?: number;
  onDismiss?: () => void;
  className?: string;
}

export function AlertProgressTimed({
  children,
  duration = 5000,
  onDismiss,
  className = '',
}: AlertProgressTimedProps): JSX.Element | null {
  const [visible, setVisible] = useState<boolean>(true);
  const [elapsed, setElapsed] = useState<boolean>(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setElapsed(true)));
    const timer = window.setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [duration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className={\`relative overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex items-start gap-2.5">
        <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
        </svg>
        <p className="min-w-0 flex-1 text-sm leading-normal text-gray-700 dark:text-gray-300">{children}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-100 dark:bg-gray-800 motion-reduce:hidden" aria-hidden="true">
        <div
          ref={barRef}
          className="h-full bg-green-600 ease-linear dark:bg-green-400 motion-safe:transition-[width]"
          style={{ width: elapsed ? '0%' : '100%', transitionDuration: \`\${duration}ms\` }}
        />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'alert-expandable-details',
    category: 'alerts',
    tags: ['alert', 'expandable', 'details', 'disclosure', 'aria-expanded'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'summary', type: 'string', required: true, descriptionKey: 'summary' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'severity', type: "'info' | 'success' | 'warning' | 'error'", default: "'error'", descriptionKey: 'severity' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A short summary that opens onto the noisy detail (a stack trace, the raw
  response) on demand. The HTML build uses native <details>/<summary> so it works
  with zero JavaScript and the browser wires the disclosure semantics for free;
  the React tabs use a button with aria-expanded/aria-controls for the same
  effect. The detail is <pre> that scrolls on its own (overflow-x-auto) so a long
  unbreakable line never widens the page at 320px. role="alert" for the error.
-->
<details class="group rounded-lg border border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200" role="alert">
  <summary class="flex cursor-pointer items-start gap-2.5 rounded-lg px-4 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 dark:focus-visible:ring-red-300">
    <svg class="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z" />
    </svg>
    <span class="min-w-0 flex-1">
      <span class="block text-sm font-semibold">Deploy failed</span>
      <span class="mt-0.5 block text-sm leading-normal">The build step exited with code 1. Show details for the log.</span>
    </span>
    <svg class="mt-0.5 h-4 w-4 flex-none transition-transform group-open:rotate-180 motion-reduce:transition-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
    </svg>
  </summary>
  <div class="border-t border-red-200 px-4 py-3 dark:border-red-900">
    <pre class="overflow-x-auto rounded bg-red-100/60 p-3 text-xs leading-relaxed dark:bg-red-900/40"><code>ERR! build exited with code 1
ERR! at Object.compile (/app/src/pipeline.ts:88:14)</code></pre>
  </div>
</details>`,
      react: `import { useId, useState } from 'react';

const PANEL_STYLES = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
};

const RING_STYLES = {
  info: 'focus-visible:ring-blue-700 dark:focus-visible:ring-blue-300',
  success: 'focus-visible:ring-green-700 dark:focus-visible:ring-green-300',
  warning: 'focus-visible:ring-amber-700 dark:focus-visible:ring-amber-300',
  error: 'focus-visible:ring-red-700 dark:focus-visible:ring-red-300',
};

const SEVERITY_PATHS = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertExpandableDetails({ title, summary, children, severity = 'error', className = '' }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const role = severity === 'error' ? 'alert' : 'status';

  return (
    <div role={role} className={\`rounded-lg border \${PANEL_STYLES[severity]} \${className}\`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className={\`flex w-full items-start gap-2.5 rounded-lg px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 \${RING_STYLES[severity]}\`}
      >
        <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{title}</span>
          <span className="mt-0.5 block text-sm leading-normal">{summary}</span>
        </span>
        <svg
          className={\`mt-0.5 h-4 w-4 flex-none transition-transform motion-reduce:transition-none \${open ? 'rotate-180' : ''}\`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
      {open ? (
        <div id={panelId} className="border-t border-black/10 px-4 py-3 dark:border-white/10">
          {children}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useId, useState, type ReactNode } from 'react';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AlertExpandableDetailsProps {
  title: string;
  summary: string;
  children: ReactNode;
  severity?: AlertSeverity;
  className?: string;
}

const PANEL_STYLES: Record<AlertSeverity, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
};

const RING_STYLES: Record<AlertSeverity, string> = {
  info: 'focus-visible:ring-blue-700 dark:focus-visible:ring-blue-300',
  success: 'focus-visible:ring-green-700 dark:focus-visible:ring-green-300',
  warning: 'focus-visible:ring-amber-700 dark:focus-visible:ring-amber-300',
  error: 'focus-visible:ring-red-700 dark:focus-visible:ring-red-300',
};

const SEVERITY_PATHS: Record<AlertSeverity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertExpandableDetails({
  title,
  summary,
  children,
  severity = 'error',
  className = '',
}: AlertExpandableDetailsProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const panelId: string = useId();
  const role: 'alert' | 'status' = severity === 'error' ? 'alert' : 'status';

  return (
    <div role={role} className={\`rounded-lg border \${PANEL_STYLES[severity]} \${className}\`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className={\`flex w-full items-start gap-2.5 rounded-lg px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 \${RING_STYLES[severity]}\`}
      >
        <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d={SEVERITY_PATHS[severity]} />
        </svg>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{title}</span>
          <span className="mt-0.5 block text-sm leading-normal">{summary}</span>
        </span>
        <svg
          className={\`mt-0.5 h-4 w-4 flex-none transition-transform motion-reduce:transition-none \${open ? 'rotate-180' : ''}\`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
      {open ? (
        <div id={panelId} className="border-t border-black/10 px-4 py-3 dark:border-white/10">
          {children}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'alert-cookie-consent',
    category: 'alerts',
    tags: ['alert', 'cookie', 'consent', 'gdpr', 'banner'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'message', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'acceptLabel', type: 'string', default: "'Accept all'", descriptionKey: 'acceptLabel' },
      { name: 'rejectLabel', type: 'string', default: "'Reject non-essential'", descriptionKey: 'rejectLabel' },
      { name: 'onAccept', type: '() => void', descriptionKey: 'onAccept' },
      { name: 'onReject', type: '() => void', descriptionKey: 'onReject' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Cookie consent. It is a labelled region, not a live alert - it is present on
  load, so role="alert" would have nothing to announce, and it must NOT trap
  focus like a modal dialog or the site becomes unusable for keyboard users who
  want to read first. "Reject" is a real, equally-prominent button (not a buried
  link): consent that only offers "Accept" isn't consent. Buttons stack under the
  text at 320px and sit inline from sm: up.
-->
<section aria-label="Cookie consent" class="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
    <p class="min-w-0 flex-1 text-sm leading-normal text-gray-700 dark:text-gray-300">
      We use cookies to keep you signed in and to measure traffic.
      <a href="#" class="font-medium text-gray-900 underline underline-offset-2 hover:no-underline dark:text-gray-100">See our policy</a>.
    </p>
    <div class="flex flex-col gap-2 sm:flex-row sm:flex-none">
      <button type="button" class="order-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900 sm:order-1">Reject non-essential</button>
      <button type="button" class="order-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-offset-gray-900 sm:order-2">Accept all</button>
    </div>
  </div>
</section>`,
      react: `import { useState } from 'react';

export function AlertCookieConsent({
  message,
  acceptLabel = 'Accept all',
  rejectLabel = 'Reject non-essential',
  onAccept,
  onReject,
  className = '',
}) {
  const [answered, setAnswered] = useState(false);
  if (answered) return null;

  return (
    <section
      aria-label="Cookie consent"
      className={\`rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <p className="min-w-0 flex-1 text-sm leading-normal text-gray-700 dark:text-gray-300">{message}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setAnswered(true);
              onReject?.();
            }}
            className="order-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900 sm:order-1"
          >
            {rejectLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              setAnswered(true);
              onAccept?.();
            }}
            className="order-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-offset-gray-900 sm:order-2"
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </section>
  );
}`,
      typescript: `import { useState, type ReactNode } from 'react';

export interface AlertCookieConsentProps {
  message: ReactNode;
  acceptLabel?: string;
  rejectLabel?: string;
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}

export function AlertCookieConsent({
  message,
  acceptLabel = 'Accept all',
  rejectLabel = 'Reject non-essential',
  onAccept,
  onReject,
  className = '',
}: AlertCookieConsentProps): JSX.Element | null {
  const [answered, setAnswered] = useState<boolean>(false);
  if (answered) return null;

  return (
    <section
      aria-label="Cookie consent"
      className={\`rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <p className="min-w-0 flex-1 text-sm leading-normal text-gray-700 dark:text-gray-300">{message}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setAnswered(true);
              onReject?.();
            }}
            className="order-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900 sm:order-1"
          >
            {rejectLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              setAnswered(true);
              onAccept?.();
            }}
            className="order-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-offset-gray-900 sm:order-2"
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'alert-system-status',
    category: 'alerts',
    tags: ['alert', 'status', 'uptime', 'operational', 'health'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'status', type: "'operational' | 'degraded' | 'down'", required: true, descriptionKey: 'systemStatus' },
      { name: 'label', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'children' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A service health row. The whole point is that status is NEVER carried by colour
  alone: each state pairs a distinct icon shape (check / triangle / cross) AND a
  written label ("Operational") with the dot. Someone in greyscale, or reading a
  screen reader, gets the state from the shape and the words. The dot is
  aria-hidden decoration; the label span is the real text. role="status".
-->
<div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900" role="status">
  <span class="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" aria-hidden="true">
    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
    </svg>
  </span>
  <div class="min-w-0 flex-1">
    <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">API</p>
    <p class="text-sm leading-normal text-gray-600 dark:text-gray-400">All endpoints responding normally.</p>
  </div>
  <span class="flex-none rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">Operational</span>
</div>`,
      react: `const STATUS_META = {
  operational: {
    text: 'Operational',
    chip: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    path: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  },
  degraded: {
    text: 'Degraded',
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    path: 'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  },
  down: {
    text: 'Down',
    chip: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    path: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
  },
};

export function AlertSystemStatus({ status, label, description, className = '' }) {
  const meta = STATUS_META[status];

  return (
    <div
      role="status"
      className={\`flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span className={\`flex h-6 w-6 flex-none items-center justify-center rounded-full \${meta.chip}\`} aria-hidden="true">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d={meta.path} />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
        {description ? (
          <p className="text-sm leading-normal text-gray-600 dark:text-gray-400">{description}</p>
        ) : null}
      </div>
      <span className={\`flex-none rounded-full px-2.5 py-0.5 text-xs font-semibold \${meta.badge}\`}>
        {meta.text}
      </span>
    </div>
  );
}`,
      typescript: `export type SystemStatus = 'operational' | 'degraded' | 'down';

export interface AlertSystemStatusProps {
  status: SystemStatus;
  label: string;
  description?: string;
  className?: string;
}

interface StatusMeta {
  text: string;
  chip: string;
  badge: string;
  path: string;
}

const STATUS_META: Record<SystemStatus, StatusMeta> = {
  operational: {
    text: 'Operational',
    chip: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    path: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  },
  degraded: {
    text: 'Degraded',
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    path: 'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  },
  down: {
    text: 'Down',
    chip: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    path: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
  },
};

export function AlertSystemStatus({
  status,
  label,
  description,
  className = '',
}: AlertSystemStatusProps): JSX.Element {
  const meta: StatusMeta = STATUS_META[status];

  return (
    <div
      role="status"
      className={\`flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span className={\`flex h-6 w-6 flex-none items-center justify-center rounded-full \${meta.chip}\`} aria-hidden="true">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d={meta.path} />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
        {description !== undefined ? (
          <p className="text-sm leading-normal text-gray-600 dark:text-gray-400">{description}</p>
        ) : null}
      </div>
      <span className={\`flex-none rounded-full px-2.5 py-0.5 text-xs font-semibold \${meta.badge}\`}>
        {meta.text}
      </span>
    </div>
  );
}`,
    },
  },
  {
    slug: 'alert-countdown',
    category: 'alerts',
    tags: ['alert', 'countdown', 'timer', 'deadline', 'urgency'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'deadline', type: 'number', required: true, descriptionKey: 'deadline' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'expiredLabel', type: 'string', default: "'This offer has ended.'", descriptionKey: 'expiredLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A live countdown to a deadline. The digits tick every second, which is exactly
  what must NOT be announced tick-by-tick, so the timer is aria-hidden and a
  single aria-live="polite" region carries a coarse, human summary ("about 2
  hours left") that updates rarely. The tabular-nums class stops the width from
  jittering as digits change - no layout shift, nothing to trip motion-reduce.
  See React/TypeScript for the clock; static HTML can't count down.
-->
<div class="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between" role="status">
  <div class="flex items-start gap-2.5">
    <svg class="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 0-2 0v4a1 1 0 0 0 .4.8l2.5 2a1 1 0 1 0 1.2-1.6L11 9.5V6Z" />
    </svg>
    <p class="min-w-0 text-sm font-semibold">Early-bird pricing ends soon</p>
  </div>
  <div class="flex flex-none gap-2 pl-[1.625rem] sm:pl-0" aria-hidden="true">
    <span class="flex min-w-[2.75rem] flex-col items-center rounded-md bg-white px-2 py-1 tabular-nums dark:bg-amber-900/50">
      <span class="text-base font-bold leading-none">02</span>
      <span class="mt-0.5 text-[0.625rem] font-medium uppercase tracking-wide opacity-70">hrs</span>
    </span>
    <span class="flex min-w-[2.75rem] flex-col items-center rounded-md bg-white px-2 py-1 tabular-nums dark:bg-amber-900/50">
      <span class="text-base font-bold leading-none">14</span>
      <span class="mt-0.5 text-[0.625rem] font-medium uppercase tracking-wide opacity-70">min</span>
    </span>
    <span class="flex min-w-[2.75rem] flex-col items-center rounded-md bg-white px-2 py-1 tabular-nums dark:bg-amber-900/50">
      <span class="text-base font-bold leading-none">08</span>
      <span class="mt-0.5 text-[0.625rem] font-medium uppercase tracking-wide opacity-70">sec</span>
    </span>
  </div>
  <span class="sr-only" aria-live="polite">About 2 hours left.</span>
</div>`,
      react: `import { useEffect, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

// Coarse phrase for the live region - it changes at most once a minute, so a
// screen reader isn't flooded by the per-second digits.
function coarse(ms) {
  if (ms <= 0) return 'Time is up.';
  const mins = Math.round(ms / 60000);
  if (mins < 60) return \`About \${mins} minute\${mins === 1 ? '' : 's'} left.\`;
  const hrs = Math.round(mins / 60);
  return \`About \${hrs} hour\${hrs === 1 ? '' : 's'} left.\`;
}

export function AlertCountdown({ deadline, title, expiredLabel = 'This offer has ended.', className = '' }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, deadline - Date.now()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [deadline]);

  const expired = remaining <= 0;
  const totalSec = Math.floor(remaining / 1000);
  const parts = [
    { value: pad(Math.floor(totalSec / 3600)), unit: 'hrs' },
    { value: pad(Math.floor((totalSec % 3600) / 60)), unit: 'min' },
    { value: pad(totalSec % 60), unit: 'sec' },
  ];

  return (
    <div
      role="status"
      className={\`flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between \${className}\`}
    >
      <div className="flex items-start gap-2.5">
        <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 0-2 0v4a1 1 0 0 0 .4.8l2.5 2a1 1 0 1 0 1.2-1.6L11 9.5V6Z" />
        </svg>
        <p className="min-w-0 text-sm font-semibold">{expired ? expiredLabel : title}</p>
      </div>
      {expired ? null : (
        <div className="flex flex-none gap-2 pl-[1.625rem] sm:pl-0" aria-hidden="true">
          {parts.map((p) => (
            <span key={p.unit} className="flex min-w-[2.75rem] flex-col items-center rounded-md bg-white px-2 py-1 tabular-nums dark:bg-amber-900/50">
              <span className="text-base font-bold leading-none">{p.value}</span>
              <span className="mt-0.5 text-[0.625rem] font-medium uppercase tracking-wide opacity-70">{p.unit}</span>
            </span>
          ))}
        </div>
      )}
      <span className="sr-only" aria-live="polite">{coarse(remaining)}</span>
    </div>
  );
}`,
      typescript: `import { useEffect, useState } from 'react';

export interface AlertCountdownProps {
  /** Absolute deadline as an epoch-millisecond timestamp. */
  deadline: number;
  title: string;
  expiredLabel?: string;
  className?: string;
}

const pad = (n: number): string => String(n).padStart(2, '0');

function coarse(ms: number): string {
  if (ms <= 0) return 'Time is up.';
  const mins = Math.round(ms / 60000);
  if (mins < 60) return \`About \${mins} minute\${mins === 1 ? '' : 's'} left.\`;
  const hrs = Math.round(mins / 60);
  return \`About \${hrs} hour\${hrs === 1 ? '' : 's'} left.\`;
}

export function AlertCountdown({
  deadline,
  title,
  expiredLabel = 'This offer has ended.',
  className = '',
}: AlertCountdownProps): JSX.Element {
  const [remaining, setRemaining] = useState<number>(() => Math.max(0, deadline - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, deadline - Date.now()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [deadline]);

  const expired: boolean = remaining <= 0;
  const totalSec = Math.floor(remaining / 1000);
  const parts: ReadonlyArray<{ value: string; unit: string }> = [
    { value: pad(Math.floor(totalSec / 3600)), unit: 'hrs' },
    { value: pad(Math.floor((totalSec % 3600) / 60)), unit: 'min' },
    { value: pad(totalSec % 60), unit: 'sec' },
  ];

  return (
    <div
      role="status"
      className={\`flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between \${className}\`}
    >
      <div className="flex items-start gap-2.5">
        <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 0-2 0v4a1 1 0 0 0 .4.8l2.5 2a1 1 0 1 0 1.2-1.6L11 9.5V6Z" />
        </svg>
        <p className="min-w-0 text-sm font-semibold">{expired ? expiredLabel : title}</p>
      </div>
      {expired ? null : (
        <div className="flex flex-none gap-2 pl-[1.625rem] sm:pl-0" aria-hidden="true">
          {parts.map((p) => (
            <span key={p.unit} className="flex min-w-[2.75rem] flex-col items-center rounded-md bg-white px-2 py-1 tabular-nums dark:bg-amber-900/50">
              <span className="text-base font-bold leading-none">{p.value}</span>
              <span className="mt-0.5 text-[0.625rem] font-medium uppercase tracking-wide opacity-70">{p.unit}</span>
            </span>
          ))}
        </div>
      )}
      <span className="sr-only" aria-live="polite">{coarse(remaining)}</span>
    </div>
  );
}`,
    },
  },
  {
    slug: 'alert-stacked-group',
    category: 'alerts',
    tags: ['alert', 'stack', 'group', 'list', 'region'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'AlertItem[]', required: true, descriptionKey: 'items' },
      { name: 'label', type: 'string', default: "'Alerts'", descriptionKey: 'groupLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Several related alerts as one labelled group. The wrapper is a single
  aria-labelledby'd region with the heading as its name, so a screen-reader user
  hears "Notices, group" once and can step through the members - far better than
  three loose, separately-announced alerts. The children carry NO live role: the
  group is present on load, so there is nothing to announce assertively; the
  colour+icon pairing still carries each severity. Rows wrap and never overflow
  at 320px.
-->
<section aria-labelledby="grp-heading" class="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
  <h2 id="grp-heading" class="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">2 notices</h2>
  <ul class="space-y-2">
    <li class="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
      <svg class="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>
      <span class="min-w-0 flex-1 text-sm leading-normal">Your SSL certificate renews in 6 days.</span>
    </li>
    <li class="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
      <svg class="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
      </svg>
      <span class="min-w-0 flex-1 text-sm leading-normal">A new team member is waiting for a role assignment.</span>
    </li>
  </ul>
</section>`,
      react: `import { useId } from 'react';

const ITEM_STYLES = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
};

const SEVERITY_PATHS = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertStackedGroup({ items, label = 'Alerts', className = '' }) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={\`rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <h2 id={headingId} className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {items.length} {label}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={\`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 \${ITEM_STYLES[item.severity]}\`}
          >
            <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d={SEVERITY_PATHS[item.severity]} />
            </svg>
            <span className="min-w-0 flex-1 text-sm leading-normal">{item.message}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `import { useId } from 'react';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  message: string;
}

export interface AlertStackedGroupProps {
  items: AlertItem[];
  label?: string;
  className?: string;
}

const ITEM_STYLES: Record<AlertSeverity, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200',
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200',
};

const SEVERITY_PATHS: Record<AlertSeverity, string> = {
  info: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z',
  success:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  warning:
    'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  error:
    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
};

export function AlertStackedGroup({
  items,
  label = 'Alerts',
  className = '',
}: AlertStackedGroupProps): JSX.Element {
  const headingId: string = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={\`rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <h2 id={headingId} className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {items.length} {label}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={\`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 \${ITEM_STYLES[item.severity]}\`}
          >
            <svg className="mt-px h-[1.125rem] w-[1.125rem] flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d={SEVERITY_PATHS[item.severity]} />
            </svg>
            <span className="min-w-0 flex-1 text-sm leading-normal">{item.message}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
];
