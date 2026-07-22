'use client';

import type { ReactNode } from 'react';
import { Reveal } from './lumiere-reveal';

/**
 * LUMIERE - the heading block every section opens with.
 *
 * Eyebrow, self-drawing champagne rule, serif title, optional subtitle.
 * Extracted because seven pages and a dozen sections need exactly this rhythm,
 * and a heading copied a dozen times is a heading that will be a dozen different
 * sizes by the third revision (Rule 3).
 *
 * `id` is deliberately absent and `as` is a prop: a page masthead owns the
 * document's `h1`, while a section inside it must be an `h2` so the outline is
 * never skipped.
 */
export function LumiereSectionHeading({
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
      <p className="lumi-eyebrow">{eyebrow}</p>
      <span className="lumi-underline mt-4" aria-hidden />
      <Title className="lumi-title mt-6 max-w-3xl text-balance">{title}</Title>
      {subtitle !== undefined && (
        <p className="mt-5 max-w-2xl text-pretty text-[17px] leading-[1.8] text-[var(--lumi-ink-soft)]">
          {subtitle}
        </p>
      )}
      {children}
    </Reveal>
  );
}
