'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { KITE_UI, type KitePageId } from '@/data/templates/kite-studio-content';

/**
 * KITE - the shared header, on all five pages.
 *
 * Navigation is plain `?page=` links, so a multipage template needs neither a
 * router nor a link component: the preview route reads the query string and
 * hands the id back in, and a downloaded copy behaves identically.
 *
 * The current page is derived from the href rather than stored twice, which
 * keeps `nav` a list of links and nothing more.
 */
function pageIdOf(href: string): string {
  return href.startsWith('?page=') ? href.slice('?page='.length) : href;
}

export function KiteHeader({ content, page }: { content: TemplateContent; page: KitePageId }) {
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
      className={`sticky top-0 z-50 w-full transition-colors duration-500 ${
        scrolled
          ? 'border-b border-[var(--kite-line)] bg-[var(--kite-void)]/85 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <a
        href="#kite-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-full focus:bg-[var(--kite-acid)] focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--kite-void)]"
      >
        {KITE_UI.skipToContent}
      </a>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-5 sm:px-8">
        <a href="?page=home" className="flex items-center gap-3">
          {/* The mark: a kite, drawn as one rotated gradient square. */}
          <span
            className="kite-pill-hot h-6 w-6 rotate-45 rounded-[7px]"
            aria-hidden
          />
          <span className="text-xl font-bold tracking-[-0.04em]">{content.brand}</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {content.nav.map((link) => {
            const current = pageIdOf(link.href) === page;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={current ? 'page' : undefined}
                className={`text-sm font-medium transition-colors hover:text-[var(--kite-acid)] ${
                  current
                    ? 'text-[var(--kite-paper)] underline decoration-[var(--kite-acid)] decoration-2 underline-offset-[10px]'
                    : 'text-[var(--kite-paper-faint)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={KITE_UI.headerCtaHref}
            className="kite-pill-hot hidden rounded-full px-6 py-2.5 text-sm font-semibold sm:inline-block"
          >
            {KITE_UI.headerCta}
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="kite-mobile-nav"
            aria-label={open ? KITE_UI.closeMenu : KITE_UI.openMenu}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--kite-line-strong)] lg:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="kite-mobile-nav"
          className="border-t border-[var(--kite-line)] bg-[var(--kite-void)] lg:hidden"
        >
          <nav aria-label="Main" className="mx-auto flex max-w-7xl flex-col px-5 py-4 sm:px-8">
            {content.nav.map((link) => {
              const current = pageIdOf(link.href) === page;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={current ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-lg font-semibold tracking-[-0.02em] transition-colors hover:text-[var(--kite-acid)] ${
                    current ? 'text-[var(--kite-paper)]' : 'text-[var(--kite-paper-faint)]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
