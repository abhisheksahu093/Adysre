'use client';

/**
 * Live preview for `stat-card`.
 *
 * Mirrors the `typescript` code variant verbatim. Rendered with an upward
 * trend, which is what the entry is showing off - the delta pill and its
 * `sr-only` direction word.
 * Keep this in step with `src/data/components/cards.ts`.
 */
import type { ReactNode } from 'react';

type Trend = 'up' | 'down';

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  trend?: Trend;
  period?: string;
  icon?: ReactNode;
  className?: string;
}

const TREND_STYLES: Record<Trend, string> = {
  up: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  down: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
};

const TREND_PATHS: Record<Trend, string> = {
  up: 'M10 4a1 1 0 0 1 .7.3l4 4a1 1 0 0 1-1.4 1.4L11 7.4V15a1 1 0 1 1-2 0V7.4L6.7 9.7a1 1 0 0 1-1.4-1.4l4-4A1 1 0 0 1 10 4Z',
  down: 'M10 16a1 1 0 0 1-.7-.3l-4-4a1 1 0 0 1 1.4-1.4L9 12.6V5a1 1 0 1 1 2 0v7.6l2.3-2.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-.7.3Z',
};

export function StatCard({
  label,
  value,
  delta,
  trend = 'up',
  period = 'vs last month',
  icon,
  className = '',
}: StatCardProps) {
  return (
    <article
      className={`w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        {icon ? (
          <span
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{value}</p>

      <p className="mt-2 flex items-center gap-1.5 text-sm">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${TREND_STYLES[trend]}`}>
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d={TREND_PATHS[trend]} />
          </svg>
          <span className="sr-only">{trend === 'up' ? 'Up' : 'Down'}</span>
          {delta}
        </span>
        <span className="text-gray-600 dark:text-gray-400">{period}</span>
      </p>
    </article>
  );
}

export default function StatCardPreview() {
  return (
    <StatCard
      label="Monthly recurring revenue"
      value="$48,120"
      delta="12.5%"
      trend="up"
      period="vs last month"
      icon={
        <svg className="h-[1.125rem] w-[1.125rem]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a1 1 0 0 1 1 1v1.1c1.7.3 3 1.5 3 3.1a1 1 0 1 1-2 0c0-.6-.8-1.2-2-1.2s-2 .6-2 1.2.8 1.2 2 1.2c2.2 0 4 1.4 4 3.2 0 1.6-1.3 2.8-3 3.1V16a1 1 0 1 1-2 0v-1.3c-1.7-.3-3-1.5-3-3.1a1 1 0 1 1 2 0c0 .6.8 1.2 2 1.2s2-.6 2-1.2-.8-1.2-2-1.2c-2.2 0-4-1.4-4-3.2 0-1.6 1.3-2.8 3-3.1V3a1 1 0 0 1 1-1Z" />
        </svg>
      }
    />
  );
}
