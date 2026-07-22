'use client';

import type { TemplateContent } from '@/data/templates/types';
import { NORTHGATE_COMPLIANCE } from '@/data/templates/northgate-pay-content';
import { northgateHref } from './northgate-links';

/**
 * NORTHGATE - shared footer.
 *
 * Deep ground, so every page closes on the inverted end of the palette. The
 * compliance marks repeat here because in payments the licence line is the
 * thing a prospective merchant scrolls to the bottom to check, and the legal
 * paragraph carries the FCA reference for the same reason.
 */
export function NorthgateFooter({ content }: { content: TemplateContent }) {
  const { footer, brand } = content;

  return (
    <footer className="ngp-on-deep bg-[var(--ngp-deep)] text-[var(--ngp-on-deep)]">
      <span className="ngp-rule-grad" aria-hidden />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <a
              href={northgateHref('home')}
              className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
            >
              <span
                aria-hidden
                className="h-6 w-6 rounded-[8px] bg-[linear-gradient(120deg,var(--ngp-indigo-bright),var(--ngp-cyan-bright))]"
              />
              <span className="ngp-display text-[17px]">{brand}</span>
            </a>
            <p className="mt-6 max-w-sm text-[13.5px] leading-[1.8] text-[var(--ngp-on-deep-soft)]">
              {footer.tagline}
            </p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {NORTHGATE_COMPLIANCE.map((badge) => (
                <li
                  key={badge.code}
                  className="ngp-mono rounded-full border border-[var(--ngp-deep-rule)] px-3 py-1.5 text-[10.5px] tracking-[0.16em] text-[var(--ngp-on-deep-faint)]"
                >
                  {badge.code}
                </li>
              ))}
            </ul>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="ngp-eyebrow ngp-eyebrow-invert">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    {/* Placeholder destinations: the download owner points these
                        at their own routes, so they resolve rather than dangle. */}
                    <a
                      href={northgateHref('products')}
                      className="text-[13.5px] text-[var(--ngp-on-deep-soft)] transition-colors hover:text-[var(--ngp-cyan-bright)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="ngp-mono mt-14 border-t border-[var(--ngp-deep-rule)] pt-6 text-[11px] leading-[1.9] text-[var(--ngp-on-deep-faint)]">
          {footer.legal}
        </p>
      </div>
    </footer>
  );
}
