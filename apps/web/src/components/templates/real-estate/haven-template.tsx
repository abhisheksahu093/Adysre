'use client';

import { HAVEN_LABELS, HAVEN_PAGES, type HavenPageId } from '@/data/templates/real-estate-content';
import { HavenHeader } from './haven-sections';
import { useSmoothScroll } from './haven-motion';
import { HavenFooter, HavenPage } from './haven-pages';
import './haven.css';

/**
 * HAVEN - the assembled real-estate site.
 *
 * Seven pages, routed by the template itself via `?page=`; the header links back
 * with the same query, so links work in the preview, the gallery iframe, the
 * standalone /websites route and a downloaded project with no router. Lenis gives
 * the document smooth inertial scroll (off under reduced motion). `data-template`
 * scopes the white/forest-green palette, the soft plates and the 3D card depth.
 *
 * A Client Component: the content module carries Lucide icon functions that
 * cannot cross a server/client boundary as props, and the mortgage calculator is
 * interactive.
 */
export function HavenTemplate({ page }: { page?: string }) {
  useSmoothScroll();
  const current: HavenPageId = HAVEN_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="haven" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--hv-green)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-white"
      >
        {HAVEN_LABELS.skipToContent}
      </a>

      <HavenHeader page={current} />

      <main key={current}>
        <HavenPage page={current} />
      </main>

      <HavenFooter />
    </div>
  );
}

export default HavenTemplate;
