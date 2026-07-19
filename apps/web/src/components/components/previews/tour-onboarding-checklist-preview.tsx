'use client';

import { useId, useMemo, useState } from 'react';

/**
 * Live preview for `tour-onboarding-checklist`.
 *
 * Mirrors the `typescript` code variant verbatim. Interactive: toggle any task
 * to watch the count and progress bar update; the header chevron collapses the
 * body. Keep in step with `src/data/components/tour.ts`.
 */
interface ChecklistTask {
  id: string;
  label: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  done?: boolean;
}

interface OnboardingChecklistProps {
  title?: string;
  tasks: ChecklistTask[];
  defaultCollapsed?: boolean;
  className?: string;
}

function OnboardingChecklist({
  title = 'Getting started',
  tasks,
  defaultCollapsed = false,
  className = '',
}: OnboardingChecklistProps) {
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
  const regionId = `${baseId}-region`;

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section className={`mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{complete} of {total} complete</p>
        </div>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={regionId} className="shrink-0 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400">
          <span className="sr-only">{open ? 'Collapse checklist' : 'Expand checklist'}</span>
          <svg viewBox="0 0 20 20" className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Onboarding progress">
        <div className="h-full rounded-full bg-blue-600 transition-[width] duration-300 motion-reduce:transition-none dark:bg-blue-500" style={{ width: `${pct}%` }} />
      </div>

      {open ? (
        <ul id={regionId} className="mt-4 space-y-2">
          {tasks.map((task) => {
            const isDone = Boolean(checked[task.id]);
            return (
              <li key={task.id} className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <button type="button" role="checkbox" aria-checked={isDone} onClick={() => toggle(task.id)} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${isDone ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500' : 'border-gray-300 text-transparent dark:border-gray-600'}`}>
                  <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><path d="m5 10 3.5 3.5L15 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${isDone ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{task.label}</p>
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
}

const SAMPLE_TASKS: ChecklistTask[] = [
  { id: 'verify', label: 'Verify your email', done: true },
  { id: 'invite', label: 'Invite a teammate', description: 'Tours are better with company.', ctaLabel: 'Send invite' },
  { id: 'connect', label: 'Connect a data source', description: 'Link a database or upload a CSV.', ctaLabel: 'Connect' },
  { id: 'publish', label: 'Publish your first view', description: 'Share a read-only link.', ctaLabel: 'Publish' },
];

export const minHeight = 440;

export default function TourOnboardingChecklistPreview() {
  return <OnboardingChecklist tasks={SAMPLE_TASKS} />;
}
