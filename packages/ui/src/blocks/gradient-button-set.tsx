'use client';

/**
 * Live preview for `gradient-button-set`.
 *
 * Mirrors the `typescript` code variant verbatim. Both variants render side by
 * side: the solid button cross-fades two stacked gradients on hover, the
 * outline wears the same gradient as a 1px ring. They stack at 320px and sit in
 * a row from sm up. Keep this in step with `src/data/components/gradients.ts`.
 */
interface GradientButtonProps {
  label: string;
  href?: string;
  variant?: 'solid' | 'outline';
  className?: string;
}

export function GradientButton({ label, href = '#', variant = 'solid', className = '' }: GradientButtonProps) {
  if (variant === 'outline') {
    // The border-card padding trick at button scale. The hover fill reuses
    // the gradient the ring already paints, and the label flips to white -
    // the stops were chosen to clear AA under white in both themes, which is
    // why there are no dark: overrides on the gradient itself.
    return (
      <a
        href={href}
        className={`group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-fuchsia-600 p-px text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ${className}`}
      >
        <span className="inline-flex w-full items-center justify-center rounded-[calc(0.5rem_-_1px)] bg-white px-5 py-2.5 text-gray-900 transition-colors group-hover:bg-transparent group-hover:text-white motion-reduce:transition-none dark:bg-gray-950 dark:text-gray-100">
          {label}
        </span>
      </a>
    );
  }

  // Two stacked static gradients cross-faded with opacity, not one gradient
  // with an animated background-position: position animation repaints the
  // gradient every frame, an opacity fade is compositor work.
  return (
    <a
      href={href}
      className={`group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ${className}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600" aria-hidden="true" />
      <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none" aria-hidden="true" />
      <span className="relative">{label}</span>
    </a>
  );
}

export default function GradientButtonSetPreview() {
  return (
    <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
      <GradientButton label="Start free trial" variant="solid" />
      <GradientButton label="Book a demo" variant="outline" />
    </div>
  );
}
