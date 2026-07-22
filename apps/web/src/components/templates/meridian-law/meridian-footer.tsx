'use client';

import type { TemplateContent } from '@/data/templates/types';
import { MERIDIAN_OFFICES } from '@/data/templates/meridian-law-content';
import { meridianHref } from './meridian-links';

/**
 * MERIDIAN - shared footer.
 *
 * Navy, so the page closes on the same authority it opened with, and ruled
 * rather than boxed: the columns are separated by hairlines only. The office
 * cities repeat here because a firm's footer is where correspondence details
 * are looked for.
 */
export function MeridianFooter({ content }: { content: TemplateContent }) {
  const { footer, brand } = content;

  return (
    <footer className="border-t border-[var(--mer-gold)] bg-[var(--mer-navy)] text-[var(--mer-on-navy)]">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <a
              href={meridianHref('home')}
              className="mer-display text-xl uppercase tracking-[0.34em] transition-colors hover:text-[var(--mer-gold-bright)]"
            >
              {brand}
            </a>
            <span className="mer-hairline mt-5" aria-hidden />
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-[var(--mer-on-navy-soft)]">
              {footer.tagline}
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {MERIDIAN_OFFICES.map((office) => (
                <li
                  key={office.city}
                  className="text-[11px] uppercase tracking-[0.2em] text-[var(--mer-on-navy-faint)]"
                >
                  {office.city}
                </li>
              ))}
            </ul>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="mer-eyebrow mer-eyebrow-invert">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    {/* Placeholder destinations: the download owner points these
                        at their own routes, so they resolve rather than dangle. */}
                    <a
                      href={meridianHref('practices')}
                      className="text-[13px] leading-relaxed text-[var(--mer-on-navy-soft)] transition-colors hover:text-[var(--mer-gold-bright)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-14 border-t border-[var(--mer-navy-rule)] pt-6 text-[11px] leading-relaxed tracking-[0.08em] text-[var(--mer-on-navy-faint)]">
          {footer.legal}
        </p>
      </div>
    </footer>
  );
}
