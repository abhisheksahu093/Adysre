import type { ComponentContentMap } from '../types';

/** English prose for the cursors category. Keys are component slugs. */
export const cursorsContent: ComponentContentMap = {
  'cursor-dot-follower': {
    title: 'Dot Cursor Follower',
    description: 'A small dot replaces the native cursor and tracks the pointer inside its panel.',
    customization:
      'The dot colour and size live in `dotClassName`; swap in any Tailwind size/background. `cursor: none` is set by the script, never a class, so a non-fine pointer or a JS-off page keeps a real cursor.',
    seoTitle: 'Dot Cursor Follower - Free React Component',
    seoDescription:
      'A scoped custom dot cursor that follows the pointer with a single transform per move, in Tailwind, React and TypeScript. Touch-safe and MIT licensed.',
    keywords: ['custom cursor', 'dot follower', 'cursor effect', 'pointer follower'],
  },
  'cursor-ring-lag-follower': {
    title: 'Lagging Ring Cursor',
    description: 'An outlined ring that eases in behind the pointer with a per-frame lerp.',
    customization:
      'Tune the trail with `ease` (lower lags further) and restyle the ring via `ringClassName`. The lag is the effect, so `prefers-reduced-motion` drops the factor to 1 and the ring tracks the pointer exactly.',
    seoTitle: 'Lagging Ring Cursor - Free React Component',
    seoDescription:
      'A smoothed ring cursor that trails the pointer via requestAnimationFrame easing, in Tailwind, React and TypeScript. Respects reduced motion. MIT licensed.',
    keywords: ['ring cursor', 'cursor lag', 'smooth cursor', 'easing follower'],
  },
  'cursor-spotlight-reveal': {
    title: 'Spotlight Reveal Cursor',
    description: 'A dark panel that reveals its content through a radial spotlight following the pointer.',
    customization:
      'Set the reveal size with `radius`; the mask is a radial gradient positioned by two CSS variables, so only custom properties change on move. Off hover the hole parks off-panel and the surface reads fully dark.',
    seoTitle: 'Spotlight Reveal Cursor - Free CSS Component',
    seoDescription:
      'A pointer-driven radial spotlight that reveals hidden panel content, in Tailwind, React and TypeScript. Touch-safe and MIT licensed.',
    keywords: ['spotlight cursor', 'reveal effect', 'radial mask', 'hover spotlight'],
  },
  'cursor-magnetic-button': {
    title: 'Magnetic Button',
    description: 'A button that is gently pulled toward the pointer while it is near, eased in rAF.',
    customization:
      'Control the pull with `strength` (0 still, 1 locked on). The magnetism is decoration, so `prefers-reduced-motion` skips it entirely and the button stays put - clickable and focusable in every case.',
    seoTitle: 'Magnetic Button Cursor Effect - Free React Component',
    seoDescription:
      'A magnetic button that follows the pointer with an eased pull, in Tailwind, React and TypeScript. Accessible, reduced-motion aware and MIT licensed.',
    keywords: ['magnetic button', 'cursor attraction', 'hover magnet', 'micro-interaction'],
  },
  'cursor-trail-particles': {
    title: 'Particle Trail Cursor',
    description: 'A comet trail of fading particles that follows the pointer across the panel.',
    customization:
      'Set particle `color` and pool `count` (also the trail length). A fixed pool avoids per-move allocation and one rAF loop decays opacity and scale; the trail is pure decoration, so reduced motion opts out.',
    seoTitle: 'Particle Trail Cursor - Free React Component',
    seoDescription:
      'A pooled particle trail that follows the pointer with fading dots, in Tailwind, React and TypeScript. No canvas, reduced-motion aware, MIT licensed.',
    keywords: ['cursor trail', 'particle cursor', 'comet trail', 'pointer particles'],
  },
  'cursor-text-zoom-hover': {
    title: 'Text Zoom Cursor',
    description: 'A word that scales up and tilts toward the pointer on hover.',
    customization:
      'Set the `text` and peak `scale`; a transition on the transform smooths the motion so there is no animation loop. The zoom and tilt are decoration and switch off under `prefers-reduced-motion`.',
    seoTitle: 'Text Zoom Hover Cursor - Free React Component',
    seoDescription:
      'A headline that zooms and tilts toward the pointer, in Tailwind, React and TypeScript. Reduced-motion aware and MIT licensed.',
    keywords: ['text zoom', 'hover tilt', 'cursor text effect', '3d text hover'],
  },
  'cursor-image-peek': {
    title: 'Image Peek Cursor',
    description: 'Hovering a link floats a thumbnail preview that follows the pointer.',
    customization:
      'Pass `items` of `{ label, href, gradient }`; a CSS gradient stands in for a real thumbnail. The active item changes only on enter/leave while the peek position is a transform on move, and it is `aria-hidden` since each link already names its target.',
    seoTitle: 'Image Peek Cursor - Free React Component',
    seoDescription:
      'A hover peek that floats a thumbnail beside the pointer over a link list, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['image peek', 'hover preview', 'cursor thumbnail', 'link preview'],
  },
  'cursor-gradient-blob-follow': {
    title: 'Gradient Blob Cursor',
    description: 'A soft blurred gradient blob eases after the pointer behind the panel content.',
    customization:
      'Tune the drift with `ease` and restyle the content via `heading`/`copy`. The blob sits behind the text and moves on the compositor; the drift is decoration, so reduced motion parks it in the centre with no listeners.',
    seoTitle: 'Gradient Blob Cursor - Free React Component',
    seoDescription:
      'A blurred gradient blob that eases after the pointer inside its panel, in Tailwind, React and TypeScript. Reduced-motion aware and MIT licensed.',
    keywords: ['gradient blob', 'cursor glow', 'blob follower', 'blur cursor'],
  },
  'cursor-crosshair-precision': {
    title: 'Crosshair Cursor',
    description: 'Two thin guides track the pointer with a live coordinate readout.',
    customization:
      'The guides move via transform (translateX / translateY) and a mono chip prints the local coordinates. Movement is 1:1 with the hand, so no reduced-motion opt-out is needed; touch devices keep an ordinary panel.',
    seoTitle: 'Crosshair Cursor with Coordinates - Free React Component',
    seoDescription:
      'A precision crosshair cursor with live local coordinates, in Tailwind, React and TypeScript. Touch-safe and MIT licensed.',
    keywords: ['crosshair cursor', 'coordinate readout', 'precision cursor', 'pointer guides'],
  },
  'cursor-custom-svg': {
    title: 'Custom SVG Cursor',
    description: 'An inline SVG arrow replaces the cursor and leans into the direction of travel.',
    customization:
      'Swap the inline `<path>` for any shape. The tilt derives from movement direction and ignores sub-pixel jitter; it is decoration, so `prefers-reduced-motion` keeps the arrow upright while it still follows.',
    seoTitle: 'Custom SVG Cursor - Free React Component',
    seoDescription:
      'A custom inline-SVG cursor that rotates toward pointer motion, in Tailwind, React and TypeScript. Touch-safe, reduced-motion aware and MIT licensed.',
    keywords: ['custom svg cursor', 'svg pointer', 'rotating cursor', 'cursor replacement'],
  },
};
