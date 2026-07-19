import type { ComponentContentMap } from '../types';

/** English prose for the sidebars category. Keys are component slugs. */
export const sidebarsContent: ComponentContentMap = {
  'sidebar-basic': {
    title: 'Basic Sidebar',
    description:
      'A static navigation column - brand, icon-and-label links, and one clearly marked current page.',
    customization:
      'The active item is marked with `aria-current="page"` and the highlight is styled off that same attribute rather than a parallel `.is-active` class - one source of truth, so the blue pill and what a screen reader announces cannot drift apart. Drive it from your router: `pathname === item.href` in Next.js. The icons are decorative and carry `aria-hidden="true"`, which is correct *because* the label sits right beside them; the moment you drop the label the icon becomes the only content and needs its own name - reach for `sidebar-icon-rail` instead of stripping this one down. Nothing here holds state, so it renders as a Server Component with no `use client`. Swap the fixed `w-60` for `w-56` or `w-64` in one place; the links are `flex` and follow.',
    seoTitle: 'Basic Sidebar Navigation - Free Tailwind Component',
    seoDescription:
      'A static sidebar with icon links and an accessible current-page marker, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['tailwind sidebar', 'sidebar navigation', 'dashboard sidebar', 'react sidebar', 'side nav component'],
  },
  'sidebar-collapsible': {
    title: 'Collapsible Sidebar',
    description:
      'A sidebar that animates between 15rem and 4rem, hiding its labels and leaving the icons behind.',
    customization:
      'The toggle is a real button with `aria-expanded` and `aria-controls` - the chevron rotation hangs off `aria-expanded` too, so the arrow physically cannot point the wrong way. The labels hide with `invisible` *and* `opacity-0`, never `opacity-0` alone: a label that is merely transparent is still read aloud and still counted by a screen reader, so the collapsed rail would announce four names it does not show. `visibility` also rides the same transition, which `display: none` cannot. Width animates via `transition-[width]` rather than `transform`, because the page content beside it must actually reflow - a transform would slide the sidebar over the content instead of making room. `motion-reduce:transition-none` lands on the end state instantly for anyone who asked for less motion; the collapse still works, it just does not travel. Persist the state to `localStorage` if you want it to survive a reload.',
    seoTitle: 'Collapsible Sidebar with Animated Width - Free React Component',
    seoDescription:
      'A collapsible sidebar that animates its width and hides labels accessibly, with a reduced-motion fallback. HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['collapsible sidebar', 'animated sidebar', 'sidebar toggle', 'expandable side nav', 'react collapsible sidebar'],
  },
  'sidebar-icon-rail': {
    title: 'Icon Rail Sidebar',
    description: 'A 4rem rail of icon-only links, each with a tooltip on hover and on keyboard focus.',
    customization:
      'A tooltip is not an accessible name. It is a hover affordance for sighted mouse users, it does not exist for a screen reader, and on a touch device it does not exist at all - so every link carries its own `aria-label` and the tooltip is `aria-hidden="true"` decoration that repeats it. Get this wrong and the rail announces as four unnamed links. The tooltip appears on `group-hover` **and** `group-focus-within`; drop the second and the rail becomes a mouse-only control the moment someone Tabs through it. Targets are `h-10 w-10` - comfortably past the 24px minimum, and worth keeping there since a rail is often the densest thing on the page. Stateless CSS-only tooltips mean no `use client` and no JavaScript. If your labels run long, cap the tooltip with `max-w-48` and drop `whitespace-nowrap`.',
    seoTitle: 'Icon Rail Sidebar with Tooltips - Free Accessible Component',
    seoDescription:
      'A compact icon-only sidebar rail with accessible labels and CSS tooltips that appear on hover and focus. HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['icon sidebar', 'sidebar rail', 'icon only navigation', 'sidebar tooltip', 'compact side nav'],
  },
  'sidebar-nested-groups': {
    title: 'Nested Groups Sidebar',
    description:
      'Expandable sections of sub-links built on the disclosure pattern - real triggers, real panels.',
    customization:
      'Each group is a disclosure: `aria-expanded` on the trigger button, `aria-controls` pointing at the `id` of the `<ul>` it owns. The collapsed panel uses the `hidden` attribute rather than `height: 0` or `opacity-0` - an invisible panel that still hands its links to Tab is the classic half-built tree, where a keyboard user falls into sub-links they cannot see. `hidden` removes them from both the tab order and the accessibility tree in one attribute. These are `<ul>`s of links, deliberately **not** `role="tree"`: a tree implies arrow-key traversal and roving tabindex, and if you claim the role without building the behaviour you have made things worse than plain nav. `allowMultiple={false}` turns the groups into an accordion. The indent guide is the sub-list border-left doing double duty - one border, no spacer divs.',
    seoTitle: 'Nested Sidebar Navigation with Collapsible Groups - Free Component',
    seoDescription:
      'A sidebar with expandable nested groups built on the ARIA disclosure pattern, with proper hidden panels. HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['nested sidebar', 'collapsible sidebar groups', 'sidebar submenu', 'accordion sidebar', 'multi level navigation'],
  },
  'sidebar-mobile-drawer': {
    title: 'Mobile Drawer Sidebar',
    description:
      'An off-canvas sidebar with a backdrop, a real focus trap, Escape to close and focus restoration.',
    customization:
      'A drawer is a modal, and a modal that only *looks* modal is the classic half-built one: the page behind it still takes Tab, so a keyboard user walks straight out of the open drawer into links they cannot see. Four things fix it and all four are here - `role="dialog" aria-modal="true"`; a focus trap that wraps Tab off the last item back to the first and Shift+Tab off the first to the last; Escape closing it with focus returned to the button that opened it, not dumped at the top of the document; and `overflow: hidden` on `<body>` so the page does not scroll under your finger while the drawer sits still. The Next.js variant also closes on route change - skip that and the drawer hangs over the page you just navigated to. The slide is decoration and sits behind `motion-safe:`/`motion-reduce:`: someone who asked for less motion still gets the drawer, it simply arrives. The `focusables()` selector covers links and buttons; widen it if you add inputs.',
    seoTitle: 'Mobile Sidebar Drawer with Focus Trap - Free React Component',
    seoDescription:
      'An accessible off-canvas sidebar drawer with backdrop, focus trap, Escape handling, scroll lock and focus restoration. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['mobile sidebar drawer', 'off canvas sidebar', 'focus trap drawer', 'slide in sidebar', 'accessible mobile nav'],
  },
  'sidebar-dark-theme': {
    title: 'Dark Theme Sidebar',
    description: 'A committed-dark navigation column that needs no light styles and no `dark:` toggle to look right.',
    customization:
      'Every colour is chosen for a dark surface, so it renders correctly with or without a `dark` class on the root. The active item is marked with `aria-current="page"` and highlighted off that attribute - one source of truth. Swap the indigo accent for any brand hue in the brand chip and the focus ring.',
    seoTitle: 'Dark Theme Sidebar - Free Tailwind Component',
    seoDescription:
      'A dark sidebar navigation with an accessible current-page marker, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['dark sidebar', 'dark navigation', 'tailwind dark sidebar', 'dashboard side nav'],
  },
  'sidebar-search-nav': {
    title: 'Search Sidebar',
    description: 'A sidebar whose links filter live as you type into a labelled search field.',
    customization:
      'The field has no visible label, so it carries its own `aria-label`; the filter is a case-insensitive `includes` on the item label and renders a "No matches" row when empty. Debounce the input or swap the filter for a fuzzy match if your list runs long.',
    seoTitle: 'Searchable Sidebar Navigation - Free React Component',
    seoDescription:
      'A sidebar with a live client-side filter and an accessible search field, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['search sidebar', 'filter navigation', 'sidebar search', 'react sidebar filter'],
  },
  'sidebar-with-footer-user': {
    title: 'Sidebar with User Footer',
    description: 'A scrolling nav with a pinned footer card showing the signed-in user.',
    customization:
      'The footer is pinned by flex (`flex-1` nav + static footer), not `absolute`, so it never overlaps the last nav item however long the list grows. The avatar is an initials chip - swap it for an `<img>` with `alt=""` since the name sits beside it. Truncation with `min-w-0` keeps a long email from breaking the layout.',
    seoTitle: 'Sidebar with User Footer - Free React Component',
    seoDescription:
      'A dashboard sidebar with a scrolling nav and a pinned user account footer, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['sidebar user footer', 'sidebar profile', 'account sidebar', 'dashboard sidebar'],
  },
  'sidebar-badges-counts': {
    title: 'Sidebar with Count Badges',
    description: 'Nav links carrying numeric badges that pair the count with a screen-reader context word.',
    customization:
      'The badge is not meaning-by-colour: each count carries an `sr-only` word (`unread`, `due`) so a screen reader announces "Inbox 12 unread", not a bare number beside a coloured pill. Pass `count` and `countLabel` per item; omit `count` for no badge.',
    seoTitle: 'Sidebar with Notification Badges - Free Component',
    seoDescription:
      'A sidebar with accessible count badges that pair a number with context, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['sidebar badges', 'notification counts', 'sidebar count badge', 'unread badge nav'],
  },
  'sidebar-workspace-switcher': {
    title: 'Workspace Switcher Sidebar',
    description: 'A sidebar topped with a menu button that switches between workspaces.',
    customization:
      'The trigger is a real button with `aria-expanded`, `aria-controls` and `aria-haspopup="menu"`; the options are `role="menuitemradio"` with `aria-checked` so the current workspace is announced as selected. Wire the selection to your tenant router and close the menu on outside click and Escape in production.',
    seoTitle: 'Workspace Switcher Sidebar - Free React Component',
    seoDescription:
      'A sidebar with an accessible workspace/team switcher menu, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['workspace switcher', 'team switcher sidebar', 'tenant switcher', 'sidebar dropdown'],
  },
  'sidebar-two-level': {
    title: 'Two-Level Sidebar',
    description: 'Parent links each showing their child links, indented by a single border guide.',
    customization:
      'Both levels are always visible - this is hierarchy, not a disclosure, so there is no toggle to get wrong. The indent guide is the child list `border-l` doing double duty; no spacer divs. Only child links take `aria-current`; drive it from `pathname === child.href`.',
    seoTitle: 'Two-Level Sidebar Navigation - Free Component',
    seoDescription:
      'A sidebar with a fixed two-level hierarchy of parent and child links, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['two level sidebar', 'nested navigation', 'sidebar hierarchy', 'sub navigation'],
  },
  'sidebar-floating-card': {
    title: 'Floating Card Sidebar',
    description: 'A detached, rounded, shadowed card that floats in a padded gutter instead of a flush column.',
    customization:
      'The `m-4` gutter and `rounded-2xl` + `shadow-lg` lift it off the page; drop the margin for a flush edge. Everything else is the standard accessible list - `aria-current` on the active link, focus rings on every target.',
    seoTitle: 'Floating Card Sidebar - Free Tailwind Component',
    seoDescription:
      'A floating, rounded, elevated sidebar card, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['floating sidebar', 'card sidebar', 'rounded sidebar', 'elevated side nav'],
  },
  'sidebar-gradient-brand': {
    title: 'Gradient Brand Sidebar',
    description: 'A sidebar led by a gradient brand header with white text over a fixed dark gradient.',
    customization:
      'The header text is white over a fixed indigo-to-fuchsia gradient, so contrast holds regardless of light or dark theme - the gradient does not flip. Recolour the `from-`/`to-` stops to your brand; the nav below stays neutral and theme-aware.',
    seoTitle: 'Gradient Brand Sidebar - Free Tailwind Component',
    seoDescription:
      'A sidebar with a gradient brand header and accessible navigation, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['gradient sidebar', 'brand header sidebar', 'gradient navigation', 'branded side nav'],
  },
  'sidebar-mini-expandable': {
    title: 'Mini Expandable Sidebar',
    description: 'A mini icon rail that expands to a full-width labelled sidebar on toggle.',
    customization:
      'Starts collapsed as a `4rem` rail and animates to `16rem`; the toggle is a real button with `aria-expanded` and `aria-controls`. Labels hide with `invisible` *and* `opacity-0`, never opacity alone, so the collapsed rail does not announce names it no longer shows. `motion-reduce` lands on the end state instantly.',
    seoTitle: 'Mini Expandable Sidebar - Free React Component',
    seoDescription:
      'A mini rail sidebar that expands to a labelled column, with accessible toggle and reduced-motion fallback, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['mini sidebar', 'expandable sidebar', 'icon rail expand', 'collapsible mini nav'],
  },
  'sidebar-sections-labeled': {
    title: 'Labeled Sections Sidebar',
    description: 'Navigation split into labelled groups, each list tied to its heading as a real group name.',
    customization:
      'Each group is its own `<nav>` with an `aria-label`, and each `<ul>` is `aria-labelledby` its uppercase heading - so the label is a real accessible group name, not just styled text a screen reader skips. Pass any number of sections; `aria-current` marks the active link.',
    seoTitle: 'Labeled Sections Sidebar - Free Component',
    seoDescription:
      'A sidebar grouped into accessible labelled sections, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['sidebar sections', 'grouped navigation', 'labelled sidebar', 'sidebar group headings'],
  },
};
