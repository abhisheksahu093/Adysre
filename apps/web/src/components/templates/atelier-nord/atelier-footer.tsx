'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './atelier-reveal';

/**
 * ATELIER NORD - footer.
 *
 * The studio name is set very large here and nowhere else on the page: the
 * header states it at 10px, so the closing statement is the one moment the
 * identity is allowed any size at all.
 */
export function AtelierFooter({ content }: { content: TemplateContent }) {
  const { footer, brand } = content;

  return (
    <footer className="border-t border-[var(--atelier-rule)] bg-[var(--atelier-wash)]">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <Reveal>
          <p className="atelier-display text-[2.5rem] leading-none sm:text-7xl">{brand}</p>
          <p className="mt-10 max-w-md text-[15px] font-light leading-[1.9] text-[var(--atelier-ink-soft)]">
            {footer.tagline}
          </p>
        </Reveal>

        <div className="mt-20 grid gap-12 border-t border-[var(--atelier-rule)] pt-12 sm:grid-cols-3">
          {footer.columns.map((column, index) => (
            <Reveal key={column.title} delay={0.06 * index}>
              <p className="atelier-label">{column.title}</p>
              <ul className="mt-6 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-[15px] font-light text-[var(--atelier-ink-soft)] transition-colors duration-300 hover:text-[var(--atelier-ink)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <p className="atelier-label mt-20 border-t border-[var(--atelier-rule)] pt-8">{footer.legal}</p>
      </div>
    </footer>
  );
}
