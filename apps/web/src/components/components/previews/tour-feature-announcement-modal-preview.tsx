'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

/**
 * Live preview for `tour-feature-announcement-modal`.
 *
 * Mirrors the `typescript` code variant verbatim. Interactive: open the dialog
 * from the trigger; Escape or a scrim click closes it and focus returns to the
 * trigger. The overlay is scoped to this box - no page-level portal. Keep in step
 * with `src/data/components/tour.ts`.
 */
interface FeatureAnnouncementModalProps {
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

function FeatureAnnouncementModal({
  version = 'v2.0',
  title = "What's new",
  description = 'A quick look at what shipped this release.',
  features,
  primaryLabel = 'Got it',
  secondaryLabel = 'Dismiss',
  triggerLabel = "See what's new",
  onPrimary,
  className = '',
}: FeatureAnnouncementModalProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) dialogRef.current?.focus({ preventScroll: true });
    else triggerRef.current?.focus({ preventScroll: true });
  }, [open]);

  function close() { setOpen(false); }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
  }

  const titleId = `${baseId}-title`;

  return (
    <div className={`relative isolate flex min-h-[22rem] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
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
}

const SAMPLE_FEATURES = [
  'Command palette, on every page',
  'Real-time collaborative cursors',
  'One-click CSV and PDF export',
];

export const minHeight = 380;

export default function TourFeatureAnnouncementModalPreview() {
  return (
    <FeatureAnnouncementModal
      version="v2.0"
      title="What's new in 2.0"
      description="The biggest release yet - here are the highlights."
      features={SAMPLE_FEATURES}
    />
  );
}
