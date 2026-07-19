import type { ComponentEntry } from './types';

/**
 * Steppers category.
 *
 * Ten structurally different progress indicators, not ten recolours of one: a
 * numbered row, a vertical detail list, an icon row, compact dots, a fraction
 * bar, a checkout flow, an interactive wizard, a segmented bar, a clickable
 * navigator and a mixed-status list. The shared constraint is 320px. A row of
 * numbered circles with labels beside them is the first thing to overflow a
 * phone, so every horizontal stepper here drops its labels below `sm:` and
 * surfaces the active step as a single line instead - the markers stay, the
 * text that cannot fit steps aside. Connectors are `aria-hidden` decoration; the
 * meaning lives in `aria-current="step"` and the visually-hidden state text.
 */
export const steppersComponents: ComponentEntry[] = [
  {
    slug: 'stepper-horizontal-numbered',
    category: 'steppers',
    tags: ['stepper', 'horizontal', 'numbered', 'progress', 'wizard'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'steps', type: 'string[]', required: true, descriptionKey: 'steps' },
      { name: 'current', type: 'number', default: '0', descriptionKey: 'current' },
    ],
    code: {
      tailwind: `<!--
  Labels sit beside the markers only from sm up. In a four-step row on a 320px
  phone the text would blow past the viewport, so below sm the markers stand
  alone and the connectors carry the eye. The line before a step is coloured
  only when that step is done; aria-current marks the active <li>.
-->
<nav aria-label="Progress" class="w-full">
  <ol class="flex items-center">
    <li class="flex flex-1 items-center">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd"/></svg>
        </span>
        <span class="hidden text-sm font-medium text-gray-900 sm:inline dark:text-gray-100">Account</span>
      </div>
      <span aria-hidden="true" class="mx-2 h-px flex-1 bg-blue-600 sm:mx-3"></span>
    </li>
    <li class="flex flex-1 items-center" aria-current="step">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
        <span class="hidden text-sm font-medium text-gray-900 sm:inline dark:text-gray-100">Profile</span>
      </div>
      <span aria-hidden="true" class="mx-2 h-px flex-1 bg-gray-200 sm:mx-3 dark:bg-gray-700"></span>
    </li>
    <li class="flex flex-1 items-center">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-500 dark:border-gray-700 dark:text-gray-400">3</span>
        <span class="hidden text-sm font-medium text-gray-500 sm:inline dark:text-gray-400">Billing</span>
      </div>
      <span aria-hidden="true" class="mx-2 h-px flex-1 bg-gray-200 sm:mx-3 dark:bg-gray-700"></span>
    </li>
    <li class="flex items-center">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-500 dark:border-gray-700 dark:text-gray-400">4</span>
        <span class="hidden text-sm font-medium text-gray-500 sm:inline dark:text-gray-400">Done</span>
      </div>
    </li>
  </ol>
</nav>`,
      react: `const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status) {
  const base =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

export function StepperHorizontalNumbered({ steps, current = 0 }) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const status = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          return (
            <li
              key={label}
              className={isLast ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
                <span
                  className={
                    'hidden text-sm font-medium sm:inline ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {label}
                </span>
              </div>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={
                    'mx-2 h-px flex-1 sm:mx-3 ' +
                    (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
      typescript: `export interface StepperHorizontalNumberedProps {
  /** Ordered step labels. Shown beside the marker from the sm breakpoint up. */
  steps: string[];
  /** Zero-based index of the active step; earlier steps render complete. */
  current?: number;
}

type StepStatus = 'complete' | 'current' | 'upcoming';

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status: StepStatus): string {
  const base =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

export function StepperHorizontalNumbered({
  steps,
  current = 0,
}: StepperHorizontalNumberedProps): JSX.Element {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          return (
            <li
              key={label}
              className={isLast ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
                <span
                  className={
                    'hidden text-sm font-medium sm:inline ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {label}
                </span>
              </div>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={
                    'mx-2 h-px flex-1 sm:mx-3 ' +
                    (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'stepper-vertical-detailed',
    category: 'steppers',
    tags: ['stepper', 'vertical', 'detailed', 'description', 'timeline'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'steps', type: '{ title: string; description?: string }[]', required: true, descriptionKey: 'steps' },
      { name: 'current', type: 'number', default: '0', descriptionKey: 'current' },
    ],
    code: {
      tailwind: `<!--
  Vertical is the layout that never fights a phone: the connector runs down a
  fixed-width left rail as a flex-1 line, so it stretches to whatever height the
  title-plus-description on the right needs. No absolute positioning to drift.
-->
<nav aria-label="Progress" class="w-full">
  <ol>
    <li class="flex gap-4">
      <div class="flex flex-col items-center">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd"/></svg>
        </span>
        <span aria-hidden="true" class="mt-1 w-px flex-1 bg-blue-600"></span>
      </div>
      <div class="pb-8">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Create account</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Set your email and a password to get started.</p>
      </div>
    </li>
    <li class="flex gap-4" aria-current="step">
      <div class="flex flex-col items-center">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
        <span aria-hidden="true" class="mt-1 w-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
      </div>
      <div class="pb-8">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Verify email</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter the six-digit code we just sent you.</p>
      </div>
    </li>
    <li class="flex gap-4">
      <div class="flex flex-col items-center">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-500 dark:border-gray-700 dark:text-gray-400">3</span>
      </div>
      <div>
        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400">Invite your team</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add teammates now or skip and do it later.</p>
      </div>
    </li>
  </ol>
</nav>`,
      react: `const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status) {
  const base =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

export function StepperVerticalDetailed({ steps, current = 0 }) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol>
        {steps.map((step, i) => {
          const status = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.title}
              className="flex gap-4"
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className="flex flex-col items-center">
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={
                      'mt-1 w-px flex-1 ' + (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                    }
                  />
                ) : null}
              </div>
              <div className={isLast ? '' : 'pb-8'}>
                <h3
                  className={
                    'text-sm font-semibold ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {step.title}
                </h3>
                {step.description ? (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
      typescript: `export interface VerticalStep {
  title: string;
  description?: string;
}

export interface StepperVerticalDetailedProps {
  steps: VerticalStep[];
  current?: number;
}

type StepStatus = 'complete' | 'current' | 'upcoming';

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status: StepStatus): string {
  const base =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

export function StepperVerticalDetailed({
  steps,
  current = 0,
}: StepperVerticalDetailedProps): JSX.Element {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol>
        {steps.map((step, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.title}
              className="flex gap-4"
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className="flex flex-col items-center">
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={
                      'mt-1 w-px flex-1 ' + (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                    }
                  />
                ) : null}
              </div>
              <div className={isLast ? '' : 'pb-8'}>
                <h3
                  className={
                    'text-sm font-semibold ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {step.title}
                </h3>
                {step.description ? (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'stepper-icons',
    category: 'steppers',
    tags: ['stepper', 'icons', 'horizontal', 'progress', 'onboarding'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'steps', type: '{ label: string; icon: ReactNode }[]', required: true, descriptionKey: 'steps' },
      { name: 'current', type: 'number', default: '0', descriptionKey: 'current' },
    ],
    code: {
      tailwind: `<!--
  Same 320px survival trick as the numbered row: icons stay, labels appear only
  from sm up. A completed step swaps its icon for a check so "done" reads at a
  glance without relying on colour alone.
-->
<nav aria-label="Progress" class="w-full">
  <ol class="flex items-center">
    <li class="flex flex-1 items-center">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
          <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd"/></svg>
        </span>
        <span class="hidden text-sm font-medium text-gray-900 sm:inline dark:text-gray-100">Cart</span>
      </div>
      <span aria-hidden="true" class="mx-2 h-px flex-1 bg-blue-600 sm:mx-3"></span>
    </li>
    <li class="flex flex-1 items-center" aria-current="step">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 dark:text-blue-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M3 12h18M3 17h12"/></svg>
        </span>
        <span class="hidden text-sm font-medium text-gray-900 sm:inline dark:text-gray-100">Details</span>
      </div>
      <span aria-hidden="true" class="mx-2 h-px flex-1 bg-gray-200 sm:mx-3 dark:bg-gray-700"></span>
    </li>
    <li class="flex items-center">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        </span>
        <span class="hidden text-sm font-medium text-gray-500 sm:inline dark:text-gray-400">Confirm</span>
      </div>
    </li>
  </ol>
</nav>`,
      react: `const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status) {
  const base = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

export function StepperIcons({ steps, current = 0 }) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((step, i) => {
          const status = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.label}
              className={isLast ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : step.icon}</span>
                <span
                  className={
                    'hidden text-sm font-medium sm:inline ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {step.label}
                </span>
              </div>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={
                    'mx-2 h-px flex-1 sm:mx-3 ' +
                    (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface IconStep {
  label: string;
  /** Rendered inside the marker for upcoming and current steps. */
  icon: ReactNode;
}

export interface StepperIconsProps {
  steps: IconStep[];
  current?: number;
}

type StepStatus = 'complete' | 'current' | 'upcoming';

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status: StepStatus): string {
  const base = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

export function StepperIcons({ steps, current = 0 }: StepperIconsProps): JSX.Element {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((step, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.label}
              className={isLast ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : step.icon}</span>
                <span
                  className={
                    'hidden text-sm font-medium sm:inline ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {step.label}
                </span>
              </div>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={
                    'mx-2 h-px flex-1 sm:mx-3 ' +
                    (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'stepper-dots-compact',
    category: 'steppers',
    tags: ['stepper', 'dots', 'compact', 'minimal', 'mobile'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'steps', type: 'string[]', required: true, descriptionKey: 'steps' },
      { name: 'current', type: 'number', default: '0', descriptionKey: 'current' },
    ],
    code: {
      tailwind: `<!--
  The tightest footprint of the set: a row of dots and one line of text. The
  active dot stretches into a pill so "where am I" survives even without colour,
  and each dot carries its state as sr-only text for screen readers.
-->
<nav aria-label="Progress" class="flex flex-wrap items-center gap-x-3 gap-y-2">
  <ol class="flex items-center gap-2">
    <li><span class="block h-2.5 w-2.5 rounded-full bg-blue-600"></span><span class="sr-only">Plan (complete)</span></li>
    <li><span class="block h-2.5 w-6 rounded-full bg-blue-600" aria-current="step"></span><span class="sr-only">Build (current)</span></li>
    <li><span class="block h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700"></span><span class="sr-only">Review</span></li>
    <li><span class="block h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700"></span><span class="sr-only">Ship</span></li>
  </ol>
  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
    <span class="text-gray-500 dark:text-gray-400">Step 2 of 4:</span> Build
  </p>
</nav>`,
      react: `function dotClass(status) {
  const base = 'block h-2.5 rounded-full transition-all';
  if (status === 'complete') return base + ' w-2.5 bg-blue-600';
  if (status === 'current') return base + ' w-6 bg-blue-600';
  return base + ' w-2.5 bg-gray-300 dark:bg-gray-700';
}

export function StepperDotsCompact({ steps, current = 0 }) {
  const active = steps[current];
  return (
    <nav aria-label="Progress" className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <ol className="flex items-center gap-2">
        {steps.map((label, i) => {
          const status = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          return (
            <li key={label}>
              <span className={dotClass(status)} aria-current={status === 'current' ? 'step' : undefined} />
              <span className="sr-only">
                {label}
                {status === 'complete' ? ' (complete)' : status === 'current' ? ' (current)' : ''}
              </span>
            </li>
          );
        })}
      </ol>
      {active ? (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          <span className="text-gray-500 dark:text-gray-400">
            Step {current + 1} of {steps.length}:
          </span>{' '}
          {active}
        </p>
      ) : null}
    </nav>
  );
}`,
      typescript: `export interface StepperDotsCompactProps {
  steps: string[];
  current?: number;
}

type StepStatus = 'complete' | 'current' | 'upcoming';

function dotClass(status: StepStatus): string {
  const base = 'block h-2.5 rounded-full transition-all';
  if (status === 'complete') return base + ' w-2.5 bg-blue-600';
  if (status === 'current') return base + ' w-6 bg-blue-600';
  return base + ' w-2.5 bg-gray-300 dark:bg-gray-700';
}

export function StepperDotsCompact({ steps, current = 0 }: StepperDotsCompactProps): JSX.Element {
  const active = steps[current];
  return (
    <nav aria-label="Progress" className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <ol className="flex items-center gap-2">
        {steps.map((label, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          return (
            <li key={label}>
              <span className={dotClass(status)} aria-current={status === 'current' ? 'step' : undefined} />
              <span className="sr-only">
                {label}
                {status === 'complete' ? ' (complete)' : status === 'current' ? ' (current)' : ''}
              </span>
            </li>
          );
        })}
      </ol>
      {active ? (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          <span className="text-gray-500 dark:text-gray-400">
            Step {current + 1} of {steps.length}:
          </span>{' '}
          {active}
        </p>
      ) : null}
    </nav>
  );
}`,
    },
  },
  {
    slug: 'stepper-progress-fraction',
    category: 'steppers',
    tags: ['stepper', 'progress', 'fraction', 'bar', 'percentage'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'steps', type: 'string[]', required: true, descriptionKey: 'steps' },
      { name: 'current', type: 'number', default: '0', descriptionKey: 'current' },
    ],
    code: {
      tailwind: `<!--
  A titled fraction over a real progressbar. role="progressbar" plus the
  aria-value* trio makes the fill meaningful to assistive tech; the visible
  "Step 2 of 5" is the same fact for everyone else. The fill width is the only
  inline style because it is genuinely data, not decoration.
-->
<div class="w-full">
  <div class="flex items-baseline justify-between gap-3">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Shipping address</h3>
    <p class="shrink-0 text-sm text-gray-500 dark:text-gray-400">Step 2 of 5</p>
  </div>
  <div role="progressbar" aria-valuenow="2" aria-valuemin="1" aria-valuemax="5" aria-label="Checkout progress" class="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
    <div class="h-full rounded-full bg-blue-600 transition-all motion-reduce:transition-none" style="width: 40%"></div>
  </div>
</div>`,
      react: `export function StepperProgressFraction({ steps, current = 0 }) {
  const total = steps.length;
  const clamped = Math.min(Math.max(current, 0), Math.max(total - 1, 0));
  const active = steps[clamped];
  const pct = total > 0 ? Math.round(((clamped + 1) / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{active}</h3>
        <p className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
          Step {clamped + 1} of {total}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={clamped + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label="Progress"
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-all motion-reduce:transition-none"
          style={{ width: pct + '%' }}
        />
      </div>
    </div>
  );
}`,
      typescript: `export interface StepperProgressFractionProps {
  steps: string[];
  current?: number;
}

export function StepperProgressFraction({
  steps,
  current = 0,
}: StepperProgressFractionProps): JSX.Element {
  const total = steps.length;
  const clamped = Math.min(Math.max(current, 0), Math.max(total - 1, 0));
  const active = steps[clamped];
  const pct = total > 0 ? Math.round(((clamped + 1) / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{active}</h3>
        <p className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
          Step {clamped + 1} of {total}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={clamped + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label="Progress"
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-all motion-reduce:transition-none"
          style={{ width: pct + '%' }}
        />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'stepper-checkout',
    category: 'steppers',
    tags: ['stepper', 'checkout', 'ecommerce', 'horizontal', 'flow'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    props: [
      { name: 'steps', type: 'string[]', required: true, descriptionKey: 'steps' },
      { name: 'current', type: 'number', default: '0', descriptionKey: 'current' },
    ],
    code: {
      tailwind: `<!--
  A four-stage checkout. The labelled row would never fit 320px, so below sm the
  labels drop out of the row and the active stage is restated as a single line
  above it - the phone gets "Step 2 of 4: Shipping", the desktop gets the full
  labelled row.
-->
<nav aria-label="Checkout progress" class="w-full">
  <p class="mb-3 text-sm font-medium text-gray-900 sm:hidden dark:text-gray-100">
    <span class="text-gray-500 dark:text-gray-400">Step 2 of 4:</span> Shipping
  </p>
  <ol class="flex items-center">
    <li class="flex flex-1 items-center">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd"/></svg>
        </span>
        <span class="hidden text-sm font-medium text-gray-900 sm:inline dark:text-gray-100">Cart</span>
      </div>
      <span aria-hidden="true" class="mx-2 h-px flex-1 bg-blue-600 sm:mx-3"></span>
    </li>
    <li class="flex flex-1 items-center" aria-current="step">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
        <span class="hidden text-sm font-medium text-gray-900 sm:inline dark:text-gray-100">Shipping</span>
      </div>
      <span aria-hidden="true" class="mx-2 h-px flex-1 bg-gray-200 sm:mx-3 dark:bg-gray-700"></span>
    </li>
    <li class="flex flex-1 items-center">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-500 dark:border-gray-700 dark:text-gray-400">3</span>
        <span class="hidden text-sm font-medium text-gray-500 sm:inline dark:text-gray-400">Payment</span>
      </div>
      <span aria-hidden="true" class="mx-2 h-px flex-1 bg-gray-200 sm:mx-3 dark:bg-gray-700"></span>
    </li>
    <li class="flex items-center">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-500 dark:border-gray-700 dark:text-gray-400">4</span>
        <span class="hidden text-sm font-medium text-gray-500 sm:inline dark:text-gray-400">Review</span>
      </div>
    </li>
  </ol>
</nav>`,
      react: `const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status) {
  const base =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

export function StepperCheckout({ steps, current = 0 }) {
  const active = steps[current];
  return (
    <nav aria-label="Checkout progress" className="w-full">
      {active ? (
        <p className="mb-3 text-sm font-medium text-gray-900 sm:hidden dark:text-gray-100">
          <span className="text-gray-500 dark:text-gray-400">
            Step {current + 1} of {steps.length}:
          </span>{' '}
          {active}
        </p>
      ) : null}
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const status = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          return (
            <li
              key={label}
              className={isLast ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
                <span
                  className={
                    'hidden text-sm font-medium sm:inline ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {label}
                </span>
              </div>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={
                    'mx-2 h-px flex-1 sm:mx-3 ' +
                    (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
      typescript: `export interface StepperCheckoutProps {
  steps: string[];
  current?: number;
}

type StepStatus = 'complete' | 'current' | 'upcoming';

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status: StepStatus): string {
  const base =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

export function StepperCheckout({ steps, current = 0 }: StepperCheckoutProps): JSX.Element {
  const active = steps[current];
  return (
    <nav aria-label="Checkout progress" className="w-full">
      {active ? (
        <p className="mb-3 text-sm font-medium text-gray-900 sm:hidden dark:text-gray-100">
          <span className="text-gray-500 dark:text-gray-400">
            Step {current + 1} of {steps.length}:
          </span>{' '}
          {active}
        </p>
      ) : null}
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          return (
            <li
              key={label}
              className={isLast ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
                <span
                  className={
                    'hidden text-sm font-medium sm:inline ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {label}
                </span>
              </div>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={
                    'mx-2 h-px flex-1 sm:mx-3 ' +
                    (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'stepper-wizard-interactive',
    category: 'steppers',
    tags: ['stepper', 'wizard', 'interactive', 'form', 'navigation'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'steps', type: '{ title: string; description?: string }[]', required: true, descriptionKey: 'steps' },
      { name: 'initialStep', type: 'number', default: '0', descriptionKey: 'initialStep' },
    ],
    code: {
      tailwind: `<!--
  The markup shows one frame of the interactive wizard; the React/TypeScript tabs
  own the state. Back is disabled on the first step and Next becomes a disabled
  "Done" on the last, so the controls never point past the ends of the flow.
-->
<div class="w-full">
  <ol class="flex items-center">
    <li class="flex flex-1 items-center">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd"/></svg>
      </span>
      <span aria-hidden="true" class="mx-2 h-px flex-1 bg-blue-600"></span>
    </li>
    <li class="flex flex-1 items-center" aria-current="step">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
      <span aria-hidden="true" class="mx-2 h-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
    </li>
    <li class="flex items-center">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-500 dark:border-gray-700 dark:text-gray-400">3</span>
    </li>
  </ol>
  <div class="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Company details</h3>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Tell us who you are so we can tailor the workspace.</p>
  </div>
  <div class="mt-4 flex items-center justify-between gap-3">
    <button type="button" class="inline-flex min-h-[2.5rem] items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">Back</button>
    <button type="button" class="inline-flex min-h-[2.5rem] items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Next</button>
  </div>
</div>`,
      react: `import { useState } from 'react';

function markerClass(status) {
  const base =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

export function StepperWizardInteractive({ steps, initialStep = 0 }) {
  const [current, setCurrent] = useState(initialStep);
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;
  const active = steps[current];

  return (
    <div className="w-full">
      <ol className="flex items-center" aria-label="Progress">
        {steps.map((step, i) => {
          const status = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLastMarker = i === steps.length - 1;
          return (
            <li
              key={step.title}
              className={isLastMarker ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
              {!isLastMarker ? (
                <span
                  aria-hidden="true"
                  className={
                    'mx-2 h-px flex-1 ' + (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div
        className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
        role="group"
        aria-label={active ? active.title : undefined}
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{active ? active.title : ''}</h3>
        {active && active.description ? (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{active.description}</p>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={isFirst}
          className="inline-flex min-h-[2.5rem] items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
          disabled={isLast}
          className="inline-flex min-h-[2.5rem] items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {isLast ? 'Done' : 'Next'}
        </button>
      </div>
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface WizardStep {
  title: string;
  description?: string;
}

export interface StepperWizardInteractiveProps {
  steps: WizardStep[];
  initialStep?: number;
}

type StepStatus = 'complete' | 'current' | 'upcoming';

function markerClass(status: StepStatus): string {
  const base =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

export function StepperWizardInteractive({
  steps,
  initialStep = 0,
}: StepperWizardInteractiveProps): JSX.Element {
  const [current, setCurrent] = useState(initialStep);
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;
  const active = steps[current];

  return (
    <div className="w-full">
      <ol className="flex items-center" aria-label="Progress">
        {steps.map((step, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLastMarker = i === steps.length - 1;
          return (
            <li
              key={step.title}
              className={isLastMarker ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
              {!isLastMarker ? (
                <span
                  aria-hidden="true"
                  className={
                    'mx-2 h-px flex-1 ' + (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div
        className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
        role="group"
        aria-label={active ? active.title : undefined}
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{active ? active.title : ''}</h3>
        {active && active.description ? (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{active.description}</p>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={isFirst}
          className="inline-flex min-h-[2.5rem] items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
          disabled={isLast}
          className="inline-flex min-h-[2.5rem] items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {isLast ? 'Done' : 'Next'}
        </button>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'stepper-segmented-bar',
    category: 'steppers',
    tags: ['stepper', 'segmented', 'bar', 'progress', 'minimal'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'steps', type: 'string[]', required: true, descriptionKey: 'steps' },
      { name: 'current', type: 'number', default: '0', descriptionKey: 'current' },
    ],
    code: {
      tailwind: `<!--
  Segments instead of a single fill: each one is flex-1 so the bar splits evenly
  at any width and never overflows. Filled segments cover done-and-current; the
  fraction is restated in text because a bar alone is not an accessible label.
-->
<div class="w-full">
  <div class="flex items-baseline justify-between gap-3">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Onboarding</h3>
    <p class="shrink-0 text-sm text-gray-500 dark:text-gray-400">2 / 4</p>
  </div>
  <ol class="mt-2 flex gap-1.5" aria-label="Progress">
    <li class="h-1.5 flex-1 rounded-full bg-blue-600"></li>
    <li class="h-1.5 flex-1 rounded-full bg-blue-600" aria-current="step"></li>
    <li class="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700"></li>
    <li class="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700"></li>
  </ol>
</div>`,
      react: `export function StepperSegmentedBar({ steps, current = 0 }) {
  const total = steps.length;
  const active = steps[current];
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{active}</h3>
        <p className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
          {current + 1} / {total}
        </p>
      </div>
      <ol className="mt-2 flex gap-1.5" aria-label="Progress">
        {steps.map((label, i) => {
          const done = i <= current;
          return (
            <li
              key={label}
              aria-current={i === current ? 'step' : undefined}
              className={
                'h-1.5 flex-1 rounded-full transition-colors motion-reduce:transition-none ' +
                (done ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
              }
            >
              <span className="sr-only">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}`,
      typescript: `export interface StepperSegmentedBarProps {
  steps: string[];
  current?: number;
}

export function StepperSegmentedBar({ steps, current = 0 }: StepperSegmentedBarProps): JSX.Element {
  const total = steps.length;
  const active = steps[current];
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{active}</h3>
        <p className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
          {current + 1} / {total}
        </p>
      </div>
      <ol className="mt-2 flex gap-1.5" aria-label="Progress">
        {steps.map((label, i) => {
          const done = i <= current;
          return (
            <li
              key={label}
              aria-current={i === current ? 'step' : undefined}
              className={
                'h-1.5 flex-1 rounded-full transition-colors motion-reduce:transition-none ' +
                (done ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
              }
            >
              <span className="sr-only">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}`,
    },
  },
  {
    slug: 'stepper-clickable-navigation',
    category: 'steppers',
    tags: ['stepper', 'clickable', 'navigation', 'interactive', 'buttons'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'steps', type: 'string[]', required: true, descriptionKey: 'steps' },
      { name: 'initialStep', type: 'number', default: '0', descriptionKey: 'initialStep' },
      { name: 'onStepChange', type: '(index: number) => void', descriptionKey: 'onStepChange' },
    ],
    code: {
      tailwind: `<!--
  Each marker is a real button, so it must clear a 40px touch target - hence the
  h-10 w-10 marker rather than the h-9 used by the read-only rows. Only visited
  and current steps are enabled; upcoming ones are disabled so you cannot skip
  ahead. Labels drop below sm exactly as the other horizontal rows do.
-->
<nav aria-label="Progress" class="w-full">
  <ol class="flex items-center">
    <li class="flex flex-1 items-center">
      <button type="button" class="group flex items-center gap-2 rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:gap-3 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd"/></svg>
        </span>
        <span class="hidden pr-1 text-sm font-medium text-gray-900 sm:inline dark:text-gray-100">Details</span>
      </button>
      <span aria-hidden="true" class="mx-2 h-px flex-1 bg-blue-600 sm:mx-3"></span>
    </li>
    <li class="flex flex-1 items-center" aria-current="step">
      <button type="button" class="group flex items-center gap-2 rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:gap-3 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 text-sm font-semibold text-blue-600 dark:text-blue-400">2</span>
        <span class="hidden pr-1 text-sm font-medium text-gray-900 sm:inline dark:text-gray-100">Address</span>
      </button>
      <span aria-hidden="true" class="mx-2 h-px flex-1 bg-gray-200 sm:mx-3 dark:bg-gray-700"></span>
    </li>
    <li class="flex items-center">
      <button type="button" disabled class="group flex cursor-not-allowed items-center gap-2 rounded-full text-left sm:gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-500 dark:border-gray-700 dark:text-gray-400">3</span>
        <span class="hidden pr-1 text-sm font-medium text-gray-500 sm:inline dark:text-gray-400">Payment</span>
      </button>
    </li>
  </ol>
</nav>`,
      react: `import { useState } from 'react';

function markerClass(status) {
  const base =
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white group-hover:bg-blue-700';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

export function StepperClickableNavigation({ steps, initialStep = 0, onStepChange }) {
  const [current, setCurrent] = useState(initialStep);

  function go(i) {
    if (i > current) return; // cannot skip ahead of the furthest reached step
    setCurrent(i);
    if (onStepChange) onStepChange(i);
  }

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const status = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          const clickable = i <= current;
          return (
            <li
              key={label}
              className={isLast ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <button
                type="button"
                onClick={() => go(i)}
                disabled={!clickable}
                aria-label={'Step ' + (i + 1) + ': ' + label}
                className={
                  'group flex items-center gap-2 rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:gap-3 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ' +
                  (clickable ? 'cursor-pointer' : 'cursor-not-allowed')
                }
              >
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
                <span
                  className={
                    'hidden pr-1 text-sm font-medium sm:inline ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {label}
                </span>
              </button>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={
                    'mx-2 h-px flex-1 sm:mx-3 ' +
                    (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
      typescript: `import { useState } from 'react';

export interface StepperClickableNavigationProps {
  steps: string[];
  initialStep?: number;
  onStepChange?: (index: number) => void;
}

type StepStatus = 'complete' | 'current' | 'upcoming';

function markerClass(status: StepStatus): string {
  const base =
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white group-hover:bg-blue-700';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

export function StepperClickableNavigation({
  steps,
  initialStep = 0,
  onStepChange,
}: StepperClickableNavigationProps): JSX.Element {
  const [current, setCurrent] = useState(initialStep);

  function go(i: number): void {
    if (i > current) return; // cannot skip ahead of the furthest reached step
    setCurrent(i);
    if (onStepChange) onStepChange(i);
  }

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center">
        {steps.map((label, i) => {
          const status: StepStatus = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          const clickable = i <= current;
          return (
            <li
              key={label}
              className={isLast ? 'flex items-center' : 'flex flex-1 items-center'}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <button
                type="button"
                onClick={() => go(i)}
                disabled={!clickable}
                aria-label={'Step ' + (i + 1) + ': ' + label}
                className={
                  'group flex items-center gap-2 rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:gap-3 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ' +
                  (clickable ? 'cursor-pointer' : 'cursor-not-allowed')
                }
              >
                <span className={markerClass(status)}>{status === 'complete' ? CHECK : i + 1}</span>
                <span
                  className={
                    'hidden pr-1 text-sm font-medium sm:inline ' +
                    (status === 'upcoming'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100')
                  }
                >
                  {label}
                </span>
              </button>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={
                    'mx-2 h-px flex-1 sm:mx-3 ' +
                    (i < current ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                  }
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'stepper-status-mixed',
    category: 'steppers',
    tags: ['stepper', 'status', 'error', 'vertical', 'state'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      {
        name: 'steps',
        type: "{ title: string; description?: string; status: 'complete' | 'current' | 'error' | 'upcoming' }[]",
        required: true,
        descriptionKey: 'steps',
      },
    ],
    code: {
      tailwind: `<!--
  Status is explicit here rather than derived from an index, so a step can fail:
  the error step gets a red marker and red title, and its state is spelled out in
  sr-only text so it never rides on colour alone. Vertical, so it never fights a
  phone.
-->
<nav aria-label="Progress" class="w-full">
  <ol>
    <li class="flex gap-4">
      <div class="flex flex-col items-center">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd"/></svg>
        </span>
        <span aria-hidden="true" class="mt-1 w-px flex-1 bg-blue-600"></span>
      </div>
      <div class="pb-8">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Details submitted<span class="sr-only"> (complete)</span></h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Your account information was saved.</p>
      </div>
    </li>
    <li class="flex gap-4">
      <div class="flex flex-col items-center">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">!</span>
        <span aria-hidden="true" class="mt-1 w-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
      </div>
      <div class="pb-8">
        <h3 class="text-sm font-semibold text-red-600 dark:text-red-400">Payment failed<span class="sr-only"> (error)</span></h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Your card was declined. Try another payment method.</p>
      </div>
    </li>
    <li class="flex gap-4" aria-current="step">
      <div class="flex flex-col items-center">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 text-sm font-semibold text-blue-600 dark:text-blue-400">3</span>
      </div>
      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Confirmation<span class="sr-only"> (current)</span></h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Review and place your order.</p>
      </div>
    </li>
  </ol>
</nav>`,
      react: `const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status) {
  const base =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'error') return base + ' bg-red-600 font-bold text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

function titleClass(status) {
  if (status === 'error') return 'text-sm font-semibold text-red-600 dark:text-red-400';
  if (status === 'upcoming') return 'text-sm font-semibold text-gray-500 dark:text-gray-400';
  return 'text-sm font-semibold text-gray-900 dark:text-gray-100';
}

function stateLabel(status) {
  if (status === 'complete') return ' (complete)';
  if (status === 'error') return ' (error)';
  if (status === 'current') return ' (current)';
  return '';
}

export function StepperStatusMixed({ steps }) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.title}
              className="flex gap-4"
              aria-current={step.status === 'current' ? 'step' : undefined}
            >
              <div className="flex flex-col items-center">
                <span className={markerClass(step.status)}>
                  {step.status === 'complete' ? CHECK : step.status === 'error' ? '!' : i + 1}
                </span>
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={
                      'mt-1 w-px flex-1 ' +
                      (step.status === 'complete' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                    }
                  />
                ) : null}
              </div>
              <div className={isLast ? '' : 'pb-8'}>
                <h3 className={titleClass(step.status)}>
                  {step.title}
                  <span className="sr-only">{stateLabel(step.status)}</span>
                </h3>
                {step.description ? (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
      typescript: `export type StepStatus = 'complete' | 'current' | 'error' | 'upcoming';

export interface MixedStep {
  title: string;
  description?: string;
  status: StepStatus;
}

export interface StepperStatusMixedProps {
  steps: MixedStep[];
}

const CHECK = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
);

function markerClass(status: StepStatus): string {
  const base =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors';
  if (status === 'complete') return base + ' bg-blue-600 text-white';
  if (status === 'error') return base + ' bg-red-600 font-bold text-white';
  if (status === 'current') return base + ' border-2 border-blue-600 text-blue-600 dark:text-blue-400';
  return base + ' border border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400';
}

function titleClass(status: StepStatus): string {
  if (status === 'error') return 'text-sm font-semibold text-red-600 dark:text-red-400';
  if (status === 'upcoming') return 'text-sm font-semibold text-gray-500 dark:text-gray-400';
  return 'text-sm font-semibold text-gray-900 dark:text-gray-100';
}

function stateLabel(status: StepStatus): string {
  if (status === 'complete') return ' (complete)';
  if (status === 'error') return ' (error)';
  if (status === 'current') return ' (current)';
  return '';
}

export function StepperStatusMixed({ steps }: StepperStatusMixedProps): JSX.Element {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.title}
              className="flex gap-4"
              aria-current={step.status === 'current' ? 'step' : undefined}
            >
              <div className="flex flex-col items-center">
                <span className={markerClass(step.status)}>
                  {step.status === 'complete' ? CHECK : step.status === 'error' ? '!' : i + 1}
                </span>
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={
                      'mt-1 w-px flex-1 ' +
                      (step.status === 'complete' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')
                    }
                  />
                ) : null}
              </div>
              <div className={isLast ? '' : 'pb-8'}>
                <h3 className={titleClass(step.status)}>
                  {step.title}
                  <span className="sr-only">{stateLabel(step.status)}</span>
                </h3>
                {step.description ? (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`,
    },
  },
];
