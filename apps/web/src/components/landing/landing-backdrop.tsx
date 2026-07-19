import { cn } from '@adysre/ui';

/**
 * Decorative section background: two soft token-coloured glows over a faint
 * grid. Purely presentational, so it is `aria-hidden` and carries no text.
 *
 * Colours are theme tokens (`primary` / `secondary` / `accent`) at low opacity,
 * never hardcoded hex, so the glow re-tints itself in light and dark. The grid
 * is a masked repeating-linear-gradient that fades out towards the edges.
 */
export function LandingBackdrop({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {/* Grid: current-color hairlines, faded to nothing by a radial mask so it
          never reaches a hard edge. */}
      <div
        className="absolute inset-0 text-border/60 [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      {/* Primary glow, top-left of centre. */}
      <div className="absolute -top-24 left-1/2 h-[32rem] w-[32rem] -translate-x-3/4 rounded-full bg-primary/20 blur-[120px]" />
      {/* Secondary glow, offset to the right for a two-tone wash. */}
      <div className="absolute -top-16 left-1/2 h-[28rem] w-[28rem] -translate-x-1/4 rounded-full bg-secondary/20 blur-[120px]" />
    </div>
  );
}
