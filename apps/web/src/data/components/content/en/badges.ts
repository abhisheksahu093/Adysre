import type { ComponentContentMap } from '../types';

/** English prose for the badges category. Keys are component slugs. */
export const badgesContent: ComponentContentMap = {
  'badge-status-set': {
    title: 'Status Badge Set',
    description:
      'Success, warning, danger and info badges - a coloured dot beside a word that carries the meaning on its own.',
    customization:
      'The rule that shapes everything here: colour is reinforcement, never the message. The dot is `aria-hidden` and the state is spelled out - "Failed", not a red circle - because roughly 1 in 12 men cannot tell the green dot from the red one, and a screen reader cannot see either. To add a status, extend the `STATUS_STYLES` map with a `badge` and `dot` pair; keep the text at the 800 shade on a 50 tint in light mode and at 300 on a translucent wash in dark - 12px medium text is the hardest place on the page to hit 4.5:1, so these pairs are chosen with headroom, not at the limit.',
    seoTitle: 'Status Badge Set - Free Tailwind CSS Component',
    seoDescription:
      'Accessible success, warning, danger and info status badges with dot indicators, in HTML, CSS, Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['status badge', 'badge with dot', 'tailwind badge', 'success badge', 'error badge'],
  },
  'badge-pill-soft': {
    title: 'Soft Pill Badges',
    description:
      'Tinted pill badges in six colours and three sizes - for tags and categories, not for alarms.',
    customization:
      'Soft pills are for neutral labelling: categories, teams, topics. If a pill means "something is wrong", use the status badge with its dot instead - that distinction is a design contract, not a styling preference. Colours and sizes are flat class maps (`PILL_COLORS`, `PILL_SIZES`), so extending either is one line; keep the full class strings literal so the Tailwind scanner can see them. Dark mode swaps the 100 tint for a `/15` translucent wash, which lets the pill sit on any dark surface - a card, a modal, the page - without inventing a matching grey for each.',
    seoTitle: 'Soft Pill Badges - Free Tailwind CSS Component',
    seoDescription:
      'Tinted pill badges with color and size props, in Tailwind, React, Next.js and TypeScript. Server-component ready, WCAG AA, MIT licensed.',
    keywords: ['pill badge', 'soft badge', 'tag badge', 'tailwind pill', 'badge component'],
  },
  'badge-outline-set': {
    title: 'Outline Badges',
    description:
      'Bordered badges with no fill - they borrow whatever surface they sit on.',
    customization:
      'The outline badge paints no background, which is exactly why it composes so well on cards, tinted panels and heroes - and exactly why its text colour is conservative. With no surface of its own, the label must clear AA against anything plausible underneath, so light shades stop at 700 and dark shades sit at 300; resist the urge to lighten them for elegance. The border, by contrast, is decorative and can afford the translucent `/40` treatment in dark mode. Add colours by extending `OUTLINE_COLORS` with the same discipline.',
    seoTitle: 'Outline Badge Set - Free Tailwind CSS Component',
    seoDescription:
      'Minimal outline badges with a color prop and AA-safe text colors, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['outline badge', 'border badge', 'minimal badge', 'tailwind outline badge'],
  },
  'badge-counter': {
    title: 'Counter Badge',
    description:
      'A count badge that caps at "99+", hides at zero, and tells screen readers what it is counting.',
    customization:
      'Three decisions do the work. The cap: `count > max` renders `"99+"` because an uncapped counter grows a character per order of magnitude until it pushes its host off-grid - `max` is a layout guarantee wearing a content hat. The zero: `count <= 0` returns `null`, since an empty red circle is a false alarm and "0" is a fact nobody pinned a badge for. The noun: `srLabel` appends sr-only text so a screen reader hears "99+ unread notifications" instead of a naked number. The `min-w` + padding combination (never a fixed width) is what lets one digit render a circle while "99+" stretches into a pill.',
    seoTitle: 'Counter Badge with 99+ Cap - Free React Component',
    seoDescription:
      'A notification counter badge with max-cap logic, zero-hiding and screen reader labelling, in HTML, CSS, Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['counter badge', 'notification count', '99+ badge', 'unread badge', 'badge cap'],
  },
  'badge-removable': {
    title: 'Removable Badge',
    description:
      'A filter chip with a dismiss × - a real button with a real name, not a clickable pill.',
    customization:
      'Only the × is interactive, on purpose. Making the whole chip a button gives it two jobs - represent the filter and remove it - and one accessible name to cover both. The × is a native `<button>`, so Enter, Space and focus handling come free, and its `aria-label` names action and target together ("Remove React"): a row of chips that each announce only "remove" is a guessing game. The `-my-1` trick lets the 24px hit area overhang the pill without inflating its height; on touch-primary layouts, grow the button toward 40px rather than shrinking the pill around it. The component is controlled - it owns no list state, it just reports `onRemove`.',
    seoTitle: 'Removable Badge Chip - Free React Component',
    seoDescription:
      'A dismissible filter chip with a keyboard-accessible remove button, in Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['removable badge', 'dismissible chip', 'filter chip', 'badge with close button'],
  },
  'badge-with-icon': {
    title: 'Badge With Icon',
    description:
      'A pill badge with an inline SVG beside the label - the icon decorates, the text informs.',
    customization:
      'The icon slot takes any inline SVG as a `ReactNode`; the default bolt shows the pattern to copy: `aria-hidden`, `fill="currentColor"` so it inherits the badge’s text colour in both themes, and `h-3.5` so it sits on the cap height of `text-xs` instead of towering over it. The label is required by design - an icon-only badge is a rebus, and this component refuses to be one. To recolour, change the pill’s tint classes once; the icon follows automatically through `currentColor`, which is the entire reason to prefer it over a hardcoded fill.',
    seoTitle: 'Badge With Icon - Free Tailwind CSS Component',
    seoDescription:
      'A badge with an inline SVG icon slot and required text label, in Tailwind, React and TypeScript. Accessible, free and MIT licensed.',
    keywords: ['icon badge', 'badge with icon', 'svg badge', 'tailwind icon badge'],
  },
  'badge-gradient-shine': {
    title: 'Gradient Shine Badge',
    description:
      'A gradient pill with a periodic shine sweep - and a reduced-motion story that keeps the gradient.',
    customization:
      'The shine is an absolutely positioned strip of `via-white/30` gradient that a keyframe slides across the pill; `overflow-hidden` on the pill is what turns a moving rectangle into a glint. The reduced-motion handling is the part worth stealing: the strip starts at `-translate-x-full`, and because a running animation owns `transform`, that utility is inert - until `motion-reduce:animate-none` kills the animation, at which point the same utility takes back over and parks the strip off-canvas. Motion is the only casualty; the gradient stays. The keyframes travel in a `<style>` tag with the component, so there is nothing to add to a Tailwind config. Keep the label white and the gradient stops at 600 - lighter stops flunk AA under 12px text.',
    seoTitle: 'Gradient Shine Badge - Free CSS Animation Component',
    seoDescription:
      'An animated gradient badge with a shine sweep and reduced-motion fallback, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['gradient badge', 'shine animation', 'animated badge', 'shimmer badge'],
  },
  'badge-corner-notification': {
    title: 'Corner Notification Badge',
    description:
      'A count or dot pinned to the corner of anything - button, avatar, icon - via a positioning wrapper.',
    customization:
      'The component is a wrapper, not a sibling: `relative inline-flex` around your host, `absolute` negative offsets for the badge, so it works on any child without measuring it. The `ring-2` fakes a cutout between badge and host; it is tinted to the page background (`ring-white dark:ring-gray-900`), so if the host sits on a card, retint the ring to the card’s surface or the illusion breaks. `dot` mode is presence-only - no number - which makes `srLabel` non-negotiable there: a 10px red circle with no text is invisible to assistive tech and cryptic to everyone else. Count mode inherits the counter badge’s cap and zero-hiding logic.',
    seoTitle: 'Corner Notification Badge - Free React Component',
    seoDescription:
      'A notification badge positioned on the corner of a button or avatar, with count and dot modes, in Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: [
      'notification badge',
      'corner badge',
      'badge on button',
      'avatar badge',
      'indicator dot',
    ],
  },
  'badge-ribbon-corner': {
    title: 'Corner Ribbon',
    description:
      'A 45° ribbon across a card corner, built from one rotated span and one equation.',
    customization:
      'The geometry is a single constraint: the band’s centre must sit at equal distances from the corner on both axes, or the 45° rotation drifts off the diagonal. With `w-40` (160px) the half-width is 80, so `right-[-48px]` centres the band 32px in from the edge, and `top-[20px]` plus half the ~24px band height puts it 32px down - 32 equals 32. Change one number and you must change its partner. The wrapper adds only `relative overflow-hidden` (the clipping is what trims the band ends into a wedge); the card border, radius and padding are yours to supply via `className`, so the ribbon drapes over any card you already have. Keep the label to one short word and pad the card’s top-right content (`pr-14`) so headings do not run underneath.',
    seoTitle: 'Corner Ribbon Badge - Free Tailwind CSS Component',
    seoDescription:
      'A diagonal corner ribbon for cards with exact positioning math explained, in HTML, CSS, Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['corner ribbon', 'card ribbon', 'diagonal ribbon', 'sale ribbon', 'ribbon badge'],
  },
  'badge-verified-check': {
    title: 'Verified Check Badge',
    description:
      'An inline scalloped seal with a check, drawn in two SVG paths - no icon library.',
    customization:
      'The seal is two paths in one 24×24 SVG: the scalloped rosette filled with `currentColor` and the check stroked in white on top, so recolouring is one text-colour class. Dark mode deliberately uses `blue-500` rather than the usual 400 lift: the white check needs 3:1 against its own fill (WCAG graphics contrast), and blue-400 misses it. The SVG is `aria-hidden` and the word "Verified" sits beside it in real text - the blue tick means nothing to a screen reader, and platform lore aside, less than you think to everyone else. If you must render the seal alone, give the wrapping span an `aria-label` and a tooltip; better, keep the word.',
    seoTitle: 'Verified Check Badge - Free SVG React Component',
    seoDescription:
      'An inline SVG verified seal with check mark and visible text label, in Tailwind, React and TypeScript. Accessible, free and MIT licensed.',
    keywords: ['verified badge', 'check badge', 'verification seal', 'svg badge', 'trust badge'],
  },
};
