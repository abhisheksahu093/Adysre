'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Search, Blocks, Shapes, Palette, Blend, Grid2x2, Waves, Library, LayoutTemplate, CornerDownLeft } from 'lucide-react';
import { cn } from 'adysre';
import { useRouter } from '@/i18n/navigation';
import { NAV_SUBMENUS } from '@/config/nav-submenus';
import { humanizeKey } from '@/lib/humanize';
import type { ComponentSearchEntry } from '@/data/component-search-index';

interface Result {
  id: string;
  label: string;
  sublabel: string;
  href: string;
}

/** Top-level destinations, searchable by name. */
const PAGE_LINKS: { key: string; href: string; icon: typeof Blocks }[] = [
  { key: 'components', href: '/components', icon: Blocks },
  { key: 'icons', href: '/icons', icon: Shapes },
  { key: 'palettes', href: '/palettes', icon: Palette },
  { key: 'gradients', href: '/gradients', icon: Blend },
  { key: 'patterns', href: '/patterns', icon: Grid2x2 },
  { key: 'textures', href: '/textures', icon: Waves },
  { key: 'promptLibrary', href: '/prompt-library', icon: Library },
  { key: 'templates', href: '/templates', icon: LayoutTemplate },
];

const MAX_PER_GROUP = 8;

/**
 * Global command-palette search (opens from the topbar button or Cmd/Ctrl-K).
 *
 * Indexes destinations, every module's categories/tags, and all components, so
 * typing a feature name jumps straight to it. The ~780-entry component index is
 * imported lazily the first time the palette opens, so it never weighs down the
 * pages that just render the topbar.
 */
export function SearchCommand({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const t = useTranslations('nav');
  const tComponents = useTranslations('components');
  const tIcons = useTranslations('icons');
  const tPrompts = useTranslations('promptLibrary');
  const tTopbar = useTranslations('topbar');

  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [components, setComponents] = useState<ComponentSearchEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Load the heavy component index once, the first time the palette opens.
  useEffect(() => {
    if (!open || components.length > 0) return;
    let alive = true;
    import('@/data/component-search-index').then((m) => {
      if (alive) setComponents(m.COMPONENT_SEARCH);
    });
    return () => {
      alive = false;
    };
  }, [open, components.length]);

  // Focus the field and reset state each time it opens; lock body scroll.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(id);
    };
  }, [open]);

  /** Category/tag label, mirroring the sidebar's resolution. */
  const submenuLabel = useCallback(
    (moduleKey: string, value: string): string => {
      const mode = NAV_SUBMENUS[moduleKey]?.labelMode;
      if (!mode || mode === 'humanize') return humanizeKey(value);
      const translate =
        mode.ns === 'components' ? tComponents : mode.ns === 'icons' ? tIcons : tPrompts;
      const key = `${mode.prefix}${value}`;
      return translate.has(key) ? translate(key) : humanizeKey(value);
    },
    [tComponents, tIcons, tPrompts],
  );

  // Every searchable destination, built once (cheap for pages/categories).
  const catalogue = useMemo<Result[]>(() => {
    const items: Result[] = [];
    for (const p of PAGE_LINKS) {
      items.push({ id: `page:${p.key}`, label: t(p.key), sublabel: tTopbar('groups.page'), href: p.href });
    }
    for (const [moduleKey, submenu] of Object.entries(NAV_SUBMENUS)) {
      const values = submenu.groups ? submenu.groups.flatMap((g) => g.values) : (submenu.values ?? []);
      for (const value of values) {
        items.push({
          id: `${moduleKey}:${value}`,
          label: submenuLabel(moduleKey, value),
          sublabel: `${t(moduleKey)} · ${tTopbar(`groups.${submenu.param}`)}`,
          href: `${submenu.href}?${submenu.param}=${value}`,
        });
      }
    }
    return items;
  }, [t, tTopbar, submenuLabel]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalogue.filter((r) => r.id.startsWith('page:'));

    const score = (haystack: string): number => {
      const h = haystack.toLowerCase();
      if (h === q) return 3;
      if (h.startsWith(q)) return 2;
      if (h.includes(q)) return 1;
      return 0;
    };

    const pages = catalogue
      .map((r) => ({ r, s: score(r.label) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, MAX_PER_GROUP)
      .map((x) => x.r);

    const comps = components
      .map((c) => ({ c, s: Math.max(score(c.title), score(c.slug), score(c.category), ...c.tags.map(score)) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, MAX_PER_GROUP + 4)
      .map(
        (x): Result => ({
          id: `component:${x.c.slug}`,
          label: x.c.title,
          sublabel: tComponents(`categories.${x.c.category}`),
          href: `/components/${x.c.slug}`,
        }),
      );

    return [...pages, ...comps];
  }, [query, catalogue, components, tComponents]);

  // Keep the active row in range and scrolled into view.
  useEffect(() => {
    setActive(0);
  }, [query]);
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = results[active];
      if (chosen) go(chosen.href);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={tTopbar('commandPalette')}
        className="relative flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={tTopbar('searchPlaceholder')}
            aria-label={tTopbar('searchPlaceholder')}
            className="h-12 flex-1 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
            Esc
          </kbd>
        </div>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {tTopbar('noResults')}
            </p>
          ) : (
            results.map((r, i) => (
              <button
                key={r.id}
                type="button"
                data-active={i === active}
                onClick={() => go(r.href)}
                onMouseMove={() => setActive(i)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors',
                  i === active ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted',
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{r.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{r.sublabel}</span>
                </span>
                {i === active && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
