import { getTranslations } from 'next-intl/server';
import {
  GRADIENT_SAMPLES,
  ICON_SAMPLES,
  PALETTE_SAMPLES,
  PATTERN_SAMPLES,
  TEXTURE_SAMPLES,
} from '@/data/workbench';
import { WorkbenchSection } from './workbench/section';
import { MaterialsPanel, type MaterialGroup } from './workbench/materials-panel';

/** Where each family lives in the app. One page, four tabs. */
const SURFACES_ROUTE = '/colors-surfaces';

/**
 * "See it work", rebuilt on the real catalogue.
 *
 * It used to be a bento of hand-drawn tiles: a gradient made of theme tokens, a
 * grid of borrowed icons, two CSS squares standing in for patterns. Everything
 * on the shelf now is a published record rendered by its own CSS, so this
 * section cannot show a material the library does not actually ship.
 *
 * Server Component: it reads the catalogues, projects the samples, and hands
 * them to the panel, which is the only client piece (it owns the tabs).
 */
export async function Showcase() {
  const [t, tNav, tIcons] = await Promise.all([
    getTranslations('landing'),
    getTranslations('nav'),
    getTranslations('icons'),
  ]);

  const groups: MaterialGroup[] = [
    {
      id: 'palettes',
      label: tNav('palettes'),
      href: `${SURFACES_ROUTE}?tab=palettes`,
      browseLabel: t('workbench.browse', { family: tNav('palettes') }),
      palettes: PALETTE_SAMPLES,
    },
    {
      id: 'gradients',
      label: tNav('gradients'),
      href: `${SURFACES_ROUTE}?tab=gradients`,
      browseLabel: t('workbench.browse', { family: tNav('gradients') }),
      surfaces: GRADIENT_SAMPLES,
    },
    {
      id: 'patterns',
      label: tNav('patterns'),
      href: `${SURFACES_ROUTE}?tab=patterns`,
      browseLabel: t('workbench.browse', { family: tNav('patterns') }),
      surfaces: PATTERN_SAMPLES,
    },
    {
      id: 'textures',
      label: tNav('textures'),
      href: `${SURFACES_ROUTE}?tab=textures`,
      browseLabel: t('workbench.browse', { family: tNav('textures') }),
      surfaces: TEXTURE_SAMPLES,
    },
    {
      id: 'icons',
      label: tNav('icons'),
      href: `${SURFACES_ROUTE}?tab=icons`,
      browseLabel: t('workbench.browse', { family: tNav('icons') }),
      // The category label is translated here rather than in the panel: the
      // samples are built once at module scope, where there is no locale.
      icons: ICON_SAMPLES.map((icon) => ({
        ...icon,
        caption: tIcons(`categories.${icon.category}`),
      })),
    },
  ];

  return (
    <WorkbenchSection
      label={t('workbench.panels.materials')}
      title={t('showcase.title')}
      description={t('showcase.subtitle')}
    >
      <MaterialsPanel title={t('workbench.panels.materials')} groups={groups} />
    </WorkbenchSection>
  );
}
