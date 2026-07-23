'use client';

/**
 * Live preview for `gradient-section-divider`.
 *
 * Mirrors the `typescript` code variant verbatim. The hairline fades out at
 * both ends and a soft glow sits behind it; the whole thing is aria-hidden so
 * a screen reader never hears "separator". Keep this in step with
 * `src/data/components/gradients.ts`.
 */
interface GradientSectionDividerProps {
  glow?: boolean;
  className?: string;
}

export function GradientSectionDivider({ glow = true, className = '' }: GradientSectionDividerProps) {
  return (
    /* aria-hidden, not <hr>, on purpose: an <hr> announces "separator" and
       between two <section>s that is noise - the headings already carry the
       structure. If the break IS semantic, drop aria-hidden and use <hr>. */
    <div className={`relative isolate w-full py-6 ${className}`} aria-hidden="true">
      {glow ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-16 w-2/3 max-w-md -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(59,130,246,0.2),transparent)] blur-xl dark:bg-[radial-gradient(closest-side,rgba(96,165,250,0.18),transparent)]" />
      ) : null}
      {/* The fade at both ends is what makes it read as a breath between
          sections rather than a rule across the page. */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
    </div>
  );
}

export default function GradientSectionDividerPreview() {
  return <GradientSectionDivider glow />;
}
