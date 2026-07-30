import { buttonVariants, cn } from 'adysre';

/**
 * The landing page's actions: the shared button, plus the canvas's motion.
 *
 * Three tones instead of five variants, because the marketing page only ever
 * makes three claims about an action: it is the way in (`solid`), it is the
 * other way in (`quiet`), or it is a link that happens to be button-shaped
 * (`bare`). Each maps to a variant of the shared button (Rule 3: the colours,
 * sizes and focus ring stay in `packages/ui`) and to the `.cta-*` classes in
 * globals.css that add the lift, the glow and the sheen.
 *
 * This module is the only place that pairing lives, so a change to the hover
 * treatment is one edit rather than one per section. Icons opt into their own
 * movement with `CTA_ARROW` (trailing arrow leads) or `CTA_GLYPH` (leading glyph
 * tilts); both are driven by the parent's hover.
 */
export type CtaTone = 'solid' | 'quiet' | 'bare';
export type CtaSize = 'sm' | 'md' | 'lg';

const TONE_VARIANT = {
  solid: 'primary',
  quiet: 'outline',
  bare: 'ghost',
} as const satisfies Record<CtaTone, 'primary' | 'outline' | 'ghost'>;

/** `bare` shares the quiet hover tint: a ghost action has no border to colour. */
const TONE_MOTION = {
  solid: 'cta cta-solid',
  quiet: 'cta cta-quiet',
  bare: 'cta cta-quiet',
} as const satisfies Record<CtaTone, string>;

export interface CtaOptions {
  tone?: CtaTone;
  size?: CtaSize;
  /** Layout and one-off overrides, applied last. */
  className?: string;
}

export function ctaClass({ tone = 'solid', size = 'md', className }: CtaOptions = {}): string {
  return cn(buttonVariants({ variant: TONE_VARIANT[tone], size }), TONE_MOTION[tone], className);
}

export const CTA_ARROW = 'cta-arrow';
export const CTA_GLYPH = 'cta-glyph';
