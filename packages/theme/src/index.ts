/**
 * ADYSRE design tokens — the single source of color/typography truth.
 * Per UI_DESIGN_SYSTEM.md, colors must NEVER be hardcoded elsewhere; import
 * from here (TS) or consume the CSS variables from `tokens.css`.
 */

export const brand = {
  primary: '#2563EB',
  secondary: '#6366F1',
  accent: '#06B6D4',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
} as const;

export type BrandColor = keyof typeof brand;

/**
 * The dark semantic surface, mirroring the `.dark` block in `tokens.css`.
 *
 * Exists for the handful of renderers that cannot read a CSS custom property:
 * social card images (`next/og` rasterises to PNG, with no stylesheet and no
 * cascade), canvas and any generated bitmap. Everything that renders into the
 * DOM must still use the tokens, not these literals.
 *
 * Dark only, because a social card has no theme to follow. It is drawn on the
 * brand's own surface, whatever theme the viewer's app happens to be in.
 */
export const surface = {
  background: '#09090b',
  foreground: '#fafafa',
  muted: '#18181b',
  mutedForeground: '#a1a1aa',
  border: '#27272a',
} as const;

export const typography = {
  fontSans: '"Inter Variable", Inter, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

export const radius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
} as const;

/** Available theme modes for the theme switcher. */
export const themeModes = ['light', 'dark', 'system'] as const;
export type ThemeMode = (typeof themeModes)[number];
