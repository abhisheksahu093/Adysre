import type { SignatureDesign, SocialPlatform } from './types';

/**
 * Signature themes: each is a `SignatureDesign` preset. Colors are explicit
 * (email HTML is inline-styled, not tokenized), so a theme is data the builder
 * reads. Adding a theme is one entry here.
 */

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

export interface SignatureTheme {
  id: string;
  label: string;
  design: SignatureDesign;
}

const base: SignatureDesign = {
  font: SANS,
  primaryColor: '#111827',
  textColor: '#374151',
  mutedColor: '#6b7280',
  accentColor: '#2563eb',
  background: '#ffffff',
  iconSize: 26,
  roundedImages: true,
  showBorder: false,
  showDividers: true,
  spacing: 8,
  photoSize: 72,
  logoWidth: 120,
};

export const SIGNATURE_THEMES: readonly SignatureTheme[] = [
  { id: 'modern', label: 'Modern', design: { ...base, accentColor: '#2563eb', primaryColor: '#0f172a' } },
  { id: 'corporate', label: 'Corporate', design: { ...base, accentColor: '#0369a1', primaryColor: '#1e293b', roundedImages: false, showBorder: true } },
  { id: 'minimal', label: 'Minimal', design: { ...base, accentColor: '#111827', primaryColor: '#111827', showDividers: false, iconSize: 22 } },
  { id: 'dark', label: 'Dark', design: { ...base, background: '#0b0b0f', primaryColor: '#f4f4f5', textColor: '#d4d4d8', mutedColor: '#a1a1aa', accentColor: '#8b5cf6' } },
  { id: 'elegant', label: 'Elegant', design: { ...base, font: SERIF, accentColor: '#9a7b4f', primaryColor: '#292524', textColor: '#44403c', background: '#fbfaf7' } },
  { id: 'startup', label: 'Startup', design: { ...base, accentColor: '#059669', primaryColor: '#111827', iconSize: 28 } },
  { id: 'creative', label: 'Creative', design: { ...base, accentColor: '#ec4899', primaryColor: '#7c3aed', iconSize: 30, spacing: 10 } },
];

export const SIGNATURE_THEMES_BY_ID: Record<string, SignatureTheme> = Object.fromEntries(
  SIGNATURE_THEMES.map((t) => [t.id, t]),
);

/** Brand color + short label for each social chip (self-contained, no images). */
export const SOCIAL_META: Record<SocialPlatform, { label: string; short: string; color: string }> = {
  facebook: { label: 'Facebook', short: 'f', color: '#1877F2' },
  linkedin: { label: 'LinkedIn', short: 'in', color: '#0A66C2' },
  instagram: { label: 'Instagram', short: 'IG', color: '#E4405F' },
  x: { label: 'X', short: 'X', color: '#000000' },
  youtube: { label: 'YouTube', short: 'YT', color: '#FF0000' },
  github: { label: 'GitHub', short: 'GH', color: '#181717' },
  behance: { label: 'Behance', short: 'Be', color: '#1769FF' },
  dribbble: { label: 'Dribbble', short: 'Dr', color: '#EA4C89' },
};
