'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import {
  HALCYON_LABELS,
  HALCYON_NAV,
  type HalcyonPageId,
} from '@/data/templates/halcyon-ai-content';

/**
 * HALCYON - the site header.
 *
 * A glass bar that only becomes glass once the page has scrolled: over the hero
 * it is transparent, so the mesh reads as one continuous field from the top of
 * the viewport. Frosting it immediately would put a seam across the fold.
 *
 * Navigation is `?page=` rather than a route, because the template has to render
 * anywhere - a preview iframe, a card thumbnail, a downloaded project - without
 * bringing a router with it.
 */
export function HalcyonHeader({ page }: { page: HalcyonPageId }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A page change closes the menu; leaving it open over new content is a trap
  // on mobile, where the panel covers the thing you just navigated to.
  useEffect(() => setOpen(false), [page]);

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-colors duration-500',
        scrolled ? 'hal-glass border-x-0 border-t-0 !rounded-none' : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <a
          href="?page=home"
          className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="h-7 w-7 rounded-lg bg-[linear-gradient(135deg,var(--hal-violet),var(--hal-cyan))]"
          />
          Halcyon
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {HALCYON_NAV.map((item) => {
            const current = item.id === page;
            return (
              <a
                key={item.id}
                href={`?page=${item.id}`}
                aria-current={current ? 'page' : undefined}
                className={[
                  'rounded-full px-4 py-2 text-[13.5px] transition-colors',
                  current
                    ? 'bg-[var(--hal-glass-strong)] text-[var(--hal-ink)]'
                    : 'text-[var(--hal-ink-faint)] hover:text-[var(--hal-ink)]',
                ].join(' ')}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="?page=contact" className="text-[13.5px] text-[var(--hal-ink-soft)] hover:text-[var(--hal-ink)]">
            Sign in
          </a>
          <a
            href="?page=pricing"
            className="rounded-full bg-[var(--hal-ink)] px-4 py-2 text-[13.5px] font-medium text-[var(--hal-bg)] transition-opacity hover:opacity-90"
          >
            Start building
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="hal-mobile-nav"
          aria-label={open ? HALCYON_LABELS.close : HALCYON_LABELS.menu}
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav
          id="hal-mobile-nav"
          aria-label="Primary"
          className="hal-glass mx-4 mb-4 !rounded-2xl p-2 md:hidden"
        >
          {HALCYON_NAV.map((item) => (
            <a
              key={item.id}
              href={`?page=${item.id}`}
              aria-current={item.id === page ? 'page' : undefined}
              className={[
                'block rounded-xl px-4 py-3 text-[15px]',
                item.id === page ? 'bg-[var(--hal-glass-strong)]' : 'text-[var(--hal-ink-soft)]',
              ].join(' ')}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
