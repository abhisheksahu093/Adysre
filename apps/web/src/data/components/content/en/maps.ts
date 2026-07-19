import type { ComponentContentMap } from '../types';

/** English prose for the maps category. Keys are component slugs. */
export const mapsContent: ComponentContentMap = {
  'map-world-dotted': {
    title: 'Dotted World Map',
    description:
      'A stylised dotted-continent world drawn in inline SVG, with labelled city pins and no tile server.',
    customization:
      'Pass your own `markers` as `{ id, label, x, y }` where `x`/`y` are percentages over the panel. The continents are decorative blobs (`aria-hidden`); every pin is a real button with an `aria-label` and a focus ring, so a keyboard reaches them all.',
    seoTitle: 'Dotted World Map - Free Tailwind CSS Component',
    seoDescription:
      'A pure-SVG dotted world map with labelled, keyboard-reachable pins and no external map service, in Tailwind, React and TypeScript.',
    keywords: ['dotted world map', 'svg map', 'world map pins', 'tailwind map'],
  },
  'map-office-locations': {
    title: 'Office Locations Map',
    description:
      'A dotted map panel of office pins beside a matching address list, stacking on mobile.',
    customization:
      'Drive both the pins and the list from a single `offices` array so they never drift apart. The map sits below the list on mobile (`order-`) so the addresses are read first, and each pin is a labelled button.',
    seoTitle: 'Office Locations Map - Free Tailwind CSS Component',
    seoDescription:
      'A dotted map with office pins and a synced address list, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['office locations map', 'locations map', 'map with list', 'contact map'],
  },
  'map-contact-split': {
    title: 'Contact Split Map',
    description:
      'Address, email and phone on one side, a dotted map with a single pin on the other.',
    customization:
      'Feed `address`, `email` and `phone`; the email and phone become real `mailto:`/`tel:` links with the phone stripped to digits for the `href`. The two columns collapse to one below `md`, keeping the contact details above the map.',
    seoTitle: 'Contact Section with Map - Free Tailwind CSS Component',
    seoDescription:
      'A split contact block with address details and a dotted SVG map, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['contact map', 'contact section', 'address map', 'split contact'],
  },
  'map-region-selector': {
    title: 'Region Selector Map',
    description:
      'An abstract grid of region tiles you can pick from, with the choice announced below.',
    customization:
      'Pass `regions` and an optional `defaultSelectedId`, and read the choice via `onSelect`. Each tile is a toggle button carrying `aria-pressed`, sized to a 44px minimum tap target; the grid goes two-up on phones and three-up from `sm`.',
    seoTitle: 'Region Selector - Free React Component',
    seoDescription:
      'An accessible region-selector grid with pressed state and a keyboard-reachable tap target, in Tailwind, React and TypeScript.',
    keywords: ['region selector', 'region picker', 'map selector', 'area selector'],
  },
  'map-pin-popover': {
    title: 'Map Pin Popover',
    description:
      'Dotted map pins that open a small details popover on click, one at a time.',
    customization:
      'Supply `places` as `{ id, label, detail, x, y }`. Each pin is a button with `aria-expanded`; clicking toggles its popover, Escape closes it, and opening one closes the rest so only a single card shows at a time.',
    seoTitle: 'Map Pin with Popover - Free React Component',
    seoDescription:
      'Interactive map pins with an accessible details popover and Escape-to-close, in Tailwind, React and TypeScript.',
    keywords: ['map pin popover', 'map tooltip', 'interactive map pins', 'map marker popover'],
  },
  'map-coverage-stats': {
    title: 'Coverage Stats Map',
    description:
      'A dotted map with a floating stat card summarising reach - countries, cities, uptime.',
    customization:
      'Pass any number of `stats` as `{ id, label, value }`. The overlay card carries its own near-opaque backing rather than relying on the blur alone, because text over an arbitrary dotted field has to bring its own contrast to clear AA.',
    seoTitle: 'Coverage Map with Stats - Free Tailwind CSS Component',
    seoDescription:
      'A dotted coverage map with a floating metrics card, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['coverage map', 'stats map', 'global coverage', 'map metrics'],
  },
  'map-store-locator-list': {
    title: 'Store Locator List',
    description:
      'A scannable store list linked to a dotted map, where selecting either highlights the pair.',
    customization:
      'One `stores` array drives the list and the pins; clicking a row or its pin sets the active store, enlarging the pin and highlighting the card. The active state is shared, so list and map never disagree.',
    seoTitle: 'Store Locator with List - Free React Component',
    seoDescription:
      'An interactive store locator pairing a list with a dotted SVG map and a shared active state, in Tailwind, React and TypeScript.',
    keywords: ['store locator', 'store list map', 'find a store', 'location finder'],
  },
  'map-route-steps': {
    title: 'Route Steps Map',
    description:
      'A zig-zagging SVG route with numbered stops above an ordered list of directions.',
    customization:
      'Pass `steps` as `{ id, label, detail }`; the stops are spread across the SVG viewBox and numbered automatically, and the same list renders as an accessible `<ol>` beneath. The route line and stop numbers stay in sync with the list.',
    seoTitle: 'Route Directions Map - Free Tailwind CSS Component',
    seoDescription:
      'A numbered SVG route with a directions list, in Tailwind, React and TypeScript. No external map service. MIT licensed.',
    keywords: ['route map', 'directions steps', 'numbered route', 'itinerary map'],
  },
  'map-embed-responsive': {
    title: 'Responsive Map Embed',
    description:
      'A responsive 16:9 map frame that renders a styled placeholder and leaves the live iframe commented out.',
    customization:
      'The frame keeps a fixed aspect ratio so it never causes layout shift, and it ships a placeholder rather than a live `<iframe>` - the real embed is left commented in the code so nothing loads or phones home until you deliberately opt in. Drop your provider snippet in and delete the placeholder.',
    seoTitle: 'Responsive Map Embed - Free Tailwind CSS Component',
    seoDescription:
      'A responsive, layout-shift-free map embed frame with a privacy-first commented iframe, in Tailwind, React and TypeScript.',
    keywords: ['responsive map embed', 'map iframe', 'embed map', 'aspect ratio map'],
  },
  'map-dark-glow': {
    title: 'Dark Glow Map',
    description:
      'A near-black dotted world with a soft radial glow behind it and glowing city pins.',
    customization:
      'The panel paints its own `bg-gray-950` surface and blurred glow, so it looks identical on a light or dark page with no `dark:` variants. Continents are decorative blob dots; the pins are labelled buttons whose focus rings are tuned against the dark backdrop.',
    seoTitle: 'Dark Glow World Map - Free Tailwind CSS Component',
    seoDescription:
      'A dark dotted world map with a radial glow and labelled pins, self-contained across themes, in Tailwind, React and TypeScript.',
    keywords: ['dark map', 'glow map', 'dark world map', 'dotted map dark'],
  },
};
