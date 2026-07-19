import type { ComponentContentMap } from '../types';

/** English prose for the gradients category. Keys are component slugs. */
export const gradientsContent: ComponentContentMap = {
  'gradient-mesh-background': {
    title: 'Mesh Gradient Background',
    description:
      'Three blurred radial pools over an opaque base - a mesh section that never has to fight its own text for contrast.',
    customization:
      'Move the pools by editing their inset classes (`-left-20 -top-20`, etc.) and recolour them inside the `radial-gradient()` arbitrary values - the alpha in each `rgba()` is the one number to respect. The opacity cap is the contrast strategy: the text sits on the opaque base surface, and at ≤ 0.35 no pool can drag it below AA in either theme, which is why there is no scrim layer. Push a pool past ~40% and you have silently traded that guarantee away - add a scrim or re-check contrast if you do. The pools deliberately survive the theme switch untouched: at these opacities they read as tint on white and as glow on near-black, so only the base and the text flip. `overflow-hidden` on the section is load-bearing - the pools hang off all four edges.',
    seoTitle: 'Mesh Gradient Background Section - Free Tailwind CSS Component',
    seoDescription:
      'A layered radial mesh gradient background section with guaranteed text contrast, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: [
      'mesh gradient',
      'gradient background',
      'radial gradient section',
      'tailwind mesh background',
    ],
  },
  'gradient-animated-blobs': {
    title: 'Animated Gradient Blobs',
    description:
      'Blurred colour blobs drifting on twenty-second loops behind ordinary, fully legible content.',
    customization:
      'The drift animates `transform` only - translate and scale. That is not a style choice: the blur is the expensive part of a blob, and a transform-only animation lets the browser rasterise each blob once and move the bitmap on the compositor, where animating `left`/`top` or `width` would re-run the blur every frame. Keep any new keyframes inside that budget. Durations are 18-28s with a negative delay desynchronising the third blob; halving them turns weather into a screensaver. `motion-reduce:animate-none` freezes the blobs in place and keeps the colour - the motion is the decoration, not the design. Contrast works like the mesh: low-opacity blobs over an opaque base, so the text never depends on where a blob happens to be.',
    seoTitle: 'Animated Gradient Blobs Background - Free Tailwind CSS Component',
    seoDescription:
      'Slow-drifting blurred gradient blobs behind content, GPU-cheap (transform-only) with a reduced-motion fallback. Tailwind, React and TypeScript.',
    keywords: [
      'animated blobs',
      'gradient blobs background',
      'css blob animation',
      'animated background',
    ],
  },
  'gradient-aurora': {
    title: 'Aurora Background',
    description:
      'A northern-lights sweep on a self-painted night sky, with a scrim that keeps the text legible at every frame.',
    customization:
      'Same three-layer contract as an animated hero: aurora, scrim, content - and the scrim is not optional. The ribbons drift through bright emerald and cyan, so white text over the raw aurora passes contrast on one frame and fails on the next; `bg-gray-950/45` is what makes 4.5:1 true at every frame. The sweep animates `transform` only (translate + skew), so the `blur-3xl` ribbons are rasterised once and panned by the compositor. Recolour the aurora inside the two `linear-gradient()` values; if you brighten the stops, thicken the scrim to match. There are no `dark:` variants on purpose - the section paints its own night sky and looks identical on a white page and a black one. Retune the ribbon container’s negative insets if you change the section height; they are what keep the glow bleeding in from beyond every edge.',
    seoTitle: 'Aurora Gradient Background - Free Tailwind CSS Component',
    seoDescription:
      'An animated northern-lights gradient background with an accessibility scrim and reduced-motion fallback, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: [
      'aurora background',
      'northern lights css',
      'animated gradient background',
      'aurora effect',
    ],
  },
  'gradient-radial-spotlight': {
    title: 'Radial Spotlight Card',
    description:
      'A card whose radial glow follows the pointer - custom properties do the tracking, opacity does the reveal.',
    customization:
      'The pointer handler writes two CSS custom properties and nothing else: no `setState`, no class toggles, no layout. Updating a custom property repaints one composited layer, which is why the handler can fire on every `pointermove` without a re-render storm - resist the urge to route the coordinates through React state. The reveal is a pure-CSS opacity fade on `group-hover`, so the spotlight simply never exists for touch and keyboard users; that makes the card’s baseline styling (border, background, text) the real design, and the glow a bonus. Resize the glow via the `240px` in both `radial-gradient()` values and keep its alpha low - it sits under the text, and unlike the mesh it moves, so it must never get strong enough to matter for contrast.',
    seoTitle: 'Hover Spotlight Card - Free React Component',
    seoDescription:
      'A pointer-tracking radial spotlight card using CSS custom properties, with an opacity-only reveal and no re-renders. Tailwind, React, TypeScript.',
    keywords: [
      'spotlight card',
      'hover glow card',
      'mouse tracking gradient',
      'radial gradient hover',
    ],
  },
  'gradient-conic-ring': {
    title: 'Spinning Conic Ring Card',
    description:
      'A card wrapped in a slowly rotating conic-gradient border - one paint, then pure transform.',
    customization:
      'The ring is the 1px of spinning gradient the `p-px` padding leaves exposed. Three numbers hold it together: `inset-[-100%]` makes the conic layer 3× the card so its corners never show mid-rotation; the inner radius is `calc(1rem - 1px)` - outer minus ring - so the corners don’t pinch; and the inner surface is fully opaque, or the gradient shows through the card instead of around it. The spin is pure `transform: rotate`, so the gradient is painted exactly once and rotated by the compositor; slow it by editing the `6s` in the `animate-[…]` value. `motion-reduce:animate-none` leaves a static conic arc, which still reads as a designed border - the motion is the decoration, the ring is the design. Widen the ring by swapping `p-px` for `p-0.5` and updating the inner `calc()` to match.',
    seoTitle: 'Spinning Conic Gradient Border Card - Free Tailwind CSS Component',
    seoDescription:
      'A card with an animated rotating conic-gradient border using the padding trick, transform-only animation and a reduced-motion fallback. Tailwind, React, Next.js, TypeScript.',
    keywords: [
      'conic gradient border',
      'animated border card',
      'spinning border',
      'gradient ring',
    ],
  },
  'gradient-text': {
    title: 'Gradient Text Headline',
    description:
      'A headline painted with a gradient via bg-clip-text - still real, selectable, announced text.',
    customization:
      '`bg-clip-text` changes the paint, not the text: it stays selectable, findable and announced, so there is nothing to do for screen readers. Two things do need care. Contrast: judge each stop against the page on its own - the darkest and the lightest stop decide legibility, never the average - which is why the `dark:` stops are each one shade lighter (`blue-600` is muddy on near-black, `blue-400` is not). Clipping: the gradient clips at the content box, and a tight line-height puts the descenders of g, y and j outside it - the `pb-1` on the headline is descender room, not rhythm; remove it and the tails get sliced. The CSS tab also sets a solid `color` before the clip properties as a fallback, so browsers without `background-clip: text` show violet text instead of invisible text. Keep the gradient to the headline; body copy has to carry the reading and stays flat.',
    seoTitle: 'Gradient Text Headline - Free Tailwind CSS Component',
    seoDescription:
      'Gradient headline text with bg-clip-text, per-stop AA contrast, descender-safe padding and a solid-colour fallback. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['gradient text', 'bg-clip-text', 'gradient headline', 'css text gradient'],
  },
  'gradient-border-card': {
    title: 'Gradient Border Card',
    description:
      'A card with a 1px gradient border via the padding trick - because border-image cannot round corners.',
    customization:
      'CSS borders cannot take a gradient and keep their radius (`border-image` discards `border-radius`), so the "border" is the 1px of gradient background the `p-px` padding leaves exposed around an opaque inner card. Two rules keep the illusion: the inner surface must be fully opaque - any alpha and the gradient shows through the card, not just around it, which is also why the inner card re-declares `bg-white dark:bg-gray-950` rather than inheriting - and the inner radius must be the outer radius minus the ring width (`calc(1rem - 1px)`) or the corners pinch. Recolour the ring on the wrapper’s `from/via/to` classes; mid-500 stops read well against both themes. Widen the ring with `p-0.5` and update the `calc()` to match. The card is static by design - pair it with the conic-ring entry if you want the border to move.',
    seoTitle: 'Gradient Border Card - Free Tailwind CSS Component',
    seoDescription:
      'A rounded card with a 1px gradient border using the padding trick, dark-mode aware and fully static. Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['gradient border', 'gradient border card', 'padding trick border', 'tailwind gradient card'],
  },
  'gradient-noise-overlay': {
    title: 'Noise Overlay Gradient',
    description:
      'A gradient panel with SVG turbulence grain on top - texture without a texture file.',
    customization:
      'The grain is an inline `feTurbulence` filter, not a PNG: zero network requests, crisp at any pixel density, and it kills the banding a smooth gradient shows on cheap panels. Tune it with `baseFrequency` (higher = finer grain), the SVG’s `opacity-25`, and the blend mode - `mix-blend-soft-light` tints, `overlay` punches harder. Stacking order is load-bearing, bottom to top: gradient, grain, scrim, content. The scrim sits above the grain on purpose, so it guarantees AA for the white text over both the gradient and the noise speckle, whatever opacity the grain runs at. The one invisible-until-it-bites caveat: SVG filter ids are document-global, so two instances with the same id both resolve to the first one’s filter - the React tabs take a `filterId` prop for exactly this; pass a unique one per instance.',
    seoTitle: 'Noise Grain Gradient Overlay - Free Tailwind CSS Component',
    seoDescription:
      'A gradient section with SVG feTurbulence film grain, a contrast scrim and no image assets, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['noise gradient', 'grain overlay', 'svg noise texture', 'feturbulence grain'],
  },
  'gradient-section-divider': {
    title: 'Gradient Section Divider',
    description:
      'A hairline that fades out at both ends, with an optional soft glow - a breath between sections.',
    customization:
      'The fade at both ends is the whole design: a hairline that hits the container edge reads as a rule across the page, one that dissolves reads as a breath between sections. It is `aria-hidden` rather than an `<hr>` on purpose - an `<hr>` announces "separator" to a screen reader, and between two `<section>`s whose headings already carry the structure, that is noise. If the break is semantic (the end of an article before the comments), drop `aria-hidden` and use a real `<hr>`. The glow is a blurred radial gradient behind the line, togglable via the `glow` prop and recolourable in its `radial-gradient()` value; keep its alpha under ~0.25 or it stops being an accent and starts being a stain. Adjust the breathing room with the wrapper’s `py-6`.',
    seoTitle: 'Gradient Divider Line - Free Tailwind CSS Component',
    seoDescription:
      'A fading gradient hairline divider with an optional accent glow, correct separator semantics and dark-mode support. HTML, CSS, Tailwind, React, TypeScript.',
    keywords: ['gradient divider', 'section divider', 'fading hr', 'gradient line separator'],
  },
  'gradient-button-set': {
    title: 'Gradient Button Set',
    description:
      'Solid and outline gradient buttons whose hover shift is an opacity cross-fade, not a repaint.',
    customization:
      'The hover shift is two stacked static gradients cross-faded with opacity - not one gradient with an animated `background-position`. Position animation repaints the gradient every frame; an opacity fade is compositor work. Recolour by editing both layers of the solid button: the base (`blue → violet`) and the hover layer (`violet → fuchsia`) should share their middle colour or the fade flickers instead of shifting. The label lives in its own `relative` span so it stays above both layers. The outline variant is the border-card padding trick at button scale, and its hover fill reuses the gradient the ring already paints - the label flips to white over stops chosen to clear AA under white in both themes, which is why the gradient has no `dark:` overrides. Buttons go full width below `sm` for tap targets; drop `w-full sm:w-auto` if they live inside a toolbar.',
    seoTitle: 'Gradient Buttons with Hover Shift - Free Tailwind CSS Component',
    seoDescription:
      'Solid and outline gradient buttons with a GPU-cheap opacity hover shift, focus rings and dark-mode support. Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['gradient button', 'gradient cta', 'hover gradient shift', 'tailwind gradient button'],
  },
};
