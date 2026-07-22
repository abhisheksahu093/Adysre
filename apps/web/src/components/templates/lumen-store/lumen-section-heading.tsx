'use client';

import type { ReactNode } from 'react';
import { Reveal } from './lumen-reveal';

/**
 * LUMEN - the heading block every section opens with.
 *
 * Eyebrow, self-drawing amber rule, title, optional subtitle. Extracted because
 * nine sections and five pages need exactly this rhythm, and a heading that is
 * copied nine times is a heading that will be nine different sizes by the third
 * revision (Rule 3).
 *
 * `id` is optional on purpose: page headings own the document's `h1`/`h2` anchor,
 * but a summary block inside a page does not want an anchor at all.
 */
export function LumenSectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'start',
  as = 'h2',
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
  as?: 'h1' | 'h2';
  children?: ReactNode;
}) {
  const Title = as;
  const centered = align === 'center';

  return (
    <Reveal className={centered ? 'flex flex-col items-center text-center' : ''}>
      <p className="lum-eyebrow">{eyebrow}</p>
      <span className="lum-underline mt-4" aria-hidden />
      <Title className="mt-6 max-w-3xl text-balance text-[34px] font-medium leading-[1.14] tracking-[-0.02em] sm:text-[44px]">
        {title}
      </Title>
      {subtitle !== undefined && (
        <p className="mt-5 max-w-2xl text-pretty text-[17px] leading-[1.75] text-[var(--lum-ink-soft)]">
          {subtitle}
        </p>
      )}
      {children}
    </Reveal>
  );
}
