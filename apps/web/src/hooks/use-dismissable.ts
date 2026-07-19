'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Closes a popover on outside-click or Escape.
 *
 * Returns a ref to put on the popover's outermost element (trigger included,
 * so clicking the trigger doesn't count as "outside").
 */
export function useDismissable<T extends HTMLElement>(
  open: boolean,
  onDismiss: () => void,
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismiss();
    }

    // mousedown, not click: a click fires after the element may have moved.
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onDismiss]);

  return ref;
}
