'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { CADENCE_UI, type CadencePageId } from '@/data/templates/cadence-academy-content';

/**
 * CADENCE - the shared header, on all five pages.
 *
 * Navigation is plain `?page=` links, so a multipage template needs neither a
 * router nor a link component: the preview route reads the query string and
 * hands the id back in, and a downloaded copy behaves identically.
 *
 * The current page is derived from the href rather than stored twice, which
 * keeps `nav` a list of links and nothing more. `course` is a detail view with
 * no nav item, so on that page no link is marked current - `aria-current="page"`
 * has to mean this link is this page, and marking Courses would be a small lie
 * told to exactly the users who can least afford one.
 */
function pageIdOf(href: string): string {
  return href.startsWith('?page=') ? href.slice('?page='.length) : href;
}

export function CadenceHeader({
  content,
  page,
}: {
  content: TemplateContent;
  page: CadencePageId;
}) {
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
        scrolled ? 'bg-[var(--cad-cream)]/90 backdrop-blur-md' : ''
      }`}
    >
      <a
        href="#cadence-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-[var(--cad-radius-pill)] focus:bg-[var(--cad-ink)] focus:px-5 focus:py-2.5 focus:text-sm focus:text-[var(--cad-on-ink)]"
      >
        {CADENCE_UI.skipToContent}
      </a>

      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <a href="?page=home" className="flex items-center gap-3">
          {/* The mark: a violet disc with a lime beat cut out of it. */}
          <span
            className="grid h-9 w-9 place-items-center rounded-[var(--cad-radius-pill)] bg-[var(--cad-violet)]"
            aria-hidden
          >
            <span className="h-3 w-3 rounded-[var(--cad-radius-pill)] bg-[var(--cad-lime)]" />
          </span>
          <span className="text-xl font-bold tracking-[-0.02em]">{content.brand}</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {content.nav.map((link) => {
            const current = pageIdOf(link.href) === page;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={current ? 'page' : undefined}
                className={`text-[15px] font-semibold transition-colors hover:text-[var(--cad-violet)] ${
                  current
                    ? 'text-[var(--cad-ink)] underline decoration-[var(--cad-lime)] decoration-4 underline-offset-8'
                    : 'text-[var(--cad-ink-soft)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={CADENCE_UI.headerCtaHref}
            className="hidden rounded-[var(--cad-radius-pill)] bg-[var(--cad-ink)] px-6 py-3 text-sm font-semibold text-[var(--cad-on-ink)] transition-colors hover:bg-[var(--cad-violet)] sm:inline-block"
          >
            {CADENCE_UI.headerCta}
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="cadence-mobile-nav"
            aria-label={open ? CADENCE_UI.closeMenu : CADENCE_UI.openMenu}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-[var(--cad-radius-pill)] bg-[var(--cad-cream-warm)] text-[var(--cad-ink)] md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div id="cadence-mobile-nav" className="bg-[var(--cad-cream)] pb-4 md:hidden">
          <nav aria-label="Main" className="mx-auto flex max-w-6xl flex-col px-5 sm:px-8">
            {content.nav.map((link) => {
              const current = pageIdOf(link.href) === page;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={current ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={`rounded-[var(--cad-radius-sm)] px-4 py-3.5 text-base font-semibold transition-colors ${
                    current
                      ? 'bg-[var(--cad-cream-warm)] text-[var(--cad-ink)]'
                      : 'text-[var(--cad-ink-soft)]'
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
