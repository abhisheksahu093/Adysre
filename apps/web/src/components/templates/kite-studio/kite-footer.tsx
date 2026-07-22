'use client';

import type { TemplateContent } from '@/data/templates/types';
import { KITE_UI } from '@/data/templates/kite-studio-content';

/**
 * KITE - the shared footer, on all five pages.
 *
 * Closes the document with the brand set at display size: on a site whose whole
 * argument is confidence, the last thing on the page should be the name rather
 * than a legal line.
 */
export function KiteFooter({ content }: { content: TemplateContent }) {
  const { footer, brand, nav } = content;

  return (
    <footer className="border-t border-[var(--kite-line)] bg-[var(--kite-void-deep)]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <span className="kite-pill-hot h-6 w-6 rotate-45 rounded-[7px]" aria-hidden />
              <span className="text-xl font-bold tracking-[-0.04em]">{brand}</span>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-[1.8] text-[var(--kite-paper-soft)]">
              {footer.tagline}
            </p>

            {/*
             * The footer repeats the page nav, because on a multipage site the
             * bottom of a long work grid is exactly where a visitor looks next.
             */}
            <nav aria-label="Footer" className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {nav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--kite-paper-faint)] transition-colors hover:text-[var(--kite-acid)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="kite-eyebrow">{column.title}</p>
              <ul className="mt-6 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href={KITE_UI.headerCtaHref}
                      className="text-sm text-[var(--kite-paper-soft)] transition-colors hover:text-[var(--kite-acid)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/*
         * The brand at display size, clipped to the footer's width. Decorative
         * repetition of the wordmark, so it is hidden from assistive tech.
         */}
        <div className="mt-16 overflow-hidden border-t border-[var(--kite-line)] pt-10">
          <p
            className="kite-display kite-gradient-text select-none text-[clamp(4rem,20vw,14rem)] leading-[0.8]"
            aria-hidden
          >
            {brand}
          </p>
        </div>

        <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-[var(--kite-paper-faint)]">
          {footer.legal}
        </p>
      </div>
    </footer>
  );
}
