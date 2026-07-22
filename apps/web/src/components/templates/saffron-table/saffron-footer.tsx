'use client';

import type { TemplateContent } from '@/data/templates/types';

/** SAFFRON - footer: wordmark and tagline, three link columns, a legal rule. */
export function SaffronFooter({ content }: { content: TemplateContent }) {
  const { footer, brand } = content;

  return (
    <footer className="border-t border-[var(--saf-rule)] bg-[var(--saf-paper-2)]">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="text-xl uppercase tracking-[0.24em]">{brand}</p>
            <p className="mt-5 max-w-xs text-[15px] leading-[1.8] text-[var(--saf-ink-soft)]">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--saf-ink-faint)]">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-[15px] text-[var(--saf-ink-soft)] transition-colors hover:text-[var(--saf-accent)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-[var(--saf-rule)] pt-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--saf-ink-faint)]">
            {footer.legal}
          </p>
        </div>
      </div>
    </footer>
  );
}
