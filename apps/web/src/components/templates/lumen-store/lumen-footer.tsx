'use client';

import { lumenHref, type LumenShopCopy } from '@/data/templates/lumen-store-content';
import type { TemplateContent } from '@/data/templates/types';

/**
 * LUMEN - the shared footer.
 *
 * Wordmark, tagline, three link columns and the legal rule. The demo notice sits
 * here rather than only on checkout so that a visitor landing on any page of the
 * store is told, once, that it is a template.
 */
export function LumenFooter({ content, shop }: { content: TemplateContent; shop: LumenShopCopy }) {
  const { footer, brand } = content;

  return (
    <footer className="border-t border-[var(--lum-rule)] bg-[var(--lum-paper-2)]">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <p className="text-lg font-medium uppercase tracking-[0.34em]">{brand}</p>
            <p className="mt-5 max-w-xs text-[15px] leading-[1.75] text-[var(--lum-ink-soft)]">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="lum-label">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    {/* Column links are copy, not routes - they all return to the
                        shop index, which is the one page that lists everything. */}
                    <a
                      href={lumenHref('shop')}
                      className="text-[15px] text-[var(--lum-ink-soft)] transition-colors hover:text-[var(--lum-accent-deep)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-[var(--lum-rule)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--lum-ink-faint)]">{footer.legal}</p>
          <p className="text-[12px] text-[var(--lum-ink-faint)]">{shop.common.demoNotice}</p>
        </div>
      </div>
    </footer>
  );
}
