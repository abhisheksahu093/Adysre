'use client';

import { useEffect, useState } from 'react';

/**
 * Track the real rendered height of a `/preview/[slug]` iframe.
 *
 * The preview stage posts `adysre:preview-height` after layout; until that
 * message arrives the caller renders at `minHeight` so the page doesn't jump
 * from zero. Same-origin only - an iframe can post anything, and this sets
 * layout.
 */
export function usePreviewHeight(slug: string, minHeight = 192): number {
  const [height, setHeight] = useState(minHeight);

  useEffect(() => {
    // A slug change means a different document is loading - drop the previous
    // component's height rather than letting it linger under the new one.
    setHeight(minHeight);

    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { type?: string; slug?: string; height?: number };
      if (data?.type !== 'adysre:preview-height' || data.slug !== slug) return;
      if (typeof data.height === 'number' && data.height > 0) {
        setHeight(Math.max(minHeight, Math.ceil(data.height)));
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [slug, minHeight]);

  return height;
}
