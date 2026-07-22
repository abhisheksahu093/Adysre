'use client';

import type { TemplateContent } from '@/data/templates/types';

/** PULSE - footer: brand column, three link columns, and the registration line. */
export function PulseFooter({ content }: { content: TemplateContent }) {
  const { footer, brand } = content;

  return (
    <footer className="border-t border-[var(--pulse-line)] bg-[var(--pulse-surface)]">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--pulse-accent)] text-base font-bold text-[var(--pulse-on-accent)]">
                {brand.charAt(0)}
              </span>
              <span className="text-lg font-semibold tracking-[-0.01em]">{brand}</span>
            </div>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-[var(--pulse-ink-soft)]">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="text-[13px] font-semibold">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-[15px] text-[var(--pulse-ink-soft)] transition-colors hover:text-[var(--pulse-accent)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-[var(--pulse-line)] pt-6">
          <p className="text-[13px] text-[var(--pulse-ink-faint)]">{footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
