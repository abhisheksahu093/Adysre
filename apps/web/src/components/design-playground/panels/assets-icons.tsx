'use client';

import { useId, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { cn } from '@adysre/ui';
import { ICONS, type Icon } from '@/data/icons';
import { buildDataUri, DEFAULT_ICON_STYLE } from '@/lib/icons/svg';
import { box } from '@/lib/design-playground/templates';
import { useDesignDocumentStore } from '@/stores/design-document-store';
import { AssetsEmpty } from './assets-empty';

/**
 * The Icons group: the app's own 24x24 line set, searchable.
 *
 * The document model has no vector-path node, so an icon lands as an `image`
 * whose `src` is the icon serialised to a `data:image/svg+xml` URI. That keeps
 * the placement fully offline - the canvas never fetches an asset - and it
 * survives autosave, because the URI is the artwork rather than a pointer to it.
 * When a path node arrives, only this placement function changes.
 *
 * The grid preview does NOT use the data URI: an inline `<svg>` inherits
 * `currentColor`, so previews follow the panel's tokens while the placed copy
 * carries its own literal ink.
 */

/** The size an icon is placed at, and the size its data URI is authored for. */
const PLACED_SIZE = 64;

/**
 * Ink for a placed icon. Placed artwork is document data, not chrome: the canvas
 * has no token pipeline, and `currentColor` would resolve against the image's
 * own (empty) context rather than the page, so the colour must be literal here.
 * Recolouring is the inspector's job once icons gain stroke controls (PRD §7.4).
 */
const PLACED_ICON_COLOR = '#111111';

/** Cap on rendered results: the set is large and the rail is narrow. */
const RESULT_LIMIT = 60;

function matches(icon: Icon, query: string): boolean {
  if (!query) return true;
  return (
    icon.title.toLowerCase().includes(query) ||
    icon.name.toLowerCase().includes(query) ||
    icon.category.includes(query) ||
    icon.tags.some((tag) => tag.toLowerCase().includes(query))
  );
}

export function AssetsIcons() {
  const t = useTranslations('designPlayground');
  const insertTemplate = useDesignDocumentStore((s) => s.insertTemplate);
  const [query, setQuery] = useState('');
  const inputId = useId();

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return ICONS.filter((icon) => matches(icon, needle));
  }, [query]);

  const shown = results.slice(0, RESULT_LIMIT);

  const place = (icon: Icon): void => {
    const src = buildDataUri(icon.body, {
      ...DEFAULT_ICON_STYLE,
      size: PLACED_SIZE,
      color: PLACED_ICON_COLOR,
    });
    insertTemplate({
      type: 'image',
      // The icon's own title, untranslated - a layer name is data, not chrome.
      name: icon.title,
      transform: box(PLACED_SIZE, PLACED_SIZE),
      // `contain` keeps the 24x24 drawing square whatever the box is resized to.
      image: { src, alt: icon.title, fit: 'contain' },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label={t('panels.assets.icons.searchLabel')}
          placeholder={t('panels.assets.icons.searchPlaceholder')}
          className="h-8 w-full rounded-md border border-border bg-background pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {shown.length === 0 ? (
        <AssetsEmpty>{t('panels.assets.icons.empty')}</AssetsEmpty>
      ) : (
        <>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {t('panels.assets.icons.hint')}
          </p>

          <div className="grid grid-cols-5 gap-1">
            {shown.map((icon) => (
              <button
                key={icon.name}
                type="button"
                onClick={() => place(icon)}
                title={icon.title}
                aria-label={t('panels.assets.icons.place', { name: icon.title })}
                className={cn(
                  'flex h-9 w-full items-center justify-center rounded-md border border-transparent text-foreground',
                  'hover:border-border hover:bg-muted',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  // Bodies are build-time constants from `data/icons/generated`,
                  // sanitised to a shape/attribute whitelist at generation time -
                  // no user input ever reaches this markup.
                  dangerouslySetInnerHTML={{ __html: icon.body }}
                />
              </button>
            ))}
          </div>

          {results.length > shown.length && (
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {t('panels.assets.icons.more', { shown: shown.length, total: results.length })}
            </p>
          )}
        </>
      )}
    </div>
  );
}
