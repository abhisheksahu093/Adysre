'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from 'adysre';
import { useSelectionActions } from './selection-actions';

/**
 * Right-click menu for the canvas and the layer tree.
 *
 * Positioned in viewport coordinates because it is summoned by a pointer, not
 * anchored to a component. It closes on any outside press, on Escape and on
 * scroll - a menu that survives the thing it acted on is worse than no menu.
 */
export interface ContextMenuState {
  /** Viewport coordinates - where to draw the menu. */
  x: number;
  y: number;
  /** The same point in canvas coordinates, so "paste here" means here. */
  canvas: { x: number; y: number };
}

export function CanvasContextMenu({
  state,
  onClose,
}: {
  state: ContextMenuState | null;
  onClose: () => void;
}) {
  const t = useTranslations('designPlayground');
  const actions = useSelectionActions();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state) return;
    // Focus the first item so the menu is operable from the keyboard the moment
    // it opens (Shift+F10 / the menu key summon it without a pointer).
    menuRef.current?.querySelector('button')?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    const onPointerDown = (event: PointerEvent): void => {
      if (!menuRef.current?.contains(event.target as globalThis.Node)) onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('blur', onClose);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('blur', onClose);
    };
  }, [state, onClose]);

  // Nothing to offer (empty canvas, empty clipboard) - show no menu rather than
  // an empty box the user has to dismiss.
  if (!state || actions.length === 0) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={t('actions.selectionLabel')}
      // A pointer position is continuous, so it cannot be a class. Everything
      // else here is tokens.
      style={{ left: state.x, top: state.y }}
      className="fixed z-50 min-w-52 rounded-lg border border-border bg-card p-1 shadow-lg"
    >
      {actions.map(({ id, icon: Icon, run, shortcut, danger }) => (
        <button
          key={id}
          type="button"
          role="menuitem"
          onClick={() => {
            // Paste lands where the menu was opened, so "paste here" means here.
            run(state.canvas);
            onClose();
          }}
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
            danger
              ? 'text-danger hover:bg-danger/10'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 flex-1 truncate">{t(`actions.${id}`)}</span>
          {shortcut && (
            <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground/70">
              {shortcut}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
