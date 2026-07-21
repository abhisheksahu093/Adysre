'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@adysre/ui';
import { PALETTES } from '@/data/palettes';
import { box } from '@/lib/design-playground/templates';
import { useDesignDocumentStore } from '@/stores/design-document-store';
import { AssetsEmpty } from './assets-empty';

/**
 * The Colours group: the app's curated palettes, one row per palette.
 *
 * A swatch does one of two things and the helper line above says which, because
 * the same click cannot mean both: with a selection it repaints it, with nothing
 * selected it has to create something to paint. Guessing wrong is destructive
 * (an accidental fill over a finished layer), so the state is stated up front
 * rather than discovered.
 *
 * Palettes are read straight from `@/data/palettes` - the same source the
 * palettes pages use - so a new palette appears here with no work.
 */

/** Size of the rectangle a swatch drops when there is nothing to paint. */
const PLACED_SIZE = 120;
const PLACED_RADIUS = 12;

export function AssetsColors() {
  const t = useTranslations('designPlayground');
  const selection = useDesignDocumentStore((s) => s.selection);
  const patchSelection = useDesignDocumentStore((s) => s.patchSelection);
  const insertTemplate = useDesignDocumentStore((s) => s.insertTemplate);

  const hasSelection = selection.length > 0;

  const applyOrPlace = (color: string): void => {
    if (hasSelection) {
      patchSelection({ style: { fill: color } });
      return;
    }
    // The node name is the colour itself: layer names are user data and must not
    // change with locale (same rule as `document.defaultName`).
    insertTemplate({
      type: 'rectangle',
      name: color,
      transform: box(PLACED_SIZE, PLACED_SIZE),
      style: { fill: color, radius: PLACED_RADIUS },
    });
  };

  if (PALETTES.length === 0) {
    return <AssetsEmpty>{t('panels.assets.colors.empty')}</AssetsEmpty>;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {t(hasSelection ? 'panels.assets.colors.applyHint' : 'panels.assets.colors.placeHint')}
      </p>

      {PALETTES.map((palette) => (
        <div key={palette.id} className="flex flex-col gap-1">
          <span className="truncate text-[11px] font-medium text-muted-foreground">
            {palette.name}
          </span>
          <div className="flex gap-1">
            {palette.colors.map((color, index) => (
              <button
                // A palette may legitimately repeat a colour, so the index is
                // part of the key rather than the colour alone.
                key={`${color}-${index}`}
                type="button"
                onClick={() => applyOrPlace(color)}
                title={color}
                aria-label={t(
                  hasSelection ? 'panels.assets.colors.apply' : 'panels.assets.colors.place',
                  { color, palette: palette.name },
                )}
                // The swatch IS the colour - a runtime hex can never be a
                // Tailwind class, and this is document data, not chrome. Every
                // other pixel here (border, ring, radius) stays on tokens.
                style={{ backgroundColor: color }}
                className={cn(
                  'h-6 flex-1 rounded border border-border/60 transition-transform',
                  'hover:scale-105 focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card',
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
