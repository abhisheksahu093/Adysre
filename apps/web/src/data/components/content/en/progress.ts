import type { ComponentContentMap } from '../types';

/** English prose for the progress category. Keys are component slugs. */
export const progressContent: ComponentContentMap = {
  'progress-linear-label': {
    title: 'Linear Progress With Label',
    description:
      'A labelled horizontal progress bar with a live percentage readout above the track.',
    customization:
      'The `aria-valuenow` sits on the wrapper and the visible `%` is derived from the same value, so the two can never drift; set `showValue={false}` when the caption alone is enough. Retint the fill by swapping the `bg-blue-600` utility.',
    seoTitle: 'Linear Progress Bar With Label - Free Tailwind Component',
    seoDescription:
      'An accessible labelled linear progress bar with a percentage readout, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['progress bar', 'linear progress', 'progress label', 'tailwind progress'],
  },
  'progress-circular-ring': {
    title: 'Circular Progress Ring',
    description:
      'An SVG ring that fills from the top with a bold percentage in its centre.',
    customization:
      'The ring is driven by `stroke-dashoffset` over the circumference, and both circles are `aria-hidden` because the centred `%` is the real readout. Resize with `size` and `strokeWidth`, or recolour via the `stroke-blue-600` class.',
    seoTitle: 'Circular Progress Ring - Free SVG Tailwind Component',
    seoDescription:
      'An accessible circular SVG progress ring with a centred percentage, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['circular progress', 'progress ring', 'svg progress', 'radial progress'],
  },
  'progress-segmented': {
    title: 'Segmented Progress',
    description:
      'A discrete progress track split into equal pill segments that fill left to right.',
    customization:
      'Set the notch count with `segments`; the value rounds to the nearest segment while `aria-valuenow` keeps the true number. The pills stay decorative, so screen readers hear the percentage, not the geometry.',
    seoTitle: 'Segmented Progress Bar - Free Tailwind Component',
    seoDescription:
      'An accessible segmented progress meter with configurable notches, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['segmented progress', 'discrete progress', 'stepped progress', 'progress meter'],
  },
  'progress-striped-animated': {
    title: 'Striped Animated Progress',
    description:
      'A thick progress bar with a moving barber-pole stripe that freezes under reduced motion.',
    customization:
      'The stripe keyframes ship inside the component in a `<style>` tag, and `motion-reduce:animate-none` halts them because the stripes add nothing the percentage does not. Swap the fill colour to rebrand.',
    seoTitle: 'Animated Striped Progress Bar - Free Tailwind Component',
    seoDescription:
      'An accessible animated striped progress bar with a reduced-motion fallback, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['striped progress', 'animated progress bar', 'barber pole progress', 'css progress'],
  },
  'progress-multi-stacked': {
    title: 'Multi-Segment Stacked Progress',
    description:
      'A single bar split into coloured category segments with a labelled, numeric legend.',
    customization:
      'Pass `segments` of `{ label, value, className }`; the bar and legend share each colour class and `max` sets the track total. The legend never encodes by colour alone - every row pairs a swatch with a text label and a value, so it survives greyscale and colour blindness.',
    seoTitle: 'Stacked Multi-Segment Progress Bar - Free Tailwind Component',
    seoDescription:
      'An accessible stacked progress bar with a colour-safe labelled legend, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['stacked progress', 'multi segment bar', 'progress legend', 'usage breakdown'],
  },
  'progress-goal-card': {
    title: 'Goal Progress Card',
    description:
      'A card pairing a raised-versus-goal amount with a progress bar and a caption.',
    customization:
      'Feed `current`, `goal` and an optional `prefix` like `$`; amounts format with `toLocaleString` and the fill clamps to 100% so an over-funded goal cannot overflow. `aria-valuenow`/`max` carry the real amounts for assistive tech.',
    seoTitle: 'Goal Progress Card - Free Tailwind Component',
    seoDescription:
      'An accessible fundraising goal card with a progress bar and amount readout, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['goal progress', 'fundraising card', 'progress card', 'target progress'],
  },
  'progress-radial-dashboard': {
    title: 'Radial Dashboard Gauge',
    description:
      'A semicircular gauge with a large numeral, built from one SVG arc drawn twice.',
    customization:
      '`pathLength={100}` normalises the arc so the value stroke is simply `strokeDasharray="<pct> 100"` - no trigonometry. The arc is `aria-hidden`; the numeral and the wrapper `aria-valuenow` carry the value. Set a `unit` like `%` or ` pts`.',
    seoTitle: 'Radial Dashboard Gauge - Free SVG Tailwind Component',
    seoDescription:
      'An accessible semicircular dashboard gauge with a numeric readout, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['radial gauge', 'dashboard gauge', 'semicircle progress', 'svg gauge'],
  },
  'progress-mini-inline': {
    title: 'Mini Inline Progress',
    description:
      'A compact single-row progress bar with a label and percentage, sized for table cells.',
    customization:
      'The track uses `min-w-0 flex-1` so it shrinks inside a flex row instead of overflowing at 320px, while the label and percentage stay `shrink-0`. Drop it straight into list rows or table cells.',
    seoTitle: 'Mini Inline Progress Bar - Free Tailwind Component',
    seoDescription:
      'A compact inline progress bar for rows and tables, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['inline progress', 'mini progress bar', 'compact progress', 'table progress'],
  },
  'progress-steps-checklist': {
    title: 'Steps Checklist Progress',
    description:
      'A checklist of tasks with a bar whose range is completed steps, not a percentage.',
    customization:
      'Pass `steps` of `{ label, done }`; `aria-valuenow`/`max` count completed steps so a screen reader hears "2 of 4". The check glyphs are `aria-hidden` because list order and strike-through already convey each state.',
    seoTitle: 'Steps Checklist Progress - Free Tailwind Component',
    seoDescription:
      'An accessible onboarding checklist with a step-based progress bar, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['checklist progress', 'steps progress', 'onboarding checklist', 'task progress'],
  },
  'progress-indeterminate-thin': {
    title: 'Thin Indeterminate Progress',
    description:
      'A slim indeterminate loading bar with a sliding chip and a static reduced-motion fallback.',
    customization:
      'This is the one bar that omits `aria-valuenow` on purpose - in ARIA an absent value signals an unknown duration, and `aria-busy` marks the region as working. `motion-reduce` swaps the sliding chip for a static one so the state stays visible without movement.',
    seoTitle: 'Thin Indeterminate Progress Bar - Free Tailwind Component',
    seoDescription:
      'An accessible thin indeterminate loading bar with a reduced-motion fallback, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['indeterminate progress', 'loading bar', 'thin progress', 'linear loader'],
  },
};
