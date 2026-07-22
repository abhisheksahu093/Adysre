'use client';

import type { TemplateContent } from '@/data/templates/types';
import { VerdantAbout } from './verdant-about';
import { VerdantServices } from './verdant-services';
import { VerdantTeam } from './verdant-team';

/**
 * VERDANT - the about page: the founding story, then the method, then the
 * people and the timeline. Story before service, because the agency's argument
 * is that its method follows from why it was started.
 */
export function VerdantAboutPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <VerdantAbout content={content} />
      <VerdantServices content={content} />
      <VerdantTeam />
    </>
  );
}
