'use client';

import { useEffect, useState } from 'react';
import type { TemplateContent } from '@/data/templates/types';

/**
 * ATELIER NORD - header.
 *
 * No hamburger, no drawer, no call-to-action button. Five tiny uppercase links
 * wrap onto a second line on narrow screens instead of hiding behind a toggle:
 * a five-item index is shorter than the menu that would conceal it, and the
 * template stays free of chrome copy it would otherwise have to hardcode.
 *
 * The bottom hairline appears only once the page has moved, so the header does
 * not draw a line across the hero on load.
 */
export function AtelierHeader({ content }: { content: TemplateContent }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[var(--atelier-paper)]/90 backdrop-blur-sm transition-colors duration-500 ${
        scrolled ? 'border-b border-[var(--atelier-rule)]' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-10 gap-y-4 px-6 py-6 sm:px-10 sm:py-7">
        <a
          href="#top"
          className="atelier-label text-[var(--atelier-ink)] transition-opacity hover:opacity-60"
        >
          {content.brand}
        </a>

        <nav aria-label="Main">
          <ul className="flex flex-wrap items-baseline gap-x-7 gap-y-3 sm:gap-x-10">
            {content.nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="atelier-label transition-colors duration-300 hover:text-[var(--atelier-ink)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
