'use client';

import type { TemplateContent } from '@/data/templates/types';
import { CADENCE_UI } from '@/data/templates/cadence-academy-content';

/**
 * CADENCE - the shared footer, on all five pages.
 *
 * An aubergine block closing a cream document, with the top corners rounded to
 * the largest radius so the page ends on the same shape it is built from.
 */
export function CadenceFooter({ content }: { content: TemplateContent }) {
  const { footer, brand, nav } = content;

  return (
    <footer className="bg-[var(--cad-cream)] px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="rounded-[var(--cad-radius-xl)] bg-[var(--cad-ink-deep)] text-[var(--cad-on-ink)]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="grid h-9 w-9 place-items-center rounded-[var(--cad-radius-pill)] bg-[var(--cad-lime)]"
                  aria-hidden
                >
                  <span className="h-3 w-3 rounded-[var(--cad-radius-pill)] bg-[var(--cad-ink-deep)]" />
                </span>
                <span className="text-xl font-bold tracking-[-0.02em]">{brand}</span>
              </div>
              <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-[var(--cad-on-ink-soft)]">
                {footer.tagline}
              </p>

              {/*
               * The footer repeats the page nav, because on a multipage site the
               * bottom of a long catalogue is exactly where a visitor looks next.
               */}
              <nav aria-label="Footer" className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {nav.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-semibold text-[var(--cad-on-ink-faint)] transition-colors hover:text-[var(--cad-lime)]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {footer.columns.map((column) => (
              <div key={column.title}>
                <p className="cad-eyebrow-inverse">{column.title}</p>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href={CADENCE_UI.headerCtaHref}
                        className="text-[15px] text-[var(--cad-on-ink-soft)] transition-colors hover:text-[var(--cad-lime)]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-[var(--cad-rule-inverse)] pt-6">
            <p className="text-[13px] text-[var(--cad-on-ink-faint)]">{footer.legal}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
