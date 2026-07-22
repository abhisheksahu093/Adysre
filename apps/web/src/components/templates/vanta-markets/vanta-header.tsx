'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { VANTA_UI, type VantaPageId } from '@/data/templates/vanta-markets-content';

/**
 * VANTA - the shared header, on all five pages.
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

export function VantaHeader({ content, page }: { content: TemplateContent; page: VantaPageId }) {
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
          ? 'border-b border-[var(--vanta-line)] bg-[var(--vanta-ink)]/85 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <a
        href="#vanta-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-full focus:bg-[var(--vanta-brand)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--vanta-ink)]"
      >
        {VANTA_UI.skipToContent}
      </a>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-5 sm:px-8">
        <a href="?page=home" className="flex items-center gap-3">
          {/* The mark: a violet lozenge with a hairline inner rule. No asset. */}
          <span
            className="grid h-8 w-8 place-items-center rounded-[10px] border border-[var(--vanta-brand)] bg-[var(--vanta-brand-soft)]"
            aria-hidden
          >
            <span className="h-3 w-[2px] rounded-full bg-[var(--vanta-brand)]" />
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.02em]">{content.brand}</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {content.nav.map((link) => {
            const current = pageIdOf(link.href) === page;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={current ? 'page' : undefined}
                className={`text-sm transition-colors hover:text-[var(--vanta-text)] ${
                  current
                    ? 'text-[var(--vanta-text)] underline decoration-[var(--vanta-brand)] decoration-2 underline-offset-[10px]'
                    : 'text-[var(--vanta-faint)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={VANTA_UI.headerCtaHref}
            className="hidden rounded-full bg-[var(--vanta-brand)] px-5 py-2.5 text-[13px] font-semibold text-[var(--vanta-ink)] transition-transform hover:-translate-y-0.5 sm:inline-block"
          >
            {VANTA_UI.headerCta}
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="vanta-mobile-nav"
            aria-label={open ? VANTA_UI.closeMenu : VANTA_UI.openMenu}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--vanta-line-strong)] text-[var(--vanta-text)] lg:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="vanta-mobile-nav"
          className="border-t border-[var(--vanta-line)] bg-[var(--vanta-ink)] lg:hidden"
        >
          <nav aria-label="Main" className="mx-auto flex max-w-7xl flex-col px-5 py-3 sm:px-8">
            {content.nav.map((link) => {
              const current = pageIdOf(link.href) === page;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={current ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={`border-b border-[var(--vanta-line)] py-4 text-sm last:border-b-0 ${
                    current ? 'text-[var(--vanta-text)]' : 'text-[var(--vanta-faint)]'
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
