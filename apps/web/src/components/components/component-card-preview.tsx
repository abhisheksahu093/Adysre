'use client';

import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react';
import { Layers } from 'lucide-react';
import { PREVIEWS, hasPreview } from './previews/registry';

/**
 * A clipped, non-interactive thumbnail of the real component for the index card.
 *
 * It renders the same registered preview the detail page uses, at half scale
 * inside a fixed box, so a browser understands a card at a glance instead of
 * from prose alone. Two things keep a big grid fast:
 *   - the preview module is loaded lazily, and only once the card scrolls near
 *     the viewport (IntersectionObserver), so an off-screen card costs nothing;
 *   - the whole thumbnail is `inert` - the card link and its heading carry all
 *     the interaction and meaning.
 *
 * `inert` rather than `aria-hidden` + `pointer-events-none`: previews render the
 * real component, and hundreds of them contain their own links and buttons.
 * Those two properties stop the MOUSE but leave every one of them in the tab
 * order - so a keyboard user would tab through a wall of invisible `href="#"`
 * anchors, and `aria-hidden` containing focusable nodes is an ARIA violation
 * besides. `inert` takes the whole subtree out of both trees at once.
 *
 * Components without a registered preview fall back to a neutral placeholder.
 */

/** Lazy component per slug, memoised so re-renders don't re-wrap the import. */
const lazyCache = new Map<string, ComponentType>();
function previewComponent(slug: string): ComponentType {
  let component = lazyCache.get(slug);
  if (!component) {
    const load = PREVIEWS[slug];
    component = lazy(() => load!().then((m) => ({ default: m.Component })));
    lazyCache.set(slug, component);
  }
  return component;
}

export function ComponentCardPreview({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const available = hasPreview(slug);

  useEffect(() => {
    if (!available || inView) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      // Start loading a little before the card is on screen.
      { rootMargin: '200px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [available, inView]);

  return (
    <div
      ref={ref}
      inert
      className="relative mb-3 h-36 w-full overflow-hidden rounded-md border border-border bg-muted/30"
    >
      {available && inView ? (
        <Preview slug={slug} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
          <Layers className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}

/** The scaled preview surface. Half-scale over a doubled box, so a desktop-ish
 *  render fits the card's aspect without its own breakpoints lying. */
function Preview({ slug }: { slug: string }) {
  const Rendered = previewComponent(slug);
  return (
    <div
      // `inert` on the box already blocks the pointer; this keeps the cursor
      // from changing over a link the click will never reach.
      className="pointer-events-none absolute left-0 top-0 origin-top-left"
      style={{ width: '200%', height: '200%', transform: 'scale(0.5)' }}
    >
      <div className="flex h-full w-full items-center justify-center p-4">
        <Suspense fallback={null}>
          <Rendered />
        </Suspense>
      </div>
    </div>
  );
}
