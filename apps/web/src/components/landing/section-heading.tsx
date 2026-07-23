import type { ReactNode } from 'react';
import { cn } from 'adysre';

/**
 * Centred title + subtitle used at the top of most landing sections. Extracted
 * so spacing and type scale stay identical across the page (Rule 3). Text is
 * always passed in already translated by the caller.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto max-w-2xl text-center', className)}>
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-widest text-primary">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}
