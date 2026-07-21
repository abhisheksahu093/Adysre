'use client';

import { useEffect, useState } from 'react';

/**
 * Load a bitmap for Konva.
 *
 * Konva draws an `HTMLImageElement`, not a URL, so every image node needs one
 * decoded ahead of paint. Instances are cached by src for the lifetime of the
 * tab: the same upload placed twenty times decodes once, and a re-render never
 * restarts a load that already finished.
 */
const cache = new Map<string, HTMLImageElement>();

export function useImage(src: string | undefined): HTMLImageElement | undefined {
  const [image, setImage] = useState<HTMLImageElement | undefined>(() =>
    src ? cache.get(src) : undefined,
  );

  useEffect(() => {
    if (!src) {
      setImage(undefined);
      return;
    }

    const cached = cache.get(src);
    if (cached) {
      setImage(cached);
      return;
    }

    const element = new window.Image();
    // Remote sources must not taint the canvas, or PNG export would throw.
    if (!src.startsWith('data:')) element.crossOrigin = 'anonymous';

    let alive = true;
    element.onload = () => {
      cache.set(src, element);
      if (alive) setImage(element);
    };
    // A broken source leaves the node drawn as an empty box rather than
    // crashing the stage - the layer is still selectable and replaceable.
    element.onerror = () => {
      if (alive) setImage(undefined);
    };
    element.src = src;

    return () => {
      alive = false;
    };
  }, [src]);

  return image;
}
