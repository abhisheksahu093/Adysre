'use client';

import type { TemplateContent } from '@/data/templates/types';

/**
 * VERDANT - the shared footer, on all four pages. Forest block closing a sand
 * document, with the brand column beside three link columns.
 */
export function VerdantFooter({ content }: { content: TemplateContent }) {
  const { footer, brand, nav } = content;

  return (
    <footer className="bg-[var(--verdant-forest-deep)] text-[var(--verdant-on-forest)]">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <span
                className="h-7 w-7 rounded-full border-2 border-[var(--verdant-brass)]"
                aria-hidden
              />
              <span className="text-lg font-semibold uppercase tracking-[0.22em]">{brand}</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--verdant-on-forest-soft)]">
              {footer.tagline}
            </p>

            {/*
             * The footer repeats the page nav, because on a multipage site the
             * bottom of a long listings grid is where a visitor looks next.
             */}
            <nav aria-label="Footer" className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
              {nav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.18em] text-[var(--verdant-on-forest-faint)] transition-colors hover:text-[var(--verdant-brass)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="verdant-eyebrow">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="?page=contact"
                      className="text-sm text-[var(--verdant-on-forest-soft)] transition-colors hover:text-[var(--verdant-brass)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-[var(--verdant-rule-inverse)] pt-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--verdant-on-forest-faint)]">
            {footer.legal}
          </p>
        </div>
      </div>
    </footer>
  );
}
