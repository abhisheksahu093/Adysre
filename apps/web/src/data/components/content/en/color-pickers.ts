import type { ComponentContentMap } from '../types';

/** English prose for the color-pickers category. Keys are component slugs. */
export const colorPickersContent: ComponentContentMap = {
  'color-picker-swatch-grid': {
    title: 'Swatch Grid Picker',
    description: 'A radiogroup of preset colour swatches where the choice is marked by a ring and a check, not colour alone.',
    customization:
      'Pass your own `colors`; leave `value` off to let the grid own the selection or wire it for a controlled field. The tick uses `mix-blend-mode:difference` so it stays legible on any swatch, light or dark.',
    seoTitle: 'Color Swatch Grid Picker - Free React Component',
    seoDescription:
      'An accessible preset-colour swatch grid with ring-and-check selection, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['color swatch grid', 'swatch picker', 'preset colors', 'color radiogroup'],
  },
  'color-picker-hue-slider': {
    title: 'Hue Slider',
    description: 'A single native range painted with the hue wheel that reports the resolved hex.',
    customization:
      'Control it with the `hue` prop or let it self-manage. The 0-360 value is converted to hex for both the swatch and the slider`s `aria-label`, so the announced value is a colour, not a raw number.',
    seoTitle: 'Hue Slider Color Picker - Free React Component',
    seoDescription:
      'A CSS-gradient hue slider built on a native range input, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['hue slider', 'color range slider', 'hue picker', 'css gradient slider'],
  },
  'color-picker-hsl-sliders': {
    title: 'HSL Sliders',
    description: 'Three native ranges for hue, saturation and lightness, each track previewing its own channel.',
    customization:
      'Drive it with an `{ h, s, l }` `value` or let it manage itself. The saturation and lightness tracks are recomputed live from the current colour, so each slider is its own preview instead of a static rainbow.',
    seoTitle: 'HSL Sliders Color Picker - Free React Component',
    seoDescription:
      'An HSL colour picker with three live-gradient range sliders, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['hsl sliders', 'hsl color picker', 'saturation lightness slider', 'color channels'],
  },
  'color-picker-hex-input': {
    title: 'Hex Input',
    description: 'A typed hex field paired with a native colour input, flagging invalid entries with an icon and text.',
    customization:
      '`onChange` fires only for a valid 6-digit hex, so a half-typed value never repaints the app. An invalid entry sets `aria-invalid` and shows an icon plus a message - never a bare red border, which is invisible to many colour-blind users.',
    seoTitle: 'Hex Color Input - Free React Component',
    seoDescription:
      'An accessible hex colour input with validation and a native colour fallback, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['hex input', 'hex color field', 'color validation', 'native color input'],
  },
  'color-picker-saturation-pane': {
    title: 'Saturation Pane',
    description: 'The classic saturation/brightness square, driveable by pointer and by arrow keys.',
    customization:
      'Set the `hue` and read the resolved hex from `onChange`. The pane is a `role="slider"` with `aria-valuetext` set to the hex and full arrow-key control, because a 2D picker reachable only by mouse locks out keyboard users.',
    seoTitle: 'Saturation Value Pane Color Picker - Free React Component',
    seoDescription:
      'A pointer- and keyboard-accessible saturation/brightness pane built from CSS gradients, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['saturation pane', 'sv square', 'color area picker', 'hsv picker'],
  },
  'color-picker-alpha-slider': {
    title: 'Alpha Slider',
    description: 'An opacity range over a CSS checkerboard that reports the full rgba() value.',
    customization:
      'Give it a base `color` and control the `alpha` 0-100. The checkerboard behind the track and swatch is what makes transparency honest - over plain white, half and full alpha look nearly identical.',
    seoTitle: 'Alpha Opacity Slider Color Picker - Free React Component',
    seoDescription:
      'An opacity slider with a checkerboard track and live rgba() output, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['alpha slider', 'opacity picker', 'rgba slider', 'transparency checkerboard'],
  },
  'color-picker-palette-generator': {
    title: 'Palette Generator',
    description: 'A ten-step tint and shade ramp generated from one base colour by walking lightness.',
    customization:
      'Pick a `base` and read chosen steps from `onSelect`. Hue and saturation are held from the base while only lightness moves, which is what keeps the ten swatches reading as one family rather than unrelated colours.',
    seoTitle: 'Color Palette Generator - Free React Component',
    seoDescription:
      'A tint/shade palette generator that derives a colour scale from one base, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['palette generator', 'color scale', 'tints and shades', 'color ramp'],
  },
  'color-picker-gradient-builder': {
    title: 'Gradient Builder',
    description: 'Two colour inputs and an angle slider composing a live linear-gradient with copy-ready CSS.',
    customization:
      'Set `from`, `to` and `angle`, and read the composed string from `onChange`. The CSS output is a single horizontally scrollable line, never wrapped, because a wrapped gradient string is easy to mis-copy.',
    seoTitle: 'CSS Gradient Builder - Free React Component',
    seoDescription:
      'A linear-gradient builder with two colour inputs, an angle slider and copy-ready CSS, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['gradient builder', 'css gradient picker', 'linear gradient tool', 'gradient generator'],
  },
  'color-picker-contrast-checker': {
    title: 'Contrast Checker',
    description: 'A WCAG contrast checker whose AA and AAA verdicts read as a tick and a word, not a colour.',
    customization:
      'Set `foreground` and `background`; the ratio is computed with the WCAG 2.1 relative-luminance formula. Each verdict pairs a tick or cross with the words "Pass"/"Fail", so the result never depends on the badge`s own colour.',
    seoTitle: 'WCAG Contrast Checker - Free React Component',
    seoDescription:
      'An accessible colour contrast checker with AA/AAA verdicts and a live sample, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['contrast checker', 'wcag contrast', 'color accessibility', 'aa aaa ratio'],
  },
  'color-picker-recent-colors': {
    title: 'Recent Colors',
    description: 'A native colour input backed by a de-duplicated, capped most-recently-used strip.',
    customization:
      'Seed the `recent` list and read picks from `onChange`. New colours are unshifted, de-duplicated and capped at eight; the active swatch carries a ring and a check so it is identifiable without relying on colour.',
    seoTitle: 'Recent Colors Picker - Free React Component',
    seoDescription:
      'A colour picker with a most-recently-used history strip, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['recent colors', 'color history', 'recently used swatches', 'color picker history'],
  },
};
