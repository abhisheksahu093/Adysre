'use client';

import type { TemplateContent } from '@/data/templates/types';

/** NOVA - footer: brand column, three link columns, legal rule. */
export function NovaFooter({ content }: { content: TemplateContent }) {
  const { footer, brand } = content;

  return (
    <footer className="border-t border-[var(--nova-line)] bg-[var(--nova-surface)]/60">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-[var(--nova-accent)] to-[var(--nova-accent-2)] text-sm font-bold text-[var(--nova-bg)]">
                N
              </span>
              <span className="text-[15px] font-semibold tracking-tight">{brand}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--nova-muted)]">{footer.tagline}</p>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="nova-mono text-[10px] text-[var(--nova-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm text-[var(--nova-muted)] transition-colors hover:text-[var(--nova-text)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-[var(--nova-line)] pt-6">
          <p className="nova-mono text-[10px] text-[var(--nova-faint)]">{footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
