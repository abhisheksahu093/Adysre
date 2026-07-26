'use client';

import { cn } from 'adysre';
import type { Tone } from '../constants/http';

/**
 * Tones to classes, in one place.
 *
 * Components ask for a TONE (`success`, `danger`) and never for a colour, so
 * every method badge, status pill and timing bar in the module is repainted by
 * one edit here and by a token change in `@adysre/theme`. Tailwind needs the
 * full class name in the source to keep it, which is why these are written out
 * rather than assembled from a template string.
 */

const TEXT: Record<Tone, string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  muted: 'text-muted-foreground',
};

const SOFT: Record<Tone, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  muted: 'bg-muted text-muted-foreground',
};

const FILL: Record<Tone, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  muted: 'bg-muted-foreground',
};

export const toneText = (tone: Tone): string => TEXT[tone];
export const toneSoft = (tone: Tone): string => SOFT[tone];
export const toneFill = (tone: Tone): string => FILL[tone];

/** A small uppercase label in a tone. Used for methods and status codes. */
export function TonePill({
  tone,
  children,
  className,
  title,
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide',
        SOFT[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
