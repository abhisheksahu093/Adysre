'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

/**
 * Live preview for `tour-coach-mark-spotlight`.
 *
 * Mirrors the `typescript` code variant verbatim. Fully interactive: Back / Next
 * / Skip drive the spotlight down the mock rows; focus follows the callout as you
 * advance (never on first mount). The dim layer is scoped to this box. Keep in
 * step with `src/data/components/tour.ts`.
 */
interface CoachStep {
  target: string;
  title: string;
  body: string;
}

interface CoachMarkSpotlightProps {
  steps: CoachStep[];
  finishLabel?: string;
  onFinish?: () => void;
  className?: string;
}

function CoachMarkSpotlight({
  steps,
  finishLabel = 'Finish',
  onFinish,
  className = '',
}: CoachMarkSpotlightProps) {
  const baseId = useId();
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  const total = steps.length;
  const step = steps[index];

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

  const titleId = `${baseId}-title`;

  return (
    <div className={`relative isolate mx-auto w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <ul className="space-y-2">
        {steps.map((s, i) => {
          const active = !done && i === index;
          return (
            <li
              key={s.target}
              className={`relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${
                active
                  ? 'z-20 border-blue-500 bg-white text-gray-900 ring-2 ring-blue-500 dark:bg-gray-900 dark:text-gray-100'
                  : 'border-gray-200 bg-white/70 text-gray-600 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
              {s.target}
            </li>
          );
        })}
      </ul>

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
}

const SAMPLE_STEPS: CoachStep[] = [
  { target: 'Create your workspace', title: 'Create your workspace', body: 'Name it and pick a colour - this is where everything lives.' },
  { target: 'Invite your team', title: 'Invite your team', body: 'Add teammates by email; roles can be tuned later.' },
  { target: 'Connect a data source', title: 'Connect a data source', body: 'Link a database or upload a CSV to see your first chart.' },
  { target: 'Publish your first view', title: 'Publish your first view', body: 'Share a read-only link with anyone, no account needed.' },
];

export const minHeight = 280;

export default function TourCoachMarkSpotlightPreview() {
  return <CoachMarkSpotlight steps={SAMPLE_STEPS} />;
}
