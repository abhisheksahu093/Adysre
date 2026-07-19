import type { ComponentContentMap } from '../types';

/** English prose for the animation category. Keys are component slugs. */
export const animationContent: ComponentContentMap = {
  'fade-in-on-scroll': {
    title: 'Fade In On Scroll',
    description: 'Content that fades and rises into place as it enters the viewport.',
    customization:
      'Tune `duration` and the y-offset for a heavier or lighter entrance. Trigger once rather than on every scroll - re-animating content a reader has already seen is distracting.',
    seoTitle: 'Fade In On Scroll - Free Framer Motion Component',
    seoDescription:
      'A scroll-triggered fade-and-rise animation with reduced-motion support, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['fade in on scroll', 'framer motion', 'scroll animation', 'intersection observer'],
  },
  'stagger-reveal-grid': {
    title: 'Stagger Reveal Grid',
    description: 'Grid items that fade and slide up in sequence as the grid enters the viewport.',
    customization:
      'Tune `staggerMs` for a tighter or looser cascade and `distance` for the slide length. Set `once={false}` to replay the reveal whenever the grid re-enters view.',
    seoTitle: 'Stagger Reveal Grid - Free React Animation Component',
    seoDescription:
      'A staggered fade-and-slide grid reveal driven by IntersectionObserver, with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['stagger reveal', 'grid animation', 'intersection observer', 'scroll reveal'],
  },
  'count-up-number': {
    title: 'Count Up Number',
    description: 'An animated counter that eases up to its target value when scrolled into view.',
    customization:
      'Set `decimals`, `prefix` and `suffix` to format currency, percentages or plain stats. `duration` controls the count speed; reduced motion jumps to the final value.',
    seoTitle: 'Count Up Number - Free React Counter Animation',
    seoDescription:
      'An animated count-up number that eases to its target on scroll using requestAnimationFrame, with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['count up', 'animated counter', 'stat block', 'number animation'],
  },
  'typewriter-text': {
    title: 'Typewriter Text',
    description: 'Text typed out character by character, with an optional blinking cursor and loop.',
    customization:
      'Pass multiple `words` to cycle phrases and tune `typingSpeed`, `deletingSpeed` and `pauseMs`. Reduced motion shows the full text with no animation.',
    seoTitle: 'Typewriter Text - Free React Typing Animation',
    seoDescription:
      'A typewriter text effect that types and deletes phrases with a blinking cursor, with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['typewriter', 'typing effect', 'text animation', 'blinking cursor'],
  },
  'scroll-progress-bar': {
    title: 'Scroll Progress Bar',
    description: 'A reading-progress bar that fills as its scoped content container is scrolled.',
    customization:
      'Adjust `height` for a thicker bar and `maxHeight` for the scroll area. Progress is scoped to the container, so it drops into cards and articles without touching the window.',
    seoTitle: 'Scroll Progress Bar - Free React Reading Indicator',
    seoDescription:
      'A container-scoped reading progress bar that fills with scroll position, accessible via role=progressbar, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['scroll progress', 'reading indicator', 'progress bar', 'scroll animation'],
  },
  'hover-lift-card': {
    title: 'Hover Lift Card',
    description: 'A card that lifts and deepens its shadow on hover and keyboard focus.',
    customization:
      'Adjust `liftPx` for a subtler or bolder rise. The lift is transform-only and drops to nothing under reduced motion.',
    seoTitle: 'Hover Lift Card - Free Tailwind Hover Animation',
    seoDescription:
      'A GPU-cheap hover-lift card with focus-within support and reduced-motion handling, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['hover lift card', 'hover animation', 'card transition', 'tailwind hover'],
  },
  'gradient-text-animated': {
    title: 'Animated Gradient Text',
    description: 'A heading whose gradient fill pans continuously across the text.',
    customization:
      'Swap the gradient stops and set `durationMs` for a faster or slower pan. Reduced motion freezes the gradient in place.',
    seoTitle: 'Animated Gradient Text - Free React Text Animation',
    seoDescription:
      'A background-clip gradient text animation that pans on a loop, with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['animated gradient text', 'gradient heading', 'background clip text', 'text animation'],
  },
  'pulse-attention': {
    title: 'Pulse Attention',
    description: 'An expanding ring that pulses behind any element to draw the eye.',
    customization:
      'Wrap a badge, dot or button and recolor the ring. The pulse is transform/opacity only and disappears under reduced motion.',
    seoTitle: 'Pulse Attention - Free React Ping Animation',
    seoDescription:
      'A pulsing attention ring that draws focus to any element, with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['pulse animation', 'attention ring', 'ping effect', 'notification pulse'],
  },
  'flip-card-3d': {
    title: '3D Flip Card',
    description: 'A card that flips in 3D on hover and keyboard focus to reveal its back.',
    customization:
      'Pass any `front` and `back` content. The front face is tabbable so the flip is reachable by keyboard; reduced motion drops the transition.',
    seoTitle: '3D Flip Card - Free CSS Flip Animation',
    seoDescription:
      'A 3D flip card that reveals its back on hover or focus, keyboard accessible with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['3d flip card', 'flip animation', 'card flip', 'hover reveal'],
  },
  'ripple-effect-button': {
    title: 'Ripple Effect Button',
    description: 'A button that spawns a material-style ripple from the click point.',
    customization:
      'The ripple is scaled to the button and scoped to it - never the document. Reduced motion skips the ripple while the click still fires.',
    seoTitle: 'Ripple Effect Button - Free React Ripple Animation',
    seoDescription:
      'A material-style ripple button that animates from the click coordinate, with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['ripple button', 'material ripple', 'click animation', 'button effect'],
  },
  'bounce-in-entrance': {
    title: 'Bounce In Entrance',
    description: 'An element that springs into place with a bouncy scale on mount.',
    customization:
      'Set `delayMs` to sequence several entrances. The animation is scale/opacity only and reduced motion shows the final state instantly.',
    seoTitle: 'Bounce In Entrance - Free React Entrance Animation',
    seoDescription:
      'A bouncy scale-in entrance animation with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['bounce in', 'entrance animation', 'mount animation', 'spring effect'],
  },
  'parallax-layers': {
    title: 'Parallax Layers',
    description: 'Layered shapes that drift at different depths as the pointer moves.',
    customization:
      'Tune `strength` for the parallax range. Pointer tracking is scoped to the container and gated on a fine pointer, so touch and reduced motion stay static.',
    seoTitle: 'Parallax Layers - Free React Pointer Parallax',
    seoDescription:
      'A container-scoped pointer parallax with depth layers, gated for touch and reduced motion, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['parallax layers', 'pointer parallax', 'depth animation', 'mouse parallax'],
  },
  'animated-checkmark-draw': {
    title: 'Animated Checkmark Draw',
    description: 'An SVG success checkmark whose circle and tick draw themselves in.',
    customization:
      'Set `size` and `label` for the accessible name. The stroke draws via dashoffset; reduced motion shows the completed mark.',
    seoTitle: 'Animated Checkmark Draw - Free SVG Success Animation',
    seoDescription:
      'A self-drawing SVG checkmark for success states, with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['animated checkmark', 'svg draw', 'success animation', 'stroke animation'],
  },
  'blob-morph': {
    title: 'Blob Morph',
    description: 'An organic gradient blob that morphs and rotates on a slow loop.',
    customization:
      'Adjust `size` and the gradient stops. The rotation is GPU-cheap and reduced motion freezes the shape in place.',
    seoTitle: 'Blob Morph - Free CSS Blob Animation',
    seoDescription:
      'A morphing organic gradient blob animation with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['blob morph', 'organic shape', 'gradient blob', 'morphing animation'],
  },
  'text-scramble': {
    title: 'Text Scramble',
    description: 'Text that resolves out of scrambled glyphs into its final string.',
    customization:
      'Set `speedMs` for the decode pace. Reduced motion shows the text immediately and the label stays readable to screen readers throughout.',
    seoTitle: 'Text Scramble - Free React Decode Animation',
    seoDescription:
      'A scramble-to-reveal text animation that decodes into place, with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['text scramble', 'decode animation', 'glitch text', 'scramble effect'],
  },
  'wave-text': {
    title: 'Wave Text',
    description: 'Text whose letters bob up and down in a staggered wave.',
    customization:
      'Each letter animates on an offset delay for the wave. Reduced motion holds every letter still.',
    seoTitle: 'Wave Text - Free CSS Letter Wave Animation',
    seoDescription:
      'A per-letter wave text animation with staggered delays and reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['wave text', 'letter animation', 'staggered text', 'bobbing text'],
  },
  'confetti-burst': {
    title: 'Confetti Burst',
    description: 'A button that bursts confetti particles from its center on click.',
    customization:
      'Set `particleCount` and recolor the particles. The burst is scoped to the component wrapper and a reduced-motion click is a no-op.',
    seoTitle: 'Confetti Burst - Free React Confetti Animation',
    seoDescription:
      'A click-to-burst confetti button scoped to its own container, with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['confetti burst', 'celebration animation', 'confetti button', 'particle effect'],
  },
  'gradient-border-rotate': {
    title: 'Rotating Gradient Border',
    description: 'A card wrapped in a conic gradient border that rotates continuously.',
    customization:
      'Set `borderWidth` and swap the conic stops. Reduced motion holds the gradient still while keeping the lit border.',
    seoTitle: 'Rotating Gradient Border - Free CSS Border Animation',
    seoDescription:
      'A rotating conic gradient border for cards with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['gradient border', 'rotating border', 'conic gradient', 'animated border'],
  },
  'scroll-reveal-slide': {
    title: 'Scroll Reveal Slide',
    description: 'Content that slides and fades in from a chosen edge as it enters view.',
    customization:
      'Pick the `from` edge and `distance`; set `once={false}` to replay on re-entry. The observer watches only this element and reduced motion shows it immediately.',
    seoTitle: 'Scroll Reveal Slide - Free React Scroll Animation',
    seoDescription:
      'A directional scroll-reveal slide driven by IntersectionObserver, with reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['scroll reveal', 'slide in', 'intersection observer', 'scroll animation'],
  },
  'hover-underline-grow': {
    title: 'Hover Underline Grow',
    description: 'A link whose underline scales in from the left on hover and focus.',
    customization:
      'Drop it into any nav; the underline uses currentColor so it inherits the link color. Reduced motion removes the transition.',
    seoTitle: 'Hover Underline Grow - Free CSS Link Animation',
    seoDescription:
      'A growing underline link animation with focus-visible support and reduced motion, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['hover underline', 'link underline animation', 'nav link', 'underline grow'],
  },
  'card-tilt-3d': {
    title: '3D Card Tilt',
    description: 'A card that tilts in 3D toward the pointer as it moves across it.',
    customization:
      'Set `maxTiltDeg` for the tilt range. Tracking is scoped to the card and gated on `(pointer: fine)`, so touch devices and reduced motion get a flat card.',
    seoTitle: '3D Card Tilt - Free React Pointer Tilt',
    seoDescription:
      'A pointer-following 3D tilt card gated for touch and reduced motion, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['3d card tilt', 'pointer tilt', 'hover tilt', 'perspective card'],
  },
  'animated-hamburger': {
    title: 'Animated Hamburger',
    description: 'A hamburger button whose bars morph into an X when toggled.',
    customization:
      'Use `onToggle` to drive a menu and set `label` for the accessible name. Bars animate with transform/opacity and reduced motion drops the transition.',
    seoTitle: 'Animated Hamburger - Free React Menu Toggle',
    seoDescription:
      'An accessible hamburger-to-X toggle button with aria-expanded and reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['animated hamburger', 'menu toggle', 'hamburger to x', 'nav toggle'],
  },
  'glitch-text': {
    title: 'Glitch Text',
    description: 'Text overlaid with two clipped color clones that jitter for a glitch look.',
    customization:
      'Recolor the two clone layers for different glitch palettes. The base text stays readable and reduced motion stills the clones.',
    seoTitle: 'Glitch Text - Free CSS Glitch Animation',
    seoDescription:
      'A clip-path glitch text effect with layered color clones and reduced-motion support, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['glitch text', 'glitch effect', 'clip-path animation', 'cyberpunk text'],
  },
};
