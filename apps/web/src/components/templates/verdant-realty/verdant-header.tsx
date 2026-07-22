'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { VERDANT_UI, type VerdantPageId } from '@/data/templates/verdant-realty-content';

/**
 * VERDANT - the shared header, on all four pages.
 *
 * Navigation is plain `?page=` links, so a multipage template needs neither a
 * router nor a link component: the preview route reads the query string and
 * hands the id back in, and a downloaded copy behaves identically.
 *
 * The current page is derived from that href rather than stored twice, which
 * keeps `nav` a list of links and nothing more.
 */
function pageIdOf(href: string): string {
  return href.startsWith('?page=') ? href.slice('?page='.length) : href;
}

export function VerdantHeader({ content, page }: { content: TemplateContent; page: VerdantPageId }) {
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
          ? 'border-b border-[var(--verdant-rule)] bg-[var(--verdant-sand)]/90 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <a
        href="#verdant-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-full focus:bg-[var(--verdant-forest)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--verdant-on-forest)]"
      >
        {VERDANT_UI.skipToContent}
      </a>

      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <a href="?page=home" className="flex items-center gap-3">
          <span
            className="h-7 w-7 rounded-full border-2 border-[var(--verdant-brass)] bg-[var(--verdant-forest)]"
            aria-hidden
          />
          <span className="text-lg font-semibold uppercase tracking-[0.22em]">{content.brand}</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {content.nav.map((link) => {
            const current = pageIdOf(link.href) === page;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={current ? 'page' : undefined}
                className={`text-sm transition-colors hover:text-[var(--verdant-brass)] ${
                  current
                    ? 'text-[var(--verdant-ink)] underline decoration-[var(--verdant-brass)] decoration-2 underline-offset-8'
                    : 'text-[var(--verdant-ink-soft)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={VERDANT_UI.headerCtaHref}
            className="hidden rounded-full bg-[var(--verdant-forest)] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--verdant-on-forest)] transition-colors hover:bg-[var(--verdant-brass)] hover:text-[var(--verdant-forest)] sm:inline-block"
          >
            {VERDANT_UI.headerCta}
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="verdant-mobile-nav"
            aria-label={open ? VERDANT_UI.closeMenu : VERDANT_UI.openMenu}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--verdant-rule-strong)] md:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="verdant-mobile-nav"
          className="border-t border-[var(--verdant-rule)] bg-[var(--verdant-sand)] md:hidden"
        >
          <nav aria-label="Main" className="mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8">
            {content.nav.map((link) => {
              const current = pageIdOf(link.href) === page;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={current ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-sm transition-colors hover:text-[var(--verdant-brass)] ${
                    current ? 'text-[var(--verdant-ink)]' : 'text-[var(--verdant-ink-soft)]'
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
