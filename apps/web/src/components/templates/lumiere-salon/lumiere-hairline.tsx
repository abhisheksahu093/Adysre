'use client';

/**
 * LUMIERE - the rose-gold divider motif.
 *
 * A champagne hairline with a rotated diamond at its centre, drawn entirely by
 * `.lumi-hairline` in lumiere.css. It carries no meaning, so it is hidden from
 * assistive technology rather than announced as a separator between things a
 * screen reader already hears as separate sections.
 */
export function LumiereHairline({ className = '' }: { className?: string }) {
  return (
    <div className={`lumi-hairline ${className}`} aria-hidden>
      <span />
    </div>
  );
}
