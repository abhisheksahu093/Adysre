'use client';

import type { TemplateContent } from '@/data/templates/types';
import { KITE_STUDIO_PAGE } from '@/data/templates/kite-studio-content';
import { KiteMasthead } from './kite-masthead';
import { KiteStory } from './kite-story';
import { KiteTeam } from './kite-team';

/**
 * KITE - the studio page. Why the studio exists, the rules that follow from it,
 * the five people you actually meet, and nine years of dates.
 */
export function KiteStudioPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <KiteMasthead
        eyebrow={KITE_STUDIO_PAGE.eyebrow}
        title={KITE_STUDIO_PAGE.title}
        outline={KITE_STUDIO_PAGE.titleOutline}
        subtitle={KITE_STUDIO_PAGE.subtitle}
      />
      <KiteStory content={content} />
      <KiteTeam />
    </>
  );
}
