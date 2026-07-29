'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from 'adysre';

/**
 * A thin bar across the top of the window while a page is on its way.
 *
 * ## Why a click listener and not a router event
 *
 * The App Router has no navigation events, and `useLinkStatus` only reports on
 * the one `<Link>` it is rendered inside - covering the app with it would mean
 * an extra node inside all fifty-odd files that link anywhere. A capture-phase
 * click listener sees the same navigations from one place: the sidebar, the
 * header, cards, the footer, plus back and forward through `popstate`.
 *
 * Programmatic `router.push` calls are the known gap (nothing observable is
 * emitted for them), so the tab strips that navigate from a `<button>` do not
 * raise the bar. They are the fastest transitions in the app, being one client
 * component swap, which is why this is a gap worth having rather than a reason
 * to instrument every call site.
 *
 * ## Why it deliberately does nothing for the first moment
 *
 * Most navigations here resolve in well under `SHOW_DELAY`, and a bar that
 * appears and vanishes inside two frames reads as a glitch rather than as
 * progress. Nothing is shown until a navigation has actually proved slow.
 *
 * Decoration only, hence `aria-hidden`: the new page announces itself, and a
 * progress bar in the live region would just talk over it.
 */

/** Below this, a navigation is fast enough that showing anything is noise. */
const SHOW_DELAY = 140;
/** Fade-out, and how long the finished bar lingers before it unmounts. */
const FADE_MS = 220;
/**
 * Backstop. A navigation that never lands (cancelled, or a link to a download)
 * must not leave the bar creeping across the top of the screen forever.
 */
const MAX_MS = 10_000;

type Phase = 'idle' | 'loading' | 'done';

function RouteProgressBar() {
  // Deliberately `next/navigation`, not the locale-aware `@/i18n/navigation`
  // wrapper this app uses elsewhere: what matters here is that the real URL
  // changed, not what it means. Locale is irrelevant, and stripping it would
  // hide a locale switch entirely.
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [phase, setPhase] = useState<Phase>('idle');
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setPhase((current) => {
      if (current === 'idle') return current;
      timers.current.push(window.setTimeout(() => setPhase('idle'), FADE_MS));
      return 'done';
    });
  }, [clearTimers]);

  const start = useCallback(() => {
    clearTimers();
    timers.current.push(window.setTimeout(() => setPhase('loading'), SHOW_DELAY));
    timers.current.push(window.setTimeout(finish, MAX_MS));
  }, [clearTimers, finish]);

  // The URL settled, so whatever was in flight has arrived. Also runs on mount,
  // where `finish` is a no-op because nothing is loading.
  useEffect(() => {
    finish();
  }, [pathname, searchParams, finish]);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      // Anything the app already handled, or that the browser will not treat as
      // a plain navigation: modified clicks open tabs, middle clicks too.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '_self') return;

      const next = new URL(anchor.href, window.location.href);
      // Another origin leaves the app entirely; the browser draws its own
      // progress for that. `mailto:` and friends never navigate at all.
      if (next.origin !== window.location.origin) return;
      // Same page, or a jump to an anchor on it: no load to wait for.
      if (next.href === window.location.href) return;
      if (next.pathname === window.location.pathname && next.search === window.location.search) {
        return;
      }

      start();
    }

    // Capture phase, so a handler that stops propagation on the way up (menus
    // closing themselves, for one) does not hide the navigation from us.
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', start);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', start);
    };
  }, [start]);

  if (phase === 'idle') return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[110] h-0.5 overflow-hidden"
    >
      {/*
        Tokens, so the bar is the app's own accent in both themes rather than a
        second blue that only matches by accident. The creep keeps running under
        the fade: snapping to full width first would be a jump, and the fade is
        already the thing that says "arrived".
      */}
      <div
        className={cn(
          'route-progress h-full w-full bg-primary',
          phase === 'done' && 'route-progress--done',
        )}
      />
    </div>
  );
}

export function RouteProgress() {
  // `useSearchParams` opts its subtree into client rendering; the boundary keeps
  // that from reaching the statically generated pages this sits above.
  return (
    <Suspense fallback={null}>
      <RouteProgressBar />
    </Suspense>
  );
}
