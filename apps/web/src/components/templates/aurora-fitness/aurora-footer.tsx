'use client';

import type { TemplateContent } from '@/data/templates/types';

/**
 * AURORA - footer. The wordmark is set as an oversized condensed slab that
 * fills the column width (`text-[18vw]`), which is the template's last piece of
 * kinetic type before the legal rule closes the page.
 */
export function AuroraFooter({ content }: { content: TemplateContent }) {
  const { footer, brand } = content;

  return (
    <footer className="border-t-2 border-[var(--aurora-line)] bg-[var(--aurora-surface)]">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <p className="aurora-display text-6xl leading-none text-[var(--aurora-acid)] sm:text-7xl">
              {brand}
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--aurora-muted)]">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="aurora-tag border-b-2 border-[var(--aurora-line)] pb-3 text-[10px] text-[var(--aurora-faint)]">
                {column.title}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm text-[var(--aurora-muted)] transition-colors hover:text-[var(--aurora-acid)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t-2 border-[var(--aurora-line)] pt-6">
          <p className="aurora-tag text-[10px] leading-relaxed text-[var(--aurora-faint)]">{footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
