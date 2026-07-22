'use client';

import {
  lumiereHref,
  type LumierePageId,
  type LumiereSalonCopy,
} from '@/data/templates/lumiere-salon-content';
import type { TemplateContent } from '@/data/templates/types';
import { LumiereHairline } from './lumiere-hairline';

/**
 * LUMIERE - the shared footer.
 *
 * Wordmark, tagline, three link columns and the legal rule. The demo notice sits
 * here rather than only on the booking page, so a visitor landing anywhere in the
 * salon is told once that it is a template and that no appointment is held.
 *
 * Column links are copy rather than routes, so each column points at the page it
 * describes instead of pretending to twelve destinations that do not exist.
 */
const COLUMN_TARGETS: LumierePageId[] = ['services', 'shop', 'contact'];

export function LumiereFooter({
  content,
  salon,
}: {
  content: TemplateContent;
  salon: LumiereSalonCopy;
}) {
  const { footer, brand } = content;

  return (
    <footer className="lumi-band mt-24">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <LumiereHairline className="mx-auto mb-16 w-52" />

        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div>
            <p className="font-[family-name:var(--lumi-serif)] text-[30px] tracking-[0.08em]">
              {brand}
            </p>
            <p className="mt-5 max-w-xs text-[15px] leading-[1.8] text-[var(--lumi-ink-soft)]">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((column, index) => (
            <div key={column.title}>
              <p className="lumi-label">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href={lumiereHref(COLUMN_TARGETS[index] ?? 'home')}
                      className="text-[15px] text-[var(--lumi-ink-soft)] transition-colors hover:text-[var(--lumi-accent-deep)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 pt-8 shadow-[inset_0_1px_0_var(--lumi-rule)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--lumi-ink-faint)]">{footer.legal}</p>
          <p className="text-[12px] text-[var(--lumi-ink-faint)]">{salon.common.demoNotice}</p>
        </div>
      </div>
    </footer>
  );
}
