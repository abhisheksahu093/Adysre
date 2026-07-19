/**
 * JA prompt text, merged over the English source by `getPrompts('ja')`.
 * Mirrors the English category layout so a translator edits one file per category.
 * Any prompt or field missing here falls back to English individually.
 */
import type { PromptContentMap } from '../types';

import { portraitContent } from './portrait';
import { headshotContent } from './headshot';
import { businessContent } from './business';
import { fashionContent } from './fashion';
import { lifestyleContent } from './lifestyle';
import { cinematicContent } from './cinematic';
import { travelContent } from './travel';
import { natureContent } from './nature';
import { fitnessContent } from './fitness';
import { automotiveContent } from './automotive';
import { editorialContent } from './editorial';
import { fantasyContent } from './fantasy';
import { sciFiContent } from './sci-fi';
import { animeContent } from './anime';
import { artisticContent } from './artistic';

const content: PromptContentMap = {
  ...portraitContent,
  ...headshotContent,
  ...businessContent,
  ...fashionContent,
  ...lifestyleContent,
  ...cinematicContent,
  ...travelContent,
  ...natureContent,
  ...fitnessContent,
  ...automotiveContent,
  ...editorialContent,
  ...fantasyContent,
  ...sciFiContent,
  ...animeContent,
  ...artisticContent,
};

export default content;
