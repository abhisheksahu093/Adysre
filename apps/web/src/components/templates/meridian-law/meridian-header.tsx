'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { meridianHref } from './meridian-links';
import {
  MERIDIAN_LABELS,
  MERIDIAN_OFFICES,
  type MeridianPageId,
} from '@/data/templates/meridian-law-content';

/**
 * MERIDIAN - shared masthead.
 *
 * Navigation is by query string (`?page=practices`) rather than by anchor,
 * because MERIDIAN is a multipage template and the preview route mounts it
 * without a router: the template reads the page itself and swaps its sections,
 * so a plain `<a>` is enough to move between pages in any host.
 *
 * The layout is deliberately symmetrical - a centred serif wordmark above a
 * centred rule of links - which is the formality the art direction asks for.
 */
export function MeridianHeader({
  content,
  page,
}: {
  content: TemplateContent;
  page: MeridianPageId;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The Home entry is chrome rather than content, so it is assembled here from
  // the shared label set instead of padding the template's `nav` array.
  const links = [{ href: meridianHref('home'), label: MERIDIAN_LABELS.home }, ...content.nav];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-[var(--mer-rule)] bg-[var(--mer-ivory)]/95 backdrop-blur-sm transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_0_0_var(--mer-rule-strong)]' : ''
      }`}
    >
      {/* Standing line: the offices, the way a letterhead carries them. Derived
          from the office list so adding a fourth city never edits this file. */}
      <p className="mer-eyebrow hidden border-b border-[var(--mer-rule)] py-2 text-center text-[10px] md:block">
        {MERIDIAN_OFFICES.map((office) => office.city).join(' · ')}
      </p>

      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-6 px-6 md:justify-center sm:px-10">
        <a
          href={meridianHref('home')}
          className="mer-display text-xl uppercase tracking-[0.34em] transition-colors hover:text-[var(--mer-gold-ink)] sm:text-2xl"
        >
          {content.brand}
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="meridian-mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center border border-[var(--mer-rule-strong)] md:hidden"
        >
          {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
        </button>
      </div>

      <nav
        aria-label="Main"
        className="mx-auto hidden max-w-6xl items-center justify-center gap-10 border-t border-[var(--mer-rule)] px-10 md:flex"
      >
        {links.map((link) => {
          const current = link.href === meridianHref(page);
          return (
            <a
              key={link.href}
              href={link.href}
              {...(current ? { 'aria-current': 'page' as const } : {})}
              className={`border-b-2 py-3.5 text-[13px] tracking-[0.12em] uppercase transition-colors ${
                current
                  ? 'border-[var(--mer-gold)] text-[var(--mer-ink)]'
                  : 'border-transparent text-[var(--mer-ink-faint)] hover:text-[var(--mer-ink)]'
              }`}
            >
              {link.label}
            </a>
          );
        })}

        <a
          href={meridianHref('contact')}
          className="border border-[var(--mer-gold)] px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-[var(--mer-ink)] transition-colors hover:bg-[var(--mer-gold)] hover:text-[var(--mer-navy)]"
        >
          {MERIDIAN_LABELS.headerCta}
        </a>
      </nav>

      {open && (
        <nav
          id="meridian-mobile-nav"
          aria-label="Main"
          className="flex flex-col border-t border-[var(--mer-rule)] bg-[var(--mer-ivory)] px-6 py-2 md:hidden"
        >
          {links.map((link) => {
            const current = link.href === meridianHref(page);
            return (
              <a
                key={link.href}
                href={link.href}
                {...(current ? { 'aria-current': 'page' as const } : {})}
                onClick={() => setOpen(false)}
                className={`border-b border-[var(--mer-rule)] py-3.5 text-[13px] uppercase tracking-[0.12em] ${
                  current ? 'text-[var(--mer-gold-ink)]' : 'text-[var(--mer-ink-soft)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href={meridianHref('contact')}
            onClick={() => setOpen(false)}
            className="mt-4 mb-3 border border-[var(--mer-gold)] py-3 text-center text-[11px] uppercase tracking-[0.2em]"
          >
            {MERIDIAN_LABELS.headerCta}
          </a>
        </nav>
      )}
    </header>
  );
}
