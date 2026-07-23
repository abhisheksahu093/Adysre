'use client';

import { useTranslations } from 'next-intl';
import { cn } from 'adysre';
import { GRADIENTS, type Gradient } from '@/data/gradients';
import { gradientToCss } from '@/lib/gradients/css';
import { box } from '@/lib/design-playground/templates';
import { useDesignDocumentStore } from '@/stores/design-document-store';
import { AssetsEmpty } from './assets-empty';

/**
 * The Gradients group: the app's curated CSS gradients.
 *
 * `StyleSpec.fill` is a single colour today - there is no gradient paint in the
 * document model, and inventing one here would fork the model ahead of the
 * effects work that owns it. So a click places a rectangle in the gradient's
 * FIRST stop and the caption says exactly that. The swatch still previews the
 * real gradient, because the preview is chrome and can afford what the canvas
 * cannot; promising a gradient fill the renderer would silently flatten would be
 * the worse trade.
 */

const PLACED_WIDTH = 240;
const PLACED_HEIGHT = 160;
const PLACED_RADIUS = 12;

/** The stop a placed rectangle takes its colour from: the earliest one. */
function leadStop(gradient: Gradient): string | null {
  const ordered = [...gradient.stops].sort((a, b) => a.position - b.position);
  return ordered[0]?.color ?? null;
}

export function AssetsGradients() {
  const t = useTranslations('designPlayground');
  const insertTemplate = useDesignDocumentStore((s) => s.insertTemplate);

  if (GRADIENTS.length === 0) {
    return <AssetsEmpty>{t('panels.assets.gradients.empty')}</AssetsEmpty>;
  }

  const place = (gradient: Gradient): void => {
    const fill = leadStop(gradient);
    insertTemplate({
      type: 'rectangle',
      // The gradient's own name, untranslated - it is data, like a layer name.
      name: gradient.name,
      transform: box(PLACED_WIDTH, PLACED_HEIGHT),
      style: { fill, radius: PLACED_RADIUS },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {t('panels.assets.gradients.hint')}
      </p>

      <div className="grid grid-cols-2 gap-2">
        {GRADIENTS.map((gradient) => (
          <button
            key={gradient.id}
            type="button"
            onClick={() => place(gradient)}
            title={gradient.name}
            aria-label={t('panels.assets.gradients.place', { name: gradient.name })}
            className={cn(
              'group flex flex-col gap-1 rounded-md text-left',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            {/* The gradient is user data built at runtime, so it can only be an
                inline style - no class can express an arbitrary stop list. */}
            <span
              aria-hidden
              style={{ backgroundImage: gradientToCss(gradient) }}
              className="h-10 w-full rounded-md border border-border/60 transition-transform group-hover:scale-[1.03]"
            />
            <span className="truncate text-[11px] text-muted-foreground group-hover:text-foreground">
              {gradient.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
