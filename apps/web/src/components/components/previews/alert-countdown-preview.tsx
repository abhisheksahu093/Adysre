'use client';

/**
 * Live preview for `alert-countdown`.
 *
 * Mirrors the `typescript` code variant. The digits tick every second and are
 * aria-hidden; a single aria-live="polite" region carries a coarse phrase so a
 * screen reader is not flooded. tabular-nums keeps the width from jittering. The
 * preview seeds a deadline ~2h14m out relative to mount.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import { useEffect, useState } from 'react';

interface AlertCountdownProps {
  deadline: number;
  title: string;
  expiredLabel?: string;
  className?: string;
}

const pad = (n: number): string => String(n).padStart(2, '0');

function coarse(ms: number): string {
  if (ms <= 0) return 'Time is up.';
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `About ${mins} minute${mins === 1 ? '' : 's'} left.`;
  const hrs = Math.round(mins / 60);
  return `About ${hrs} hour${hrs === 1 ? '' : 's'} left.`;
}

function AlertCountdown({
  deadline,
  title,
  expiredLabel = 'This offer has ended.',
  className = '',
}: AlertCountdownProps) {
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
      className={`flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between ${className}`}
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
      <span className="sr-only" aria-live="polite">
        {coarse(remaining)}
      </span>
    </div>
  );
}

export default function AlertCountdownPreview() {
  // Seed the deadline once on mount so the countdown starts from a fixed offset.
  const [deadline] = useState<number>(() => Date.now() + (2 * 3600 + 14 * 60 + 8) * 1000);

  return (
    <div className="w-full max-w-lg">
      <AlertCountdown deadline={deadline} title="Early-bird pricing ends soon" />
    </div>
  );
}

export const minHeight = 200;
