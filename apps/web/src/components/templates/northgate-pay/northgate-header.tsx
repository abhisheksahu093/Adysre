'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { NORTHGATE_LABELS, type NorthgatePageId } from '@/data/templates/northgate-pay-content';
import { northgateHref } from './northgate-links';

/**
 * NORTHGATE - shared header.
 *
 * Navigation is by query string (`?page=pricing`) rather than by anchor,
 * because NORTHGATE is a multipage template and the preview route mounts it
 * without a router: the template reads the page itself and swaps its sections,
 * so a plain `<a>` moves between pages in any host.
 *
 * The bar is a hairline over a blurred paper surface, and it gains a single
 * gradient rule once the page has scrolled - the only chrome that ever changes
 * state, because a technical product page should not be busy at the top.
 */
export function NorthgateHeader({
  content,
  page,
}: {
  content: TemplateContent;
  page: NorthgatePageId;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const homeHref = northgateHref('home');
  // Home is chrome rather than content, so it is assembled here from the shared
  // label set instead of padding the template's `nav` array.
  const links = [{ href: homeHref, label: NORTHGATE_LABELS.home }, ...content.nav];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-[var(--ngp-bg)]/85 backdrop-blur-xl transition-colors duration-300 ${
        scrolled ? 'border-[var(--ngp-rule)]' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <a
          href={homeHref}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
          aria-label={content.brand}
        >
          {/* The mark: a gradient square with a hairline notch. Drawn, never
              imported - the download carries no binary assets. */}
          <span
            aria-hidden
            className="h-6 w-6 rounded-[8px] bg-[linear-gradient(120deg,var(--ngp-indigo),var(--ngp-cyan))]"
          />
          <span className="ngp-display text-[17px]">{content.brand}</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const current = link.href === northgateHref(page);
            return (
              <a
                key={link.href}
                href={link.href}
                // Spread conditionally: `exactOptionalPropertyTypes` forbids
                // handing `undefined` to an optional attribute.
                {...(current ? { 'aria-current': 'page' as const } : {})}
                className={`rounded-full px-4 py-2 text-[13.5px] transition-colors ${
                  current
                    ? 'bg-[var(--ngp-accent-wash)] text-[var(--ngp-indigo-deep)]'
                    : 'text-[var(--ngp-ink-soft)] hover:text-[var(--ngp-ink)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={northgateHref('contact')}
            className="hidden rounded-full bg-[var(--ngp-ink)] px-5 py-2.5 text-[13px] text-[var(--ngp-bg)] transition-opacity hover:opacity-85 sm:inline-block"
          >
            {NORTHGATE_LABELS.headerCta}
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="northgate-mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--ngp-rule-strong)] md:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="northgate-mobile-nav"
          aria-label="Main"
          className="flex flex-col border-t border-[var(--ngp-rule)] bg-[var(--ngp-bg)] px-5 py-2 md:hidden"
        >
          {links.map((link) => {
            const current = link.href === northgateHref(page);
            return (
              <a
                key={link.href}
                href={link.href}
                {...(current ? { 'aria-current': 'page' as const } : {})}
                onClick={() => setOpen(false)}
                className={`border-b border-[var(--ngp-rule)] py-3.5 text-[15px] ${
                  current ? 'text-[var(--ngp-indigo-deep)]' : 'text-[var(--ngp-ink-soft)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href={northgateHref('contact')}
            onClick={() => setOpen(false)}
            className="my-4 rounded-full bg-[var(--ngp-ink)] py-3 text-center text-[13px] text-[var(--ngp-bg)]"
          >
            {NORTHGATE_LABELS.headerCta}
          </a>
        </nav>
      )}
    </header>
  );
}
