import type { ComponentContentMap } from '../types';

/** English prose for the globes category. Keys are component slugs. */
export const globesContent: ComponentContentMap = {
  'globe-dotted-rotating': {
    title: 'Dotted Rotating Globe',
    description:
      'A dotted-sphere globe that turns slowly under a fixed highlight - pure CSS and inline SVG, no WebGL.',
    customization:
      'The dots are an SVG `<pattern>` clipped to a circle; the spin is a `rotate` keyframe on the whole SVG, while the highlight is a separate static div on top so the light source stays put. Swap the `size` prop and the `text-blue-*` class to retint. Reduced motion freezes the spin and keeps the globe.',
    seoTitle: 'Dotted Rotating Globe - Free CSS + SVG Component',
    seoDescription:
      'A CSS-only dotted globe that rotates under a fixed highlight, with a reduced-motion fallback, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['dotted globe', 'rotating globe css', 'svg globe', 'world globe component'],
  },
  'globe-wireframe-sphere': {
    title: 'Wireframe Sphere Globe',
    description:
      'A latitude/longitude wireframe sphere drawn entirely in SVG ellipses, turning gently.',
    customization:
      'Each parallel and meridian is an `<ellipse>` whose `rx`/`ry` encode the perspective - the numbers are the illusion, not decoration, so tune them together or the sphere flattens. Retint via the `text-indigo-*` class and resize with `size`; `motion-reduce` stops the rotation.',
    seoTitle: 'Wireframe Sphere Globe - Free SVG Component',
    seoDescription:
      'A latitude and longitude wireframe globe built from SVG ellipses, with a reduced-motion fallback, in Tailwind, React and TypeScript.',
    keywords: ['wireframe globe', 'sphere wireframe', 'latitude longitude globe', 'svg sphere'],
  },
  'globe-connections-arcs': {
    title: 'Globe with Connection Arcs',
    description:
      'A dotted globe with flowing connection arcs and interactive, keyboard-reachable location pings.',
    customization:
      'Pass `points` of `{ label, x, y }` in percent; each renders as a real `<button>` with an accessible name, a pulsing ping and a hover/focus tooltip - a marker a mouse can hover must be reachable by keyboard too. The arcs animate `stroke-dashoffset` so they appear to flow and stay `aria-hidden` as decoration.',
    seoTitle: 'Globe with Connection Arcs - Free CSS + SVG Component',
    seoDescription:
      'A dotted globe with animated connection arcs and accessible location pings, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['globe arcs', 'connection globe', 'network globe', 'globe pings'],
  },
  'globe-hero-split': {
    title: 'Globe Hero Split',
    description:
      'A two-column hero: headline, copy and CTA on one side, a rotating dotted globe on the other.',
    customization:
      'Copy comes first in the DOM so the mobile stack reads headline-before-globe; the globe column is `aria-hidden` decoration. Feed `title`, `copy` and the CTA props. The columns collapse to one below `md` and the globe caps at `max-w-[320px]` so it never overflows a phone.',
    seoTitle: 'Globe Hero Section - Free Tailwind CSS Component',
    seoDescription:
      'A split hero with copy and a rotating SVG globe that stacks on mobile, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['globe hero', 'hero with globe', 'split hero globe', 'saas globe hero'],
  },
  'globe-stats-overlay': {
    title: 'Globe with Stat Badges',
    description:
      'A rotating globe ringed by KPI badges that overlap it on desktop and drop below it on phones.',
    customization:
      'Drive the numbers with `stats` of `{ value, label }`; each is a `<dl>` sitting outside the `aria-hidden` globe, so a screen reader reads the metrics and skips the decoration. Absolute anchor positions only apply from `sm:` up - below that the badges wrap in normal flow instead of colliding.',
    seoTitle: 'Globe with KPI Stats - Free Tailwind CSS Component',
    seoDescription:
      'A rotating globe with floating KPI stat badges that reflow on mobile, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['globe stats', 'kpi globe', 'metrics globe', 'globe overlay badges'],
  },
  'globe-network-nodes': {
    title: 'Globe Network Nodes',
    description:
      'A dotted globe overlaid with a mesh of links and nodes that twinkle on staggered timers.',
    customization:
      'The nodes pulse via an opacity keyframe with per-node delays, so the mesh shimmers rather than blinking in unison; the links are a static clipped `<g>`. The whole diagram is one `aria-hidden` SVG. Retint through the `text-violet-*` class; `motion-reduce` stills both the spin and the pulse.',
    seoTitle: 'Globe Network Mesh - Free CSS + SVG Component',
    seoDescription:
      'A dotted globe with an animated node-and-link mesh and a reduced-motion fallback, in Tailwind, React and TypeScript.',
    keywords: ['network globe', 'mesh globe', 'node globe', 'connected globe'],
  },
  'globe-dark-glow': {
    title: 'Dark Glow Globe',
    description:
      'A near-black section with a pulsing radial glow behind a rotating dotted globe.',
    customization:
      'The section paints its own `bg-gray-950` and glow, so it looks identical on a light or dark page with no `dark:` variants. The glow pulses on opacity only (compositor-cheap) and sits behind the globe on the z-axis; both the glow and the spin respect `motion-reduce`.',
    seoTitle: 'Dark Glow Globe - Free Tailwind CSS Component',
    seoDescription:
      'A dark globe section with a pulsing radial glow and a reduced-motion fallback, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['dark globe', 'glow globe', 'radial glow globe', 'dark mode globe'],
  },
  'globe-orbit-rings': {
    title: 'Globe Orbit Rings',
    description:
      'A small globe circled by three tilted orbit rings, each with a satellite sweeping its own speed.',
    customization:
      'Each ring is an outer `<g>` that holds the tilt and an inner `<g>` that spins, so the satellite dot sweeps around a tilted plane rather than a flat circle. Change the tilt `rotate()` and the duration per ring to recompose the system; `motion-reduce` stops every ring at once.',
    seoTitle: 'Globe Orbit Rings - Free CSS + SVG Component',
    seoDescription:
      'A globe with three tilted, spinning orbit rings and satellites, with a reduced-motion fallback, in Tailwind, React and TypeScript.',
    keywords: ['orbit rings globe', 'satellite globe', 'spinning rings', 'orbit animation'],
  },
  'globe-flat-world-dots': {
    title: 'Flat Dotted World Map',
    description:
      'A flat SVG dot-map with stylised continents and interactive, pulsing location markers.',
    customization:
      'Continents are paths filled with an SVG dot `<pattern>` and the map is `aria-hidden`; the `markers` you pass - `{ label, x, y }` in percent - render as real `<button>`s with accessible names, a ping and a focus tooltip, so every location is keyboard reachable. The box uses `overflow-hidden` so nothing spills at 320px.',
    seoTitle: 'Flat Dotted World Map - Free CSS + SVG Component',
    seoDescription:
      'A flat dotted world map with stylised continents and accessible pulsing location pins, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['dotted world map', 'flat map dots', 'location map', 'world map component'],
  },
  'globe-cta-band': {
    title: 'Globe CTA Band',
    description:
      'A dark call-to-action band with a rotating dotted globe bleeding off the right edge.',
    customization:
      'The globe is `aria-hidden` and clipped by the band’s `overflow-hidden`, so it reads as a backdrop while the heading, copy and button carry the meaning. Feed `title`, `copy` and the CTA props; the layout stays left-aligned and the globe tucks further off-screen at `sm:` so text never crowds it.',
    seoTitle: 'Globe CTA Band - Free Tailwind CSS Component',
    seoDescription:
      'A dark CTA band with a rotating SVG globe backdrop and a reduced-motion fallback, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['globe cta', 'cta band globe', 'call to action globe', 'globe banner'],
  },
};
