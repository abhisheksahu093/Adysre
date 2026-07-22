'use client';

import type { TemplateContent } from '@/data/templates/types';
import { PINNACLE_OFFICES } from '@/data/templates/pinnacle-advisory-content';
import { pinnacleHref } from './pinnacle-links';

/**
 * PINNACLE - shared footer.
 *
 * Ink, so the page closes on the same weight the results band opened with, and
 * rounded at the top corners so the sand above appears to sit on it rather than
 * abut it. The office cities repeat here because a footer is where a reader
 * looks for them.
 */
export function PinnacleFooter({ content }: { content: TemplateContent }) {
  const { footer, brand } = content;

  return (
    <footer className="pin-invert bg-[var(--pin-sand)] px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-[80rem] rounded-[var(--pin-r-xl)] bg-[var(--pin-ink)] px-7 py-14 text-[var(--pin-on-ink)] sm:px-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-10">
          <div>
            <a
              href={pinnacleHref('home')}
              className="flex items-center gap-2.5 text-[1.0625rem] font-[600] tracking-[-0.02em]"
            >
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[var(--pin-brand-bright)]" />
              {brand}
            </a>

            <p className="mt-6 max-w-sm text-[0.9375rem] leading-[1.62] text-[var(--pin-on-ink-soft)]">
              {footer.tagline}
            </p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {PINNACLE_OFFICES.map((office) => (
                <li key={office.city} className="pin-tag pin-tag-invert">
                  {office.city}
                </li>
              ))}
            </ul>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="pin-eyebrow pin-eyebrow-invert">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    {/* Placeholder destinations: the download owner points these at
                        their own routes, so every link resolves rather than dangles. */}
                    <a
                      href={pinnacleHref('expertise')}
                      className="text-[0.9375rem] leading-relaxed text-[var(--pin-on-ink-soft)] transition-colors duration-300 hover:text-[var(--pin-brand-bright)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-14 border-t border-[var(--pin-ink-line)] pt-7 text-[0.8125rem] text-[var(--pin-on-ink-faint)]">
          {footer.legal}
        </p>
      </div>
    </footer>
  );
}
