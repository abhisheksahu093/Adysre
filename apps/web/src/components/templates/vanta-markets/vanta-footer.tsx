'use client';

import type { TemplateContent } from '@/data/templates/types';
import { VANTA_FOOTER_EXTRAS, VANTA_UI } from '@/data/templates/vanta-markets-content';

/**
 * VANTA - the shared footer, on all five pages.
 *
 * Carries three obligations, not one: the link columns, the entity and
 * regulator line, and - because this template imitates the surface of a broker
 * - a plainly visible statement that it is a design artifact and not advice.
 * That disclaimer is deliberately above the legal line and not in small print.
 */
export function VantaFooter({ content }: { content: TemplateContent }) {
  const { footer, brand, nav } = content;

  return (
    <footer className="border-t border-[var(--vanta-line)] bg-[var(--vanta-ink-deep)]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <span
                className="grid h-8 w-8 place-items-center rounded-[10px] border border-[var(--vanta-brand)] bg-[var(--vanta-brand-soft)]"
                aria-hidden
              >
                <span className="h-3 w-[2px] rounded-full bg-[var(--vanta-brand)]" />
              </span>
              <span className="text-[17px] font-semibold tracking-[-0.02em]">{brand}</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--vanta-muted)]">
              {footer.tagline}
            </p>

            {/*
             * The footer repeats the page nav, because on a multipage site the
             * bottom of a long instrument board is where a visitor looks next.
             */}
            <nav aria-label="Footer" className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
              {nav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="vanta-label transition-colors hover:text-[var(--vanta-brand)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="vanta-eyebrow">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="?page=contact"
                      className="text-sm text-[var(--vanta-muted)] transition-colors hover:text-[var(--vanta-text)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 border-t border-[var(--vanta-line)] pt-8 lg:grid-cols-2">
          <div className="rounded-[var(--vanta-radius-sm)] border border-[var(--vanta-line-strong)] p-5">
            <p className="vanta-label">{VANTA_FOOTER_EXTRAS.disclaimerLabel}</p>
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--vanta-muted)]">
              {VANTA_UI.disclaimer}
            </p>
          </div>
          <div className="rounded-[var(--vanta-radius-sm)] border border-[var(--vanta-line-strong)] p-5">
            <p className="vanta-label">{VANTA_FOOTER_EXTRAS.riskLabel}</p>
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--vanta-muted)]">
              {VANTA_UI.riskLine}
            </p>
          </div>
        </div>

        <p className="mt-8 text-[12px] leading-relaxed text-[var(--vanta-faint)]">{footer.legal}</p>
      </div>
    </footer>
  );
}
