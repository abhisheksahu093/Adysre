import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * Templates - slug to renderer.
 *
 * Lazy on purpose: a template is a whole page of markup, and the gallery links
 * to many of them. Only the one being previewed is ever downloaded, so adding
 * the tenth template costs the grid nothing.
 *
 * Each template's folder is named for its slug, which is also the key the
 * source generator writes - so a template has exactly one identifier.
 */
/** Multipage templates receive the resolved page id; single-page ones ignore it. */
export type TemplateRendererProps = { page?: string };

export const TEMPLATE_RENDERERS: Record<string, ComponentType<TemplateRendererProps>> = {
  'nova-analytics': dynamic(() =>
    import('./nova-analytics/nova-template').then((mod) => ({ default: mod.NovaTemplate })),
  ),
  'saffron-table': dynamic(() =>
    import('./saffron-table/saffron-template').then((mod) => ({ default: mod.SaffronTemplate })),
  ),
  'pulse-clinic': dynamic(() =>
    import('./pulse-clinic/pulse-template').then((mod) => ({ default: mod.PulseTemplate })),
  ),
  'aurora-fitness': dynamic(() =>
    import('./aurora-fitness/aurora-template').then((mod) => ({ default: mod.AuroraTemplate })),
  ),
  'atelier-nord': dynamic(() =>
    import('./atelier-nord/atelier-template').then((mod) => ({ default: mod.AtelierTemplate })),
  ),
  'verdant-realty': dynamic(() =>
    import('./verdant-realty/verdant-template').then((mod) => ({ default: mod.VerdantTemplate })),
  ),
  'meridian-law': dynamic(() =>
    import('./meridian-law/meridian-template').then((mod) => ({ default: mod.MeridianTemplate })),
  ),
  'lumen-store': dynamic(() =>
    import('./lumen-store/lumen-template').then((mod) => ({ default: mod.LumenTemplate })),
  ),
  'kite-studio': dynamic(() =>
    import('./kite-studio/kite-template').then((mod) => ({ default: mod.KiteTemplate })),
  ),
  'vanta-markets': dynamic(() =>
    import('./vanta-markets/vanta-template').then((mod) => ({ default: mod.VantaTemplate })),
  ),
  'cadence-academy': dynamic(() =>
    import('./cadence-academy/cadence-template').then((mod) => ({ default: mod.CadenceTemplate })),
  ),
  'tavola-kitchen': dynamic(() =>
    import('./tavola-kitchen/tavola-template').then((mod) => ({ default: mod.TavolaTemplate })),
  ),
  'lumiere-salon': dynamic(() =>
    import('./lumiere-salon/lumiere-template').then((mod) => ({ default: mod.LumiereTemplate })),
  ),
  'northgate-pay': dynamic(() =>
    import('./northgate-pay/northgate-template').then((mod) => ({ default: mod.NorthgateTemplate })),
  ),
  'pinnacle-advisory': dynamic(() =>
    import('./pinnacle-advisory/pinnacle-template').then((mod) => ({ default: mod.PinnacleTemplate })),
  ),
};

export function hasTemplateRenderer(slug: string): boolean {
  return slug in TEMPLATE_RENDERERS;
}
