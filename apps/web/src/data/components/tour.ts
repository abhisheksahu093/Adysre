import type { ComponentEntry } from './types';

/**
 * Tour category - product tours and onboarding guides.
 *
 * Five structurally different guides, not five recolours of one: a spotlight
 * coach mark, a getting-started checklist, a "what's new" dialog, a field of
 * pulsing hotspots, and a driver.js-style step sequence. The constraint they
 * share is a hard one for this genre: a tour normally dims the whole document
 * and traps focus at the page level. That is hostile inside a component gallery
 * and impossible to make responsive as a copy-paste block. So every overlay
 * here is SCOPED to the component's own box - the dim layer is `absolute inset-0`
 * within a `relative` container, never `fixed` over the viewport - and every
 * callout is width-clamped so it cannot spill past a 320px screen. Motion
 * (pulses, pans) always yields to `motion-reduce`.
 */
export const tourComponents: ComponentEntry[] = [
  {
    slug: 'tour-coach-mark-spotlight',
    category: 'tour',
    tags: ['tour', 'coach-mark', 'spotlight', 'onboarding', 'walkthrough'],
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
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'steps', type: 'CoachStep[]', required: true, descriptionKey: 'steps' },
      { name: 'finishLabel', type: 'string', default: "'Finish'", descriptionKey: 'finishLabel' },
      { name: 'onFinish', type: '() => void', descriptionKey: 'onFinish' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Coach mark, scoped to this box. The dim layer is absolute inset-0 INSIDE the
  relative container - it never covers the document. The active row is lifted
  above the dim (z-20) so it reads as spotlit; the callout is width-clamped so it
  cannot overflow a 320px phone. Wire the Back/Next/Skip buttons and role=dialog
  focus handling with JS - see the React/TypeScript tabs.
-->
<div class="relative isolate mx-auto w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
  <ul class="space-y-2">
    <li class="relative z-20 flex items-center gap-3 rounded-lg border border-blue-500 bg-white px-3 py-2.5 text-sm text-gray-900 ring-2 ring-blue-500 dark:bg-gray-900 dark:text-gray-100">
      <span class="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true"></span>
      Create your workspace
    </li>
    <li class="relative flex items-center gap-3 rounded-lg border border-gray-200 bg-white/70 px-3 py-2.5 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400">
      <span class="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true"></span>
      Invite your team
    </li>
    <li class="relative flex items-center gap-3 rounded-lg border border-gray-200 bg-white/70 px-3 py-2.5 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400">
      <span class="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true"></span>
      Connect a data source
    </li>
  </ul>

  <div class="absolute inset-0 z-10 rounded-xl bg-gray-950/50" aria-hidden="true"></div>

  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="coach-title"
    tabindex="-1"
    class="absolute bottom-3 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-xs -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900"
  >
    <p class="text-xs font-medium text-blue-600 dark:text-blue-400">Step 1 of 3</p>
    <h3 id="coach-title" class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Create your workspace</h3>
    <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Name it and pick a colour - this is where everything lives.</p>
    <div class="mt-4 flex items-center justify-between gap-2">
      <button type="button" class="rounded-md px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">Skip</button>
      <div class="flex items-center gap-2">
        <button type="button" disabled class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-40 dark:border-gray-700 dark:text-gray-200">Back</button>
        <button type="button" class="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">Next</button>
      </div>
    </div>
  </div>
</div>`,
      react: `'use client';

import { useEffect, useId, useRef, useState } from 'react';

export function CoachMarkSpotlight({
  steps,
  finishLabel = 'Finish',
  onFinish,
  className = '',
}) {
  const baseId = useId();
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const cardRef = useRef(null);
  const firstRun = useRef(true);

  const total = steps.length;
  const step = steps[index];

  // Move focus to the callout as the user advances - but skip the first mount so
  // the component never yanks the page to itself just by rendering.
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    cardRef.current?.focus({ preventScroll: true });
  }, [index, done]);

  function next() {
    if (index >= total - 1) { setDone(true); onFinish?.(); }
    else setIndex((i) => i + 1);
  }
  function back() { setIndex((i) => Math.max(0, i - 1)); }
  function skip() { setDone(true); }

  function onKeyDown(event) {
    if (event.key === 'Escape') { event.preventDefault(); skip(); }
    else if (event.key === 'ArrowRight' || event.key === 'Enter') { event.preventDefault(); next(); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); back(); }
  }

  const titleId = \`\${baseId}-title\`;

  return (
    <div className={\`relative isolate mx-auto w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <ul className="space-y-2">
        {steps.map((s, i) => {
          const active = !done && i === index;
          return (
            <li
              key={s.target}
              className={\`relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm \${
                active
                  ? 'z-20 border-blue-500 bg-white text-gray-900 ring-2 ring-blue-500 dark:bg-gray-900 dark:text-gray-100'
                  : 'border-gray-200 bg-white/70 text-gray-600 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400'
              }\`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
              {s.target}
            </li>
          );
        })}
      </ul>

      {/* Dim layer - scoped to THIS box, never the whole document. */}
      {!done && step ? <div className="absolute inset-0 z-10 rounded-xl bg-gray-950/50" aria-hidden="true" /> : null}

      {!done && step ? (
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className="absolute bottom-3 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-xs -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-4 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-visible:ring-blue-400"
        >
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Step {index + 1} of {total}</p>
          <h3 id={titleId} className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.body}</p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <button type="button" onClick={skip} className="rounded-md px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400">Skip</button>
            <div className="flex items-center gap-2">
              <button type="button" onClick={back} disabled={index === 0} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 enabled:hover:bg-gray-100 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-200 dark:enabled:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Back</button>
              <button type="button" onClick={next} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{index >= total - 1 ? finishLabel : 'Next'}</button>
            </div>
          </div>
        </div>
      ) : null}

      {done ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <button type="button" onClick={() => { setIndex(0); setDone(false); }} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Replay tour</button>
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

export interface CoachStep {
  /** Label shown on the mock target row this step spotlights. */
  target: string;
  title: string;
  body: string;
}

export interface CoachMarkSpotlightProps {
  steps: CoachStep[];
  /** Label for the button on the final step. */
  finishLabel?: string;
  onFinish?: () => void;
  className?: string;
}

export function CoachMarkSpotlight({
  steps,
  finishLabel = 'Finish',
  onFinish,
  className = '',
}: CoachMarkSpotlightProps): JSX.Element {
  const baseId = useId();
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  const total = steps.length;
  const step = steps[index];

  // Move focus to the callout as the user advances - but skip the first mount so
  // the component never yanks the page to itself just by rendering. preventScroll
  // keeps a focus() from jumping the viewport.
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    cardRef.current?.focus({ preventScroll: true });
  }, [index, done]);

  function next() {
    if (index >= total - 1) { setDone(true); onFinish?.(); }
    else setIndex((i) => i + 1);
  }
  function back() { setIndex((i) => Math.max(0, i - 1)); }
  function skip() { setDone(true); }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') { event.preventDefault(); skip(); }
    else if (event.key === 'ArrowRight' || event.key === 'Enter') { event.preventDefault(); next(); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); back(); }
  }

  const titleId = \`\${baseId}-title\`;

  return (
    <div className={\`relative isolate mx-auto w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      {/* Mock product UI the tour points at. */}
      <ul className="space-y-2">
        {steps.map((s, i) => {
          const active = !done && i === index;
          return (
            <li
              key={s.target}
              className={\`relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm \${
                active
                  ? 'z-20 border-blue-500 bg-white text-gray-900 ring-2 ring-blue-500 dark:bg-gray-900 dark:text-gray-100'
                  : 'border-gray-200 bg-white/70 text-gray-600 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400'
              }\`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
              {s.target}
            </li>
          );
        })}
      </ul>

      {/* Dim layer - scoped to THIS box, never the whole document. */}
      {!done && step ? <div className="absolute inset-0 z-10 rounded-xl bg-gray-950/50" aria-hidden="true" /> : null}

      {/* Callout: anchored bottom-centre and width-clamped so it can never spill
          past a 320px viewport. */}
      {!done && step ? (
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className="absolute bottom-3 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-xs -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-4 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-visible:ring-blue-400"
        >
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Step {index + 1} of {total}</p>
          <h3 id={titleId} className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.body}</p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <button type="button" onClick={skip} className="rounded-md px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400">Skip</button>
            <div className="flex items-center gap-2">
              <button type="button" onClick={back} disabled={index === 0} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 enabled:hover:bg-gray-100 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-200 dark:enabled:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Back</button>
              <button type="button" onClick={next} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{index >= total - 1 ? finishLabel : 'Next'}</button>
            </div>
          </div>
        </div>
      ) : null}

      {done ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <button type="button" onClick={() => { setIndex(0); setDone(false); }} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Replay tour</button>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'tour-onboarding-checklist',
    category: 'tour',
    tags: ['tour', 'checklist', 'onboarding', 'progress', 'getting-started'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'collapsed', labelKey: 'collapsed' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Getting started'", descriptionKey: 'title' },
      { name: 'tasks', type: 'ChecklistTask[]', required: true, descriptionKey: 'tasks' },
      { name: 'defaultCollapsed', type: 'boolean', default: 'false', descriptionKey: 'defaultCollapsed' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Getting-started checklist. The progress bar is a real role=progressbar; each
  row's toggle is a role=checkbox button (an <input> would need a wrapping label
  to stay accessible). The collapse button owns aria-expanded + aria-controls.
  Wire the checks, progress and collapse with JS - see the React/TypeScript tabs.
-->
<section class="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Getting started</h3>
      <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">1 of 3 complete</p>
    </div>
    <button type="button" aria-expanded="true" aria-controls="checklist-region" class="shrink-0 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
      <span class="sr-only">Collapse checklist</span>
      <svg viewBox="0 0 20 20" class="h-4 w-4 rotate-180" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 8 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>
  </div>

  <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800" role="progressbar" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100" aria-label="Onboarding progress">
    <div class="h-full rounded-full bg-blue-600 dark:bg-blue-500" style="width:33%"></div>
  </div>

  <ul id="checklist-region" class="mt-4 space-y-2">
    <li class="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <button type="button" role="checkbox" aria-checked="true" class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500">
        <svg viewBox="0 0 20 20" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="m5 10 3.5 3.5L15 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-gray-400 line-through dark:text-gray-500">Verify your email</p>
      </div>
    </li>
    <li class="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <button type="button" role="checkbox" aria-checked="false" class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-transparent dark:border-gray-600">
        <svg viewBox="0 0 20 20" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="m5 10 3.5 3.5L15 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Invite a teammate</p>
        <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Tours are better with company.</p>
        <a href="#" class="mt-1.5 inline-block text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">Send invite →</a>
      </div>
    </li>
  </ul>
</section>`,
      react: `'use client';

import { useId, useMemo, useState } from 'react';

export function OnboardingChecklist({
  title = 'Getting started',
  tasks,
  defaultCollapsed = false,
  className = '',
}) {
  const baseId = useId();
  const [checked, setChecked] = useState(() =>
    Object.fromEntries(tasks.map((t) => [t.id, Boolean(t.done)])),
  );
  const [open, setOpen] = useState(!defaultCollapsed);

  const total = tasks.length;
  const complete = useMemo(
    () => tasks.reduce((n, t) => (checked[t.id] ? n + 1 : n), 0),
    [tasks, checked],
  );
  const pct = total === 0 ? 0 : Math.round((complete / total) * 100);
  const regionId = \`\${baseId}-region\`;

  function toggle(id) { setChecked((prev) => ({ ...prev, [id]: !prev[id] })); }

  return (
    <section className={\`mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{complete} of {total} complete</p>
        </div>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={regionId} className="shrink-0 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400">
          <span className="sr-only">{open ? 'Collapse checklist' : 'Expand checklist'}</span>
          <svg viewBox="0 0 20 20" className={\`h-4 w-4 transition-transform motion-reduce:transition-none \${open ? 'rotate-180' : ''}\`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Onboarding progress">
        <div className="h-full rounded-full bg-blue-600 transition-[width] duration-300 motion-reduce:transition-none dark:bg-blue-500" style={{ width: \`\${pct}%\` }} />
      </div>

      {open ? (
        <ul id={regionId} className="mt-4 space-y-2">
          {tasks.map((task) => {
            const isDone = Boolean(checked[task.id]);
            return (
              <li key={task.id} className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <button type="button" role="checkbox" aria-checked={isDone} onClick={() => toggle(task.id)} className={\`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${isDone ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500' : 'border-gray-300 text-transparent dark:border-gray-600'}\`}>
                  <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="m5 10 3.5 3.5L15 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div className="min-w-0 flex-1">
                  <p className={\`text-sm font-medium \${isDone ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}\`}>{task.label}</p>
                  {task.description ? <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{task.description}</p> : null}
                  {task.ctaLabel && !isDone ? (
                    <a href={task.ctaHref ?? '#'} className="mt-1.5 inline-block text-xs font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">{task.ctaLabel} →</a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}`,
      typescript: `'use client';

import { useId, useMemo, useState } from 'react';

export interface ChecklistTask {
  id: string;
  label: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  done?: boolean;
}

export interface OnboardingChecklistProps {
  title?: string;
  tasks: ChecklistTask[];
  /** Render collapsed on first paint. */
  defaultCollapsed?: boolean;
  className?: string;
}

export function OnboardingChecklist({
  title = 'Getting started',
  tasks,
  defaultCollapsed = false,
  className = '',
}: OnboardingChecklistProps): JSX.Element {
  const baseId = useId();
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tasks.map((t) => [t.id, Boolean(t.done)] as const)),
  );
  const [open, setOpen] = useState(!defaultCollapsed);

  const total = tasks.length;
  const complete = useMemo(
    () => tasks.reduce((n, t) => (checked[t.id] ? n + 1 : n), 0),
    [tasks, checked],
  );
  const pct = total === 0 ? 0 : Math.round((complete / total) * 100);
  const regionId = \`\${baseId}-region\`;

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section className={\`mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{complete} of {total} complete</p>
        </div>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={regionId} className="shrink-0 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400">
          <span className="sr-only">{open ? 'Collapse checklist' : 'Expand checklist'}</span>
          <svg viewBox="0 0 20 20" className={\`h-4 w-4 transition-transform motion-reduce:transition-none \${open ? 'rotate-180' : ''}\`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Onboarding progress">
        <div className="h-full rounded-full bg-blue-600 transition-[width] duration-300 motion-reduce:transition-none dark:bg-blue-500" style={{ width: \`\${pct}%\` }} />
      </div>

      {open ? (
        <ul id={regionId} className="mt-4 space-y-2">
          {tasks.map((task) => {
            const isDone = Boolean(checked[task.id]);
            return (
              <li key={task.id} className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <button type="button" role="checkbox" aria-checked={isDone} onClick={() => toggle(task.id)} className={\`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${isDone ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500' : 'border-gray-300 text-transparent dark:border-gray-600'}\`}>
                  <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="m5 10 3.5 3.5L15 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div className="min-w-0 flex-1">
                  <p className={\`text-sm font-medium \${isDone ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}\`}>{task.label}</p>
                  {task.description ? <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{task.description}</p> : null}
                  {task.ctaLabel && !isDone ? (
                    <a href={task.ctaHref ?? '#'} className="mt-1.5 inline-block text-xs font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:focus-visible:ring-blue-400">{task.ctaLabel} →</a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}`,
    },
  },
  {
    slug: 'tour-feature-announcement-modal',
    category: 'tour',
    tags: ['tour', 'modal', 'whats-new', 'announcement', 'changelog'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'version', type: 'string', default: "'v2.0'", descriptionKey: 'version' },
      { name: 'title', type: 'string', default: "\"What's new\"", descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'features', type: 'string[]', required: true, descriptionKey: 'features' },
      { name: 'primaryLabel', type: 'string', default: "'Got it'", descriptionKey: 'primaryLabel' },
      { name: 'secondaryLabel', type: 'string', default: "'Dismiss'", descriptionKey: 'secondaryLabel' },
      { name: 'triggerLabel', type: 'string', descriptionKey: 'triggerLabel' },
      { name: 'onPrimary', type: '() => void', descriptionKey: 'onPrimary' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  "What's new" dialog, scoped to this box. The illustration is pure inline SVG on
  a gradient - no external image to preload or let rot. The overlay is absolute
  inset-0 within the relative stage, NOT a fixed full-screen portal, so it never
  locks the page. Wire open/close, Escape and focus handling with JS - see the
  React/TypeScript tabs.
-->
<div class="relative isolate flex min-h-[22rem] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
  <div class="absolute inset-0 z-10 bg-gray-950/50" aria-hidden="true"></div>
  <div role="dialog" aria-modal="true" aria-labelledby="whatsnew-title" tabindex="-1" class="absolute left-1/2 top-1/2 z-20 w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
    <div class="relative h-24 w-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600" aria-hidden="true">
      <svg viewBox="0 0 400 120" preserveAspectRatio="none" class="absolute inset-0 h-full w-full opacity-30"><circle cx="60" cy="40" r="50" fill="white" /><circle cx="320" cy="90" r="70" fill="white" /></svg>
      <span class="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white ring-1 ring-inset ring-white/40">v2.0</span>
    </div>
    <div class="p-5">
      <h3 id="whatsnew-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">What's new</h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">A quick look at what shipped this release.</p>
      <ul class="mt-3 space-y-2">
        <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <svg viewBox="0 0 20 20" class="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.3 3.3 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd" /></svg>
          Command palette, on every page
        </li>
      </ul>
      <div class="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
        <button type="button" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Got it</button>
        <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">Dismiss</button>
      </div>
    </div>
  </div>
</div>`,
      react: `'use client';

import { useEffect, useId, useRef, useState } from 'react';

export function FeatureAnnouncementModal({
  version = 'v2.0',
  title = "What's new",
  description = 'A quick look at what shipped this release.',
  features,
  primaryLabel = 'Got it',
  secondaryLabel = 'Dismiss',
  triggerLabel = "See what's new",
  onPrimary,
  className = '',
}) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  // Return focus to the trigger on close - a dialog that drops focus to <body>
  // strands keyboard and screen-reader users.
  useEffect(() => {
    if (open) dialogRef.current?.focus({ preventScroll: true });
    else triggerRef.current?.focus({ preventScroll: true });
  }, [open]);

  function close() { setOpen(false); }
  function onKeyDown(event) { if (event.key === 'Escape') { event.preventDefault(); close(); } }

  const titleId = \`\${baseId}-title\`;

  return (
    <div className={\`relative isolate flex min-h-[22rem] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{triggerLabel}</button>

      {open ? (
        <>
          <div className="absolute inset-0 z-10 bg-gray-950/50" aria-hidden="true" onClick={close} />
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={onKeyDown} className="absolute left-1/2 top-1/2 z-20 w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-visible:ring-blue-400">
            <div className="relative h-24 w-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600" aria-hidden="true">
              <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-30"><circle cx="60" cy="40" r="50" fill="white" /><circle cx="320" cy="90" r="70" fill="white" /></svg>
              <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white ring-1 ring-inset ring-white/40">{version}</span>
            </div>
            <div className="p-5">
              <h3 id={titleId} className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
              <ul className="mt-3 space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.3 3.3 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
                <button type="button" onClick={() => { onPrimary?.(); close(); }} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{primaryLabel}</button>
                <button type="button" onClick={close} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">{secondaryLabel}</button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

export interface FeatureAnnouncementModalProps {
  version?: string;
  title?: string;
  description?: string;
  features: string[];
  primaryLabel?: string;
  secondaryLabel?: string;
  triggerLabel?: string;
  onPrimary?: () => void;
  className?: string;
}

export function FeatureAnnouncementModal({
  version = 'v2.0',
  title = "What's new",
  description = 'A quick look at what shipped this release.',
  features,
  primaryLabel = 'Got it',
  secondaryLabel = 'Dismiss',
  triggerLabel = "See what's new",
  onPrimary,
  className = '',
}: FeatureAnnouncementModalProps): JSX.Element {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Return focus to the trigger on close - a dialog that drops focus to <body>
  // strands keyboard and screen-reader users.
  useEffect(() => {
    if (open) dialogRef.current?.focus({ preventScroll: true });
    else triggerRef.current?.focus({ preventScroll: true });
  }, [open]);

  function close() { setOpen(false); }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
  }

  const titleId = \`\${baseId}-title\`;

  return (
    // Scoped stage: the "modal" overlays THIS box, not the page - no portal, no
    // document-level scroll lock.
    <div className={\`relative isolate flex min-h-[22rem] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950 \${className}\`}>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{triggerLabel}</button>

      {open ? (
        <>
          <div className="absolute inset-0 z-10 bg-gray-950/50" aria-hidden="true" onClick={close} />
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={onKeyDown} className="absolute left-1/2 top-1/2 z-20 w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-visible:ring-blue-400">
            {/* Illustration - pure inline SVG on a gradient, no external asset. */}
            <div className="relative h-24 w-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600" aria-hidden="true">
              <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-30"><circle cx="60" cy="40" r="50" fill="white" /><circle cx="320" cy="90" r="70" fill="white" /></svg>
              <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white ring-1 ring-inset ring-white/40">{version}</span>
            </div>
            <div className="p-5">
              <h3 id={titleId} className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
              <ul className="mt-3 space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.3 3.3 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
                <button type="button" onClick={() => { onPrimary?.(); close(); }} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{primaryLabel}</button>
                <button type="button" onClick={close} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">{secondaryLabel}</button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'tour-hotspot-beacons',
    category: 'tour',
    tags: ['tour', 'hotspot', 'beacon', 'popover', 'onboarding'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'active', labelKey: 'active' },
    ],
    props: [
      { name: 'hotspots', type: 'Hotspot[]', required: true, descriptionKey: 'hotspots' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Pulsing beacons over a mock UI. The pulse is animate-ping and carries
  motion-reduce:hidden, so reduced-motion users get a steady dot instead of a
  throb. Each beacon is a real button; the popover is width-clamped (w-40) and
  its horizontal alignment flips by position so it never runs off the edge. Wire
  open/close (focus + click) with JS - see the React/TypeScript tabs.
-->
<div class="relative isolate mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
  <div class="absolute inset-0 p-4" aria-hidden="true">
    <div class="h-3 w-24 rounded bg-gray-300 dark:bg-gray-700"></div>
    <div class="mt-3 h-16 w-full rounded-lg bg-white/70 dark:bg-gray-800/70"></div>
    <div class="mt-3 grid grid-cols-3 gap-2">
      <div class="h-10 rounded-lg bg-white/70 dark:bg-gray-800/70"></div>
      <div class="h-10 rounded-lg bg-white/70 dark:bg-gray-800/70"></div>
      <div class="h-10 rounded-lg bg-white/70 dark:bg-gray-800/70"></div>
    </div>
  </div>

  <div class="absolute" style="left:24%;top:22%">
    <button type="button" aria-expanded="false" aria-label="Search" class="relative -ml-2 -mt-2 flex h-4 w-4 items-center justify-center rounded-full focus:outline-none">
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500/70 motion-reduce:hidden" aria-hidden="true"></span>
      <span class="relative inline-flex h-3 w-3 rounded-full bg-blue-600 ring-2 ring-white dark:ring-gray-900"></span>
    </button>
  </div>

  <div class="absolute" style="left:70%;top:60%">
    <button type="button" aria-expanded="true" aria-label="Filters" class="relative -ml-2 -mt-2 flex h-4 w-4 items-center justify-center rounded-full focus:outline-none">
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500/70 motion-reduce:hidden" aria-hidden="true"></span>
      <span class="relative inline-flex h-3 w-3 rounded-full bg-blue-600 ring-2 ring-blue-300 dark:ring-blue-500"></span>
    </button>
    <div role="tooltip" class="absolute right-0 top-full z-20 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-xl dark:border-gray-700 dark:bg-gray-900">
      <p class="text-xs font-semibold text-gray-900 dark:text-gray-100">Filters</p>
      <p class="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">Narrow the list by owner, status or date.</p>
    </div>
  </div>
</div>`,
      react: `'use client';

import { useId, useState } from 'react';

function alignFor(x) {
  if (x < 40) return 'left-0';
  if (x > 60) return 'right-0';
  return 'left-1/2 -translate-x-1/2';
}

export function HotspotBeacons({ hotspots, className = '' }) {
  const baseId = useId();
  const [openId, setOpenId] = useState(null);

  return (
    <div className={\`relative isolate mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950 \${className}\`}>
      <div className="absolute inset-0 p-4" aria-hidden="true">
        <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="mt-3 h-16 w-full rounded-lg bg-white/70 dark:bg-gray-800/70" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="h-10 rounded-lg bg-white/70 dark:bg-gray-800/70" />
          <div className="h-10 rounded-lg bg-white/70 dark:bg-gray-800/70" />
          <div className="h-10 rounded-lg bg-white/70 dark:bg-gray-800/70" />
        </div>
      </div>

      {hotspots.map((h) => {
        const isOpen = openId === h.id;
        const tipId = \`\${baseId}-\${h.id}\`;
        return (
          <div key={h.id} className="absolute" style={{ left: \`\${h.x}%\`, top: \`\${h.y}%\` }}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={tipId}
              aria-label={h.label}
              onFocus={() => setOpenId(h.id)}
              onBlur={() => setOpenId((cur) => (cur === h.id ? null : cur))}
              onKeyDown={(e) => { if (e.key === 'Escape') setOpenId(null); }}
              className="relative -ml-2 -mt-2 flex h-4 w-4 items-center justify-center rounded-full focus:outline-none"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500/70 motion-reduce:hidden" aria-hidden="true" />
              <span className={\`relative inline-flex h-3 w-3 rounded-full bg-blue-600 ring-2 ring-white dark:ring-gray-900 \${isOpen ? 'ring-blue-300 dark:ring-blue-500' : ''}\`} />
            </button>

            {isOpen ? (
              <div id={tipId} role="tooltip" className={\`absolute top-full z-20 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-xl dark:border-gray-700 dark:bg-gray-900 \${alignFor(h.x)}\`}>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{h.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{h.tip}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}`,
      typescript: `'use client';

import { useId, useState, type KeyboardEvent } from 'react';

export interface Hotspot {
  id: string;
  /** Horizontal position within the mock, 0-100 (%). */
  x: number;
  /** Vertical position within the mock, 0-100 (%). */
  y: number;
  label: string;
  tip: string;
}

export interface HotspotBeaconsProps {
  hotspots: Hotspot[];
  className?: string;
}

// Flip the popover's horizontal anchor by position so a beacon near an edge
// opens inward and never runs off the box.
function alignFor(x: number): string {
  if (x < 40) return 'left-0';
  if (x > 60) return 'right-0';
  return 'left-1/2 -translate-x-1/2';
}

export function HotspotBeacons({ hotspots, className = '' }: HotspotBeaconsProps): JSX.Element {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={\`relative isolate mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950 \${className}\`}>
      {/* Mock UI backdrop. */}
      <div className="absolute inset-0 p-4" aria-hidden="true">
        <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="mt-3 h-16 w-full rounded-lg bg-white/70 dark:bg-gray-800/70" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="h-10 rounded-lg bg-white/70 dark:bg-gray-800/70" />
          <div className="h-10 rounded-lg bg-white/70 dark:bg-gray-800/70" />
          <div className="h-10 rounded-lg bg-white/70 dark:bg-gray-800/70" />
        </div>
      </div>

      {hotspots.map((h) => {
        const isOpen = openId === h.id;
        const tipId = \`\${baseId}-\${h.id}\`;
        return (
          <div key={h.id} className="absolute" style={{ left: \`\${h.x}%\`, top: \`\${h.y}%\` }}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={tipId}
              aria-label={h.label}
              onFocus={() => setOpenId(h.id)}
              onBlur={() => setOpenId((cur) => (cur === h.id ? null : cur))}
              onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => { if (e.key === 'Escape') setOpenId(null); }}
              className="relative -ml-2 -mt-2 flex h-4 w-4 items-center justify-center rounded-full focus:outline-none"
            >
              {/* Pulse yields to reduced-motion - a steady dot, not a throb. */}
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500/70 motion-reduce:hidden" aria-hidden="true" />
              <span className={\`relative inline-flex h-3 w-3 rounded-full bg-blue-600 ring-2 ring-white dark:ring-gray-900 \${isOpen ? 'ring-blue-300 dark:ring-blue-500' : ''}\`} />
            </button>

            {isOpen ? (
              <div id={tipId} role="tooltip" className={\`absolute top-full z-20 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-xl dark:border-gray-700 dark:bg-gray-900 \${alignFor(h.x)}\`}>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{h.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{h.tip}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}`,
    },
  },
  {
    slug: 'tour-step-tooltip-sequence',
    category: 'tour',
    tags: ['tour', 'tooltip', 'sequence', 'driver', 'walkthrough'],
    difficulty: 'advanced',
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
      { name: 'steps', type: 'TourStep[]', required: true, descriptionKey: 'steps' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  driver.js-style sequence. The highlight ring moves along a mock toolbar as the
  step advances; the tooltip's caret is positioned by the step index - targets
  share the row evenly, so slot i's centre is (i + 0.5)/total, no measuring. Wire
  Next/Prev, the dots and ArrowLeft/Right with JS - see the React/TypeScript tabs.
-->
<div class="mx-auto w-full max-w-md">
  <div class="flex items-stretch gap-1 rounded-xl border border-gray-200 bg-white p-1.5 dark:border-gray-800 dark:bg-gray-950">
    <div aria-current="step" class="flex min-w-0 flex-1 items-center justify-center rounded-lg bg-blue-600 px-2 py-2 text-xs font-medium text-white ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-950"><span class="truncate">Search</span></div>
    <div class="flex min-w-0 flex-1 items-center justify-center rounded-lg px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400"><span class="truncate">Filter</span></div>
    <div class="flex min-w-0 flex-1 items-center justify-center rounded-lg px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400"><span class="truncate">Sort</span></div>
    <div class="flex min-w-0 flex-1 items-center justify-center rounded-lg px-2 py-2 text-xs font-medium text-gray-500 dark:text-gray-400"><span class="truncate">Share</span></div>
  </div>

  <div class="relative mt-3">
    <div class="absolute -top-1.5 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900" style="left:12.5%;margin-left:-0.375rem" aria-hidden="true"></div>
    <div role="dialog" aria-labelledby="seq-title" class="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div class="flex items-center justify-between gap-2">
        <h3 id="seq-title" class="text-sm font-semibold text-gray-900 dark:text-gray-100">Search anything</h3>
        <span class="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">1 / 4</span>
      </div>
      <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Jump to any record from here - no menu-hunting.</p>
      <div class="mt-4 flex items-center justify-between gap-3">
        <div class="flex items-center gap-1.5" role="tablist" aria-label="Tour steps">
          <button type="button" role="tab" aria-selected="true" aria-label="Go to step 1" class="h-2 w-5 rounded-full bg-blue-600 dark:bg-blue-500"></button>
          <button type="button" role="tab" aria-selected="false" aria-label="Go to step 2" class="h-2 w-2 rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-700"></button>
          <button type="button" role="tab" aria-selected="false" aria-label="Go to step 3" class="h-2 w-2 rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-700"></button>
          <button type="button" role="tab" aria-selected="false" aria-label="Go to step 4" class="h-2 w-2 rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-700"></button>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" disabled class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-40 dark:border-gray-700 dark:text-gray-200">Prev</button>
          <button type="button" class="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">Next</button>
        </div>
      </div>
    </div>
  </div>
</div>`,
      react: `'use client';

import { useId, useState } from 'react';

export function StepTooltipSequence({ steps, className = '' }) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const total = steps.length;
  const step = steps[active];

  function go(to) { setActive(Math.min(total - 1, Math.max(0, to))); }
  function onKeyDown(event) {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(active + 1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); go(active - 1); }
  }

  // Caret sits under the active target: targets share the row evenly, so slot
  // i's centre is (i + 0.5)/total - no measuring required.
  const caretLeft = total === 0 ? 50 : ((active + 0.5) / total) * 100;

  return (
    <div className={\`mx-auto w-full max-w-md \${className}\`} onKeyDown={onKeyDown}>
      <div className="flex items-stretch gap-1 rounded-xl border border-gray-200 bg-white p-1.5 dark:border-gray-800 dark:bg-gray-950">
        {steps.map((s, i) => {
          const isActive = i === active;
          return (
            <div key={s.target} aria-current={isActive ? 'step' : undefined} className={\`flex min-w-0 flex-1 items-center justify-center rounded-lg px-2 py-2 text-xs font-medium transition-colors motion-reduce:transition-none \${isActive ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-950' : 'text-gray-500 dark:text-gray-400'}\`}>
              <span className="truncate">{s.target}</span>
            </div>
          );
        })}
      </div>

      {step ? (
        <div className="relative mt-3">
          <div className="absolute -top-1.5 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900" style={{ left: \`\${caretLeft}%\`, marginLeft: '-0.375rem' }} aria-hidden="true" />
          <div role="dialog" aria-labelledby={\`\${baseId}-title\`} className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-2">
              <h3 id={\`\${baseId}-title\`} className="text-sm font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
              <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">{active + 1} / {total}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.body}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Tour steps">
                {steps.map((s, i) => (
                  <button key={s.target} type="button" role="tab" aria-selected={i === active} aria-label={\`Go to step \${i + 1}\`} onClick={() => go(i)} className={\`h-2 rounded-full transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${i === active ? 'w-5 bg-blue-600 dark:bg-blue-500' : 'w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700'}\`} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => go(active - 1)} disabled={active === 0} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 enabled:hover:bg-gray-100 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-200 dark:enabled:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Prev</button>
                <button type="button" onClick={() => go(active + 1)} disabled={active >= total - 1} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white enabled:hover:bg-blue-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Next</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useId, useState, type KeyboardEvent } from 'react';

export interface TourStep {
  /** Label for the toolbar target this step highlights. */
  target: string;
  title: string;
  body: string;
}

export interface StepTooltipSequenceProps {
  steps: TourStep[];
  className?: string;
}

export function StepTooltipSequence({ steps, className = '' }: StepTooltipSequenceProps): JSX.Element {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const total = steps.length;
  const step = steps[active];

  function go(to: number) { setActive(Math.min(total - 1, Math.max(0, to))); }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(active + 1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); go(active - 1); }
  }

  // Caret sits under the active target: targets share the row evenly, so slot
  // i's centre is (i + 0.5)/total - no measuring required.
  const caretLeft = total === 0 ? 50 : ((active + 0.5) / total) * 100;

  return (
    <div className={\`mx-auto w-full max-w-md \${className}\`} onKeyDown={onKeyDown}>
      {/* Mock toolbar. */}
      <div className="flex items-stretch gap-1 rounded-xl border border-gray-200 bg-white p-1.5 dark:border-gray-800 dark:bg-gray-950">
        {steps.map((s, i) => {
          const isActive = i === active;
          return (
            <div key={s.target} aria-current={isActive ? 'step' : undefined} className={\`flex min-w-0 flex-1 items-center justify-center rounded-lg px-2 py-2 text-xs font-medium transition-colors motion-reduce:transition-none \${isActive ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-950' : 'text-gray-500 dark:text-gray-400'}\`}>
              <span className="truncate">{s.target}</span>
            </div>
          );
        })}
      </div>

      {step ? (
        <div className="relative mt-3">
          <div className="absolute -top-1.5 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900" style={{ left: \`\${caretLeft}%\`, marginLeft: '-0.375rem' }} aria-hidden="true" />
          <div role="dialog" aria-labelledby={\`\${baseId}-title\`} className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-2">
              <h3 id={\`\${baseId}-title\`} className="text-sm font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
              <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">{active + 1} / {total}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.body}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              {/* Progress dots double as jump-to controls. */}
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Tour steps">
                {steps.map((s, i) => (
                  <button key={s.target} type="button" role="tab" aria-selected={i === active} aria-label={\`Go to step \${i + 1}\`} onClick={() => go(i)} className={\`h-2 rounded-full transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${i === active ? 'w-5 bg-blue-600 dark:bg-blue-500' : 'w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700'}\`} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => go(active - 1)} disabled={active === 0} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 enabled:hover:bg-gray-100 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-200 dark:enabled:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Prev</button>
                <button type="button" onClick={() => go(active + 1)} disabled={active >= total - 1} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white enabled:hover:bg-blue-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Next</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
];
