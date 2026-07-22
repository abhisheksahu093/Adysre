'use client';

import {
  CADENCE_CONTENT,
  CADENCE_PAGES,
  type CadencePageId,
} from '@/data/templates/cadence-academy-content';
import { CadenceContactPage } from './cadence-contact-page';
import { CadenceCoursePage } from './cadence-course-page';
import { CadenceCoursesPage } from './cadence-courses-page';
import { CadenceFooter } from './cadence-footer';
import { CadenceHeader } from './cadence-header';
import { CadenceHomePage } from './cadence-home-page';
import { CadenceMentorsPage } from './cadence-mentors-page';
import './cadence.css';

/**
 * CADENCE - the assembled site.
 *
 * A MULTIPAGE template. `page` is the id the host route read out of `?page=`,
 * and every link in the header, footer and cards writes that same query string
 * back, so the whole site navigates with plain anchors: no router, no link
 * component, and identical behaviour in the preview route and in a downloaded
 * copy.
 *
 * `data-template` scopes the palette (cadence.css), so the template renders the
 * same wherever it is mounted.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props. Assembling on the client keeps the content one plain import.
 */
function resolvePage(page: string | undefined): CadencePageId {
  // An unknown or missing id lands on the home page rather than 404ing: the
  // query string is user-editable and a template has no error route.
  const match = CADENCE_PAGES.find((id) => id === page);
  return match ?? 'home';
}

export function CadenceTemplate({ page }: { page?: string }) {
  const current = resolvePage(page);

  return (
    <div data-template="cadence" className="min-h-screen antialiased">
      <CadenceHeader content={CADENCE_CONTENT} page={current} />

      <main id="cadence-main">
        {current === 'courses' && <CadenceCoursesPage content={CADENCE_CONTENT} />}
        {current === 'course' && <CadenceCoursePage content={CADENCE_CONTENT} />}
        {current === 'mentors' && <CadenceMentorsPage content={CADENCE_CONTENT} />}
        {current === 'contact' && <CadenceContactPage content={CADENCE_CONTENT} />}
        {current === 'home' && <CadenceHomePage content={CADENCE_CONTENT} />}
      </main>

      <CadenceFooter content={CADENCE_CONTENT} />
    </div>
  );
}
