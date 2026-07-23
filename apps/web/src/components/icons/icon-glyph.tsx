import { cn } from 'adysre';

interface IconGlyphProps {
  /** The icon's authored SVG child elements (from our static data). */
  body: string;
  size?: number;
  /** Stroke/fill colour; `currentColor` inherits from text colour. */
  color?: string;
  stroke?: number;
  filled?: boolean;
  className?: string;
  /**
   * Take the stroke weight from the `--icon-stroke` CSS variable (set on an
   * ancestor) instead of a fixed value. Lets a container restyle many glyphs at
   * once - e.g. the grid's global weight slider - without re-rendering them.
   */
  strokeVar?: boolean;
  /** Accessible label; when omitted the glyph is decorative. */
  label?: string;
}

/**
 * Render an authored icon body inside the shared 24x24 wrapper. Colour, weight
 * and fill are driven entirely by props, so one body renders at any style the
 * user picks - on a card, in the editor, or in the exported code.
 *
 * `body` is trusted, first-party static data (see `@/data/icons`), never user
 * input, so injecting it is safe.
 */
export function IconGlyph({
  body,
  size = 24,
  color = 'currentColor',
  stroke = 1.5,
  filled = false,
  className,
  strokeVar = false,
  label,
}: IconGlyphProps) {
  const paint = filled
    ? { fill: color, stroke: 'none' }
    : {
        fill: 'none',
        stroke: color,
        // Inline style beats the SVG presentation attribute and needs no
        // stylesheet rule, so the CSS variable drives weight reliably.
        ...(strokeVar
          ? { style: { strokeWidth: 'var(--icon-stroke, 1.5)' } }
          : { strokeWidth: stroke }),
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
      };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      {...paint}
      className={cn('shrink-0', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
