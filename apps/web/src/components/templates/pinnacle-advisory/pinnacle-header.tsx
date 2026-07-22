'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { PINNACLE_LABELS, type PinnaclePageId } from '@/data/templates/pinnacle-advisory-content';
import { pinnacleHref } from './pinnacle-links';

/**
 * PINNACLE - shared header.
 *
 * Navigation is by query string (`?page=expertise`) rather than by anchor,
 * because PINNACLE is a multipage template and the preview route mounts it
 * without a router: the template reads the page itself and swaps its sections,
 * so a plain `<a>` is enough to move between pages in any host.
 *
 * The bar is a floating pill rather than a full-width band - it is the first
 * place the 999px radius appears, and it sets the geometry for everything below.
 */
export function PinnacleHeader({
  content,
  page,
}: {
  content: TemplateContent;
  page: PinnaclePageId;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The Home entry is chrome rather than content, so it is assembled here from
  // the shared label set instead of padding the template's `nav` array.
  const links = [{ href: pinnacleHref('home'), label: PINNACLE_LABELS.home }, ...content.nav];
  const currentHref = pinnacleHref(page);

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6 sm:pt-6">
      <div
        className={`mx-auto flex h-16 max-w-[80rem] items-center justify-between gap-6 rounded-[var(--pin-r-pill)] border px-5 backdrop-blur-md transition-all duration-500 sm:px-7 ${
          scrolled
            ? 'border-[var(--pin-line-strong)] bg-[var(--pin-sand)]/88 shadow-[0_18px_44px_-30px_rgb(20_20_19/0.55)]'
            : 'border-transparent bg-[var(--pin-sand)]/55'
        }`}
      >
        <a
          href={pinnacleHref('home')}
          className="flex items-center gap-2.5 text-[1.0625rem] font-[600] tracking-[-0.02em]"
        >
          {/* The wordmark's only ornament: a small brand disc, drawn not drawn-on. */}
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full bg-[var(--pin-brand)]"
          />
          {content.brand}
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const current = link.href === currentHref;
            return (
              <a
                key={link.href}
                href={link.href}
                // Spread conditionally: `exactOptionalPropertyTypes` refuses an
                // explicit `undefined` on an optional prop.
                {...(current ? { 'aria-current': 'page' as const } : {})}
                className={`pin-navlink relative inline-flex min-h-11 items-center rounded-[var(--pin-r-pill)] px-[0.9rem] text-[0.9375rem] transition-colors duration-300 ${
                  current ? 'text-[var(--pin-text)]' : 'text-[var(--pin-text-muted)] hover:text-[var(--pin-text)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={pinnacleHref('contact')}
            className="pin-btn pin-btn-primary hidden lg:inline-flex"
          >
            {PINNACLE_LABELS.headerCta}
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="pinnacle-mobile-nav"
            aria-label={open ? PINNACLE_LABELS.menuClose : PINNACLE_LABELS.menuOpen}
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-[var(--pin-r-pill)] border border-[var(--pin-line-strong)] lg:hidden"
          >
            {open ? <X className="h-4.5 w-4.5" aria-hidden /> : <Menu className="h-4.5 w-4.5" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="pinnacle-mobile-nav"
          aria-label="Main"
          className="mx-auto mt-3 flex max-w-[80rem] flex-col rounded-[var(--pin-r-md)] border border-[var(--pin-line-strong)] bg-[var(--pin-sand)] p-3 shadow-[0_24px_60px_-34px_rgb(20_20_19/0.5)] lg:hidden"
        >
          {links.map((link) => {
            const current = link.href === currentHref;
            return (
              <a
                key={link.href}
                href={link.href}
                {...(current ? { 'aria-current': 'page' as const } : {})}
                onClick={() => setOpen(false)}
                className={`rounded-[var(--pin-r-sm)] px-4 py-3.5 text-[0.9375rem] ${
                  current
                    ? 'bg-[var(--pin-brand-wash)] text-[var(--pin-brand-ink)]'
                    : 'text-[var(--pin-text-soft)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href={pinnacleHref('contact')}
            onClick={() => setOpen(false)}
            className="pin-btn pin-btn-primary mt-2 inline-flex w-full"
          >
            {PINNACLE_LABELS.headerCta}
          </a>
        </nav>
      )}
    </header>
  );
}
