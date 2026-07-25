'use client';

import {
  ASTER_LABELS,
  ASTER_PAGES,
  type AsterPageId,
} from '@/data/templates/healthcare-content';
import { AsterFooter, AsterHeader } from './aster-sections';
import { useSmoothScroll } from './aster-motion';
import {
  AsterAboutPage,
  AsterAppointmentsPage,
  AsterBlogPage,
  AsterContactPage,
  AsterDepartmentsPage,
  AsterDoctorsPage,
  AsterHomePage,
} from './aster-pages';
import './aster.css';

/**
 * ASTER - the assembled healthcare site.
 *
 * Seven pages, routed by the template itself via `?page=`; the header links back
 * with the same query, so links work in the preview, the gallery iframe, the
 * standalone /websites route and a downloaded project with no router. Lenis gives
 * the document smooth inertial scroll (off under reduced motion). `data-template`
 * scopes the blue/white palette, the soft cards and the pulse.
 *
 * A Client Component: the content module carries Lucide icon functions that
 * cannot cross a server/client boundary as props.
 */
export function AsterTemplate({ page }: { page?: string }) {
  useSmoothScroll();
  const current: AsterPageId = ASTER_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="aster" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--as-blue)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-white"
      >
        {ASTER_LABELS.skipToContent}
      </a>

      <AsterHeader page={current} />

      <main key={current}>
        {current === 'doctors' && <AsterDoctorsPage />}
        {current === 'departments' && <AsterDepartmentsPage />}
        {current === 'appointments' && <AsterAppointmentsPage />}
        {current === 'blog' && <AsterBlogPage />}
        {current === 'about' && <AsterAboutPage />}
        {current === 'contact' && <AsterContactPage />}
        {current === 'home' && <AsterHomePage />}
      </main>

      <AsterFooter />
    </div>
  );
}
