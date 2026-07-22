'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';

/**
 * AURORA - header. A hard 2px rule sits under it the moment the page moves, so
 * the nav reads as a fixed bar bolted to the wall rather than a floating shelf.
 *
 * The CTA reuses `hero.ctaPrimary` rather than inventing a label: the offer is
 * one thing, and a section must never own copy the content module could.
 */
export function AuroraHeader({ content }: { content: TemplateContent }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? 'border-b-2 border-[var(--aurora-line)] bg-[var(--aurora-bg)]/92 backdrop-blur-md'
          : 'border-b-2 border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:h-[72px] sm:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="aurora-display grid h-8 w-8 place-items-center bg-[var(--aurora-acid)] text-lg text-[var(--aurora-on-acid)]">
            {content.brand.slice(0, 1)}
          </span>
          <span className="aurora-display text-2xl tracking-[0.04em]">{content.brand}</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {content.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="aurora-tag text-[11px] text-[var(--aurora-faint)] transition-colors hover:text-[var(--aurora-acid)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="aurora-tag hidden bg-[var(--aurora-acid)] px-5 py-3 text-[11px] text-[var(--aurora-on-acid)] transition-colors hover:bg-[var(--aurora-text)] sm:inline-block"
          >
            {content.hero.ctaPrimary}
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="aurora-mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center border-2 border-[var(--aurora-line-strong)] md:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="aurora-mobile-nav"
          className="border-t-2 border-[var(--aurora-line)] bg-[var(--aurora-bg)] md:hidden"
        >
          <nav aria-label="Main" className="mx-auto flex max-w-6xl flex-col px-5 py-2 sm:px-8">
            {content.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="aurora-display border-b border-[var(--aurora-line)] py-4 text-2xl text-[var(--aurora-muted)] transition-colors hover:text-[var(--aurora-acid)]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="aurora-tag mt-4 bg-[var(--aurora-acid)] px-5 py-4 text-center text-[11px] text-[var(--aurora-on-acid)]"
            >
              {content.hero.ctaPrimary}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
