'use client';

import {
  WANDER_LABELS,
  WANDER_PAGES,
  type WanderPageId,
} from '@/data/templates/travel-content';
import { WanderFooter, WanderHeader } from './wander-sections';
import { useSmoothScroll } from './wander-motion';
import {
  WanderAboutPage,
  WanderContactPage,
  WanderDestinationsPage,
  WanderGalleryPage,
  WanderHomePage,
  WanderPackagesPage,
  WanderReviewsPage,
  WanderToursPage,
} from './wander-pages';
import './wander.css';

/**
 * WANDER - the assembled travel site.
 *
 * Eight pages, routed by the template itself via `?page=`; the header links back
 * with the same query, so links work in the preview, the gallery iframe, the
 * standalone /websites route and a downloaded project with no router. Lenis gives
 * the document smooth inertial scroll (off under reduced motion). `data-template`
 * scopes the sunset palette, the vivid plates and the map pins.
 *
 * A Client Component: the content module carries Lucide icon functions that
 * cannot cross a server/client boundary as props.
 */
export function WanderTemplate({ page }: { page?: string }) {
  useSmoothScroll();
  const current: WanderPageId = WANDER_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="wander" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--wa-orange)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-white"
      >
        {WANDER_LABELS.skipToContent}
      </a>

      <WanderHeader page={current} />

      <main key={current}>
        {current === 'destinations' && <WanderDestinationsPage />}
        {current === 'tours' && <WanderToursPage />}
        {current === 'packages' && <WanderPackagesPage />}
        {current === 'gallery' && <WanderGalleryPage />}
        {current === 'reviews' && <WanderReviewsPage />}
        {current === 'about' && <WanderAboutPage />}
        {current === 'contact' && <WanderContactPage />}
        {current === 'home' && <WanderHomePage />}
      </main>

      <WanderFooter />
    </div>
  );
}
