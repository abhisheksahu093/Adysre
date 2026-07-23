'use client';

import { useId, useState, type KeyboardEvent } from 'react';

/**
 * Live preview for `tour-step-tooltip-sequence`.
 *
 * Mirrors the `typescript` code variant verbatim. Interactive: Next / Prev, the
 * progress dots, and the Arrow keys all move the highlight along the mock toolbar
 * and slide the tooltip caret under the active target. Keep in step with
 * `src/data/components/tour.ts`.
 */
interface TourStep {
  target: string;
  title: string;
  body: string;
}

interface StepTooltipSequenceProps {
  steps: TourStep[];
  className?: string;
}

export function StepTooltipSequence({ steps, className = '' }: StepTooltipSequenceProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const total = steps.length;
  const step = steps[active];

  function go(to: number) { setActive(Math.min(total - 1, Math.max(0, to))); }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(active + 1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); go(active - 1); }
  }

  const caretLeft = total === 0 ? 50 : ((active + 0.5) / total) * 100;

  return (
    <div className={`mx-auto w-full max-w-md ${className}`} onKeyDown={onKeyDown}>
      <div className="flex items-stretch gap-1 rounded-xl border border-gray-200 bg-white p-1.5 dark:border-gray-800 dark:bg-gray-950">
        {steps.map((s, i) => {
          const isActive = i === active;
          return (
            <div key={s.target} aria-current={isActive ? 'step' : undefined} className={`flex min-w-0 flex-1 items-center justify-center rounded-lg px-2 py-2 text-xs font-medium transition-colors motion-reduce:transition-none ${isActive ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-950' : 'text-gray-500 dark:text-gray-400'}`}>
              <span className="truncate">{s.target}</span>
            </div>
          );
        })}
      </div>

      {step ? (
        <div className="relative mt-3">
          <div className="absolute -top-1.5 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900" style={{ left: `${caretLeft}%`, marginLeft: '-0.375rem' }} aria-hidden="true" />
          <div role="dialog" aria-labelledby={`${baseId}-title`} className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-2">
              <h3 id={`${baseId}-title`} className="text-sm font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
              <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">{active + 1} / {total}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.body}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Tour steps">
                {steps.map((s, i) => (
                  <button key={s.target} type="button" role="tab" aria-selected={i === active} aria-label={`Go to step ${i + 1}`} onClick={() => go(i)} className={`h-2 rounded-full transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${i === active ? 'w-5 bg-blue-600 dark:bg-blue-500' : 'w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700'}`} />
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
}

const SAMPLE_STEPS: TourStep[] = [
  { target: 'Search', title: 'Search anything', body: 'Jump to any record from here - no menu-hunting.' },
  { target: 'Filter', title: 'Filter the list', body: 'Stack filters by owner, status or date.' },
  { target: 'Sort', title: 'Sort your way', body: 'Click a column or pick a preset order.' },
  { target: 'Share', title: 'Share a view', body: 'Send a read-only link to anyone.' },
];

export const minHeight = 240;

export default function TourStepTooltipSequencePreview() {
  return <StepTooltipSequence steps={SAMPLE_STEPS} />;
}
