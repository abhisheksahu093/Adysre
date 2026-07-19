'use client';

/**
 * Live preview for `badge-gradient-shine`.
 *
 * Mirrors the `typescript` code variant verbatim, keyframes included - they
 * travel with the component, so the preview needs no global CSS. Keep this in
 * step with `src/data/components/badges.ts`.
 */
const SHINE_KEYFRAMES = `
  @keyframes badge-shine {
    0% { transform: translateX(-100%); }
    60%, 100% { transform: translateX(100%); }
  }
`;

interface GradientShineBadgeProps {
  label: string;
  className?: string;
}

function GradientShineBadge({ label, className = '' }: GradientShineBadgeProps) {
  return (
    <span
      className={`relative inline-flex items-center overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 px-3 py-1 text-xs font-semibold text-white ${className}`}
    >
      <style>{SHINE_KEYFRAMES}</style>
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full animate-[badge-shine_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent motion-reduce:animate-none"
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

export default function BadgeGradientShinePreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-6">
      <GradientShineBadge label="New feature" />
      <GradientShineBadge label="Pro" />
    </div>
  );
}
