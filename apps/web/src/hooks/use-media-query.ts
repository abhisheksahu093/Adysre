'use client';

import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query.
 *
 * Returns `undefined` until the browser has answered. That third state is the
 * point: on the server, and on the first client render, "does this viewport
 * match?" has no truthful answer, and a component that guesses either flashes
 * the wrong layout or fires an effect against a viewport that was never there.
 * Callers should branch on `=== false` / `=== true`, never on truthiness alone.
 *
 * Prefer a Tailwind breakpoint class wherever the difference is purely visual;
 * reach for this only when the layout difference is structural (a docked column
 * versus a floating sheet) or drives behaviour.
 */
export function useMediaQuery(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const list = window.matchMedia(query);
    setMatches(list.matches);
    const onChange = (event: MediaQueryListEvent): void => setMatches(event.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
