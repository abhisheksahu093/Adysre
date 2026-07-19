import { Monitor, Tablet, Smartphone } from 'lucide-react';

/**
 * Device widths shared by every preview surface (detail page, playground).
 *
 * One list, imported everywhere - the "tablet" a component detail page shows
 * must be the same tablet the playground canvas shows, or a section that looks
 * right in one place breaks in the other. `null` fills the container (desktop).
 */
export const PREVIEW_DEVICES = [
  { id: 'desktop', icon: Monitor, width: null },
  { id: 'tablet', icon: Tablet, width: 768 },
  { id: 'mobile', icon: Smartphone, width: 390 },
] as const;

export type PreviewDeviceId = (typeof PREVIEW_DEVICES)[number]['id'];

export function deviceWidth(id: PreviewDeviceId): number | null {
  return PREVIEW_DEVICES.find((d) => d.id === id)?.width ?? null;
}
