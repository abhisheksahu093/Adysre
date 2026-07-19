/**
 * Tailwind v4 is CSS-first: the design tokens live in `@adysre/theme`
 * (`tokens.css`, imported via `@import`). This preset only exposes shared
 * content globs and plugin defaults so every surface (web, ui) scans the same
 * files. Do NOT hardcode colors here — reference tokens from the theme package.
 */
export default {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
};
