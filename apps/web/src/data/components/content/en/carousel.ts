import type { ComponentContentMap } from '../types';

/** English prose for the carousel category. Keys are component slugs. */
export const carouselContent: ComponentContentMap = {
  'carousel-basic': {
    title: 'Basic Carousel',
    description: 'A slide carousel with prev/next arrows, dots and a polite live region.',
    customization:
      'The root is a labelled `role="region"` with `aria-roledescription="carousel"`, and each slide is a `role="group"` labelled "N of M" - that pair is what tells a screen-reader user what they are in and where they are. The viewport is `aria-live="polite"`, so pressing next announces the new slide without stealing focus; off-screen slides get `aria-hidden` so their text is not read while parked. The track is one flex row translated by whole viewport widths, so the only thing the JS ever writes is a transform.',
    seoTitle: 'Basic Carousel - Free Accessible React Slider',
    seoDescription:
      'An accessible carousel with arrows, dots, ARIA roles and a polite live region. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['carousel', 'accessible carousel', 'react slider', 'tailwind carousel', 'aria carousel'],
  },

  'carousel-autoplay': {
    title: 'Autoplay Carousel',
    description: 'A carousel that advances on a timer, pauses on hover and focus, and respects reduced motion.',
    customization:
      'Four rules make autoplay acceptable, and all four are in here. There is a real pause button (WCAG 2.2.2: anything moving for more than five seconds needs one). It pauses on hover *and* on focus-within, so a keyboard user tabbing to the arrows does not have the slide move out from under them. Under `prefers-reduced-motion` it never starts - off, not slower - and the preference is watched live, because users flip it mid-session. And `aria-live` is `off` while it plays, flipping to `polite` the moment it stops: a carousel that announces itself every five seconds is noise, but a manual move still deserves an announcement. Change `INTERVAL` freely; do not remove the pause control.',
    seoTitle: 'Autoplay Carousel - Free Accessible Auto-Rotating Slider',
    seoDescription:
      'An autoplay carousel with a pause control, pause on hover and focus, and full prefers-reduced-motion support. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['autoplay carousel', 'auto rotating slider', 'accessible carousel', 'reduced motion', 'react carousel'],
  },

  'carousel-thumbnails': {
    title: 'Thumbnail Carousel',
    description: 'A main image with a clickable thumbnail strip beneath it.',
    customization:
      'This is a gallery, not a slide show: the strip is the primary control, so every thumb is a real button whose label names the image ("Show Front view") and `aria-current` marks the one on display. Selection shows as a ring *and* full opacity - two signals, never colour alone. The thumbnail `<img>` carries `alt=""` because the button already names it; duplicating the name would make a screen reader say it twice. The big image keeps its real alt, and swapping it by `key` makes the live region see a new node rather than a mutated `src`.',
    seoTitle: 'Thumbnail Carousel - Free Accessible Image Gallery',
    seoDescription:
      'An accessible image gallery with a main image and a keyboard-operable thumbnail strip. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['thumbnail carousel', 'image gallery', 'product gallery', 'accessible carousel', 'react gallery'],
  },

  'carousel-multi-slide': {
    title: 'Multi-Slide Carousel',
    description: 'Three cards at a time on desktop, one on mobile, built on scroll-snap.',
    customization:
      'Scroll-snap rather than a transform, which buys three things a `translateX` carousel has to fake. The browser does the responsive maths - the slide is a flex-basis and "how many fit" is whatever fits, so there is no `matchMedia` and no per-breakpoint index juggling. Touch swipe and trackpad scroll work for free. And the track is a focusable scroll region (`tabIndex={0}` + `role="group"` + a label), so keyboard users get the browser\'s own arrow-key scrolling. The buttons measure one step from the DOM (slide width + the computed `column-gap`), so changing `basis-[calc((100%-2rem)/3)]` to four across needs no JS edit at all.',
    seoTitle: 'Multi-Slide Carousel - Free Responsive Scroll-Snap Slider',
    seoDescription:
      'A responsive carousel showing three cards on desktop and one on mobile using CSS scroll-snap, with a focusable scroll region. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['multi slide carousel', 'scroll snap carousel', 'responsive slider', 'card carousel', 'react carousel'],
  },

  'carousel-fade': {
    title: 'Fade Carousel',
    description: 'A carousel that cross-fades between slides instead of sliding.',
    customization:
      'Structurally a stack, not a row: every slide is `absolute inset-0` in the same box and only opacity changes, so there is no track and no transform. Two consequences follow. The stage needs an explicit height, because absolutely positioned children cannot size their parent - change `h-56` to fit your tallest slide. And the faded-out slides are still painted underneath, so they get `aria-hidden` *and* `pointer-events-none`; without the latter an invisible slide silently swallows clicks meant for the one on top. Under reduced motion the dissolve becomes a cut, which is the right answer: the change still happens, without the motion.',
    seoTitle: 'Fade Carousel - Free Accessible Cross-Fade Slider',
    seoDescription:
      'A cross-fading carousel with correct ARIA, a polite live region and reduced-motion support. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['fade carousel', 'crossfade slider', 'accessible carousel', 'react slideshow', 'tailwind carousel'],
  },

  'carousel-cards-peek': {
    title: 'Peek Cards Carousel',
    description: 'A card carousel where the next and previous cards peek in from the edges.',
    customization:
      'Cards are 85% wide (70% from `sm`) and `snap-center`, so a neighbour always shows at each edge as a "there is more" cue. Scroll-snap does the paging; the arrows nudge by one card width read live from the DOM, so widening the cards needs no code change.',
    seoTitle: 'Peek Cards Carousel - Free Responsive Scroll-Snap Slider',
    seoDescription:
      'A responsive card carousel with peeking neighbours built on CSS scroll-snap and a focusable scroll region. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['peek carousel', 'card carousel', 'scroll snap', 'responsive slider'],
  },

  'carousel-vertical': {
    title: 'Vertical Carousel',
    description: 'A transform carousel turned on its side, paging up and down.',
    customization:
      'The track is a flex column translated with `translateY`, and the stage carries an explicit height because the slides no longer size it. Up/Down buttons and a vertical dot rail replace the usual horizontal controls; reduced motion turns the glide into a cut.',
    seoTitle: 'Vertical Carousel - Free Accessible Up/Down Slider',
    seoDescription:
      'An accessible vertical carousel that pages up and down with a transform, ARIA slide roles and reduced-motion support. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['vertical carousel', 'up down slider', 'accessible carousel', 'react carousel'],
  },

  'carousel-center-mode': {
    title: 'Center Mode Carousel',
    description: 'The active card sits centred and full-size while its neighbours peek and dim.',
    customization:
      'The track offset is `calc(15% - index*70%)`: 15% is half the space a 70%-wide card leaves, so the current card lands dead centre. Inactive cards scale to 90% at 50% opacity, giving a coverflow feel with transforms alone.',
    seoTitle: 'Center Mode Carousel - Free Coverflow-Style Slider',
    seoDescription:
      'A centred coverflow carousel where the active card is emphasised and neighbours peek, using transforms only. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['center mode carousel', 'coverflow', 'focused slider', 'react carousel'],
  },

  'carousel-progress-dots': {
    title: 'Progress Dots Carousel',
    description: 'A slide carousel with a determinate progress bar alongside the dots.',
    customization:
      'The fill width is `(index+1)/total`, so the bar reads as "how far through you are" while the dots stay the real steering control. The bar is `aria-hidden` decoration; swap `transition-[width]` timing to taste.',
    seoTitle: 'Progress Dots Carousel - Free Slider with Progress Bar',
    seoDescription:
      'An accessible carousel pairing navigation dots with a determinate progress bar. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['progress carousel', 'progress dots', 'slider progress bar', 'react carousel'],
  },

  'carousel-testimonial': {
    title: 'Testimonial Carousel',
    description: 'A quote slider with gradient initials avatars and no image assets.',
    customization:
      'Each slide is a `figure`/`blockquote` with a gradient avatar built from the author\'s initials, so there is nothing to host. Slides page with a transform and the avatar tile is `aria-hidden` because the name is already real text.',
    seoTitle: 'Testimonial Carousel - Free Accessible Quote Slider',
    seoDescription:
      'An accessible testimonial carousel with semantic blockquotes and gradient initials avatars. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['testimonial carousel', 'quote slider', 'reviews carousel', 'react testimonials'],
  },

  'carousel-logo-strip': {
    title: 'Logo Strip Marquee',
    description: 'An infinite, auto-scrolling logo strip that pauses on hover and reduced motion.',
    customization:
      'The list is rendered twice and the track slides -50% for a seamless loop, with keyframes injected inline so the component is self-contained. It pauses on hover and stops entirely under `prefers-reduced-motion`; the wrapper scrolls, so the logos stay reachable when the motion is off.',
    seoTitle: 'Logo Strip Marquee - Free Infinite Auto-Scrolling Logos',
    seoDescription:
      'An infinite logo marquee with gradient chips, hover pause and full reduced-motion support - no image assets. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['logo marquee', 'logo strip', 'infinite scroll', 'reduced motion'],
  },

  'carousel-fullscreen-hero': {
    title: 'Fullscreen Hero Carousel',
    description: 'A full-bleed hero carousel with gradient panels, headings and real CTAs.',
    customization:
      'Each slide is a gradient panel with an eyebrow, heading, copy and a genuine CTA link; off-screen CTAs drop out of the tab order so focus never lands on a hidden slide. Overlaid arrows and dots sit on translucent chips for contrast against any gradient.',
    seoTitle: 'Fullscreen Hero Carousel - Free Full-Bleed Slider',
    seoDescription:
      'A full-bleed hero carousel with gradient panels, calls to action, overlaid controls and correct focus management. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['hero carousel', 'fullscreen slider', 'banner carousel', 'react hero'],
  },

  'carousel-thumbnail-sync': {
    title: 'Synced Thumbnail Carousel',
    description: 'A main stage and a thumbnail rail that stay in sync, with the active thumb auto-scrolling into view.',
    customization:
      'Selecting a thumb pages the stage, and whichever thumb becomes current calls `scrollIntoView`, so a long rail never drifts away from the stage. Each thumb is a real button labelled with the frame name, and the active one shows as full opacity plus a ring - two signals, never colour alone.',
    seoTitle: 'Synced Thumbnail Carousel - Free Gallery with Thumbnail Rail',
    seoDescription:
      'An accessible gallery pairing a main stage with a synced thumbnail rail that auto-scrolls the active thumb into view. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['thumbnail carousel', 'synced thumbnails', 'gallery slider', 'react gallery'],
  },

  'carousel-parallax': {
    title: 'Parallax Carousel',
    description: 'A carousel whose backdrops lag behind the text to read as depth.',
    customization:
      'Every panel translates a full 100% per step while its gradient backdrop is counter-shifted 30% and over-scaled, so the background trails the foreground. Everything is transform-only and honours reduced motion, where the parallax becomes an instant cut.',
    seoTitle: 'Parallax Carousel - Free Depth-Effect Slider',
    seoDescription:
      'A transform-only parallax carousel where backdrops lag behind the foreground for a depth effect, with reduced-motion support. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['parallax carousel', 'depth slider', 'transform carousel', 'react parallax'],
  },

  'carousel-scroll-snap': {
    title: 'Scroll-Snap Carousel',
    description: 'A full-slide carousel that is one native CSS scroll-snap container.',
    customization:
      'The whole carousel is a `snap-x snap-mandatory` scroll region, so swipe, trackpad and the browser\'s own focus scrolling page it for free - no transform is ever set. The dots call `scrollTo` and track the scrolled position back, keeping the active dot honest.',
    seoTitle: 'Scroll-Snap Carousel - Free Native CSS Slider',
    seoDescription:
      'A full-slide carousel built entirely on native CSS scroll-snap, with a focusable scroll region and position-aware dots. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['scroll snap carousel', 'css carousel', 'native slider', 'react carousel'],
  },
};
