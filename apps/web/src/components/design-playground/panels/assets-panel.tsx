'use client';

import { useId, useState, type ComponentType, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from 'adysre';
import { AssetsColors } from './assets-colors';
import { AssetsGradients } from './assets-gradients';
import { AssetsIcons } from './assets-icons';

/**
 * The assets panel: colours, gradients and icons that go onto the canvas.
 *
 * Three groups behind a tab strip rather than three stacked lists, because each
 * group is hundreds of items long - stacking them would bury the last two behind
 * a scroll nobody makes. The strip is a real `tablist`: arrow keys move between
 * tabs, only the active tab is in the tab order, and Tab from there lands in the
 * panel body, which is what a screen-reader user expects of this pattern.
 *
 * Every group draws from the app's existing data (`@/data/palettes`,
 * `@/data/gradients`, `@/data/icons`) - the playground consumes those sets, it
 * does not keep a second copy of them.
 */

/** The groups, in strip order. Labels resolve to `panels.assets.tabs.<id>`. */
const ASSET_GROUPS: { id: string; Group: ComponentType }[] = [
  { id: 'colors', Group: AssetsColors },
  { id: 'gradients', Group: AssetsGradients },
  { id: 'icons', Group: AssetsIcons },
];

export function AssetsPanel() {
  const t = useTranslations('designPlayground');
  const baseId = useId();
  const [active, setActive] = useState<string>(ASSET_GROUPS[0]?.id ?? 'colors');

  const activeIndex = Math.max(
    0,
    ASSET_GROUPS.findIndex((group) => group.id === active),
  );
  const ActiveGroup = ASSET_GROUPS[activeIndex]?.Group ?? AssetsColors;

  const onStripKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const last = ASSET_GROUPS.length - 1;
    let next: number | null = null;

    if (event.key === 'ArrowRight') next = activeIndex === last ? 0 : activeIndex + 1;
    else if (event.key === 'ArrowLeft') next = activeIndex === 0 ? last : activeIndex - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === null) return;

    event.preventDefault();
    const target = ASSET_GROUPS[next];
    if (!target) return;
    setActive(target.id);
    // Automatic activation: selection follows focus, so the panel body must
    // follow the caret rather than wait for Enter.
    event.currentTarget
      .querySelector<HTMLElement>(`[data-tab-id="${target.id}"]`)
      ?.focus();
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div
        role="tablist"
        aria-label={t('panels.assets.tablistLabel')}
        onKeyDown={onStripKeyDown}
        className="flex gap-0.5 rounded-md bg-muted p-0.5"
      >
        {ASSET_GROUPS.map(({ id }) => {
          const selected = id === active;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${id}`}
              data-tab-id={id}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(id)}
              className={cn(
                'min-w-0 flex-1 truncate rounded px-2 py-1 text-[11px] font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                selected
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t(`panels.assets.tabs.${id}`)}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        tabIndex={0}
        className="min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ActiveGroup />
      </div>
    </div>
  );
}
