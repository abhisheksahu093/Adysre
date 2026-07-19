'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `badge-ribbon-corner`.
 *
 * Mirrors the `typescript` code variant verbatim. The wrapper brings only the
 * ribbon; the card chrome (border, radius, padding) is supplied here via
 * className, exactly as a consumer would. Keep this in step with
 * `src/data/components/badges.ts`.
 */
interface RibbonCornerProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

function RibbonCorner({ label = 'New', children, className = '' }: RibbonCornerProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <span className="absolute right-[-48px] top-[20px] w-40 rotate-45 bg-blue-600 py-1 text-center text-[0.6875rem] font-semibold uppercase tracking-wider text-white shadow-sm">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function BadgeRibbonCornerPreview() {
  return (
    <div className="flex items-center justify-center p-6">
      <RibbonCorner
        label="New"
        className="w-full max-w-xs rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <h3 className="pr-14 text-base font-semibold text-gray-900 dark:text-gray-100">
          Team workspace
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Shared views, granular roles and an audit trail for every change.
        </p>
      </RibbonCorner>
    </div>
  );
}

export const minHeight = 220;
