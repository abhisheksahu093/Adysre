import Image from 'next/image';
import { cn } from 'adysre';

/** Intrinsic aspect of the artwork (653 × 192 viewBox) - ~3.4:1. */
const RATIO = 653 / 192;
/** Intrinsic aspect of the compact icon mark (218 × 120 viewBox). */
const ICON_RATIO = 218 / 120;

interface LogoProps {
  /** Rendered height in px; width follows the logo's aspect ratio. */
  height?: number;
  /** Load eagerly - set on the first logo painted above the fold. */
  priority?: boolean;
  className?: string;
}

/**
 * ADYSRE wordmark.
 *
 * The artwork is monochrome white (baked into the vector fill and the mark's
 * alpha), so it only reads on a dark surface. Rather than ship a second
 * recoloured export to keep in sync, light mode inverts it to black - the
 * source has no colour to lose. Swapping via CSS (not JS) keeps it correct on
 * first paint: no flash, no hydration mismatch.
 *
 * `public/logo/adysre.svg` is the design export with its dead weight stripped
 * (2.61 MB → 10 KB); the source of truth stays in public/prompts/logo/.
 */
export function Logo({ height = 34, priority = false, className }: LogoProps) {
  const width = Math.round(height * RATIO);

  return (
    <Image
      src="/logo/adysre.svg"
      alt="ADYSRE"
      width={width}
      height={height}
      priority={priority}
      // Asset is white: invert to black on light surfaces, leave it alone on dark.
      className={cn('shrink-0 invert dark:invert-0', className)}
      style={{ width, height }}
    />
  );
}

/**
 * Compact ADYSRE icon mark, for the collapsed sidebar rail where the full
 * wordmark does not fit. Same monochrome-white artwork as the wordmark, so it
 * gets the same light-mode invert.
 */
export function LogoIcon({ height = 22, priority = false, className }: LogoProps) {
  const width = Math.round(height * ICON_RATIO);

  return (
    <Image
      src="/logo/adysre-icon.svg"
      alt="ADYSRE"
      width={width}
      height={height}
      priority={priority}
      className={cn('shrink-0 invert dark:invert-0', className)}
      style={{ width, height }}
    />
  );
}
