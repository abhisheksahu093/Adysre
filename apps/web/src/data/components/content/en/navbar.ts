import type { ComponentContentMap } from '../types';

/** English prose for the navbar category. Keys are component slugs. */
export const navbarContent: ComponentContentMap = {
  'navbar-simple': {
    title: 'Simple Navbar',
    description:
      'A logo, an inline link row and a CTA, collapsing to a hamburger menu below the md breakpoint.',
    customization:
      'The active link is marked with `aria-current="page"` and the highlight is styled off that same attribute rather than a parallel `is-active` class - one source of truth, so what a screen reader announces cannot drift from what the eye sees. Drive it from your router: `usePathname() === link.href` in Next.js. The hamburger is a real button with `aria-expanded` and `aria-controls`; the icon swapping from bars to a cross is the *decoration*, those two attributes are what actually communicate state. Change the `md:` breakpoint in one place - the links, the CTA and the toggle all key off it, so moving it means editing three utilities, not one.',
    seoTitle: 'Simple Responsive Navbar - Free Tailwind Component',
    seoDescription:
      'A responsive navbar with a logo, links, a CTA and a mobile hamburger menu, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['tailwind navbar', 'responsive navbar', 'hamburger menu', 'react navbar', 'header component'],
  },
  'navbar-with-dropdown': {
    title: 'Navbar with Dropdown',
    description:
      'A nav bar whose Products link opens a real keyboard-navigable submenu - click, arrows, Escape.',
    customization:
      'A dropdown that opens on `:hover` is a mouse-only control: there is no hover on a phone and no hover on a keyboard. This one opens on click and on Enter, moves between entries with the arrow keys, closes on Escape returning focus to the trigger, and dismisses on an outside click. The submenu is a plain `<ul>` of links, deliberately **not** `role="menu"` - these navigate somewhere, they are not commands, and `role="menu"` makes a screen reader announce them as application menu items and swallow the arrow keys you just wired up. The chevron rotation hangs off `aria-expanded`, so the arrow physically cannot point the wrong way. Replace `OPTIONS` with your own destinations. The bar row is `min-h-14` with `flex-wrap` rather than a fixed `h-14`: the links stay visible at every width, so on a 320px phone they wrap under the brand instead of forcing a horizontal scrollbar.',
    seoTitle: 'Navbar with Dropdown Menu - Free Accessible React Component',
    seoDescription:
      'A navbar with a keyboard-navigable dropdown submenu - arrow keys, Escape and outside-click dismissal. HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['navbar dropdown', 'submenu navbar', 'accessible dropdown menu', 'react nav dropdown'],
  },
  'navbar-centered-logo': {
    title: 'Centered Logo Navbar',
    description: 'Links left, wordmark dead centre, actions right - a three-column editorial header.',
    customization:
      'The layout is `grid-cols-[1fr_auto_1fr]`, and that is the whole trick. With flex and `justify-between` the logo drifts off-centre the moment the two side groups differ in width - which they always do, the second "Sign in" becomes "Create free account". Equal 1fr rails pin the middle column to the centre of the *page* regardless of what flanks it. Below `sm` the left group drops out and the wordmark stays centred on its own. Stateless: no `use client`, no JavaScript, it renders as a Server Component.',
    seoTitle: 'Centered Logo Navbar - Free Tailwind CSS Component',
    seoDescription:
      'A three-column navbar with a centred logo that stays centred as the side groups change width. HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['centered logo navbar', 'grid navbar', 'symmetric header', 'tailwind centered nav'],
  },
  'navbar-sticky-blur': {
    title: 'Sticky Blur Navbar',
    description:
      'A translucent sticky bar that stays blurred over the page and earns a border once you scroll.',
    customization:
      'At the top of a page the bar and the hero are one surface, so a border there is a seam with nothing on either side of it. The moment content slides underneath, that same hairline is what stops the bar dissolving into it - hence the border appearing at 8px of scroll rather than being painted from the start. State is a `data-scrolled` attribute rather than a toggled class, so the handler writes one value and Tailwind reads it with `data-[scrolled=true]:`. Keep the background alpha at `/75`-`/85`: a prettier, more transparent bar is one whose labels fail 4.5:1 the moment a busy hero scrolls under them. The blur is progressive enhancement - a browser without `backdrop-filter` still gets a legible opaque-enough bar. The row is `min-h-14` with `flex-wrap`, not a fixed height: at 320px the always-visible links wrap under the brand rather than overflowing the viewport.',
    seoTitle: 'Sticky Blur Navbar - Free Glassmorphism Header Component',
    seoDescription:
      'A sticky translucent navbar with backdrop blur that gains a border on scroll, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['sticky navbar', 'blur navbar', 'backdrop blur header', 'glassmorphism navbar', 'scroll navbar'],
  },
  'navbar-mobile-drawer': {
    title: 'Mobile Drawer Navbar',
    description:
      'A slide-in drawer with a real focus trap, Escape to close, scroll lock and focus restoration.',
    customization:
      'A drawer is a modal, and a modal that only *looks* modal is the classic half-built one: the page behind it still takes Tab, so a keyboard user walks straight out of the open drawer into links they cannot see. Four things fix it and all four are here - `role="dialog" aria-modal="true"`; a focus trap that wraps Tab off the last item back to the first and Shift+Tab off the first to the last; Escape closing it with focus returned to the button that opened it, not dumped at the top of the document; and `overflow: hidden` on `<body>` so the page does not scroll under your finger while the drawer sits still. The slide animation is decoration and sits behind `motion-safe:` - someone who asked for less motion still gets the drawer, it simply arrives. The `focusables()` selector covers links and buttons; widen it if you add inputs.',
    seoTitle: 'Mobile Drawer Navbar with Focus Trap - Free React Component',
    seoDescription:
      'An accessible mobile navigation drawer with a focus trap, Escape handling, scroll lock and focus restoration. HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['mobile drawer navbar', 'focus trap drawer', 'slide in menu', 'accessible mobile nav', 'react drawer'],
  },
  'navbar-mega-menu': {
    title: 'Mega Menu Navbar',
    description:
      'A Products button opens a full-bleed mega panel on desktop and a flat headed list on mobile.',
    customization:
      'Above `lg` the trigger opens a full-bleed panel whose inner grid re-caps to the same `max-w-6xl` as the bar, so the columns line up with the nav instead of floating loose. Below `lg` the same destinations render as a plain headed list inside the hamburger - no floating surface to mis-tap on a phone. Escape closes the panel and returns focus to the trigger; an outside click dismisses it. Swap `MEGA_ITEMS` for your own sections.',
    seoTitle: 'Mega Menu Navbar - Free Accessible React Component',
    seoDescription:
      'A responsive mega-menu navbar with a full-bleed desktop panel and a flat mobile list, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['mega menu navbar', 'mega menu', 'responsive navbar', 'react mega menu'],
  },
  'navbar-with-search': {
    title: 'Navbar with Search',
    description:
      'A header with an inline search field that flexes to fit, collapsing the links to a hamburger.',
    customization:
      'The search field is a real `<form role="search">` with a labelled `<input>`, so Enter submits and assistive tech announces the search landmark. `min-w-0 flex-1` lets the field shrink below its content width, so the row never overflows at 320px while the link strip collapses behind the hamburger. Wire `onSearch` to your query handler.',
    seoTitle: 'Navbar with Search Bar - Free Tailwind React Component',
    seoDescription:
      'A responsive navbar with an inline, accessible search form and a mobile hamburger menu, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['navbar search', 'search bar header', 'react navbar search', 'tailwind search navbar'],
  },
  'navbar-ecommerce-icons': {
    title: 'E-commerce Icon Navbar',
    description:
      'A shop header that keeps account and cart icons on the bar at every width, with a cart badge.',
    customization:
      'Commerce headers never hide the cart behind a hamburger - a cart nobody finds is a sale nobody makes - so the account and cart icons stay on the bar at every width and only the category links collapse. The cart count is exposed to assistive tech through an `aria-label` on the button, not just the visual badge, and the badge is hidden when the count is zero. Drive `cartCount` from your store.',
    seoTitle: 'E-commerce Navbar with Cart - Free React Component',
    seoDescription:
      'A responsive e-commerce navbar with account and cart icons and a live count badge, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['ecommerce navbar', 'cart navbar', 'shop header', 'cart badge navbar'],
  },
  'navbar-double-decker': {
    title: 'Double-Decker Navbar',
    description:
      'A thin utility strip over the main bar; the strip folds into the drawer on mobile.',
    customization:
      'The top strip carries low-priority links (support, contact, sign in) and is hidden below `md` - but rather than dropping them, the mobile hamburger reappends those same links at the foot of its panel, so nothing is lost, it just relocates. Keep the strip to genuinely secondary destinations; anything essential belongs in the main row.',
    seoTitle: 'Double-Decker Navbar - Free Two-Row Header Component',
    seoDescription:
      'A two-row navbar with a utility strip above the main bar that folds into the mobile drawer, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['double decker navbar', 'two row navbar', 'utility bar header', 'topbar navbar'],
  },
  'navbar-transparent-overlay': {
    title: 'Transparent Overlay Navbar',
    description:
      'A bar that floats over a hero with white labels, opening a solid, legible panel on mobile.',
    customization:
      'The bar is `absolute inset-x-0 top-0` with no fill and white text, so it only reads over a dark hero - swap the gradient wrapper for your real image. The trap this layout invites is white-on-white links inside the open menu, so the mobile panel is given its own solid, `backdrop-blur` surface. The CTA uses a translucent glass fill that works on any backdrop.',
    seoTitle: 'Transparent Overlay Navbar - Free Hero Header Component',
    seoDescription:
      'A transparent navbar that overlays a hero image with white text and a solid mobile menu, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['transparent navbar', 'overlay navbar', 'hero navbar', 'absolute navbar'],
  },
  'navbar-pill-links': {
    title: 'Pill Links Navbar',
    description:
      'Links sit in a rounded pill track with a raised active pill, collapsing to a stacked list.',
    customization:
      'The links live inside a rounded `bg-gray-100` track styled like a segmented control; the active link is the raised white pill and is marked with `aria-current="page"`, so the highlight and the announced state share one source of truth. Below `md` the track becomes a plain stacked hamburger list. Set `current` per link from your router.',
    seoTitle: 'Pill Links Navbar - Free Segmented Header Component',
    seoDescription:
      'A navbar whose links sit in a rounded pill / segmented track with a raised active pill, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['pill navbar', 'segmented navbar', 'rounded nav links', 'tailwind pill nav'],
  },
  'navbar-underline-indicator': {
    title: 'Underline Indicator Navbar',
    description:
      'Links carry an underline that scales in from the centre on hover and stays on the active link.',
    customization:
      'Each link\'s underline is an `::after` pseudo-element, so it never nudges the text as it appears, and it scales in from the centre on hover - the transition sits behind `motion-reduce` for anyone who asked for less movement. The active link keeps its underline fixed and is marked with `aria-current`. Below `md` the strip becomes a plain hamburger list.',
    seoTitle: 'Underline Indicator Navbar - Free Animated Header Component',
    seoDescription:
      'A navbar with an animated underline indicator that scales in on hover and marks the active link, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['underline navbar', 'animated nav indicator', 'hover underline links', 'active link navbar'],
  },
  'navbar-announcement-bar': {
    title: 'Announcement Bar Navbar',
    description:
      'A dismissible promo strip above the bar; dismissing it removes the row rather than hiding it.',
    customization:
      'The promo strip sits above the nav and dismisses on its own - and dismissing *removes* it rather than toggling visibility, so it leaves no empty row behind. The close button carries an `aria-label`, and the copy wraps rather than truncating at 320px. Set `announcement` and `announcementHref`; persist the dismissed state in `localStorage` if you want it to stay closed.',
    seoTitle: 'Announcement Bar Navbar - Free Promo Banner Component',
    seoDescription:
      'A navbar with a dismissible announcement / promo bar above it, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['announcement bar', 'promo banner navbar', 'dismissible banner', 'top bar navbar'],
  },
  'navbar-split-actions': {
    title: 'Split Actions Navbar',
    description:
      'A ghost sign-in link, a divider and a filled sign-up button - the two-tier auth cluster.',
    customization:
      'The right side is the two-tier auth pattern: a ghost `Sign in` text link, a hairline divider, then a filled `Sign up` button, so the primary action reads as primary. Below `md` both actions plus the links fold into the hamburger panel in the same order - links, sign in, sign up - so the hierarchy survives the collapse. Rename via `signInLabel` and `signUpLabel`.',
    seoTitle: 'Split Actions Navbar - Free Sign In / Sign Up Header',
    seoDescription:
      'A navbar with a split action cluster - a ghost sign-in link and a filled sign-up button - in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['split actions navbar', 'sign up navbar', 'auth navbar', 'cta navbar'],
  },
  'navbar-tabs-subnav': {
    title: 'Tabs Subnav Navbar',
    description:
      'A product bar over a horizontally scrolling section tablist that never wraps on mobile.',
    customization:
      'Two tiers: a product bar over a section subnav. The subnav is a real `role="tablist"` and it scrolls sideways with `overflow-x-auto` rather than wrapping - the honest answer for a row of section tabs that will not fit a phone. The active tab carries a bottom border and `aria-selected`. It works controlled (`activeTab` + `onTabChange`) or uncontrolled; pass your own `tabs`.',
    seoTitle: 'Tabs Subnav Navbar - Free Scrollable Section Header',
    seoDescription:
      'A navbar with a horizontally scrolling section tablist subnav that never wraps on mobile, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['tabs navbar', 'subnav navbar', 'scrollable tabs', 'section navigation'],
  },
};
